import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  BuildQueueMessage,
  ClusterUpdatesDto,
  DeploymentImageUpdateDto,
  DeploymentUpdatesDto,
  KafkaTopics,
  ProjectStatus,
  ProjectType,
  StaticSiteUpdatesDto,
} from '@servel/common';

@Injectable()
export class KafkaService {
  private loggerTest: Logger;
  constructor(
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
  ) {
    // setTimeout(() => {
    //   this.loggerTest.log('Emitting now...');
    //   const testDepl: BuildQueueMessage<ProjectType.STATIC_SITE> = {
    //     name: 'test-static-depl',
    //     deploymentId: 'test-static-depl',
    //     data: {
    //       outDir: './dist',
    //       buildCommand: 'npm run build',
    //       repoUrl: 'https://github.com/harisanker10/sort-visualizer',
    //     },
    //     projectId: 'projectId',
    //     deploymentType: ProjectType.STATIC_SITE,
    //   };
    //   this.kafkaClient.emit(KafkaTopics.buildQueue, testDepl);
    // }, 1000 * 15);
    // this.loggerTest = new Logger('Test-logger');
    // this.loggerTest.log('emitting test-deployment updates in 15s');
  }

  emitDeploymentStatusUpdate(updateDto: DeploymentUpdatesDto) {
    this.kafkaClient.emit(KafkaTopics.deploymentUpdates, updateDto);
  }

  emitClusterUpdates(data: ClusterUpdatesDto) {
    console.log('emitting cluster update with data:', data);
    this.kafkaClient.emit(KafkaTopics.clusterUpdates, data);
  }

  emitImageUpdates(data: DeploymentImageUpdateDto) {
    this.kafkaClient.emit(KafkaTopics.imageUpdates, data);
  }

  emitStaticSiteDataUpdates(data: StaticSiteUpdatesDto) {
    this.kafkaClient.emit(KafkaTopics.staticSiteUpdates, data);
  }
}
