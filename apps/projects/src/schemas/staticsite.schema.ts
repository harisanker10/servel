import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseObject } from './baseObject';

@Schema({
  collection: 'staticsites',
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
export class StaticSite {
  @Prop({ ref: 'Deployment', type: Types.ObjectId, required: true })
  deploymentId: Types.ObjectId;

  @Prop({ required: true })
  repoUrl: string;

  @Prop()
  branch: string;

  @Prop()
  commitId: string;

  @Prop()
  bucketPath: string;

  @Prop({ required: true })
  outDir: string;

  @Prop({ required: true })
  buildCommand: string;
}

export type StaticSiteObject = StaticSite & BaseObject;

export const StaticSiteSchema = SchemaFactory.createForClass(StaticSite);
