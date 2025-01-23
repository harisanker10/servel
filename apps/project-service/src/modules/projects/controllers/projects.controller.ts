import {
  Controller,
  Logger,
  NotImplementedException,
  UseInterceptors,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  CreateDeploymentDto,
  CreateProjectDto,
  Deployment,
  GetDeploymentDto,
  GetProjectDto,
  GetUserDto,
  PopulatedProject,
  Project,
  Projects,
  ProjectsServiceController,
  ProjectsServiceControllerMethods,
  UpdateInstanceTypeDto,
} from '@servel/proto/projects';
import { Observable } from 'rxjs';
import { DomainErrorInterceptor } from 'src/interceptors/domainError.interceptor';
import { ProjectStrategyResolver } from '../strategy/resolver/projectStrategyResolver';

@Controller()
@UseInterceptors(DomainErrorInterceptor)
@ProjectsServiceControllerMethods()
export class ProjectsController implements ProjectsServiceController {
  private logger: Logger;
  constructor(private projectStrategyResolver: ProjectStrategyResolver) {
    this.logger = new Logger(ProjectsController.name);
  }

  async retryAndDeployProject(request: GetDeploymentDto): Promise<Deployment> {
    const projectStrategy = await this.projectStrategyResolver.resolve({
      deploymentId: request.deploymentId,
    });
    return projectStrategy.retryAndDeploy(request.deploymentId);
  }
  async createProject(dto: CreateProjectDto): Promise<PopulatedProject> {
    const projectStrategy = await this.projectStrategyResolver.resolve({
      projectType: dto.projectType,
    });
    const project = await projectStrategy.createProject(dto);
    return project;
  }

  async getProject(request: GetProjectDto): Promise<PopulatedProject> {
    const projectStrategy = await this.projectStrategyResolver.resolve({
      projectId: request.projectId,
    });
    return projectStrategy.getProject(request.projectId);
  }

  async getAllProjects(request: GetUserDto): Promise<Projects> {
    const projectStrategy = await this.projectStrategyResolver.resolve({
      userId: request.userId,
    });
    const projects = await projectStrategy.getAllProjects(request.userId);
    return { projects };
  }

  async startProject(request: GetDeploymentDto): Promise<Project> {
    const projectStrategy = await this.projectStrategyResolver.resolve({
      deploymentId: request.deploymentId,
    });
    const project = await projectStrategy.startProject(request.deploymentId);
    return project;
  }

  async stopProject(request: GetProjectDto): Promise<Project> {
    const projectStrategy = await this.projectStrategyResolver.resolve({
      projectId: request.projectId,
    });
    const project = await projectStrategy.stopProject(request.projectId);
    return project;
  }

  async rollbackProject(request: GetDeploymentDto): Promise<Deployment> {
    const projectStrategy = await this.projectStrategyResolver.resolve({
      deploymentId: request.deploymentId,
    });
    return projectStrategy.rollbackProject(request.deploymentId);
  }

  async redeployProject(request: CreateDeploymentDto): Promise<Deployment> {
    const projectStrategy = await this.projectStrategyResolver.resolve({
      projectId: request.projectId,
    });
    return projectStrategy.redeployProject(request);
  }

  updateInstanceType(
    _request: UpdateInstanceTypeDto,
  ): Project | Promise<Project> | Observable<Project> {
    throw new NotImplementedException();
  }

  async deleteProject(_request: GetProjectDto): Promise<Project> {
    throw new RpcException('Not implemented');
  }
}
