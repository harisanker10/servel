import { InstanceType, ProjectType, WebServiceData } from '@servel/common';
import { DeploymentStrategy } from './IdeploymentStrategy';
import { Env } from 'src/types/env';
import { BuildService } from 'src/modules/build/build.service';
import { KafkaService } from 'src/modules/kafka/kafka.service';
import { Inject, OnModuleInit } from '@nestjs/common';
import { DeploymentData } from 'src/types/deployment';

export class WebServiceDeployment extends DeploymentStrategy {
  private imageName: string | undefined;
  constructor(
    private readonly buildService: BuildService,
    data: DeploymentData,
    env?: Env | undefined,
  ) {
    super({ data, env });
  }

  async build() {
    const imageName = await this.buildService.createDockerImage({
      data: this.getData() as WebServiceData,
      deploymentId: this.getData().deploymentId,
    });
    if (typeof imageName === 'string' && imageName.length > 0) {
      this.imageName = imageName;
    }
  }

  async deploy(): Promise<any> {
    if (this.imageName) {
      this.buildService.runImage({
        deploymentName: this.data.deploymentName,
        deploymentId: this.data.deploymentId,
        imageName: this.imageName,
        port: (this.data as WebServiceData).port,
        envs: this.env?.values,
        instanceType: InstanceType.TIER_0,
      });
    } else {
      throw new Error('Image not created');
    }
  }

  getData() {
    return { ...(this.data as DeploymentData), env: this.env };
  }
}
