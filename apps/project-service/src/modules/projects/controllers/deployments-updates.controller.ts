import { Catch, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import {
  DeploymentBuildingEventDto,
  DeploymentDeployedEventDto,
  DeploymentDeployingEventDto,
  DeploymentFailedEventDto,
  KafkaTopics,
} from '@servel/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ProjectStrategyResolver } from '../strategy/resolver/projectStrategyResolver';

@Catch(ExceptionsHandler)
@Controller()
export class DeploymentsUpdatesController {
  constructor(
    private readonly projectStrategyResolver: ProjectStrategyResolver,
  ) {}

  @EventPattern(KafkaTopics.DEPLOYMENT_BUILDING_EVENT)
  async handleBuildingEvent(dto: DeploymentBuildingEventDto) {
    const project = await this.projectStrategyResolver.resolve({
      projectId: dto.projectId,
    });
    await project.handleBuildingEvent(dto);
  }

  @EventPattern(KafkaTopics.DEPLOYMENT_DEPLOYING_EVENT)
  async handleDeployingEvent(dto: DeploymentDeployingEventDto) {
    const project = await this.projectStrategyResolver.resolve({
      projectId: dto.projectId,
    });
    await project.handleDeployingEvent(dto);
  }

  @EventPattern(KafkaTopics.DEPLOYMENT_DEPLOYED_EVENT)
  async handleDeployedEvent(dto: DeploymentDeployedEventDto) {
    const project = await this.projectStrategyResolver.resolve({
      projectId: dto.projectId,
    });
    await project.handleDeployedEvent(dto);
  }

  @EventPattern(KafkaTopics.DEPLOYMENT_FAILED_EVENT)
  async handleDeploymentFailure(dto: DeploymentFailedEventDto) {
    const project = await this.projectStrategyResolver.resolve({
      projectId: dto.projectId,
    });
    await project.handleDeploymentFailure(dto);
  }
}
