import { InjectModel } from '@nestjs/mongoose';
import { IEnvRepository } from './interfaces/IEnv.repository';
import { Env, EnvObject } from 'src/schemas/env.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvRepository implements IEnvRepository {
  constructor(@InjectModel(Env.name) private readonly envModel: Model<Env>) {}

  createEnv(createEnvData: {
    name: string;
    userId: string;
    envs: Record<string, string>;
  }): Promise<EnvObject> {
    return new this.envModel(createEnvData)
      .save()
      .then((doc) => doc.toObject() as EnvObject);
  }

  getEnv(envId: string): Promise<void | EnvObject> {
    return this.envModel.findOne({ _id: envId });
  }

  getAllEnv(userId: string): Promise<(void | EnvObject)[]> {
    return this.envModel.find({ userId }).lean();
  }
}
