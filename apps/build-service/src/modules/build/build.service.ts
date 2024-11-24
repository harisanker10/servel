import { Injectable } from '@nestjs/common';
import {
  InstanceType,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/common';
import { spawn } from 'child_process';
import { exec } from 'child_process';
import { createDockerFile } from 'src/utils/createDockerfile';
import { applyKubernetesConfiguration } from 'src/utils/createK8Deployment';
import { KafkaService } from '../kafka/kafka.service';
import { writeFile } from 'fs/promises';
import { cloneRepository } from 'src/utils/cloneRepo';
import { StaticSiteDeployment } from 'src/deploymentStrategy/staticSiteStrategy';
import { S3Service } from 'src/services/s3.service';
import { join } from 'path';

@Injectable()
export class BuildService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly S3: S3Service,
  ) {}

  async createDockerImage({
    data,
    deploymentId,
  }: {
    data: WebServiceData;
    deploymentId: string;
  }) {
    return new Promise(async (resolve, reject) => {
      const gitUrl = data.repoUrl;
      const Dockerfile = createDockerFile({
        os: 'node:alpine',
        port: data.port,
        runCommand: data.runCommand,
        buildCommand: data.buildCommand,
      });
      const imageName = `registry:5000/servel-builds-${deploymentId}`;
      const repoPath = `/repositories/${deploymentId}`;

      console.log('Creating docker image with', {
        gitUrl,
        Dockerfile,
        imageName,
        repoPath,
      });

      await cloneRepository(gitUrl, repoPath);
      await writeFile(`${repoPath}/Dockerfile`, Dockerfile);

      const process = spawn('buildctl', [
        '--addr',
        'tcp://buildkitd:1234',
        'build',
        '--frontend=dockerfile.v0',
        '--local',
        `context=${repoPath}`,
        '--local',
        `dockerfile=${repoPath}`,
        '--output',
        `type=image,name=${imageName},push=true,registry.insecure=true`,
      ]);

      process.stdout.on('data', (data) => {
        console.log(data?.toString());
      });

      process.stderr.on('data', (data) => {
        console.error(data?.toString());
      });

      process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code == 0) {
          this.kafkaService.emitImageUpdates({
            deploymentId,
            image: imageName,
          });
          resolve(code === 0 ? imageName : null);
        } else {
          reject(false);
        }
      });
    });
  }

  runImage({
    deploymentName,
    deploymentId,
    imageName,
    envs,
    port,
    instanceType,
  }: {
    deploymentName: string;
    deploymentId: string;
    imageName: string;
    envs: Record<string, string>;
    port: number;
    instanceType: InstanceType;
  }) {
    this.kafkaService.emitClusterUpdates({
      deploymentName: deploymentName,
      deploymentId: deploymentId,
      type: ProjectType.WEB_SERVICE,
      data: {
        k8DeploymentId: 's' + deploymentId,
        k8ServiceId: 's' + deploymentId,
        port: port,
      },
    });
    applyKubernetesConfiguration(
      's' + deploymentId,
      's' + deploymentId,
      imageName,
      's' + deploymentId,
      port,
      envs,
    );
  }

  // async buildStaticSite({
  //   data,
  //   deploymentId,
  // }: {
  //   data: StaticSiteData;
  //   deploymentId: string;
  // }) {
  //   console.log('building static stie');
  //   const repoPath = `./repositories/${deploymentId}`;
  //   await cloneRepository(data.repoUrl, repoPath);
  //   await new Promise((res) => {
  //     exec('npm install', { cwd: repoPath }, (err, stdout, stderr) => {
  //       console.log({ err, stdout, stderr });
  //       if (!err) res(true);
  //     });
  //   });
  //   await new Promise((res) => {
  //     exec(
  //       data.buildCommand,
  //       { cwd: repoPath },
  //       async (error, stdout, stderr) => {
  //         console.log('Build output:', stdout);
  //         console.error('Build error (if any):', stderr);
  //         console.error('Error during build:', error);
  //         // Step 3: Upload the files in data.distDir to S3
  //         const distDir = join(repoPath, data.outDir);
  //         console.log({ distDir });
  //         await this.S3.uploadDir(distDir, '/repositories');
  //         console.log(
  //           `Static site files uploaded to S3 for deployment ${deploymentId}`,
  //         );
  //       },
  //     );
  //   });
  // }
  async buildStaticSite({
    data,
    deploymentId,
  }: {
    data: StaticSiteData;
    deploymentId: string;
  }): Promise<string> {
    const repoPath = `./repositories/${deploymentId}`;
    await new Promise(async (res, rej) => {
      exec('rm -rf ./repositories', async (code) => {
        console.log('Building static site');
        await cloneRepository(data.repoUrl, repoPath);
        exec('npm install', { cwd: repoPath }, (err, stdout, stderr) => {
          if (err) {
            console.error('Error during npm install:', stderr);
            return rej(err);
          }
          console.log('npm install output:', stdout);
          res(true);
        });
      });
    });

    return new Promise((res, rej) => {
      exec(
        data.buildCommand,
        { cwd: repoPath },
        async (err, stdout, stderr) => {
          if (err) {
            console.error('Error during build:', stderr);
            return rej(err);
          }
          console.log('Build output:', stdout);
          const distDir = join(repoPath, data.outDir);
          console.log({ distDir });

          try {
            await this.S3.uploadDir(
              distDir,
              `./repositories/${deploymentId}/${data.outDir}`,
              `repositories/${deploymentId}`,
            );
            console.log(
              `Static site files uploaded to S3 for deployment ${deploymentId}`,
            );
            res(`repositories/${deploymentId}`);
            this.kafkaService.emitStaticSiteDataUpdates({
              deploymentId,
              s3Path: `repositories/${deploymentId}`,
            });
          } catch (uploadError) {
            console.error('Error uploading to S3:', uploadError);
            rej(uploadError);
          }
        },
      );
    });
  }
}
