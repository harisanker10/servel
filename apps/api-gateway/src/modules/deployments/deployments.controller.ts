import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JWTGuard } from '../auth/guards/jwt.guard';
import {
  PROJECTS_SERVICE_NAME,
  ProjectsServiceClient,
} from '@servel/proto/projects';
import { ZodPipe } from 'src/pipes/zodValidation.pipe';
import { User } from 'src/utils/user.decorator';
import { ReqUser } from 'types/JWTPayload';

@Controller('/deployments')
@UseGuards(JWTGuard)
export class DeploymentsController implements OnModuleInit {
  constructor(@Inject(PROJECTS_SERVICE_NAME) private client: ClientGrpc) {}
  private projectsGrpcService: ProjectsServiceClient;
  onModuleInit() {
    this.projectsGrpcService = this.client.getService<ProjectsServiceClient>(
      PROJECTS_SERVICE_NAME,
    );
  }

  //TODO:
  //   rpc UpdateInstanceType(UpdateInstanceTypeDto) returns (Project) {}
  //   rpc StopDeployment(GetDeploymentDto) returns (Deployment) {}
  //   rpc DeleteDeployment(GetDeploymentDto) returns (Deployment) {}

  @Get('/:deploymentId')
  async getProject(@User() user: ReqUser, @Param('deploymentId') deploymentId) {
    return this.projectsGrpcService.getDeployment({ deploymentId });
  }


  @Post('/retry/:deploymentId')
  async retryDeployment(@Param('deploymentId') deploymentId) {
    return this.projectsGrpcService.retryDeployment({ deploymentId });
  }
}
