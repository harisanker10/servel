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
      delete ret.__v;
      return ret;
    },
  },
})
export class Image {
  @Prop({ type: Types.ObjectId, ref: 'Deployment', required: true })
  deploymentId: Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  port: number;
}

export type ImageObject = Image & BaseObject & { deploymentId: string };

export const ImageSchema = SchemaFactory.createForClass(Image);
