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
import { ZodValidationPipe, createProjectSchema } from '@servel/dto';
import { lastValueFrom } from 'rxjs';
import { JWTGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import {
  CreateProjectDto,
  PROJECTS_SERVICE_NAME,
  ProjectsServiceClient,
} from '@servel/proto/projects';
import { ZodPipe } from 'src/pipes/zodValidation.pipe';
import z from 'zod';
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
  @UsePipes(new ZodPipe(createProjectSchema))
  async createProject(@User() user: ReqUser, @Body() data: CreateProjectDto) {
    const project = await lastValueFrom(
      this.projectsGrpcService.createProject({
        ...data,
        userId: user.id,
      }),
    );
    return project;
  }

  @Get('/:projectId')
  async getProject(@User() user: ReqUser, @Param('projectId') projectId) {
    return this.projectsGrpcService.getProject({ projectId });
  }

  @Get('/')
  async getAllProjects(@User() user: ReqUser) {
    return this.projectsGrpcService.getAllProjects({ userId: user.id });
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
