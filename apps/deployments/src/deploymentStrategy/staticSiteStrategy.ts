import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/dto';
import { DeploymentStrategy } from './IdeploymentStrategy';

export class StaticSiteDeployment extends DeploymentStrategy {
  constructor(
    deploymentId: string,
    data: WebServiceData | ImageData | StaticSiteData,
  ) {
    super(deploymentId, ProjectType.staticSite, data);
  }

  async build() {}

  async deploy(): Promise<any> {}

  getData(): WebServiceData | ImageData | StaticSiteData {
    return this.data;
  }
}
