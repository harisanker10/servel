import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import {
  BuildQueueMessage,
  DeploymentQueueDto,
  InstanceType,
  KafkaTopics,
  ProjectStatus,
  ProjectType,
} from '@servel/common';
import { KafkaService } from '../kafka/kafka.service';
import { DeploymentStrategyResolver } from 'src/deploymentStrategy/deployment.strategy.resolver';
import { BuildService } from './build.service';
import checkDeploymentReplicaReadiness from 'src/utils/checkReadiness';

@Controller()
export class BuildController {
  private logger: Logger;
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly deploymentStrategyResolver: DeploymentStrategyResolver,
    private readonly buildService: BuildService,
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
      const deployment = this.deploymentStrategyResolver.resolve({
        data: {
          deploymentId: data.deploymentId,
          deploymentName: data.name,
          ...data.data,
        },
        env: data.env,
        projectType: data.deploymentType,
      });
      console.log({ deployement: deployment });
      await deployment.build();
      this.kafkaService.emitDeploymentStatusUpdate({
        deploymentId: data.deploymentId,
        updates: { status: ProjectStatus.DEPLOYING },
      });

      await deployment.deploy();

      if (
        data.deploymentType !== ProjectType.STATIC_SITE &&
        (await checkDeploymentReplicaReadiness(
          's' + deployment.getData().deploymentId,
        ))
      ) {
        this.kafkaService.emitDeploymentStatusUpdate({
          deploymentId: data.deploymentId,
          updates: { status: ProjectStatus.DEPLOYED },
        });
      }

      this.kafkaService.emitDeploymentStatusUpdate({
        deploymentId: data.deploymentId,
        updates: {
          status: ProjectStatus.DEPLOYED,
          deploymentUrl: `http://${data.deploymentId}.servel.com`,
        },
      });
    } catch (err) {
      console.log('error caught in build controller');
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
    @Payload() data: DeploymentQueueDto,
    @Ctx() context: KafkaContext,
  ) {
    try {
      this.kafkaService.emitDeploymentStatusUpdate({
        deploymentId: data.deploymentId,
        updates: { status: ProjectStatus.DEPLOYING },
      });

      await this.buildService.runImage({
        deploymentName: data.deploymentName,
        deploymentId: data.deploymentId,
        imageName: data.image,
        port: data.port,
        envs: {},
        instanceType: InstanceType.TIER_0,
      });
      if (await checkDeploymentReplicaReadiness('s' + data.deploymentId)) {
        this.kafkaService.emitDeploymentStatusUpdate({
          deploymentId: data.deploymentId,
          updates: {
            status: ProjectStatus.DEPLOYED,
            deploymentUrl: `http://${data.deploymentId}.servel.com`,
          },
        });
      }
    } catch (error) {
      console.log({ error });
      this.kafkaService.emitDeploymentStatusUpdate({
        deploymentId: data.deploymentId,
        updates: { status: ProjectStatus.FAILED },
      });
    }
  }
}
