import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'analytics',
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
export class Analytics {
  @Prop({ type: Types.ObjectId, ref: 'Deployment', required: true })
  deploymentId: Types.ObjectId;

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

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
