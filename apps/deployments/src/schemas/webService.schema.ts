import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus, InstanceType, ServiceTypes } from '@servel/dto';
import { HydratedDocument, InferRawDocType, Types } from 'mongoose';
import { Env } from './env.schema';
import { Deployment } from './deployment.schema';

@Schema({
  collection: 'webServices',
  versionKey: false,
  timestamps: true,
  id: true,
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret as Record<string, any> & { id: string };
    },
  },
})
export class WebService {
  @Prop({ type: Types.ObjectId, ref: 'Deployment' })
  deploymentId: Deployment;

  @Prop({ required: true })
  repoUrl: string;

  @Prop()
  branch: string;

  @Prop()
  commitId: string;

  @Prop()
  runCommand: string;

  @Prop()
  buildCommand: string;

  @Prop({
    enum: DeploymentStatus,
    default: DeploymentStatus.queued,
  })
  status: DeploymentStatus;

  @Prop()
  port: number;

  @Prop({ type: Types.ObjectId, ref: 'Env' })
  env: Env;
}

export const WebServiceSchema = SchemaFactory.createForClass(WebService);

export type WebServiceDoc = HydratedDocument<WebService> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};
