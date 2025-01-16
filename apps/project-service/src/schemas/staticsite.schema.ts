import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'staticsites',
  timestamps: true,
  versionKey: false,
  toObject: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class StaticSite {
  @Prop({ required: true })
  repoUrl: string;

  @Prop()
  branch?: string | undefined;

  @Prop()
  commitId?: string | undefined;

  @Prop()
  bucketPath?: string | undefined;

  @Prop({ required: true })
  outDir: string;

  @Prop({ required: true })
  buildCommand: string;
}

export const StaticSiteSchema = SchemaFactory.createForClass(StaticSite);
