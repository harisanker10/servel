import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  BuildAndDeployQueueDto,
  DeploymentBuildingEventDto,
  DeploymentDeployedEventDto,
  DeploymentDeployingEventDto,
  DeploymentFailedEventDto,
  KafkaTopics,
} from '@servel/common';
import { InstanceType, ProjectType } from '@servel/common/types';

@Injectable()
export class KafkaService {
  private loggerTest: Logger;
  constructor(
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
  ) {
    // const emitTestDeployments = (arg: ProjectType[]) => {
    //   this.loggerTest = new Logger('Test-Deployment');
    //   const delayInSec = 8;
    //   this.loggerTest.log(`emitting test-deployments in ${delayInSec}s`);
    //   // { _id: ObjectId('67763cd2ff20935c7585a21b')
    //   // { _id: ObjectId('67763cd2ff20935c7585a21c'
    //   // { _id: ObjectId('67763cd2ff20935c7585a21d'
    //   let i = 0;
    //   const interval = setInterval(() => {
    //     if (++i >= delayInSec) {
    //       clearInterval(interval);
    //       this.loggerTest.log('Emitting now...');
    //       const testWebServiceDepl: BuildAndDeployQueueDto<ProjectType.WEB_SERVICE> =
    //         {
    //           name: 'test-web-service-depl',
    //           deploymentId: '67763cd2ff20935c7585a21b',
    //           projectId: '67763cd2ff20935c7585a21b',
    //           webServiceData: {
    //             port: 3000,
    //             repoUrl: 'https://github.com/harisanker10/sort-visualizer',
    //             runCommand: 'npx serve ./dist',
    //             buildCommand: 'npm run build',
    //             buildLogsPushUrl: '',
    //           },
    //           instanceType: InstanceType.TIER_0,
    //         };
    //
    //       const testStaticSiteDepl: BuildAndDeployQueueDto<ProjectType.STATIC_SITE> =
    //         {
    //           name: 'test-static-site-depl',
    //           deploymentId: '67763cd2ff20935c7585a21c',
    //           projectId: '67763cd2ff20935c7585a21c',
    //           staticSiteServiceData: {
    //             buildCommand: 'npm run build',
    //             outDir: './dist',
    //             repoUrl: 'https://github.com/harisanker10/sort-visualizer',
    //             assetsPushUrl: '',
    //             buildLogsPushUrl: '',
    //           },
    //         };
    //
    //       const testImageSiteDepl: BuildAndDeployQueueDto<ProjectType.IMAGE> = {
    //         deploymentId: '67763cd2ff20935c7585a21d',
    //         projectId: '67763cd2ff20935c7585a21d',
    //         instanceType: InstanceType.TIER_0,
    //         projectType: ProjectType.IMAGE,
    //         name: 'test-image-service-depl',
    //         imageServiceData: {
    //           imageUrl: 'nginx',
    //           port: 80,
    //         },
    //       };
    //
    //       for (let depl of arg) {
    //         if (depl === ProjectType.STATIC_SITE)
    //           this.kafkaClient.emit(
    //             KafkaTopics.BUILD_AND_DEPLOY_QUEUE,
    //             testStaticSiteDepl,
    //           );
    //         if (depl === ProjectType.IMAGE)
    //           this.kafkaClient.emit(
    //             KafkaTopics.BUILD_AND_DEPLOY_QUEUE,
    //             testImageSiteDepl,
    //           );
    //
    //         if (depl === ProjectType.WEB_SERVICE)
    //           this.kafkaClient.emit(
    //             KafkaTopics.BUILD_AND_DEPLOY_QUEUE,
    //             testWebServiceDepl,
    //           );
    //       }
    //     } else {
    //       this.loggerTest.log(`Emitting in ${delayInSec - i}s....`);
    //     }
    //   }, 1000);
    // };
    // emit the test
    // emitTestDeployments([])
  }

  emitDeploymentBuildingEvent(dto: DeploymentBuildingEventDto) {
    this.kafkaClient.emit(KafkaTopics.DEPLOYMENT_BUILDING_EVENT, dto);
  }

  emitDeployingEvent<T extends ProjectType>(
    dto: DeploymentDeployingEventDto<T>,
  ) {
    this.kafkaClient.emit(KafkaTopics.DEPLOYMENT_DEPLOYING_EVENT, dto);
  }
  emitDeployed(dto: DeploymentDeployedEventDto) {
    this.kafkaClient.emit(KafkaTopics.DEPLOYMENT_DEPLOYED_EVENT, dto);
  }

  // emitClusterUpdates(data: ClusterUpdatesDto) {
  //   console.log('emitting cluster update with data:', data);
  //   this.kafkaClient.emit(KafkaTopics.clusterUpdates, data);
  // }
  //
  // emitImageUpdates(data: DeploymentImageUpdateDto) {
  //   this.kafkaClient.emit(KafkaTopics.imageUpdates, data);
  // }
  //
  emitDeploymentFailedEvent(data: DeploymentFailedEventDto) {
    this.kafkaClient.emit(KafkaTopics.DEPLOYMENT_FAILED_EVENT, data);
  }
}
