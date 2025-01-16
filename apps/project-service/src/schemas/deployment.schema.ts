import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus } from '@servel/common/types';
import { Query, Types } from 'mongoose';
import { StaticSite } from './staticsite.schema';
import { WebService } from './webService.schema';
import { Image } from './image.schema';

@Schema({
  collection: 'deployments',
  timestamps: true,
  versionKey: false,
  toObject: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      ret.projectId = ret.projectId.toString();
      delete ret._id;
    },
  },
})
export class Deployment {
  @Prop({
    type: String,
    enum: DeploymentStatus,
    default: DeploymentStatus.STOPPED,
  })
  status: DeploymentStatus;

  @Prop({
    ref: 'Project',
    type: Types.ObjectId,
    required: true,
  })
  projectId: Types.ObjectId;

  @Prop()
  buildLogBucketPath?: string;

  @Prop()
  runLogBucketPath?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'WebService',
  })
  webServiceData: WebService;

  @Prop({
    type: [{ name: String, value: String }],
  })
  envs?: { name: string; value: string }[];

  @Prop({
    type: Types.ObjectId,
    ref: 'StaticSite',
  })
  staticSiteData: StaticSite;

  @Prop({
    type: Types.ObjectId,
    ref: 'ImageData',
  })
  imageData: Image;
}

export const deploymentSchema = SchemaFactory.createForClass(Deployment);

deploymentSchema.pre<Query<Deployment[], Deployment>>(/^find/, function (next) {
  this.populate(['webServiceData', 'staticSiteData', 'imageData']);
  next();
});
deploymentSchema.index(
  { projectId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: 'active',
    },
  },
);
