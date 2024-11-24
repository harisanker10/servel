import { ProjectType } from '@servel/common';
import { DeploymentStrategy } from './IdeploymentStrategy';
import { WebServiceDeployment } from './webService.strategy';
import { ImageDeployment } from './image.strategy';
import { StaticSiteDeployment } from './staticSiteStrategy';
import { Env } from 'src/types/env';
import { Inject, Injectable } from '@nestjs/common';
import { BuildService } from 'src/modules/build/build.service';
import { DeploymentData } from 'src/types/deployment';

@Injectable()
export class DeploymentStrategyResolver {
  constructor(private readonly buildService: BuildService) {}
  resolve({
    data,
    projectType,
    env,
  }: {
    data: DeploymentData;
    projectType: ProjectType;
    env: Env | undefined;
  }): DeploymentStrategy {
    switch (projectType) {
      case ProjectType.WEB_SERVICE:
        return new WebServiceDeployment(this.buildService, data, env);
      case ProjectType.IMAGE:
        return new ImageDeployment(this.buildService, data, env);
      case ProjectType.STATIC_SITE:
        return new StaticSiteDeployment(this.buildService, data, env);
      default:
        throw new Error('Unsupported project type');
    }
  }
}
