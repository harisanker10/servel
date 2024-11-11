import { Controller } from '@nestjs/common';
import {
  EnvServiceControllerMethods,
  EnvServiceController,
  Env,
  GetEnvDto,
  CreateEnvDto,
  UpdateEnvDto,
  GetAllEnvDto,
} from '@servel/proto/projects';
import { Observable } from 'rxjs';
import { EnvService } from '../services/env.service';
import { RpcException } from '@nestjs/microservices';

@Controller()
@EnvServiceControllerMethods()
export class EnvController implements EnvServiceController {
  constructor(private readonly envService: EnvService) {}

  async getEnvironment(request: GetEnvDto): Promise<Env> {
    const env = await this.envService.getEnv(request.envId);
    if (!env) {
      throw new RpcException('Env not found');
    }
    const { userId, ...rest } = env;
    return rest;
  }

  createEnvironment(
    request: CreateEnvDto,
  ): Env | Promise<Env> | Observable<Env> {
    throw new Error('Not implemented');
  }
  getAllEnvironments(
    request: GetAllEnvDto,
  ): Env | Promise<Env> | Observable<Env> {
    throw new Error('Not implemented');
  }
  deleteEnvironment(request: GetEnvDto): Env | Promise<Env> | Observable<Env> {
    throw new Error('Not implemented');
  }
  updateEnvironment(
    request: UpdateEnvDto,
  ): Env | Promise<Env> | Observable<Env> {
    throw new Error('Not implemented');
  }
}
