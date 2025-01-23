import { Injectable, Logger } from '@nestjs/common';
import { WebServiceData } from '@servel/common/types';
import { ChildProcess, spawn } from 'child_process';
import { createDockerFile } from 'src/utils/createDockerfile';
import { rm, stat, writeFile } from 'fs/promises';
import { PassThrough, Readable } from 'stream';
import { Stats } from 'fs';

@Injectable()
export class BuildService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(BuildService.name);
    this.logger.log('Instantiated');
  }
  async createDockerImage({
    data,
    deploymentId,
    imageName,
  }: {
    data: WebServiceData;
    deploymentId: string;
    imageName: string;
  }) {
    const gitUrl = data.repoUrl;
    const Dockerfile = createDockerFile({
      os: 'node:alpine',
      port: data.port,
      runCommand: data.runCommand,
      buildCommand: data.buildCommand,
    });
    this.logger.log('creating docker image');
    const repoPath = `/repositories/${deploymentId}`;
    await this.cloneRepository(gitUrl, repoPath);
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

    return process;
  }

  async cloneRepository(repoUrl: string, cloneLocalPath: string) {
    const repoStat = await stat(cloneLocalPath).catch((err) => {});
    if (repoStat && repoStat.isDirectory()) {
      await rm(cloneLocalPath, { recursive: true, force: true });
    }
    return new Promise<void>(async (resolve, reject) => {
      const cloneProcess = spawn('git', ['clone', repoUrl, cloneLocalPath]);
      cloneProcess.stderr.on('data', (data) => {
        console.log(data.toString());
      });
      cloneProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Git clone failed with code ${code}`));
        } else {
          resolve();
        }
      });
      cloneProcess.on('error', reject);
    });
  }

  getStdoutFromProcess(process: ChildProcess) {
    const stdoutStream = new PassThrough();
    process.stdout.pipe(stdoutStream);
    process.stderr.pipe(stdoutStream);
    return stdoutStream;
  }

  spawnCommand(command: string, cwd?: string | undefined) {
    const [main, ...rest] = command.split(' ');
    const process = spawn(main, rest, { cwd });
    return process;
  }

  // async buildStaticSite({
  //   data,
  //   deploymentId,
  // }: {
  //   data: StaticSiteData;
  //   deploymentId: string;
  // }): Promise<string> {
  //   const repoPath = `./repositories/${deploymentId}`;
  //   const distDir = join(repoPath, data.outDir);
  //
  //   try {
  //     await this.spawnCommand(`rm -rf ./repositories`);
  //
  //     await cloneRepository(data.repoUrl, repoPath);
  //     console.log(`Repository cloned to ${repoPath}`);
  //
  //     await this.spawnCommand('npm install', { cwd: repoPath });
  //     console.log('Dependencies installed successfully.');
  //
  //     const buildLog = await this.spawnCommand(data.buildCommand, {
  //       cwd: repoPath,
  //     });
  //     console.log(`Build completed successfully. Output directory: ${distDir}`);
  //     await this.S3.streamUpload(
  //       `logs/${deploymentId}/buildLogs.txt`,
  //       buildLog,
  //     );
  //
  //     await this.S3.uploadDir(
  //       distDir,
  //       `./repositories/${deploymentId}/${data.outDir}`,
  //       `repositories/${deploymentId}`,
  //     );
  //     console.log(
  //       `Static site files uploaded to S3 for deployment ${deploymentId}`,
  //     );
  //
  //     this.kafkaService.emitStaticSiteDataUpdates({
  //       deploymentId,
  //       s3Path: `repositories/${deploymentId}`,
  //       status: DeploymentStatus.active,
  //     });
  //
  //     return `repositories/${deploymentId}`;
  //   } catch (err) {
  //     console.error('Error during static site build process:', err);
  //     throw err;
  //   }
  // }
}
