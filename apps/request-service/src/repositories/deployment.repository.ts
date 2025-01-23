import { InjectModel } from '@nestjs/mongoose';
import { DeploymentStatus, ProjectType } from '@servel/common/types';
import { Model } from 'mongoose';
import { Deployment, DeploymentObject } from 'src/schemas/deployment.schema';

export interface IDeployment {
  projectName: string;
  status: DeploymentStatus;
  projectType: ProjectType;
  deploymentId: string;
  clusterServiceName?: string | undefined;
  clusterDeploymentName?: string | undefined;
  bucketPath?: string | undefined;
  port?: number | string;
}
export interface CreateDeploymentDto {
  status: DeploymentStatus;
  projectType: ProjectType;
  deploymentId: string;
  clusterServiceName?: string | undefined;
  clusterDeploymentName?: string | undefined;
  bucketPath?: string | undefined;
  projectId: string;
  projectName: string;
  port?: number | string;
}

export class DeploymentsRepository {
  constructor(
    @InjectModel(Deployment.name)
    private readonly deploymentsModel: Model<Deployment>,
  ) {}

  async createDeployment(
    createDeploymentDto: {
      deploymentId: string;
    } & (
      | {
          clusterServiceName: string;
          clusterDeploymentName: string;
          port: number;
        }
      | { bucketPath: string }
    ),
  ) {
    console.log('creating new depl', { createDeploymentDto });
    return new this.deploymentsModel({ ...createDeploymentDto })
      .save()
      .then((doc) => doc?.toObject<DeploymentObject>());
  }

  async upsertDeployment(createDeploymentDto: CreateDeploymentDto) {
    return this.deploymentsModel.updateOne(
      { projectId: createDeploymentDto.projectId },
      { $set: { ...createDeploymentDto } },
      { upsert: true },
    );
  }

  async getDeployment(deploymentId: string) {
    return this.deploymentsModel
      .findOne({ deploymentId })
      .then((doc) => doc?.toObject<DeploymentObject | undefined>());
  }

  async getDeploymentWithProjectName(projectName: string) {
    return this.deploymentsModel
      .findOne({ projectName })
      .then((doc) => doc?.toObject<DeploymentObject | undefined>());
  }

  async updateDeployment(
    deploymentId: string,
    updateDto: Partial<
      Omit<DeploymentObject, 'id' | 'createdAt' | 'updatedAt'>
    >,
  ): Promise<DeploymentObject | undefined> {
    return this.deploymentsModel
      .findOneAndUpdate({ deploymentId }, updateDto, { new: true })
      .then((doc) => doc?.toObject<DeploymentObject | undefined>());
  }
}
