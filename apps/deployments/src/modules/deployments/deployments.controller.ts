import { Controller, Inject } from '@nestjs/common';
import { DeploymentsService } from './deployments.service';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CreateDeploymentDto,
  Deployment,
  Deployments,
  DeploymentsServiceController,
  DeploymentsServiceControllerMethods,
  GetDeploymentDto,
  Project,
  UserId,
} from '@servel/dto/dist/proto';

@Controller()
@DeploymentsServiceControllerMethods()
export class DeploymentsController implements DeploymentsServiceController {
  constructor(
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
    private readonly deploymentsService: DeploymentsService,
  ) {
    console.log('elon ma\n');
  }

  async getDeployments({
    id: projectId,
  }: GetDeploymentDto): Promise<Deployments> {
    return {
      deployments: await this.deploymentsService.getDeployments(projectId),
    };
  }

  getAllProjects({
    userId,
  }: UserId): Project | Promise<Project> | Observable<Project> {
    return this.deploymentsService.getProjects(userId);
  }
}
