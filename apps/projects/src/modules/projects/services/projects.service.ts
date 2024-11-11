import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ProjectType } from '@servel/common';
import {
  CreateProjectDto,
  ProjectType as ProtoProjectType,
} from '@servel/proto/projects';
import {
  Deployment,
  Image,
  Project,
  StaticSite,
  WebService,
} from 'src/repository/interfaces/IProjects.repository';
import { ProjectRepository } from 'src/repository/project.repository';
import { getReponame } from 'src/utils/getReponame';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectRepositroy: ProjectRepository) {}

  async createProject(data: CreateProjectDto): Promise<Project> {
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

  async createDeploymentForProject(data: {
    projectId: string;
    data: WebService | Image | StaticSite;
    envId: string;
  }) {
    return this.projectRepositroy.createDeployment({
      ...data,
    });
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
