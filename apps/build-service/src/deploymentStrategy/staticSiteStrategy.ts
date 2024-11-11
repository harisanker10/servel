import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/common';
import { DeploymentStrategy } from './IdeploymentStrategy';

export class StaticSiteDeployment extends DeploymentStrategy {
  constructor(
    deploymentId: string,
    data: WebServiceData | ImageData | StaticSiteData,
    env?: { id: string; values: Record<string, string> },
  ) {
    super(deploymentId, ProjectType.STATIC_SITE, data, env);
  }

  async build() {}

  async deploy(): Promise<any> {}

  getData(): WebServiceData | ImageData | StaticSiteData {
    return this.data;
  }
}
