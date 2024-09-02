import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, InferRawDocType } from 'mongoose';

@Schema({
  collection: 'envs',
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
export class Env {
  @Prop({ required: true })
  userId: string;

  @Prop()
  name: string;

  @Prop({ default: {} })
  envs: Map<string, string>;
}

export const EnvSchema = SchemaFactory.createForClass(Env);

export type EnvDoc = HydratedDocument<Env> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};
