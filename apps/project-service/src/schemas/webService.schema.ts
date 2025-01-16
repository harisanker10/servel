import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'webservices',
  timestamps: true,
  versionKey: false,
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
})
export class WebService {
  @Prop({ required: true })
  repoUrl: string;

  @Prop()
  branch?: string;

  @Prop()
  commitId?: string;

  @Prop({ required: true })
  runCommand: string;

  @Prop({ required: true })
  buildCommand: string;

  @Prop({ required: true })
  port: number;

  @Prop()
  clusterImage?: string;

  @Prop()
  clusterServiceName?: string;

  @Prop()
  clusterDeploymentName?: string;

  clusterContanerName?: string;
}

export const WebServiceSchema = SchemaFactory.createForClass(WebService);
