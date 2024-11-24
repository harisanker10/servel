import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeploymentStatus } from '@servel/common';
import { Query, Types } from 'mongoose';
import { Deployment as DeploymentDocument } from 'src/repository/interfaces/IDeployment.repository';

@Schema({
  collection: 'deployments',
  timestamps: true,
  versionKey: false,
  toObject: {
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
    default: DeploymentStatus.starting,
  })
  status: DeploymentStatus;

  @Prop({
    ref: 'Project',
    type: Types.ObjectId,
    required: true,
  })
  projectId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Env',
  })
  env?: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['WebService', 'StaticSite', 'Image'],
  })
  dataModelRef: 'WebService' | 'StaticSite' | 'Image';

  @Prop({ type: Types.ObjectId, required: true, refPath: 'dataModelRef' })
  data: Types.ObjectId;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);

DeploymentSchema.pre<Query<DeploymentDocument[], DeploymentDocument>>(
  /^find/,
  function (next) {
    this.populate('data'); // Populate the `data` field
    next();
  },
);
