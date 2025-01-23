import { DeploymentStrategy } from './IdeploymentStrategy';
import { DeploymentData } from 'src/types/deployment';
import { ModuleRef } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { KafkaService } from 'src/modules/kafka/kafka.service';
import { S3Service } from 'src/services/s3.service';
import { KubernetesService } from 'src/services/kubernetes.service';
import { ImageData, ProjectStatus, ProjectType } from '@servel/common/types';
import { DeploymentDeployedEventDto } from '@servel/common';

export class ImageDeployment extends DeploymentStrategy<ImageData> {
  private logger: Logger;
  private kafkaService: KafkaService;
  private s3Service: S3Service;
  private kubernetesService: KubernetesService;
  constructor(
    data: DeploymentData,
    private readonly moduleRef: ModuleRef,
  ) {
    super(data);
    this.logger = new Logger(ImageDeployment.name);
    this.kafkaService = this.moduleRef.get(KafkaService, { strict: false });
    this.s3Service = this.moduleRef.get(S3Service);
    this.kubernetesService = this.moduleRef.get(KubernetesService);
  }

  async build() {}

  async deploy(): Promise<any> {
    if (!this.data.imageUrl) {
      throw new Error('No image url present');
    }

    const clusterName = `${this.metadata.name}-${this.metadata.deploymentId}`;
    const namespace = 'deployments';

    this.kafkaService.emitDeployingEvent({
      projectId: this.metadata.projectId,
      deploymentId: this.metadata.deploymentId,
      imageServiceData: {
        port: this.data.port,
        clusterServiceName: clusterName,
        clusterDeploymentName: clusterName,
        namespace,
        clusterContainerName: clusterName,
        clusterImageName: this.data.imageUrl,
      },
      projectType: ProjectType.IMAGE,
      staticSiteServiceData: null,
      webServiceData: null,
    });

    await this.kubernetesService.createPod({
      podName: clusterName,
      envs: this.data.envs,
      imageName: this.data.imageUrl,
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

    await this.kubernetesService.checkDeploymentReadiness({
      deploymentName: clusterName,
      namespace,
      maxWaitTimeInSeconds: 180,
    });
    this.kafkaService.emitDeployed({
      name: this.metadata.name,
      projectId: this.metadata.projectId,
      deploymentId: this.metadata.deploymentId,
      projectType: ProjectType.IMAGE,
      imageServiceData: {
        clusterServiceName: clusterName,
        clusterDeploymentName: clusterName,
        namespace,
        clusterContainerName: clusterName,
        clusterImageName: this.data.imageUrl,
        port: this.data.port,
      },
    } as DeploymentDeployedEventDto);
  }
}
