import { Inject, Injectable } from '@nestjs/common';
import {
  CreateImageDeploymentDto,
  CreateProjectDto,
  CreateStaticSiteDeploymentDto,
  CreateWebServiceDeploymentDto,
} from 'src/repository/interfaces/IProjects.repository';
import { ProjectRepository } from 'src/repository/project.repository';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepositroy: ProjectRepository) {}

  async createNewProjectDeployment(data: CreateProjectDto) {
    return this.projectRepositroy.createProject(data);
  }

  createImageDeploymentForProject(deployment: CreateImageDeploymentDto) {
    return this.projectRepositroy.createImageDeployment(deployment);
  }

  createWebServiceDeploymentForProject(
    deployment: CreateWebServiceDeploymentDto,
  ) {
    return this.projectRepositroy.createWebServiceDeployment(deployment);
  }

  createStaticSiteDeploymentForProject(
    deployment: CreateStaticSiteDeploymentDto,
  ) {
    return this.projectRepositroy.createStaticSiteDeployment(deployment);
  }

  getProject(projectId: string) {
    return this.projectRepositroy.getProject(projectId);
  }

  getAllProjectsOfUser(userId: string) {
    return this.projectRepositroy.getProjects(userId);
  }

  getDeploymentById(deplId: string) {
    return this.projectRepositroy.getDeployment(deplId);
  }
  deleteProject(projectId: string) {
    return this.projectRepositroy.deleteProject(projectId);
  }
}
