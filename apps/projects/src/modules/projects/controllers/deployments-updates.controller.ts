import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { DeploymentUpdatesDto, KafkaTopics } from '@servel/dto';
import { ProjectsService } from '../services/projects.service';

@Controller()
export class DeploymentsUpdatesController {
  constructor(private readonly deplService: ProjectsService) {}

  @EventPattern(KafkaTopics.deploymentUpdates)
  updateDeployment(data: DeploymentUpdatesDto) {
    console.log({ data });
    // this.deplService.updateDeployment(
    //   data.deploymentId,
    //   data.version,
    //   data.updates,
    // );
  }
}
