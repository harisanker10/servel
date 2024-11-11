import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { BuildQueueMessage, KafkaTopics, ProjectType } from '@servel/common';

@Injectable()
export class KafkaService {
  constructor(@Inject('kafka') private readonly kafkaClient: ClientKafka) {}

  emitToBuildQueue(deployment: BuildQueueMessage) {
    this.kafkaClient.emit(KafkaTopics.buildQueue, deployment);
  }
}
