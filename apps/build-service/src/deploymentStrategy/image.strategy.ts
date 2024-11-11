import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/common';
import { DeploymentStrategy } from './IdeploymentStrategy';

export class ImageDeployment extends DeploymentStrategy {
  constructor(
    deploymentName: string,
    deploymentId: string,
    data: WebServiceData | ImageData | StaticSiteData,
    env?: { id: string; values: Record<string, string> },
  ) {
    super(deploymentName, deploymentId, ProjectType.IMAGE, data, env);
  }

  async build() {}

  async deploy(): Promise<any> {}

  getData(): WebServiceData | ImageData | StaticSiteData {
    return this.data;
  }
}
