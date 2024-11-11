import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus, ProjectType } from '@servel/dto';
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
    default: DeploymentStatus.stopped,
  })
  status: DeploymentStatus;

  @Prop({
    required: true,
  })
  deploymentId: string;

  @Prop({
    type: { id: String, values: {} },
  })
  env?: { id: string; values: Record<string, string> } | undefined;

  @Prop()
  clusterServiceName?: string | undefined;

  @Prop()
  clusterDeploymentName?: string | undefined;

  @Prop()
  clusterContainerName?: string | undefined;

  @Prop()
  s3Path?: string | undefined;

  @Prop({ type: Number })
  port?: number | string;
}

export interface DeploymentObject {
  id: string;
  status: DeploymentStatus;
  projectId: Types.ObjectId;
  env?: { id: string; values: Record<string, string> } | undefined;
  clusterServiceName?: string | undefined;
  clusterDeploymentName?: string | undefined;
  clusterContainerName?: string | undefined;
  s3Path?: string | undefined;
  port?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);
