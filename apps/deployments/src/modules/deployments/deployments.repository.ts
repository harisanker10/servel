import { InjectModel } from '@nestjs/mongoose';
import { Deployment, DeploymentDoc } from './deployments.schema';
import { Model } from 'mongoose';
import { DeploymentStatus, ServiceTypes } from '@servel/dto';

export class DeploymentsRepository {
  constructor(
    @InjectModel(Deployment.name) private deplModel: Model<DeploymentDoc>,
  ) {}

  async createWebService(depl: Omit<Deployment, 'type'>) {
    console.log({ depl });
    return new this.deplModel({
      ...depl,
      type: ServiceTypes.WebService,
    })
      .save()
      .then((doc) => doc.toObject());
  }

  async updateStatus(id: string, version: number, status: string) {
    console.log('updatign status to', status, id);
    // const data = await this.deplModel.updateOne({ _id: id }, { status });
    const data = await this.deplModel
      .findOneAndUpdate({ _id: id, version }, { status })
      .then((doc) => doc.toObject());
    console.log({ data });
    return data;
  }

  async updateDeplUrl(id: string, url: string) {
    console.log('updating url', id, url);
    const data = await this.deplModel.updateOne(
      { _id: id },
      { deploymentUrl: url },
    );
    console.log({ data });
    return data;
  }

  async getDeployment(id: string) {
    return await this.deplModel
      .findOne({ _id: id })
      .then((doc) => doc.toObject());
  }

  async updateDeployment(
    id: string,
    version: number,
    update: { image?: string; status?: DeploymentStatus },
  ): Promise<DeploymentDoc> {
    return this.deplModel.findOneAndUpdate({ _id: id, version }, update, {
      new: true,
    });
  }
}
