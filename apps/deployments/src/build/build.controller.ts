import { Controller, Inject } from '@nestjs/common';
import { BuildService } from './build.service';
import { ClientKafka, EventPattern, RpcException } from '@nestjs/microservices';
import { BuildQueueMessage, KafkaTopics, ProjectStatus } from '@servel/dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { DeploymentStrategyResolver } from 'src/deploymentStrategy/deployment.strategy.resolver';

@Controller()
export class BuildController {
  constructor(
    private readonly buildService: BuildService,
    // @Inject('build-service') private readonly kafkaClient: ClientKafka,
    private readonly kafkaService: KafkaService,
  ) {}

  @EventPattern(KafkaTopics.buildQueue)
  async build(data: BuildQueueMessage) {
    this.kafkaService.emitStatusUpdate({
      deploymentId: data.deploymentId,
      updates: { status: ProjectStatus.building },
    });

    const deployement = DeploymentStrategyResolver.resolve(
      data.deploymentId,
      data.deploymentType,
      data.data,
      data.env,
    );

    await deployement.build();
    this.kafkaService.emitStatusUpdate({
      deploymentId: data.deploymentId,
      updates: { status: ProjectStatus.deploying },
    });

    await deployement.deploy();
    this.kafkaService.emitStatusUpdate({
      deploymentId: data.deploymentId,
      updates: { status: ProjectStatus.deployed },
    });
  }
}
