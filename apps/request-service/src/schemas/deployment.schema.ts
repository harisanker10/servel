import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus, ProjectType } from '@servel/common/types';
import { Types } from 'mongoose';

@Schema({
  collection: 'deployments',
  timestamps: true,
  versionKey: false,
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      ret.projectId = ret?.projectId && ret?.projectId?.toString();
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
    default: DeploymentStatus.ACTIVE,
  })
  status: DeploymentStatus;

  @Prop({
    required: true,
    enum: ProjectType,
  })
  projectType: ProjectType;

  @Prop({
    required: true,
  })
  deploymentId: string;

  @Prop()
  clusterServiceName?: string | undefined;

  @Prop()
  clusterDeploymentName?: string | undefined;

  @Prop()
  bucketPath?: string | undefined;

  @Prop()
  projectId: string;

  @Prop()
  projectName: string;

  @Prop({ type: Number })
  port?: number | string;
}

export interface DeploymentObject {
  id: string;
  projectName: string;
  deploymentId: string;
  status: DeploymentStatus;
  projectId: Types.ObjectId;
  projectType: ProjectType;
  clusterServiceName?: string | undefined;
  clusterDeploymentName?: string | undefined;
  bucketPath?: string | undefined;
  port?: number | undefined;
  createdAt: string;
  updatedAt: string;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);
