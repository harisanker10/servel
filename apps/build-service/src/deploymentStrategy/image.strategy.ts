import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/dto';
import { DeploymentStrategy } from './IdeploymentStrategy';

export class ImageDeployment extends DeploymentStrategy {
  constructor(
    deploymentId: string,
    data: WebServiceData | ImageData | StaticSiteData,
    env?: { id: string; values: Record<string, string> },
  ) {
    super(deploymentId, ProjectType.dockerImage, data, env);
  }

  async build() {}

  async deploy(): Promise<any> {}

  getData(): WebServiceData | ImageData | StaticSiteData {
    return this.data;
  }
}
