import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  ClusterUpdatesDto,
  DeploymentUpdatesDto,
  KafkaTopics,
  ProjectType,
  DeploymentImageUpdateDto,
  ProjectStatus,
  DeploymentStatus,
  RequestDto,
} from '@servel/common';
import { ProjectsService } from '../services/projects.service';

@Controller()
export class DeploymentsUpdatesController {
  private logger: Logger;
  constructor(private readonly projectService: ProjectsService) {
    this.logger = new Logger(DeploymentsUpdatesController.name);
  }

  @EventPattern(KafkaTopics.deploymentUpdates)
  async updateDeployment(@Payload() data: DeploymentUpdatesDto) {
    try {
      this.logger.log({ data });
      const deployment = await this.projectService.getDeployment(
        data.deploymentId,
      );
      if (!deployment.id) {
        this.logger.error('No deployment found with id: ' + data.deploymentId);
        return;
      }
      if (data.updates.status || data.updates.deploymentUrl) {
        if (
          data.updates.status === ProjectStatus.DEPLOYED ||
          data.updates.status === ProjectStatus.DEPLOYING
        ) {
          console.log('updating depl status');
          await this.projectService.updateDeploymentsWithProjectId({
            projectId: deployment.projectId,
            updateAll: { status: DeploymentStatus.stopped },
          });
          await this.projectService.updateDeployment(deployment.id, {
            status: DeploymentStatus.active,
          });
        }
        await this.projectService.updateProject(deployment.projectId, {
          status: data.updates?.status,
          deploymentUrl: data.updates?.deploymentUrl,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  @EventPattern(KafkaTopics.requests)
  async updateRequests(@Payload() data: RequestDto) {
    this.logger.log({ data });
    const depl = await this.projectService.getDeployment(data.deploymentId);
    try {
      await this.projectService.addRequest({
        ...data,
        projectId: depl.projectId,
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  @EventPattern(KafkaTopics.clusterUpdates)
  async updateCluster(@Payload() data: ClusterUpdatesDto) {
    console.log({ clueterUpdates: data });
    try {
      if (data.type === ProjectType.WEB_SERVICE) {
        const query = await this.projectService.updateDeploymentData(
          data.deploymentId,
          {
            clusterDeploymentName: data.data.k8DeploymentId,
            clusterServiceName: data.data.k8ServiceId,
          },
        );
        console.log({ query });
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  @EventPattern(KafkaTopics.imageUpdates)
  async updateDeploymentImage(@Payload() data: DeploymentImageUpdateDto) {
    console.log({ imageUpdates: data });
    try {
      const query = await this.projectService.updateDeploymentData(
        data.deploymentId,
        { image: data.image },
      );
      console.log({ query });
    } catch (err) {
      this.logger.error(err);
    }
  }
}
