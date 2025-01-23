import { Injectable, NotImplementedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ProjectType } from '@servel/common/types';
import { WebServiceStrategy } from '../projects/webServiceStrategy';
import { ProjectRepository } from 'src/repository/project.repository';
import { DeploymentRepository } from 'src/repository/deployment.repository';

@Injectable()
export class ProjectStrategyResolver {
  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly deploymentRepo: DeploymentRepository,
    private readonly moduleRef: ModuleRef,
  ) {}

  async resolve({
    projectId,
    deploymentId,
    projectType,
    userId,
  }: {
    projectId?: string;
    deploymentId?: string;
    projectType?: ProjectType;
    userId?: string;
  }) {
    if (!projectType) {
      projectType = await this.getProjectType(projectId, deploymentId, userId);
    }

    if (projectType === ProjectType.WEB_SERVICE) {
      return new WebServiceStrategy(this.moduleRef);
    }

    throw new NotImplementedException(
      `Project type "${projectType}" not implemented`,
    );
  }

  private async getProjectType(
    projectId?: string,
    deploymentId?: string,
    userId?: string,
  ): Promise<ProjectType> {
    if (projectId) {
      const project = await this.projectRepo.getProject(projectId);
      return project.projectType;
    }

    if (deploymentId) {
      const deployment =
        await this.deploymentRepo.findDeploymentById(deploymentId);
      const project = await this.projectRepo.getProject(deployment.projectId);
      return project.projectType;
    }

    if (userId) {
      const projects = await this.projectRepo.getProjectsOfUser(userId);
      return projects[0].projectType;
    }

    throw new Error(
      "Couldn't resolve project strategy. No deploymentId or projectId provided.",
    );
  }
}
