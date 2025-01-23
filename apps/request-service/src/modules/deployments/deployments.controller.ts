import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  DeploymentBuildingEventDto,
  DeploymentDeployedEventDto,
  DeploymentStoppedEventDto,
  KafkaTopics,
} from '@servel/common';
import { DeploymentStatus } from '@servel/common/types';
import {
  CreateDeploymentDto,
  DeploymentsRepository,
} from 'src/repositories/deployment.repository';

@Controller()
export class DeploymentsController {
  constructor(private readonly deploymentRepository: DeploymentsRepository) {}

  @EventPattern(KafkaTopics.DEPLOYMENT_DEPLOYED_EVENT)
  async handleDeployedEvent(data: DeploymentDeployedEventDto) {
    console.log({ deployedEventData: data });
    const depl: CreateDeploymentDto = {
      status: DeploymentStatus.ACTIVE,
      projectType: data.projectType,
      deploymentId: data.deploymentId,
      projectId: data.projectId,
      projectName: data.name,
      bucketPath: data?.staticSiteServiceData?.bucketPath,
      clusterDeploymentName:
        data?.webServiceData?.clusterDeploymentName ??
        data?.imageServiceData?.clusterDeploymentName,
      clusterServiceName:
        data?.webServiceData?.clusterServiceName ??
        data?.imageServiceData?.clusterServiceName,
      port: data?.webServiceData?.port ?? data?.imageServiceData?.port,
    };
    await this.deploymentRepository.upsertDeployment(depl);
  }

  @EventPattern(KafkaTopics.DEPLOYMENT_STOPPED_EVENT)
  async handleStoppedEvent(data: DeploymentStoppedEventDto) {
    console.log({ stoppedEventData: data });
    await this.deploymentRepository.updateDeployment(data.deploymentId, {
      status: DeploymentStatus.STOPPED,
    });
  }
  @EventPattern(KafkaTopics.DEPLOYMENT_BUILDING_EVENT)
  async handleBuildingEvent(data: DeploymentBuildingEventDto) {
    await this.deploymentRepository.updateDeployment(data.deploymentId, {
      status: DeploymentStatus.STOPPED,
    });
  }
}
