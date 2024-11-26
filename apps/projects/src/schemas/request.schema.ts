import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseObject } from './baseObject';
import { ProjectStatus, RequestDto } from '@servel/common';

@Schema({
  collection: 'requests',
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
export class Request {
  @Prop({ type: Types.ObjectId, ref: 'Deployment', required: true })
  deploymentId: Types.ObjectId;

  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  ip: string;

  @Prop()
  method: string;
  @Prop()
  url: string;
  @Prop()
  userAgent: string;
  @Prop()
  referer: string;
  @Prop()
  timestamp: string;
}

export type RequestObject = Request & BaseObject;

export const RequestSchema = SchemaFactory.createForClass(Request);
