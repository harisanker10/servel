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
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ProjectType,
  createProjectSchema,
  CreateProjectDto,
} from '@servel/common';
import { lastValueFrom } from 'rxjs';
import { JWTGuard } from '../auth/guards/jwt.guard';
import {
  PROJECTS_SERVICE_NAME,
  ProjectsServiceClient,
} from '@servel/proto/projects';
import { ZodPipe } from 'src/pipes/zodValidation.pipe';
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
  async createProject(@User() user: ReqUser, @Body() dto: CreateProjectDto) {
    if (dto.projectType === ProjectType.STATIC_SITE) {
      return this.projectsGrpcService.createProject({
        ...dto,
        userId: user.id,
        //@ts-ignore
        webServiceData: dto.data,
      });
    } else if (dto.projectType === ProjectType.WEB_SERVICE) {
      return this.projectsGrpcService.createProject({
        ...dto,
        userId: user.id,
        //@ts-ignore
        webServiceData: dto.data,
      });
    } else if (dto.projectType === ProjectType.IMAGE) {
      return this.projectsGrpcService.createProject({
        ...dto,
        userId: user.id,
        //@ts-ignore
        imageData: dto.data,
      });
    }
  }

  @Get('/:projectId')
  async getProject(@User() user: ReqUser, @Param('projectId') projectId) {
    return this.projectsGrpcService.getProject({ projectId });
  }

  @Get('/')
  async getAllProjects(@User() user: ReqUser) {
    const projects = await lastValueFrom(
      this.projectsGrpcService.getAllProjects({
        userId: user.id,
      }),
    );
    console.log({ projects });
    return projects;
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
