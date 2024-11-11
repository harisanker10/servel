import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deployment, DeploymentObject } from 'src/schemas/deployment.schema';

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
          clusterContainerName: string;
          port: number;
        }
      | { s3Path: string }
    ),
  ) {
    console.log('creating new depl', { createDeploymentDto });
    return (
      new this.deploymentsModel({ ...createDeploymentDto })
        .save()
        //@ts-ignore
        .then((doc) => doc?.toObject() as DeploymentObject)
    );
  }

  async getDeployment(deploymentId: string) {
    return (
      this.deploymentsModel
        .findOne({ deploymentId })
        //@ts-ignore
        .then((doc) => doc?.toObject() as DeploymentObject | undefined)
    );
  }
}
