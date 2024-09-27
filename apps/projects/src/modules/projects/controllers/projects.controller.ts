import { Controller, Inject, NotImplementedException } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
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
  Projects,
  ProjectsServiceController,
  ProjectsServiceControllerMethods,
  UpdateInstanceTypeDto,
} from '@servel/proto/projects';
import { ProjectsService } from '../services/projects.service';
import { Observable } from 'rxjs';
import { KafkaService } from 'src/modules/kafka/kafka.service';
import { ProjectType } from '@servel/dto';

@Controller()
@ProjectsServiceControllerMethods()
export class ProjectsController implements ProjectsServiceController {
  constructor(
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
    private readonly kafkaService: KafkaService,
    private readonly projectsService: ProjectsService,
  ) {}

  async createProject(data: CreateProjectDto): Promise<PopulatedProject> {
    const project =
      //@ts-ignore UNRECOGNIZED enum in proto but not in local
      await this.projectsService.createNewProjectDeployment(data);

    this.kafkaService.emitToBuildQueue({
      deploymentType: project.projectType,
      data: data.imageData || data.staticSiteData || data.webServiceData,
      deploymentId: project.deployments[0].id,
      env: project.deployments[0]?.env && project.deployments[0]?.env.envs,
    });

    return {
      ...project,
      projectType: project.projectType,
      deployments: project.deployments.map((depl) => ({
        ...depl,
        env: depl.env ? depl.env.id : null,
      })),
    };
  }

  async createDeployment(data: CreateDeploymentDto): Promise<Deployment> {
    console.log({ data });
    if (data.imageData !== undefined) {
      const deployment =
        await this.projectsService.createImageDeploymentForProject({
          projectId: data.projectId,
          env: data.env,
          imageData: data.imageData,
        });
      this.kafkaService.emitToBuildQueue({
        deploymentId: deployment.id,
        data: deployment.imageData,
        deploymentType: ProjectType.dockerImage,
        env: deployment.env && deployment.env.envs,
      });
      return { ...deployment, env: deployment.env ? deployment.env.id : null };
    }
    if (data.webServiceData !== undefined) {
      const deployment =
        await this.projectsService.createWebServiceDeploymentForProject({
          projectId: data.projectId,
          env: data.env,
          webServiceData: data.webServiceData,
        });
      this.kafkaService.emitToBuildQueue({
        deploymentId: deployment.id,
        data: deployment.webServiceData,
        deploymentType: ProjectType.webService,
        env: deployment.env && deployment.env.envs,
      });
      return { ...deployment, env: deployment.env ? deployment.env.id : null };
    }
    if (data.staticSiteData !== undefined) {
      const deployment =
        await this.projectsService.createStaticSiteDeploymentForProject({
          projectId: data.projectId,
          env: data.env,
          staticSiteData: data.staticSiteData,
        });
      this.kafkaService.emitToBuildQueue({
        deploymentId: deployment.id,
        data: deployment.staticSiteData,
        deploymentType: ProjectType.staticSite,
        env: deployment.env && deployment.env.envs,
      });
      return { ...deployment, env: deployment.env ? deployment.env.id : null };
    }
    throw new Error('Invalid deployment data');
  }

  async getProject(request: GetProjectDto): Promise<PopulatedProject> {
    const project = await this.projectsService.getProject(request.projectId);
    return {
      ...project,
      projectType: project.projectType,
      deployments: project.deployments.map((deployment) => ({
        ...deployment,
        env: deployment.env ? deployment.env.id : null,
      })),
    };
  }

  async getAllProjects(request: GetUserDto): Promise<Projects> {
    const projects = await this.projectsService.getAllProjectsOfUser(
      request.userId,
    );
    console.log({ projects, userId: request.userId });
    return {
      projects: projects as Project[],
    };
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
    console.log({ depl });
    if (!depl) {
      throw new RpcException({
        code: 2,
      });
    }
    return { ...depl, env: depl.env ? depl.env.id : null };
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
    return project;
  }
}
