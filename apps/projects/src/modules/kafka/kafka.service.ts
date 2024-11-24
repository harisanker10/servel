import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  BuildQueueMessage,
  ClusterUpdatesDto,
  DeploymentUpdatesDto,
  KafkaTopics,
  ProjectType,
  deploymentQueueDto,
} from '@servel/common';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
  ) {}

  emitToBuildQueue(deployment: BuildQueueMessage) {
    this.kafkaClient.emit(KafkaTopics.buildQueue, deployment);
  }

  emitClusterUpdates(updates: ClusterUpdatesDto) {
    this.kafkaClient.emit(KafkaTopics.clusterUpdates, updates);
  }

  emitDeploymentUpdates(updates: DeploymentUpdatesDto) {
    this.kafkaClient.emit(KafkaTopics.deploymentUpdates, updates);
  }

  emitToDeploymentQueue(deployment: deploymentQueueDto) {
    this.kafkaClient.emit(KafkaTopics.deploymentQueue, deployment);
  }
}
