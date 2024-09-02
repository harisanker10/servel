import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus, DeploymentType, InstanceType } from '@servel/dto';
import { HydratedDocument, InferRawDocType } from 'mongoose';

@Schema({
  collection: 'projects',
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
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: InstanceType, default: InstanceType.tier_0 })
  instanceType: InstanceType;

  @Prop()
  type: DeploymentType;

  @Prop()
  deploymentUrl: string;

  @Prop({
    enum: DeploymentStatus,
    default: DeploymentStatus.queued,
  })
  status: DeploymentStatus;

  @Prop({ required: true })
  userId: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

export type ProjectDoc = HydratedDocument<Project> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};
