import { Controller, Inject } from '@nestjs/common';
import { DeploymentsService } from './deployments.service';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import {
  BuildQueueMessage,
  CreateImageDeploymentDto,
  CreateStaticSiteDto,
  CreateWebServiceDto,
  Deployment,
  Deployments,
  DeploymentsServiceController,
  DeploymentsServiceControllerMethods,
  GetDeploymentDto,
  GetUsersDeploymentsDto,
  InstanceType,
} from '@servel/dto';
import { Observable } from 'rxjs';

@Controller()
@DeploymentsServiceControllerMethods()
export class DeploymentsController implements DeploymentsServiceController {
  constructor(
    @Inject('kafka-service') private readonly kafkaClient: ClientKafka,
    private readonly deplService: DeploymentsService,
  ) {
    console.log('elon ma\n');
  }

  createStaticSite(
    request: CreateStaticSiteDto,
  ): Deployment | Promise<Deployment> | Observable<Deployment> {
    return new Observable();
  }

  createImageDeployment(
    request: CreateImageDeploymentDto,
  ): Deployment | Promise<Deployment> | Observable<Deployment> {
    return new Observable();
  }

  async createWebService(depl: CreateWebServiceDto): Promise<Deployment> {
    console.log({ depl });
    const savedDepl = await this.deplService.createWebService(depl);
    console.log({ savedDepl });

    const buildQueueMsg: BuildQueueMessage = {
      version: savedDepl.version,
      port: 3000,
      id: savedDepl.id,
      userId: depl.userId,
      repoName: savedDepl.repoName,
      instanceType: InstanceType[depl.instanceType],
      githubAccessToken: 'asdf',
      type: savedDepl.type,
      repoUrl: savedDepl.repoUrl,
      outDir: savedDepl.outDir,
      buildCommand: savedDepl.buildCommand,
      runCommand: savedDepl.runCommand,
      env: {},
    };

    this.kafkaClient.emit('build-queue', buildQueueMsg);
    return savedDepl;
  }

  async getDeployment({ id }: GetDeploymentDto): Promise<Deployment> {
    const depl = await this.deplService.getDeployment(id);
    if (!depl) {
      throw new RpcException({ details: 'not found' });
    }
    return depl;
  }

  async getUsersDeployments(
    request: GetUsersDeploymentsDto,
  ): Promise<Deployments> {
    return {
      deployments: await this.deplService.getUsersDeployments(request.userId),
    };
  }

  async stopDeployment({ id }: GetDeploymentDto) {}
}
