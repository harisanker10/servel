import { EnvObject } from 'src/schemas/env.schema';

export interface IEnvRepository {
  createEnv(createEnvData: {
    name: string;
    userId: string;
    envs: Record<string, string>;
  }): Promise<EnvObject>;
  getEnv(envId: string): Promise<EnvObject | void>;
  getAllEnv(userId: string): Promise<(EnvObject | void)[]>;
}
