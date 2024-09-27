import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus, ProjectType } from '@servel/dto';
import { Types } from 'mongoose';
import { BaseObject } from './baseObject';
import { Env, EnvObject } from './env.schema';

@Schema({
  collection: 'deployments',
  timestamps: true,
  versionKey: false,
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      ret.projectId = ret.projectId.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Deployment {
  @Prop({
    type: String,
    enum: DeploymentStatus,
    default: DeploymentStatus.stopped,
  })
  status: DeploymentStatus;

  @Prop({
    ref: 'Project',
    type: Types.ObjectId,
    required: true,
  })
  projectId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Env',
  })
  env?: Types.ObjectId;
}

export interface DeploymentObject extends BaseObject {
  status: DeploymentStatus;
  projectId: Types.ObjectId;
  env?: EnvObject | undefined;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);
