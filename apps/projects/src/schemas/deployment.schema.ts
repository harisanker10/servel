import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus } from '@servel/common';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { BaseObject } from './baseObject';
import { EnvObject } from './env.schema';

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
    default: DeploymentStatus.starting,
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

  @Prop({
    type: MongooseSchema.Types.Mixed,
    oneOf: [
      {
        repoUrl: String,
        runCommand: String,
        buildCommand: String,
        port: Number,
        branch: String,
        commitId: String,
        accessToken: String,
      },
      {
        repoUrl: String,
        outDir: String,
        buildCommand: String,
        accessToken: String,
        branch: String,
        commitId: String,
      },
      {
        imageUrl: String,
        port: Number,
        accessToken: String,
        tag: String,
      },
    ],
    required: true,
  })
  data: WebServiceData | ImageData | StaticSiteData;
}

export interface DeploymentObject extends BaseObject {
  status: DeploymentStatus;
  projectId: Types.ObjectId;
  data: WebServiceData | ImageData | StaticSiteData;
  env?: string | undefined;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);

export interface WebServiceData {
  repoUrl: string;
  runCommand: string;
  buildCommand: string;
  port: number;
  branch: string;
  commitId: string;
  accessToken: string;
}
export interface StaticSiteData {
  repoUrl: string;
  outDir: string;
  buildCommand: string;
  accessToken: string;
  branch: string;
  commitId: string;
}
export interface ImageData {
  imageUrl: string;
  port: number;
  accessToken: string;
  tag: string;
}
