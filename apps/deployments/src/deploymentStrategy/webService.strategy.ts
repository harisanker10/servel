import {
  ImageData,
  InstanceType,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from '@servel/dto';
import { DeploymentStrategy } from './IdeploymentStrategy';
import { BuildService } from 'src/build/build.service';
import { getReponame } from 'src/utils/getRepoName';
import { Env } from 'src/types/env';

export class WebServiceDeployment extends DeploymentStrategy {
  private readonly buildService: BuildService;
  private imagePath: string | undefined;
  constructor(
    deploymentId: string,
    data: WebServiceData,
    env?: Env | undefined,
  ) {
    super(deploymentId, ProjectType.webService, data, env);
    this.buildService = new BuildService();
  }

  async build() {
    const data = this.data as WebServiceData;
    const builtData = await this.buildService.buildWebService({
      deploymentId: this.deploymentId,
      env: this.env,
      port: data.port,
      repoUrl: data.repoUrl,
      repoName: getReponame(data.repoUrl),
      runCommand: data.runCommand,
      buildCommand: data.buildCommand,
      instanceType: InstanceType.tier_0,
    });

    if (builtData && builtData.image) {
      this.imagePath = builtData.image;
      return this.imagePath;
    }
  }

  async deploy(): Promise<any> {
    if (this.imagePath) {
      const deploydata = await this.buildService.runWebService(
        this.imagePath,
        this.deploymentId,
        (this.data as WebServiceData).port,
      );
      console.log({ deploydata });
    }
  }

  getData(): WebServiceData | ImageData | StaticSiteData {
    return this.data;
  }
}
