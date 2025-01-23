import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@servel/common';
import {
  DeploymentStatus,
  ProjectStatus,
  ProjectType,
} from '@servel/common/types';
import { DeploymentRepository } from 'src/repository/deployment.repository';
import { Deployment } from 'src/types';
import { CreateProjectDto } from 'src/repository/interfaces/IProjects.repository';
import { ProjectRepository } from 'src/repository/project.repository';
import { PopulatedProject, Project } from 'src/types';
import { ConfilictException } from '@servel/common';

/*
 * This service wraps around repository layer to have builsness validation rules.
 */

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepositroy: ProjectRepository,
    private readonly deploymentRepository: DeploymentRepository,
  ) {}

  //TODO: Refactor error handling
  async createProject(data: CreateProjectDto): Promise<PopulatedProject> {
    try {
      const project = await this.projectRepositroy.createProject({
        ...data,
      });
      const deployment = await this.deploymentRepository.createDeployment({
        ...data,
        projectId: project.id,
      });
      return { ...project, deployments: [deployment] };
    } catch (err) {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new ConfilictException('Project name already exist');
      }
    }
  }

  async stopProject(
    projectId: string,
  ): Promise<{ project: Project; deployment: Deployment }> {
    const activeDeployement =
      await this.deploymentRepository.findActiveDeploymentOfProject(projectId);
    if (!activeDeployement) {
      throw new Error(`No active deployement for project ${projectId}`);
    }
    const [project, deployment] = await Promise.all([
      this.updateProjectStatus(projectId, ProjectStatus.STOPPED),
      this.deploymentRepository.updateDeploymentStatus(
        activeDeployement.id,
        DeploymentStatus.STOPPED,
      ),
    ]);

    return { project, deployment };
  }

  async startProject(projectId: string) {
    return this.projectRepositroy.updateProjectStatus(
      projectId,
      ProjectStatus.QUEUED,
    );
  }

  async updateProject(
    projectId: string,
    updates: Partial<Record<keyof Project, string>>,
  ) {
    return this.projectRepositroy.updateProject({ projectId, updates });
  }

  async getAllProjectsOfUser(userId: string): Promise<Project[]> {
    const projects = await this.projectRepositroy.getProjectsOfUser(userId);
    if (!projects || projects.length < 1) {
      throw new NotFoundException('Projects not found');
    }
    return projects;
  }

  async updateProjectStatus(projectId: string, status: ProjectStatus) {
    if ([ProjectStatus.STOPPED, ProjectStatus.FAILED].includes(status)) {
      return this.projectRepositroy.updateProject({
        projectId,
        updates: { status, deploymentUrl: '' },
      });
    }
    return this.projectRepositroy.updateProjectStatus(projectId, status);
  }

  async getProject(projectId: string): Promise<PopulatedProject> {
    const [project, deployments] = await Promise.all([
      this.projectRepositroy.getProject(projectId),
      this.deploymentRepository.findDeploymentsOfProject(projectId),
    ]);
    if (!project || !project?.id) {
      throw new NotFoundException('Project not found');
    }
    return { ...project, deployments };
  }

  extractDeploymentServiceData(
    projectType: ProjectType,
    deployment: Deployment,
  ) {
    switch (projectType) {
      case ProjectType.IMAGE:
        return { imageServiceData: deployment.imageData };
      case ProjectType.WEB_SERVICE:
        return { webServiceData: deployment.webServiceData };
      case ProjectType.STATIC_SITE:
        return { staticSiteserviceData: deployment.staticSiteData };
      default:
        throw new Error('Unknown project Type');
    }
  }
}
