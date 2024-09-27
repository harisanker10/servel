import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deployment, DeploymentObject } from 'src/schemas/deployment.schema';

export class DeploymentsRepository {
  constructor(
    @InjectModel(Deployment.name)
    private readonly deploymentsModel: Model<Deployment>,
  ) {}

  async createDeployment(createDeploymentDto: {
    deploymentId: string;
    clusterServiceName?: string | undefined;
    clusterDeploymentName?: string | undefined;
    clusterContainerName?: string | undefined;
    s3Path?: string | undefined;
  }) {
    return new this.deploymentsModel({ ...createDeploymentDto })
      .save()
      //@ts-ignore
      .then((doc) => doc.toObject() as DeploymentObject);
  }
}
