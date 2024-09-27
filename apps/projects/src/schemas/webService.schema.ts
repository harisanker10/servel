import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { BaseObject } from './baseObject';

@Schema({
  collection: 'webservices',
  timestamps: true,
  versionKey: false,
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class WebService {
  @Prop({ ref: 'Deployment', type: Types.ObjectId, required: true })
  deploymentId: Types.ObjectId;

  @Prop({ required: true })
  repoUrl: string;

  @Prop()
  branch: string;

  @Prop()
  commitId: string;

  @Prop({ required: true })
  runCommand: string;

  @Prop({ required: true })
  buildCommand: string;

  @Prop({ required: true })
  port: number;
}

export type WebServiceObject = WebService & BaseObject;

export const WebServiceSchema = SchemaFactory.createForClass(WebService);
