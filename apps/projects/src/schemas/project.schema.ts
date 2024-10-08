import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InstanceType, ProjectStatus, ProjectType } from '@servel/dto';
import { Types } from 'mongoose';
import { BaseObject } from './baseObject';

@Schema({
  collection: 'projects',
  timestamps: true,
  versionKey: false,
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      ret.userId.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Project {
  @Prop()
  name: string;

  @Prop({
    type: String,
    enum: InstanceType,
    default: InstanceType.tier_0,
  })
  instanceType: InstanceType;

  @Prop({ type: Number, enum: ProjectType, required: true })
  projectType: ProjectType;

  @Prop()
  deploymentUrl: string;

  @Prop({
    type: String,
    enum: ProjectStatus,
    default: ProjectStatus.queued,
  })
  status: ProjectStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export interface ProjectObject extends BaseObject {
  name: string;
  instanceType: InstanceType;
  projectType: ProjectType;
  deploymentUrl: string;
  status: ProjectStatus;
  userId: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
