import { Injectable } from '@nestjs/common';
import { EnvRepository } from 'src/repository/env.repository';

@Injectable()
export class EnvService {
  constructor(private readonly envRepository: EnvRepository) {}

  getAllEnvsOfUser(userId: string) {
    return this.envRepository.getAllEnv(userId);
  }

  getEnv(envId: string) {
    return this.envRepository.getEnv(envId);
  }

  createEnv(data: {
    userId: string;
    name: string;
    envs: Record<string, string>;
  }) {
    return this.envRepository.createEnv({
      userId: data.userId,
      name: data.name,
      envs: data.envs,
    });
  }
}
