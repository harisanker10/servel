import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  DEPLOYMENT_SERVICE_NAME,
  DeploymentServiceClient,
} from '@servel/proto/projects';

@Controller('deployments')
export class DeploymentsController implements OnModuleInit {
  private deploymentsGrpcService: DeploymentServiceClient;

  constructor(@Inject(DEPLOYMENT_SERVICE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.deploymentsGrpcService =
      this.client.getService<DeploymentServiceClient>(DEPLOYMENT_SERVICE_NAME);
  }

  @Get('/:id')
  getDeployment(@Param('id') deploymentId: string) {
    return this.deploymentsGrpcService.getDeployment({ deploymentId });
  }

  @Get('/logs/:id')
  getLogs(@Param('id') deploymentId: string) {
    return this.deploymentsGrpcService.getLogs({ deploymentId });
  }
}
