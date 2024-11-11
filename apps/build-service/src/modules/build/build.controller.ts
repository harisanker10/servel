import { Controller, Inject, NotImplementedException } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { BuildQueueMessage, KafkaTopics, ProjectStatus } from '@servel/common';
import { KafkaService } from '../kafka/kafka.service';
import { DeploymentStrategyResolver } from 'src/deploymentStrategy/deployment.strategy.resolver';

@Controller()
export class BuildController {
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
      const deployement = this.deploymentStrategyResolver.resolve(
        data.name,
        data.deploymentId,
        data.deploymentType,
        data.data,
        data.env,
      );
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
}
