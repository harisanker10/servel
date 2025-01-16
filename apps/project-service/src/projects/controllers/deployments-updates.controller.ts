import { Catch, Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  DeploymentBuildingEventDto,
  DeploymentDeployedEventDto,
  DeploymentDeployingEventDto,
  DeploymentFailedEventDto,
  KafkaTopics,
} from '@servel/common';
import { ProjectsService } from '../services/projects.service';
import { DeploymentService } from '../services/deployments.service';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ProjectStatus, DeploymentStatus } from '@servel/common/types';
import { ProjectType } from '@servel/proto/projects';

@Catch(ExceptionsHandler)
@Controller()
export class DeploymentsUpdatesController {
  private logger: Logger;
  constructor(
    private readonly projectService: ProjectsService,
    private readonly deploymentService: DeploymentService,
  ) {
    this.logger = new Logger(DeploymentsUpdatesController.name);
  }

  @EventPattern(KafkaTopics.DEPLOYMENT_BUILDING_EVENT)
  async handleBuildingEvent(dto: DeploymentBuildingEventDto) {
    try {
      this.logger.log(`BUILDING event for ${JSON.stringify(dto)} `);

      await this.deploymentService.updateDeployment(dto.deploymentId, {
        status: DeploymentStatus.STARTING,
        buildLogBucketPath: dto.buildLogBucketPath,
      });
      await this.projectService.updateProjectStatus(
        dto.projectId,
        ProjectStatus.BUILDING,
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  @EventPattern(KafkaTopics.DEPLOYMENT_DEPLOYING_EVENT)
  async handleDeployingEvent(dto: DeploymentDeployingEventDto) {
    try {
      this.logger.log(`DEPLOYING event for ${JSON.stringify(dto)} `);
      await Promise.all([
        this.projectService.updateProjectStatus(
          dto.projectId,
          ProjectStatus.DEPLOYING,
        ),
        this.deploymentService.updateDeployment(dto.deploymentId, {
          status: DeploymentStatus.ACTIVE,
        }),
      ]);
    } catch (err) {
      this.logger.error(err);
    }
  }

  @EventPattern(KafkaTopics.DEPLOYMENT_DEPLOYED_EVENT)
  async handleDeployedEvent(dto: DeploymentDeployedEventDto) {
    try {
      this.logger.log(`DEPLOYED event for ${JSON.stringify(dto)} `);
      console.log({ deployedEventData: dto });

      const project = await this.projectService.getProject(dto.projectId);
      let updateDataQuery: Promise<unknown>;
      switch (dto.projectType) {
        case ProjectType.WEB_SERVICE: {
          updateDataQuery = this.deploymentService.updateDeploymentData(
            dto.deploymentId,
            dto.webServiceData,
          );
        }
        case ProjectType.STATIC_SITE: {
          updateDataQuery = this.deploymentService.updateDeploymentData(
            dto.deploymentId,
            dto.staticSiteServiceData,
          );
        }
        case ProjectType.IMAGE: {
          updateDataQuery = this.deploymentService.updateDeploymentData(
            dto.deploymentId,
            dto.imageServiceData,
          );
        }
      }
      await Promise.all([
        updateDataQuery,
        this.projectService.updateProject(dto.projectId, {
          status: ProjectStatus.DEPLOYED,
          deploymentUrl: `http://${project.name}.servel.com`,
        }),
        this.deploymentService.switchActiveDeployment(dto.deploymentId),
      ]);
    } catch (err) {
      this.logger.error(err);
    }
  }

  @EventPattern(KafkaTopics.DEPLOYMENT_FAILED_EVENT)
  async handleDeploymentFailure(dto: DeploymentFailedEventDto) {
    try {
      this.logger.error(`FAILED event for ${JSON.stringify(dto)} `);
      console.log({ dto });
      await Promise.all([
        this.projectService.updateProjectStatus(
          dto.projectId,
          ProjectStatus.FAILED,
        ),

        this.deploymentService.stopDeployment(dto.deploymentId),
      ]);
    } catch (err) {
      this.logger.error(err);
    }
  }

  // ------------
  // @EventPattern(KafkaTopics.DEPLOYMENT_DEPLOYED_EVENT)
  // async updateDeployment(
  //   @Payload() data: DeploymentUpdatesDto,
  //   @Ctx() context: KafkaContext,
  // ) {
  //   const deployment = await this.deploymentService.findDeployment(
  //     data.deploymentId,
  //   );
  //   if (Object.keys(data.updates).length > 0) {
  //     if (data.updates.projectStatus === ProjectStatus.DEPLOYED)
  //       await this.deploymentService.switchActiveDeployment(deployment.id);
  //
  //     await this.projectService.updateProject(deployment.projectId, {
  //       status: data.updates?.projectStatus,
  //     });
  //   }
  // }
  //
  // @EventPattern(KafkaTopics.ANALYTICS)
  // async updateRequests(@Payload() data: RequestDto) {
  //   this.logger.log({ data });
  //   const depl = await this.deploymentService.findDeployment(data.deploymentId);
  //   await this.analyticsservice.createAnalyics({
  //     ...data,
  //     projectId: depl.projectId,
  //   });
  // }
  // ------------

  // @EventPattern(KafkaTopics.CLUSTER_UPDATES)
  // async updateCluster(@Payload() data: ClusterUpdatesDto) {
  //   if (data.type === ProjectType.WEB_SERVICE) {
  //     const query = await this.deploymentService.updateDeploymentData(
  //       data.deploymentId,
  //       {
  //         clusterDeploymentName: data.data.k8DeploymentId,
  //         clusterServiceName: data.data.k8ServiceId,
  //       },
  //     );
  //     console.log({ query });
  //   }
  // }
  //
  // @EventPattern(KafkaTopics.IMAGE_UPDATES)
  // async updateDeploymentImage(@Payload() data: DeploymentImageUpdateDto) {
  //   console.log({ imageUpdates: data });
  //   await this.deploymentService.updateDeploymentData(data.deploymentId, {
  //     image: data.image,
  //   });
  // }
}
