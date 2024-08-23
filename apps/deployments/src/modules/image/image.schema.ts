import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus, InstanceType, ServiceTypes } from '@servel/dto';
import { HydratedDocument, InferRawDocType } from 'mongoose';

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
  @Prop({ required: true })
  image: string;

  @Prop({
    default: DeploymentStatus.queued,
  })
  status: Omit<DeploymentStatus, 'building'>;

  @Prop()
  port: number;

  @Prop({ default: {} })
  env: Record<string, string>;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

export type ImageDoc = HydratedDocument<Image> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};
