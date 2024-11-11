import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DeploymentUpdatesDto, KafkaTopics } from '@servel/common';
import { ProjectRepository } from 'src/repository/project.repository';

@Controller()
export class DeploymentsUpdatesController {
  constructor(private readonly projectRepo: ProjectRepository) {}

  @EventPattern(KafkaTopics.deploymentUpdates)
  updateDeployment(@Payload() data: DeploymentUpdatesDto) {
    console.log({ data });
    //@ts-ignore
    this.projectRepo.updateDeployment(data.deploymentId, data.updates);
  }
}
