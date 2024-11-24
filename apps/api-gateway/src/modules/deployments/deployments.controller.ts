import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JWTGuard } from '../auth/guards/jwt.guard';
import {
  PROJECTS_SERVICE_NAME,
  ProjectsServiceClient,
} from '@servel/proto/projects';
import { User } from 'src/utils/user.decorator';
import { ReqUser } from 'types/JWTPayload';
import { lastValueFrom } from 'rxjs';

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
  async getDeployment(@Param('deploymentId') deploymentId: string) {
    const { webServiceData, staticSiteData, imageData, ...rest } =
      await lastValueFrom(
        this.projectsGrpcService.getDeployment({ deploymentId }),
      );
    return { ...rest, data: webServiceData || staticSiteData || imageData };
  }

  @Patch('/stop/:deploymentId')
  async stopDeployment(
    @User() user: ReqUser,
    @Param('deploymentId') deploymentId: string,
  ) {
    console.log('stopping depl', deploymentId);
    return this.projectsGrpcService.stopDeployment({
      deploymentId: deploymentId,
    });
  }

  @Get('/all/:projectId')
  async getAllDeployments(
    @User() user: ReqUser,
    @Param('projectId') projectId: string,
  ) {
    const depls = await lastValueFrom(
      this.projectsGrpcService.getDeployments({ projectId }),
    );
    return depls.deployments.map((depl) => ({
      ...depl,
      data: depl.imageData || depl.staticSiteData || depl.webServiceData,
    }));
  }

  @Patch('/retry/')
  async retryDeployment(@Body() body: { deploymentId: string }) {
    return this.projectsGrpcService.retryDeployment({
      deploymentId: body.deploymentId,
    });
  }
}
