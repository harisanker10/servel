import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { JWTGuard } from '../auth/guards/jwt.guard';
import {
  CreateProjectDto,
  DEPLOYMENT_SERVICE_NAME,
  DeploymentServiceClient,
  PROJECTS_SERVICE_NAME,
  ProjectsServiceClient,
} from '@servel/proto/projects';
import { User } from 'src/utils/user.decorator';
import { ReqUser } from 'types/JWTPayload';
import { ZodPipe } from 'src/pipes/zodValidation.pipe';
import {
  CreateProjectDtoRes,
  RedeployProjectDto,
} from '@servel/common/api-gateway-dto';
import {
  DeploymentStatus,
  ProjectStatus,
  ProjectType,
} from '@servel/common/types';
import {
  createProjectSchema,
  redeployProjectSchema,
} from '@servel/common/zodSchemas';

@Controller('/projects')
@UseGuards(JWTGuard)
export class ProjectsController implements OnModuleInit {
  private projectsGrpcService: ProjectsServiceClient;
  private deploymentsGrpcService: DeploymentServiceClient;

  constructor(@Inject(PROJECTS_SERVICE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.projectsGrpcService = this.client.getService<ProjectsServiceClient>(
      PROJECTS_SERVICE_NAME,
    );
    this.deploymentsGrpcService =
      this.client.getService<DeploymentServiceClient>(DEPLOYMENT_SERVICE_NAME);
  }

  @Post('/')
  @UsePipes(new ZodPipe(createProjectSchema))
  async createProject(
    @User() user: ReqUser,
    @Body() dto: CreateProjectDto,
  ): Promise<CreateProjectDtoRes> {
    console.log({ dto });
    console.log({ user });
    const project = await lastValueFrom(
      this.projectsGrpcService.createProject({ ...dto, userId: user.id }),
    );
    return {
      ...project,
      status: project.status as ProjectStatus,
      deployments: project.deployments.map((depl) => ({
        ...depl,
        logsUrl: '',
        status: depl.status as DeploymentStatus,
      })),
    };
  }

  @Get('/:projectId')
  async getProject(
    @User() user: ReqUser,
    @Param('projectId') projectId: string,
  ) {
    const project = await lastValueFrom(
      this.projectsGrpcService.getProject({ projectId }),
    );
    return {
      ...project,
      deployments: project.deployments.map((depl) => {
        const { webServiceData, imageData, staticSiteData, ...rest } = depl;
        return {
          data: webServiceData || imageData || staticSiteData,
          ...rest,
        };
      }),
    };
  }

  @Get('/')
  async getAllProjects(@User() user: ReqUser) {
    const projects = await lastValueFrom(
      this.projectsGrpcService.getAllProjects({
        userId: user.id,
      }),
    );
    return projects;
  }

  @Patch('/redeploy')
  @UsePipes(new ZodPipe(redeployProjectSchema))
  async redeploy(@Body() body: RedeployProjectDto, @User() user: ReqUser) {
    await lastValueFrom(
      this.projectsGrpcService.redeployProject({
        env: [],
        ...body,
        userId: user.id,
      }),
    );
  }

  @Patch('/stop')
  async stopProject(@Body() body: { projectId: string }) {
    return this.projectsGrpcService.stopProject({ projectId: body.projectId });
  }

  @Delete('/:projectId')
  async deleteProject(
    @User() user: ReqUser,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsGrpcService.deleteProject({ projectId });
  }

  @Post('/start')
  async startDeployment(@Body() body: { deploymentId: string }) {
    return this.projectsGrpcService.startProject({
      deploymentId: body.deploymentId,
    });
  }

  @Patch('/rollback')
  async rollbackProject(@Body('deploymentId') deploymentId: string) {
    return this.projectsGrpcService.rollbackProject({
      deploymentId,
    });
  }

  @Patch('/retry')
  async retryProject(@Body('deploymentId') deploymentId: string) {
    return this.projectsGrpcService.retryAndDeployProject({ deploymentId });
  }

  // @Get('/analytics/:projectId')
  // async getAnalytics(@Param('projectId') projectId: string) {
  //   return this.projectsGrpcService.getRequests({ projectId });
  // }
}
