import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus, InstanceType, ServiceTypes } from '@servel/dto';
import { HydratedDocument, InferRawDocType } from 'mongoose';

@Schema({
  collection: 'deployments',
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
export class Deployment {
  @Prop({ required: true })
  repoName: string;

  @Prop({ default: 0 })
  version: number;

  @Prop({ enum: ServiceTypes, required: true })
  type: ServiceTypes;

  @Prop({ required: true })
  repoUrl: string;

  @Prop()
  deploymentUrl: string;

  @Prop({ required: true })
  outDir: string;

  @Prop({ required: true })
  buildCommand: string;

  @Prop({ required: true })
  runCommand: string;

  @Prop({ enum: InstanceType, required: true })
  instanceType: InstanceType;

  @Prop({
    enum: DeploymentStatus,
    default: DeploymentStatus.queued,
  })
  status: DeploymentStatus;

  @Prop({ required: true })
  userId: string;

  @Prop()
  port: number;

  @Prop()
  githubAccessToken: string;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);

export type DeploymentDoc = HydratedDocument<Deployment> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};
