import { ProjectType, WebServiceData } from '@servel/common/types';
import { DeploymentStrategy } from './IdeploymentStrategy';
import { DeploymentData } from 'src/types/deployment';
import { Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { KafkaService } from 'src/modules/kafka/kafka.service';
import { BuildService } from 'src/modules/build/build.service';
import { S3Service } from 'src/services/s3.service';
import { KubernetesService } from 'src/services/kubernetes.service';
import { DeploymentDeployedEventDto } from '@servel/common';

export class WebServiceDeployment extends DeploymentStrategy<WebServiceData> {
  private logger: Logger;
  private kafkaService: KafkaService;
  private buildService: BuildService;
  private s3Service: S3Service;
  private kubernetesService: KubernetesService;

  constructor(
    data: DeploymentData,
    private readonly moduleRef: ModuleRef,
  ) {
    super(data);
    this.logger = new Logger(WebServiceDeployment.name);
    this.buildService = this.moduleRef.get(BuildService);
    this.kafkaService = this.moduleRef.get(KafkaService, { strict: false });
    this.s3Service = this.moduleRef.get(S3Service);
    this.kubernetesService = this.moduleRef.get(KubernetesService);
  }

  async build(): Promise<void> {
    const date = new Date();
    const buildLogBucketKey = `/deployments/${this.metadata.deploymentId}/logs/build-${date.toISOString()}.log`;

    this.kafkaService.emitDeploymentBuildingEvent({
      projectId: this.metadata.projectId,
      deploymentId: this.metadata.deploymentId,
      buildLogBucketPath: buildLogBucketKey,
    });

    const buildImageName = `registry:5000/servel-builds-${this.metadata.deploymentId}`;

    const buildProcess = await this.buildService.createDockerImage({
      data: this.data,
      deploymentId: this.metadata.deploymentId,
      imageName: buildImageName,
    });

    const stdout = this.buildService.getStdoutFromProcess(buildProcess);
    const s3Command = this.s3Service.streamUpload(buildLogBucketKey, stdout);

    return new Promise((res, _rej) => {
      buildProcess.on('close', async (code) => {
        this.setBuiltImage(buildImageName);
        this.logger.log(`Build process exited with code = ${code}`);
        await s3Command;
        this.logger.log('Uploading to s3 done');
        res();
      });
    });
  }

  async deploy() {
    if (!this.getBuiltImage()) {
      this.logger.error('Image not built. Building...');
      await this.build();
    }

    const clusterName = `${this.metadata.name}-${this.metadata.deploymentId}`;
    const namespace = 'deployments';

    this.kafkaService.emitDeployingEvent({
      projectId: this.metadata.projectId,
      deploymentId: this.metadata.deploymentId,
      webServiceData: {
        clusterServiceName: clusterName,
        clusterDeploymentName: clusterName,
        namespace,
        clusterContainerName: clusterName,
        clusterImageName: this.data.builtImage,
        port: this.data.port,
      },
      projectType: ProjectType.WEB_SERVICE,
      imageServiceData: null,
      staticSiteServiceData: null,
    });

    await this.kubernetesService.createPod({
      podName: clusterName,
      envs: this.data.envs,
      imageName: this.data.builtImage,
      instanceType: this.metadata.instanceType,
      port: this.data.port,
      namespace,
    });
    await this.kubernetesService.createService({
      deploymentName: clusterName,
      namespace,
      port: this.data.port,
      serviceName: clusterName,
    });

    this.kafkaService.emitDeployed({
      name: this.metadata.name,
      projectId: this.metadata.projectId,
      deploymentId: this.metadata.deploymentId,
      webServiceData: {
        port: this.data.port,
        clusterServiceName: clusterName,
        clusterDeploymentName: clusterName,
        namespace,
        clusterContainerName: clusterName,
        clusterImageName: this.data.builtImage,
      },
      projectType: ProjectType.WEB_SERVICE,
      imageServiceData: null,
      staticSiteServiceData: null,
    });
  }

  private setBuiltImage(buildImage: string) {
    this.data.builtImage = buildImage;
  }

  private getBuiltImage(): string | undefined {
    return this.data.builtImage;
  }
}
