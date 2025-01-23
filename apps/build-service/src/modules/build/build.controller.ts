import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import {
  BuildAndDeployQueueDto,
  DeploymentQueueDto,
  KafkaTopics,
} from '@servel/common';
import { KafkaService } from '../kafka/kafka.service';
import { DeploymentStrategyResolver } from 'src/deploymentStrategy/deployment.strategy.resolver';
import { ProjectType } from '@servel/common/types';

@Controller()
export class BuildController {
  private logger: Logger;
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly deploymentStrategyResolver: DeploymentStrategyResolver,
  ) {
    this.logger = new Logger(BuildController.name);
  }

  @EventPattern(KafkaTopics.BUILD_AND_DEPLOY_QUEUE)
  async buildAndDeploy(
    @Payload() data: BuildAndDeployQueueDto,
    @Ctx() context: KafkaContext,
  ) {
    console.log({ buildAndDeployData: data });
    const heartbeat = context.getHeartbeat();
    const interval = setInterval(async () => {
      await heartbeat();
    }, 5000);

    try {
      const deployment = this.deploymentStrategyResolver.resolve({
        deploymentId: data.deploymentId,
        name: data.name,
        staticSiteData:
          'staticSiteServiceData' in data && data.staticSiteServiceData,
        imageData: 'imageServiceData' in data && data.imageServiceData,
        webServiceData: 'webServiceData' in data && data.webServiceData,
        instanceType: data.instanceType,
        envs: data.envs,
        projectId: data.projectId,
        projectType: data.projectType,
      });

      await deployment.build();
      await deployment.deploy();
    } catch (err) {
      this.logger.error(err);
      console.error(err);
      this.kafkaService.emitDeploymentFailedEvent({
        deploymentId: data.deploymentId,
        projectId: data.projectId,
        err: err.name || err.message || err.toString(),
      });
    } finally {
      clearInterval(interval);
    }
  }

  @EventPattern(KafkaTopics.DEPLOYMENT_QUEUE)
  async deploy(@Payload() data: DeploymentQueueDto) {
    console.log({ deploymentQueueData: data });
    try {
      const deployment = this.deploymentStrategyResolver.resolve({
        deploymentId: data.deploymentId,
        name: data.name,
        staticSiteData:
          data.projectType === ProjectType.STATIC_SITE &&
          data.staticSiteServiceData,
        imageData:
          data.projectType === ProjectType.IMAGE && data.imageServiceData,
        webServiceData:
          data.projectType === ProjectType.WEB_SERVICE && data.webServiceData,
        instanceType: data.instanceType,
        envs: data.envs,
        projectId: data.projectId,
        projectType: data.projectType,
      });
      await deployment.deploy();
    } catch (error) {
      console.log('Deployment Failed');
      console.log(error);
      this.kafkaService.emitDeploymentFailedEvent({
        deploymentId: data.deploymentId,
        projectId: data.projectId,
        err: error.message || error.name || error.toString(),
      });
    }
  }
}
