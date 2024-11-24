import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import {
  BuildQueueMessage,
  deploymentQueueDto,
  KafkaTopics,
  ProjectStatus,
  ProjectType,
} from '@servel/common';
import { KafkaService } from '../kafka/kafka.service';
import { DeploymentStrategyResolver } from 'src/deploymentStrategy/deployment.strategy.resolver';

@Controller()
export class BuildController {
  private logger: Logger;
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly deploymentStrategyResolver: DeploymentStrategyResolver,
  ) {}

  @EventPattern(KafkaTopics.buildQueue)
  async build(
    @Payload() data: BuildQueueMessage,
    @Ctx() context: KafkaContext,
  ) {
    const heartbeat = context.getHeartbeat();
    console.log('Got data in controller', data);
    const interval = setInterval(async () => {
      await heartbeat();
    }, 5000);
    this.kafkaService.emitDeploymentStatusUpdate({
      deploymentId: data.deploymentId,
      updates: { status: ProjectStatus.BUILDING },
    });

    try {
      const deployement = this.deploymentStrategyResolver.resolve({
        data: {
          deploymentId: data.deploymentId,
          deploymentName: data.name,
          ...data.data,
        },
        env: data.env,
        projectType: data.deploymentType,
      });
      console.log({ deployement });
      await deployement.build();
      this.kafkaService.emitDeploymentStatusUpdate({
        deploymentId: data.deploymentId,
        updates: { status: ProjectStatus.DEPLOYING },
      });

      await deployement.deploy();
      this.kafkaService.emitDeploymentStatusUpdate({
        deploymentId: data.deploymentId,
        updates: {
          status: ProjectStatus.DEPLOYED,
          deploymentUrl: `http://${data.deploymentId}.servel.com`,
        },
      });
    } catch (err) {
      console.log({ err });
      this.kafkaService.emitDeploymentStatusUpdate({
        deploymentId: data.deploymentId,
        updates: {
          status: ProjectStatus.FAILED,
        },
      });
    } finally {
      clearInterval(interval);
    }
  }

  @EventPattern(KafkaTopics.deploymentQueue)
  async deploy(
    @Payload() data: deploymentQueueDto,
    @Ctx() context: KafkaContext,
  ) {}
}
