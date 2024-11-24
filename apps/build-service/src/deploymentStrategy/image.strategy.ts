import { DeploymentStrategy } from './IdeploymentStrategy';
import { DeploymentData } from 'src/types/deployment';
import { BuildService } from 'src/modules/build/build.service';

export class ImageDeployment extends DeploymentStrategy {
  constructor(
    private readonly buildService: BuildService,
    data: DeploymentData,
    env?: { id: string; values: Record<string, string> },
  ) {
    super({ data, env });
  }

  async build() {}

  async deploy(): Promise<any> {}

  getData() {
    return { ...(this.data as DeploymentData), env: this.env };
  }
}
