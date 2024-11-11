import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  BuildQueueMessage,
  ClusterUpdatesDto,
  DeploymentUpdatesDto,
  KafkaTopics,
  ProjectStatus,
  ProjectType,
} from '@servel/common';

@Injectable()
export class KafkaService {
  private loggerTest: Logger;
  constructor(
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
  ) {
    // setTimeout(() => {
    //   const testDepl: BuildQueueMessage = {
    //     name: 'test-depl',
    //     deploymentId: 'test-depl',
    //     data: {
    //       port: 3000,
    //       buildCommand: 'npm run build',
    //       runCommand: 'npx serve ./dist',
    //       repoUrl: 'https://github.com/harisanker10/sort-visualizer',
    //     },
    //     projectId: 'projectId',
    //     deploymentType: ProjectType.WEB_SERVICE,
    //   };
    //   this.kafkaClient.emit(KafkaTopics.buildQueue, testDepl);
    // }, 1000 * 15);
    this.loggerTest = new Logger('Test-logger');
    this.loggerTest.log('emitting test-deployment updates');
    this.emitDeploymentStatusUpdate({
      deploymentId: 'deplId',
      updates: { status: ProjectStatus.FAILED },
    });
  }

  emitDeploymentStatusUpdate(updateDto: DeploymentUpdatesDto) {
    this.kafkaClient.emit(KafkaTopics.deploymentUpdates, updateDto);
  }

  emitClusterUpdates(data: ClusterUpdatesDto) {
    console.log('emitting cluster update with data:', data);
    this.kafkaClient.emit(KafkaTopics.clusterUpdates, data);
  }
}
