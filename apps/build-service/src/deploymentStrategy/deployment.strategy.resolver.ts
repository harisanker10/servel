import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/common';
import { DeploymentStrategy } from './IdeploymentStrategy';
import { WebServiceDeployment } from './webService.strategy';
import { ImageDeployment } from './image.strategy';
import { StaticSiteDeployment } from './staticSiteStrategy';
import { Env } from 'src/types/env';
import { Injectable } from '@nestjs/common';
import { BuildService } from 'src/modules/build/build.service';
import { KafkaService } from 'src/modules/kafka/kafka.service';

// Define a resolver to select the appropriate strategy based on project type
@Injectable()
export class DeploymentStrategyResolver {
  constructor(
    private readonly buildService: BuildService,
    private readonly kafkaService: KafkaService,
  ) {}
  resolve(
    deploymentId: string,
    projectType: ProjectType,
    data: WebServiceData | ImageData | StaticSiteData,
    env?: Env | undefined,
  ): DeploymentStrategy {
    switch (projectType) {
      case ProjectType.WEB_SERVICE:
        return new WebServiceDeployment(
          this.buildService,
          this.kafkaService,
          deploymentId,
          data as WebServiceData,
          env,
        );
      case ProjectType.IMAGE:
        return new ImageDeployment(deploymentId, data as ImageData);

      case ProjectType.STATIC_SITE:
        return new StaticSiteDeployment(deploymentId, data as StaticSiteData);
      default:
        throw new Error('Unsupported project type');
    }
  }
}
