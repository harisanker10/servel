import { Injectable } from '@nestjs/common';
import { InstanceType, ProjectType, WebServiceData } from '@servel/common';
import { spawn } from 'child_process';
import { createDockerFile } from 'src/utils/createDockerfile';
import { applyKubernetesConfiguration } from 'src/utils/createK8Deployment';
import { KafkaService } from '../kafka/kafka.service';
import { writeFile } from 'fs/promises';
import { cloneRepository } from 'src/utils/cloneRepo';

@Injectable()
export class BuildService {
  constructor(private readonly kafkaService: KafkaService) {}

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
        resolve(code === 0 ? imageName : null);
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

  createImage({}) {}
}
