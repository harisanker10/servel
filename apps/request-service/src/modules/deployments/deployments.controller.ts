import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { ClusterUpdatesDto, KafkaTopics, ProjectType } from '@servel/common';
import { DeploymentsRepository } from 'src/repositories/deployment.repository';

@Controller()
export class DeploymentsController {
  constructor(private readonly deploymentRepository: DeploymentsRepository) {}

  @EventPattern(KafkaTopics.clusterUpdates)
  async updateDeployment(data: ClusterUpdatesDto) {
    console.log('Got new deployement data', { data });
    if (data.type === ProjectType.WEB_SERVICE) {
      await this.deploymentRepository.createDeployment({
        deploymentId: data.deploymentId,
        port: data.data.port,
        clusterServiceName: data.data.k8ServiceId,
        clusterContainerName: data.data.k8ServiceId,
        clusterDeploymentName: data.data.k8DeploymentId,
      });
    } else if (data.type === ProjectType.STATIC_SITE) {
      await this.deploymentRepository.createDeployment({
        deploymentId: data.deploymentId,
        s3Path: data.data.s3Path,
      });
    }
  }
}
