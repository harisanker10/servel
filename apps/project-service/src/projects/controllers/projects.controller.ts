import {
  Controller,
  Logger,
  NotImplementedException,
  UseInterceptors,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
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
import { ProjectsService } from '../services/projects.service';
import { Observable } from 'rxjs';
import { DomainErrorInterceptor } from 'src/interceptors/domainError.interceptor';

@Controller()
@UseInterceptors(DomainErrorInterceptor)
@ProjectsServiceControllerMethods()
export class ProjectsController implements ProjectsServiceController {
  private logger: Logger;
  constructor(private readonly projectsService: ProjectsService) {
    this.logger = new Logger(ProjectsController.name);
  }

  async createProject(dto: CreateProjectDto): Promise<PopulatedProject> {
    const project = await this.projectsService.createProject(dto);
    return project;
  }

  async getProject(request: GetProjectDto): Promise<PopulatedProject> {
    return this.projectsService.getProject(request.projectId);
  }

  async getAllProjects(request: GetUserDto): Promise<Projects> {
    const projects = await this.projectsService.getAllProjectsOfUser(
      request.userId,
    );
    return { projects };
  }

  async startProject(dto: GetProjectDto): Promise<Project> {
    throw new NotImplementedException();
  }

  async stopProject(dto: GetProjectDto): Promise<Project> {
    const { project } = await this.projectsService.stopProject(dto.projectId);
    return project;
  }

  async rollbackProject(request: GetDeploymentDto): Promise<Deployment> {
    throw new NotImplementedException();
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
