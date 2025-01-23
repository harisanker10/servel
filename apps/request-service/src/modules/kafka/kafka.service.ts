import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
  ) {
    setTimeout(() => {
      // const testDepl: BuildQueueMessage = {
      //   deploymentId: 'asdfq',
      //   data: {
      //     port: 3000,
      //     buildCommand: 'npx tsc -b',
      //     runCommand: 'node ./dist/index.js',
      //     repoUrl: 'https://github.com/harisanker10/express-sample-server',
      //   },
      //   projectId: 'adsfk324jhjfdksdfj',
      //   deploymentType: ProjectType.webService,
      // };
      // this.kafkaClient.emit(KafkaTopics.buildQueue, testDepl);
    }, 1000 * 15);
  }

  // emitClusterUpdates(data: ClusterUpdatesDto) {
  //   console.log('emitting cluster update with data:', data);
  //   this.kafkaClient.emit(KafkaTopics.clusterUpdates, data);
  // }
}
