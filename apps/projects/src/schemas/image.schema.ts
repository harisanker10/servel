import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseObject } from './baseObject';

@Schema({
  collection: 'images',
  timestamps: true,
  versionKey: false,
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Image {
  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  port: number;

  @Prop()
  clusterServiceName?: string | undefined;

  @Prop()
  clusterDeploymentName?: string | undefined;
}

export type ImageObject = Image & BaseObject & { deploymentId: string };

export const ImageSchema = SchemaFactory.createForClass(Image);
