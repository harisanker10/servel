import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ClusterUpdatesDto, KafkaTopics } from '@servel/dto';
import { DeploymentsRepository } from 'src/repositories/deployment.repository';

@Controller()
export class DeploymentsController {
  constructor(private readonly deploymentRepository: DeploymentsRepository) {}
  @EventPattern(KafkaTopics.clusterUpdates)
  async updateDeployment(data: ClusterUpdatesDto) {
    await this.deploymentRepository.createDeployment({
      deploymentId: data.deploymentId,
      clusterServiceName: data.k8ServiceId,
      clusterContainerName: data.k8ContainerId,
      clusterDeploymentName: data.k8DeploymentId,
      s3Path: data.s3Path,
    });
  }
}
