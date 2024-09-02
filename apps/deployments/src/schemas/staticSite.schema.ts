import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus, InstanceType, ServiceTypes } from '@servel/dto';
import { HydratedDocument, InferRawDocType, Types } from 'mongoose';
import { Env } from './env.schema';
import { Deployment } from './deployment.schema';

@Schema({
  collection: 'staticSites',
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
export class StaticSite {
  @Prop({ required: true })
  repoUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Deployment' })
  deploymentId: Deployment;

  @Prop({ default: 0 })
  version: number;

  @Prop()
  branch: string;

  @Prop()
  commitId: string;

  @Prop()
  bucketPath: string;

  @Prop()
  outDir: string;

  @Prop()
  buildCommand: string;

  @Prop({
    enum: DeploymentStatus,
    default: DeploymentStatus.queued,
  })
  status: DeploymentStatus;

  @Prop({ type: Types.ObjectId, ref: 'Env' })
  env: Env;
}

export const StaticSiteSchema = SchemaFactory.createForClass(StaticSite);

export type StaticSiteDoc = HydratedDocument<StaticSite> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};
