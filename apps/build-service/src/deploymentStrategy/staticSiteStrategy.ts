import {
  ProjectStatus,
  ProjectType,
  StaticSiteData,
} from '@servel/common/types';
import { DeploymentStrategy } from './IdeploymentStrategy';
import { DeploymentData } from 'src/types/deployment';
import { join } from 'path';
import { ModuleRef } from '@nestjs/core';
import { KafkaService } from 'src/modules/kafka/kafka.service';
import { S3Service } from 'src/services/s3.service';
import { BuildService } from 'src/modules/build/build.service';
import { Logger } from '@nestjs/common';
import { DeploymentDeployedEventDto } from '@servel/common';

export class StaticSiteDeployment extends DeploymentStrategy<StaticSiteData> {
  private kafkaService: KafkaService;
  private s3Service: S3Service;
  private buildService: BuildService;
  private distDir: string;
  private logger: Logger;
  constructor(
    data: DeploymentData,
    private readonly moduleRef: ModuleRef,
  ) {
    super(data);
    this.kafkaService = this.moduleRef.get(KafkaService, { strict: false });
    this.s3Service = this.moduleRef.get(S3Service);
    this.buildService = this.moduleRef.get(BuildService);
    this.logger = new Logger(StaticSiteDeployment.name);
  }

  async build() {
    const s3RootDir = this.s3Service.getDeploymentDirKey(
      this.metadata.deploymentId,
    );
    this.kafkaService.emitDeploymentBuildingEvent({
      projectId: this.metadata.projectId,
      deploymentId: this.metadata.deploymentId,
      buildLogBucketPath: s3RootDir + '/build.log',
    });

    const repoPath = `/deployments/${this.metadata.deploymentId}/`;
    this.distDir = join(repoPath, this.data.outDir);

    try {
      await this.buildService.cloneRepository(this.data.repoUrl, repoPath);
      const installDeplendenciesProcess = this.buildService.spawnCommand(
        'npm install',
        repoPath,
      );
      this.buildService
        .getStdoutFromProcess(installDeplendenciesProcess)
        .on('data', (data) => {
          console.log({ installDeplendenciesProcessStdOut: data.toString() });
        });

      await new Promise((res, rej) => {
        installDeplendenciesProcess.on('close', (exitCode) => {
          exitCode === 0
            ? res(true)
            : rej(`npm install failed with code ${exitCode}`);
        });
      });

      const buildProcess = this.buildService.spawnCommand(
        this.data.buildCommand,
        repoPath,
      );

      const buildCommandStdout =
        this.buildService.getStdoutFromProcess(buildProcess);

      this.buildService
        .getStdoutFromProcess(buildProcess)
        .on('data', (data) => {
          console.log({ buildProjecss: data.toString() });
        });

      const logsUpstreamPromise = this.s3Service.streamUpload(
        s3RootDir + '/build.log',
        buildCommandStdout,
      );

      await new Promise((res, rej) => {
        buildProcess.on('close', async (code) => {
          if (code !== 0) rej(`build command process exited with code ${code}`);
          await logsUpstreamPromise;
          res(true);
        });
      });
    } catch (err) {
      this.logger.error('Error during static site build process:', err);
      throw err;
    }
  }

  //TODO: When directly deploying from DEPLOY queue without building, it is assumed that it has already built and deployed once and built assets exist in the bucket
  async deploy(): Promise<any> {
    this.kafkaService.emitDeployingEvent({
      projectId: this.metadata.projectId,
      deploymentId: this.metadata.deploymentId,
      staticSiteServiceData: {
        bucketPath: this.data.bucketPath,
      },
      projectType: ProjectType.STATIC_SITE,
      imageServiceData: null,
      webServiceData: null,
    });
    if (this.distDir) {
      await this.s3Service.uploadDir(
        this.distDir,
        `deployments/${this.metadata.deploymentId}/dist`,
      );
    } else {
      this.logger.warn('No built dir found, emitting deployed event');
    }
    this.data.bucketPath = `deployments/${this.metadata.deploymentId}/dist`;
    this.kafkaService.emitDeployed({
      name: this.metadata.name,
      projectId: this.metadata.projectId,
      deploymentId: this.metadata.projectId,
      projectType: ProjectType.STATIC_SITE,
      staticSiteServiceData: {
        bucketPath: this.data.bucketPath,
      },
    } as DeploymentDeployedEventDto);

    this.logger.log('Deployed');
  }
}
