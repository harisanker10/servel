import { InstanceType, ProjectType, WebServiceData } from '@servel/common';
import { DeploymentStrategy } from './IdeploymentStrategy';
import { Env } from 'src/types/env';
import { BuildService } from 'src/modules/build/build.service';
import { KafkaService } from 'src/modules/kafka/kafka.service';

export class WebServiceDeployment extends DeploymentStrategy {
  private imageName: string | undefined;
  constructor(
    deploymentName: string,
    private readonly buildService: BuildService,
    private readonly kafkaService: KafkaService,
    deploymentId: string,
    data: WebServiceData,
    env?: Env | undefined,
  ) {
    super(deploymentName, deploymentId, ProjectType.WEB_SERVICE, data, env);
  }

  async build() {
    const imageName = await this.buildService.createDockerImage({
      data: this.getData(),
      deploymentId: this.deploymentId,
    });
    if (typeof imageName === 'string' && imageName.length > 0) {
      this.imageName = imageName;
    }
  }

  async deploy(): Promise<any> {
    if (this.imageName) {
      this.buildService.runImage({
        deploymentName: this.deploymentName,
        deploymentId: this.deploymentId,
        imageName: this.imageName,
        port: this.getData().port,
        envs: this.env?.values,
        instanceType: InstanceType.TIER_0,
      });
    } else {
      throw new Error('Image not created');
    }
  }

  getData(): WebServiceData {
    return this.data as WebServiceData;
  }
}
