import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DeploymentUpdatesDto, KafkaTopics } from '@servel/common';
import { stat } from 'fs';
import { ProjectRepository } from 'src/repository/project.repository';

@Controller()
export class DeploymentsUpdatesController {
  private logger: Logger;
  constructor(private readonly projectRepo: ProjectRepository) {
    this.logger = new Logger(DeploymentsUpdatesController.name);
  }

  @EventPattern(KafkaTopics.deploymentUpdates)
  async updateDeployment(@Payload() data: DeploymentUpdatesDto) {
    this.logger.log({ data });
    const project = await this.projectRepo.getDeployment(data.deploymentId);
    if (!project.id) {
      this.logger.error('No deployment found with id: ' + data.deploymentId);
      return;
    }
    if (data.updates.status) {
      await this.projectRepo.updateProjectWithDeplId(data.deploymentId, {
        status: data.updates.status,
      });
    }
    if (data.updates.deploymentUrl) {
      await this.projectRepo.updateProjectWithDeplId(data.deploymentId, {
        deploymentUrl: data.updates.deploymentUrl,
      });
    }
  }
}
