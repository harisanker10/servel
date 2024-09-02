import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus, InstanceType, ServiceTypes } from '@servel/dto';
import { HydratedDocument, InferRawDocType, Types } from 'mongoose';
import { Env } from './env.schema';
import { Deployment } from './deployment.schema';

@Schema({
  collection: 'images',
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
export class Image {
  @Prop({ type: Types.ObjectId, ref: 'Deployment' })
  deploymentId: Deployment;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: 0 })
  version: number;

  @Prop({
    enum: DeploymentStatus,
    default: DeploymentStatus.queued,
  })
  status: DeploymentStatus;

  @Prop()
  port: number;

  @Prop({ type: Types.ObjectId, ref: 'Env' })
  env: Env;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

export type ImageDoc = HydratedDocument<Image> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};
