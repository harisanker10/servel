import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/dto';
import { DeploymentStrategy } from './IdeploymentStrategy';
import { WebServiceDeployment } from './webService.strategy';
import { ImageDeployment } from './image.strategy';
import { StaticSiteDeployment } from './staticSiteStrategy';
import { Env } from 'src/types/env';

// Define a resolver to select the appropriate strategy based on project type
export class DeploymentStrategyResolver {
  static resolve(
    deploymentId: string,
    projectType: ProjectType,
    data: WebServiceData | ImageData | StaticSiteData,
    env?: Env | undefined,
  ): DeploymentStrategy {
    switch (projectType) {
      case ProjectType.webService:
        return new WebServiceDeployment(
          deploymentId,
          data as WebServiceData,
          env,
        );
      case ProjectType.dockerImage:
        return new ImageDeployment(deploymentId, data as ImageData);

      case ProjectType.staticSite:
        return new StaticSiteDeployment(deploymentId, data as StaticSiteData);
      default:
        throw new Error('Unsupported project type');
    }
  }
}
