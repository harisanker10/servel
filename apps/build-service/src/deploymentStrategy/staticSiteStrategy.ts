import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/common';
import { DeploymentStrategy } from './IdeploymentStrategy';
import { BuildService } from 'src/modules/build/build.service';
import { DeploymentData } from 'src/types/deployment';
import { Env } from 'src/types/env';

export class StaticSiteDeployment extends DeploymentStrategy {
  constructor(
    private readonly buildService: BuildService,
    data: DeploymentData,
    env?: Env | undefined,
  ) {
    super({ data, env });
  }

  async build() {
    return this.buildService.buildStaticSite({
      data: { ...(this.data as StaticSiteData) },
      deploymentId: this.data.deploymentId,
    });
  }

  async deploy(): Promise<any> {}

  getData() {
    return { ...(this.data as DeploymentData), env: this.env };
  }
}
