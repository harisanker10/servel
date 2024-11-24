import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from '@servel/proto/projects';
import { DeploymentRepository } from 'src/repository/deployment.repository';
import {
  Image,
  PopulatedProject,
  Project,
  StaticSite,
  WebService,
} from 'src/repository/interfaces/IProjects.repository';
import { ProjectRepository } from 'src/repository/project.repository';
import { Deployment } from 'src/schemas/deployment.schema';
import { CreateDeploymentDto } from 'src/repository/interfaces/IDeployment.repository';
import {
  DeploymentStatus,
  NotFoundException,
  ProjectType,
} from '@servel/common';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepositroy: ProjectRepository,
    private readonly deploymentRepository: DeploymentRepository,
  ) {}

  async createProject<T extends ProjectType>(
    data: CreateProjectDto,
  ): Promise<PopulatedProject<T>> {
    const deploymentData =
      data.webServiceData || data.imageData || data.staticSiteData;

    return this.projectRepositroy.createProject({
      data: { commitId: '', branch: '', ...deploymentData },
      projectType: data.projectType,
      name: data.name,
      env: data.env,
      userId: data.userId,
      instanceType: data.instanceType,
    });
  }
  async updateDeploymentsWithProjectId({
    projectId,
    updateAll: updates,
  }: {
    projectId: string;
    updateAll: Partial<Record<keyof Deployment, string>>;
  }) {
    return this.deploymentRepository.updateAllDeploymentsWithProjectId({
      projectId,
      updates,
    });
  }

  async createDeploymentForProject(data: CreateDeploymentDto) {
    return this.deploymentRepository.createDeploymentForProject(data);
  }

  async updateDeployment(
    deplId: string,
    updates: Partial<Record<keyof Deployment, string>>,
  ) {
    return this.deploymentRepository.updateDeployment({
      deploymentId: deplId,
      updates,
    });
  }

  async getDeploymentsOfProject(projectId: string) {
    return this.deploymentRepository.getDeployments(projectId);
  }

  async updateDeploymentData(
    deplId: string,
    updates: Partial<
      Record<keyof WebService | keyof StaticSite | keyof Image, string>
    >,
  ) {
    return this.deploymentRepository.updateDeploymentData(deplId, updates);
  }

  async getDeployment(deplId: string) {
    const depl = await this.deploymentRepository.getDeployment(deplId);
    if (!depl || !depl?.id) {
      throw new NotFoundException('Deployment not found');
    }
    return depl;
  }

  async updateProject(
    projectId: string,
    updates: Partial<Record<keyof Project, string>>,
  ) {
    return this.projectRepositroy.updateProject({ projectId, updates });
  }

  async getProject(projectId: string) {
    const project = await this.projectRepositroy.getProject(projectId);
    if (!project || !project?.id) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async getAllProjectsOfUser(userId: string) {
    const projects = await this.projectRepositroy.getProjects(userId);
    if (!projects || projects.length < 1) {
      throw new NotFoundException('Projects not found');
    }
    return projects;
  }
}
