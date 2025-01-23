import { DeploymentStrategy } from './IdeploymentStrategy';
import { WebServiceDeployment } from './webService.strategy';
import { ImageDeployment } from './image.strategy';
import { StaticSiteDeployment } from './staticSiteStrategy';
import { DeploymentData } from 'src/types/deployment';
import { ProjectType } from '@servel/common/types';
import { ModuleRef } from '@nestjs/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeploymentStrategyResolver {
  constructor(private readonly moduleRef: ModuleRef) {}
  resolve(data: DeploymentData): DeploymentStrategy {
    switch (data.projectType) {
      case ProjectType.WEB_SERVICE:
        console.log('Creating new webServiceData');
        return new WebServiceDeployment(
          {
            ...data,
            projectType: ProjectType.WEB_SERVICE,
          },
          this.moduleRef,
        );
      case ProjectType.STATIC_SITE:
        return new StaticSiteDeployment(
          {
            ...data,
            projectType: ProjectType.STATIC_SITE,
          },
          this.moduleRef,
        );

      case ProjectType.IMAGE:
        return new ImageDeployment(
          {
            ...data,
            projectType: ProjectType.IMAGE,
          },
          this.moduleRef,
        );

      default:
        throw new Error(`Unknown projectType ${data.projectType}`);
    }
  }
}
