import { Controller, Inject, NotImplementedException } from '@nestjs/common';
import {
  ClientKafka,
  EventPattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import {
  CreateDeploymentDto,
  CreateProjectDto,
  Deployment,
  Deployments,
  GetDeploymentDto,
  GetDeploymentsDto,
  GetProjectDto,
  GetUserDto,
  PopulatedProject,
  Project,
  ProjectType,
  Projects,
  ProjectsServiceController,
  ProjectsServiceControllerMethods,
  UpdateInstanceTypeDto,
} from '@servel/proto/projects';
import { ProjectsService } from '../services/projects.service';
import { Observable } from 'rxjs';
import { KafkaService } from 'src/modules/kafka/kafka.service';
import {
  DeploymentUpdatesDto,
  ImageData,
  KafkaTopics,
  StaticSiteData,
  WebServiceData,
} from '@servel/common';

@Controller()
@ProjectsServiceControllerMethods()
export class ProjectsController implements ProjectsServiceController {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly projectsService: ProjectsService,
  ) {}

  async createProject(data: CreateProjectDto): Promise<PopulatedProject> {
    console.log({ data });
    const project = await this.projectsService.createProject(data);

    console.log({
      project,
      deployemnts: project.deployments[0],
      deplData: project.deployments[0].data,
    });

    const projectData: ImageData | StaticSiteData | WebServiceData =
      project.deployments[0].data;

    this.kafkaService.emitToBuildQueue({
      projectId: project.id,
      deploymentType: project.projectType,
      name: project.name,
      data: projectData,
      deploymentId: project.deployments[0].id,
    });

    return {
      ...project,
      deployments: project.deployments.map((depl) => ({
        ...depl,
        env: '',
        // env: depl.env ? depl.env : null,
      })),
    };
  }

  async createDeployment(dto: CreateDeploymentDto): Promise<Deployment> {
    const { projectId, env: envId, userId } = dto;

    const data = dto.imageData || dto.staticSiteData || dto.webServiceData;

    const { imageData, staticSiteData, webServiceData } = dto;

    const deployment = await this.projectsService.createDeploymentForProject({
      data: { branch: '', commitId: '', ...data },
      envId,
      projectId,
    });
    return {
      imageData,
      staticSiteData,
      webServiceData,
      ...deployment,
    };
  }

  async getProject(request: GetProjectDto): Promise<PopulatedProject> {
    const project = await this.projectsService.getProject(request.projectId);
    return {
      ...project,
      projectType: project.projectType,
      deployments: project.deployments.map((deployment) => ({
        ...deployment,
        env: deployment.env ? deployment.env : null,
      })),
    };
  }

  async getAllProjects(request: GetUserDto): Promise<Projects> {
    const projects = await this.projectsService.getAllProjectsOfUser(
      request.userId,
    );
    if (projects.length < 1) {
      throw new RpcException('No projects');
    }
    if (projects.length > 0) {
      return {
        //@ts-ignore
        projects: projects as Project[],
      };
    }
  }

  getDeployments(
    request: GetDeploymentsDto,
  ): Deployments | Promise<Deployments> | Observable<Deployments> {
    throw new NotImplementedException();
  }

  async getDeployment(request: GetDeploymentDto): Promise<Deployment> {
    const depl = await this.projectsService.getDeploymentById(
      request.deploymentId,
    );
    if (!depl) {
      throw new RpcException({
        code: 2,
      });
    }
    return { ...depl, env: depl.env ? depl.env : null };
  }

  stopDeployment(
    request: GetDeploymentDto,
  ): Deployment | Promise<Deployment> | Observable<Deployment> {
    throw new NotImplementedException();
  }

  retryDeployment(
    request: GetDeploymentDto,
  ): Deployment | Promise<Deployment> | Observable<Deployment> {
    throw new NotImplementedException();
  }
  rollbackProject(
    request: GetDeploymentDto,
  ): Deployment | Promise<Deployment> | Observable<Deployment> {
    throw new NotImplementedException();
  }
  deleteDeployment(
    request: GetDeploymentDto,
  ): Deployment | Promise<Deployment> | Observable<Deployment> {
    throw new NotImplementedException();
  }
  updateInstanceType(
    request: UpdateInstanceTypeDto,
  ): Project | Promise<Project> | Observable<Project> {
    throw new NotImplementedException();
  }

  async deleteProject(request: GetProjectDto): Promise<Project> {
    const project = await this.projectsService.deleteProject(request.projectId);
    if (!project) {
      throw new RpcException('Not found');
    }
    //@ts-ignore
    return project;
  }
}
