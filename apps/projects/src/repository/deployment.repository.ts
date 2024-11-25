import { InjectModel } from '@nestjs/mongoose';
import { DeploymentStatus } from '@servel/common';
import { Model } from 'mongoose';
import { Deployment } from 'src/schemas/deployment.schema';
import { Env } from 'src/schemas/env.schema';
import { Project } from 'src/schemas/project.schema';
import { StaticSite } from 'src/schemas/staticsite.schema';
import { WebService } from 'src/schemas/webService.schema';
import { Image } from 'src/schemas/image.schema';
import {
  CreateDeploymentDto,
  Deployment as IDeployment,
  IDeploymentsRepository,
} from './interfaces/IDeployment.repository';
import {
  Image as IImage,
  StaticSite as IStaticSite,
  WebService as IWebService,
} from './interfaces/IProjects.repository';

export class DeploymentRepository implements IDeploymentsRepository {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(Deployment.name)
    private readonly deploymentModel: Model<Deployment>,
    @InjectModel(Env.name)
    private readonly envModel: Model<Env>,
    @InjectModel(Request.name)
    private readonly reqModel: Model<Request>,
    @InjectModel(WebService.name)
    private readonly webServiceModel: Model<WebService>,
    @InjectModel(Image.name)
    private readonly imageModel: Model<WebService>,
    @InjectModel(StaticSite.name)
    private readonly staticSiteModel: Model<WebService>,
  ) {}

  async getDeployment(deploymentId: string): Promise<IDeployment> {
    return this.deploymentModel
      .findOne({ _id: deploymentId })
      .then((doc) => doc?.toObject());
  }

  async updateDeploymentData(
    deplId: string,
    updates: Partial<
      Record<
        Exclude<
          keyof (IWebService & IStaticSite & IImage),
          'id' | 'createdAt' | 'updatedAt'
        >,
        string
      >
    >,
  ): Promise<IDeployment> {
    const depl = await this.deploymentModel
      .findOne({ _id: deplId })
      .then((doc) => doc.toObject());
    console.log('updating service data with service id', depl.data.id);
    let updateQuery: any;
    switch (depl.dataModelRef) {
      case 'Image': {
        updateQuery = await this.imageModel.updateOne(
          { _id: depl.data.id },
          updates,
        );
        break;
      }
      case 'StaticSite': {
        updateQuery = await this.staticSiteModel.updateOne(
          { _id: depl.data.id },
          updates,
        );
        break;
      }
      case 'WebService': {
        updateQuery = await this.webServiceModel.updateOne(
          { _id: depl.data.id },
          updates,
        );
        break;
      }
      default:
        break;
    }
    console.log({ updateQuery });
    return this.getDeployment(deplId);
  }

  getDeployments(projectId: string): Promise<IDeployment[]> {
    return this.deploymentModel
      .find({ projectId })
      .then((docs) => docs && docs.map((doc) => doc.toObject()));
  }

  updateDeployment(data: {
    deploymentId: string;
    updates: Partial<Record<keyof IDeployment, string>>;
  }): Promise<IDeployment> {
    return this.deploymentModel
      .findOneAndUpdate({ _id: data.deploymentId }, data.updates, { new: true })
      .then((doc) => doc.toObject());
  }

  async updateAllDeploymentsWithProjectId(data: {
    projectId: string;
    updates: Partial<Record<keyof Deployment, string>>;
  }) {
    await this.deploymentModel.updateMany(
      { projectId: data.projectId },
      data.updates,
    );
    return this.getDeployments(data.projectId);
  }

  async createDeploymentForProject(
    data: CreateDeploymentDto<IWebService | IStaticSite | IImage>,
  ): Promise<IDeployment> {
    console.log({ datainRepo: data });
    const oldDepl = await this.deploymentModel
      .findOne({ projectId: data.projectId })
      .then((doc) => doc.toObject());

    switch (oldDepl.dataModelRef) {
      case 'WebService': {
        const webServiceData = await new this.webServiceModel({ ...data.data })
          .save()
          .then((doc) => doc.toObject() as IWebService);
        const deployment = await new this.deploymentModel({
          projectId: oldDepl.projectId,
          data: webServiceData.id,
          dataModelRef: 'WebService',
          status: DeploymentStatus.starting,
        })
          .save()
          .then((doc) => doc.toObject() as IDeployment);
        return this.getDeployment(deployment.id);
      }

      case 'StaticSite': {
        const staticSiteData = await new this.staticSiteModel({ ...data.data })
          .save()
          .then((doc) => doc.toObject() as IStaticSite);
        const deployment = await new this.deploymentModel({
          projectId: oldDepl.projectId,
          data: staticSiteData.id,
          dataModelRef: 'StaticSite',
          status: DeploymentStatus.starting,
        })
          .save()
          .then((doc) => doc.toObject() as IDeployment);
        return this.getDeployment(deployment.id);
      }

      case 'Image': {
        const imageData = await new this.imageModel({ ...data.data })
          .save()
          .then((doc) => doc.toObject() as IImage);
        const deployment = await new this.deploymentModel({
          projectId: oldDepl.projectId,
          data: imageData.id,
          dataModelRef: 'Image',
          status: DeploymentStatus.starting,
        })
          .save()
          .then((doc) => doc.toObject() as IDeployment);
        return this.getDeployment(deployment.id);
      }
    }
  }
}
