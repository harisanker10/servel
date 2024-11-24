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
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ProjectType,
  CreateProjectDto,
  CreateProjectDtoRes,
  WebServiceData,
  StaticSiteData,
  ImageData,
  DeploymentData,
} from '@servel/common';
import { lastValueFrom } from 'rxjs';
import { JWTGuard } from '../auth/guards/jwt.guard';
import {
  PROJECTS_SERVICE_NAME,
  ProjectsServiceClient,
} from '@servel/proto/projects';
import { User } from 'src/utils/user.decorator';
import { ReqUser } from 'types/JWTPayload';

@Controller('/projects')
@UseGuards(JWTGuard)
export class ProjectsController implements OnModuleInit {
  private projectsGrpcService: ProjectsServiceClient;
  constructor(@Inject(PROJECTS_SERVICE_NAME) private client: ClientGrpc) {}
  onModuleInit() {
    this.projectsGrpcService = this.client.getService<ProjectsServiceClient>(
      PROJECTS_SERVICE_NAME,
    );
  }

  //TODO:
  //   rpc CreateEnvironment(CreateEnvDto) returns (Env) {}
  //   rpc GetEnvironment(GetEnvDto) returns (Env) {}
  //   rpc GetAllEnvironments(GetAllEnvDto) returns (Env) {}
  //   rpc UpdateEnvironment(UpdateEnvDto) returns (Env) {}
  //   rpc DeleteEnvironment(GetEnvDto) returns (Env) {}

  @Post('/')
  // @UsePipes(new ZodPipe(createProjectSchema))
  async createProject(
    @User() user: ReqUser,
    @Body() dto: CreateProjectDto,
  ): Promise<CreateProjectDtoRes> {
    let webServiceData: WebServiceData | undefined;
    let staticSiteData: StaticSiteData | undefined;
    let imageData: ImageData | undefined;

    if (dto.projectType === ProjectType.STATIC_SITE) {
      staticSiteData = dto.data as StaticSiteData;
    } else if (dto.projectType === ProjectType.WEB_SERVICE) {
      webServiceData = dto.data as WebServiceData;
    } else if (dto.projectType === ProjectType.IMAGE) {
      imageData = dto.data as ImageData;
    }

    const project = await lastValueFrom(
      this.projectsGrpcService.createProject({
        ...dto,
        staticSiteData,
        webServiceData,
        imageData,
        env: '',
        userId: user.id,
      }),
    );

    console.log({ project, depls: project.deployments });

    return {
      ...project,
      //@ts-ignore
      deployments: project.deployments.map((depl) => ({
        ...depl,
        data: (depl.imageData ||
          depl.webServiceData ||
          depl.staticSiteData) as DeploymentData,
      })),
    };
  }

  @Get('/:projectId')
  async getProject(
    @User() user: ReqUser,
    @Param('projectId') projectId: string,
  ) {
    console.log({ projectId });
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
    console.log({ projects: JSON.stringify(projects) });
    return projects;
  }

  @Patch('/redeploy')
  async retryProject(@Body() body: any) {
    return this.projectsGrpcService.retryDeployment({
      deploymentId: body.deploymentId,
    });
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

  @Patch('/rollback/:projectId/:deploymentId')
  async rollbackProject(
    @Param('projectId') projectId: string,
    @Param('deploymentId') deploymentId: string,
  ) {
    return this.projectsGrpcService.rollbackProject({
      deploymentId,
      projectId,
    });
  }
}
