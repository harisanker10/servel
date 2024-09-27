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
  ) {
    super(deploymentId, ProjectType.dockerImage, data);
  }

  async build() {}

  async deploy(): Promise<any> {}

  getData(): WebServiceData | ImageData | StaticSiteData {
    return this.data;
  }
}
