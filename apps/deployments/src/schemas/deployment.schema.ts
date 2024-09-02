import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus } from '@servel/dto';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'deployments',
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
export class Deployment {
  @Prop({
    enum: DeploymentStatus,
    default: DeploymentStatus.queued,
  })
  status: DeploymentStatus;

  @Prop({ required: true })
  projectId: string;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);

export type DeploymentDoc = HydratedDocument<Deployment> & {
  id: string;
  createdAt: number;
  updatedAt: number;
};
