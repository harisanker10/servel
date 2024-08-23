import { Controller } from '@nestjs/common';
import { DeploymentsService } from './deployments.service';
import { EventPattern } from '@nestjs/microservices';
import { DeploymentUpdatesDto } from '@servel/dto';

@Controller()
export class DeploymentsUpdatesController {
  constructor(private readonly deplService: DeploymentsService) {}

  @EventPattern('deployment-updates')
  updateDeployment(data: DeploymentUpdatesDto) {
    this.deplService.updateDeployment(
      data.deploymentId,
      data.version,
      data.updates,
    );
  }
}
