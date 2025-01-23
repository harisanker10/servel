import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  KafkaTopics,
  DeploymentQueueDto,
  BuildAndDeployQueueDto,
  DeploymentStoppedEventDto,
} from '@servel/common';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
  ) {}

  emitToBuildAndDeployQueue(deployment: BuildAndDeployQueueDto) {
    this.kafkaClient.emit(KafkaTopics.BUILD_AND_DEPLOY_QUEUE, deployment);
  }

  emitDeploymentStoppedEvent(updates: DeploymentStoppedEventDto) {
    this.kafkaClient.emit(KafkaTopics.DEPLOYMENT_STOPPED_EVENT, updates);
  }

  emitToDeploymentQueue(deployment: DeploymentQueueDto) {
    this.kafkaClient.emit(KafkaTopics.DEPLOYMENT_QUEUE, deployment);
  }
}
