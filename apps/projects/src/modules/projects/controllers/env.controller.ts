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

@Controller()
@EnvServiceControllerMethods()
export class EnvController implements EnvServiceController {
  constructor(private readonly envService: EnvService) {}

  async getEnvironment(request: GetEnvDto): Promise<Env> {
    const env = await this.envService.getEnv(request.envId);
    if (!env) {
      throw new Error('Env not found');
    }
    return { ...env, userId: env.userId.toString() };
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
