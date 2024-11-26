import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  BuildQueueMessage,
  ClusterUpdatesDto,
  DeploymentUpdatesDto,
  KafkaTopics,
  ProjectType,
  DeploymentQueueDto,
  StaticSiteUpdatesDto,
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

  emitStatiSiteUpdates(updates: StaticSiteUpdatesDto) {
    this.kafkaClient.emit(KafkaTopics.staticSiteUpdates, updates);
  }

  emitToDeploymentQueue(deployment: DeploymentQueueDto) {
    this.kafkaClient.emit(KafkaTopics.deploymentQueue, deployment);
  }
}
