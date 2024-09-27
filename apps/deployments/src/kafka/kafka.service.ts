import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  ClusterUpdatesDto,
  DeploymentUpdatesDto,
  KafkaTopics,
} from '@servel/dto';

@Injectable()
export class KafkaService {
  constructor(@Inject('kafka') private readonly kafkaClient: ClientKafka) {}

  emitStatusUpdate(updateDto: DeploymentUpdatesDto) {
    this.kafkaClient.emit(KafkaTopics.deploymentUpdates, updateDto);
  }

  emitClusterUpdates(data: ClusterUpdatesDto) {
    this.kafkaClient.emit(KafkaTopics.clusterUpdates, data);
  }
}
