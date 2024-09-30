import { Controller, Inject, NotImplementedException } from '@nestjs/common';
import { ClientKafka, EventPattern, RpcException } from '@nestjs/microservices';
import { BuildQueueMessage, KafkaTopics, ProjectStatus } from '@servel/dto';
import { DeploymentStrategyResolver } from 'src/deploymentStrategy/deployment.strategy.resolver';
import { KafkaService } from '../kafka/kafka.service';

@Controller()
export class BuildController {
  constructor(
    // private readonly deploymentsService: DeploymentsService,
    private readonly kafkaService: KafkaService,
  ) {}

  @EventPattern(KafkaTopics.buildQueue)
  async build(data: BuildQueueMessage) {
    console.log(
      'Got data in ',
      KafkaTopics.buildQueue,
      { data },
      '\n throwing not implemented error...',
    );
    throw new NotImplementedException();
    // this.kafkaService.emitStatusUpdate({
    //   deploymentId: data.deploymentId,
    //   updates: { status: ProjectStatus.building },
    // });
    //
    // const deployement = DeploymentStrategyResolver.resolve(
    //   data.deploymentId,
    //   data.deploymentType,
    //   data.data,
    //   data.env,
    // );
    //
    // // await this.deploymentsService.createDeployment({
    // //   ...data,
    // //   projectType: data.deploymentType,
    // // });
    //
    // await deployement.build();
    // this.kafkaService.emitStatusUpdate({
    //   deploymentId: data.deploymentId,
    //   updates: { status: ProjectStatus.deploying },
    // });
    //
    // await deployement.deploy();
    // this.kafkaService.emitStatusUpdate({
    //   deploymentId: data.deploymentId,
    //   updates: { status: ProjectStatus.deployed },
    // });
  }
}
