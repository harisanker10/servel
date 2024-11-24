import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InstanceType, ProjectStatus, ProjectType } from '@servel/common';
import { Types } from 'mongoose';

@Schema({
  collection: 'projects',
  timestamps: true,
  versionKey: false,
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      ret.userId.toString();
      delete ret._id;
    },
  },
})
export class Project {
  @Prop()
  name: string;

  @Prop({
    type: String,
    enum: InstanceType,
    default: InstanceType.TIER_0,
  })
  instanceType: InstanceType;

  @Prop({ type: String, enum: ProjectType, required: true })
  projectType: ProjectType;

  @Prop()
  deploymentUrl?: string | undefined;

  @Prop({
    type: String,
    enum: ProjectStatus,
    default: ProjectStatus.QUEUED,
  })
  status: ProjectStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
