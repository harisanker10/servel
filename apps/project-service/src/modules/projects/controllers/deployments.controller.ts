import {
  Controller,
  NotImplementedException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ProjectsServiceControllerMethods,
  DeploymentServiceController,
  Deployment,
  GetDeploymentDto,
  CreateDeploymentDto,
  Deployments,
  GetDeploymentsDto,
  DeploymentServiceControllerMethods,
  DeploymentLogs,
} from '@servel/proto/projects';
import { Observable } from 'rxjs';
import { DomainErrorInterceptor } from 'src/interceptors/domainError.interceptor';
import { DeploymentService } from '../services/deployments.service';

@Controller()
@UseInterceptors(DomainErrorInterceptor)
@DeploymentServiceControllerMethods()
export class DeploymentsController implements DeploymentServiceController {
  constructor(private readonly deploymentService: DeploymentService) {}

  async getDeployment(request: GetDeploymentDto): Promise<Deployment> {
    return this.deploymentService.findDeployment(request.deploymentId);
  }

  async getDeployments(request: GetDeploymentsDto): Promise<Deployments> {
    const deployments = await this.deploymentService.findDeploymentsOfProject(
      request.projectId,
    );
    return { deployments };
  }
  async stopDeployment(data: GetDeploymentDto): Promise<Deployment> {
    const deployment = await this.deploymentService.stopDeployment(
      data.deploymentId,
    );
    return deployment;
  }

  async retryDeployment(request: GetDeploymentDto): Promise<Deployment> {
    console.log({ retry: request });
    return this.deploymentService.retryDeployment(request.deploymentId);
  }
  async createDeployment(dto: CreateDeploymentDto): Promise<Deployment> {
    const deployment =
      await this.deploymentService.createDeploymentForProject(dto);
    return deployment;
  }

  async startDeployment(dto: GetDeploymentDto): Promise<Deployment> {
    const deployment = await this.deploymentService.startDeployment(
      dto.deploymentId,
    );
    return deployment;
  }

  async getLogs(request: GetDeploymentDto): Promise<DeploymentLogs> {
    return this.deploymentService.getLogs(request.deploymentId);
  }

  deleteDeployment(
    _request: GetDeploymentDto,
  ): Deployment | Promise<Deployment> | Observable<Deployment> {
    throw new NotImplementedException();
  }
}
