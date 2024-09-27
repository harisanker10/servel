import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseObject } from './baseObject';

@Schema({
  collection: 'envs',
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
export class Env {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Map, of: String, default: {} })
  envs: Record<string, string>;
}

export type EnvObject = Env & BaseObject;

export const EnvSchema = SchemaFactory.createForClass(Env);
