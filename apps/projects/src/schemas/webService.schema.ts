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
  branch?: string | undefined;

  @Prop()
  commitId?: string | undefined;

  @Prop({ required: true })
  runCommand: string;

  @Prop({ required: true })
  buildCommand: string;

  @Prop({ required: true })
  port: number;

  @Prop()
  image?: string | undefined;

  @Prop()
  clusterServiceName?: string | undefined;

  @Prop()
  clusterDeploymentName?: string | undefined;
}

export const WebServiceSchema = SchemaFactory.createForClass(WebService);
