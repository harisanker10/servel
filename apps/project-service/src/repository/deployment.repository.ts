import { InjectModel } from '@nestjs/mongoose';
import { DeploymentStatus, ProjectType } from '@servel/common/types';
import { Model } from 'mongoose';
import { Deployment } from 'src/schemas/deployment.schema';
import { Project } from 'src/schemas/project.schema';
import { StaticSite } from 'src/schemas/staticsite.schema';
import { WebService } from 'src/schemas/webService.schema';
import { Image } from 'src/schemas/image.schema';
import {
  CreateDeploymentDto,
  IDeploymentsRepository,
} from './interfaces/IDeployment.repository';
import { Deployment as IDeployment } from 'src/types';
import {
  Image as IImage,
  StaticSite as IStaticSite,
  WebService as IWebService,
  Project as ProjectDoc,
} from './interfaces/IProjects.repository';

export class DeploymentRepository implements IDeploymentsRepository {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(Deployment.name)
    private readonly deploymentModel: Model<Deployment>,
    @InjectModel(WebService.name)
    private readonly webServiceModel: Model<WebService>,
    @InjectModel(Image.name)
    private readonly imageModel: Model<WebService>,
    @InjectModel(StaticSite.name)
    private readonly staticSiteModel: Model<WebService>,
  ) {}

  async findDeploymentById(deploymentId: string): Promise<IDeployment> {
    return this.deploymentModel
      .findOne({ _id: deploymentId })
      .then((doc) => doc && doc.toObject<IDeployment>());
  }

  async updateDeploymentData(
    deplId: string,
    updates: Partial<IWebService | IImage | IStaticSite>,
  ): Promise<IDeployment> {
    const depl = await this.deploymentModel
      .findOne({ _id: deplId })
      .then((doc) => doc && doc.toObject<IDeployment>());

    if (depl?.imageData?.id) {
      await this.imageModel.updateOne(
        { _id: depl.imageData.id },
        { $set: updates },
      );
    } else if (depl?.staticSiteData?.id) {
      await this.staticSiteModel.updateOne(
        { _id: depl.staticSiteData.id },
        { $set: updates },
      );
    } else if (depl?.webServiceData?.id) {
      await this.webServiceModel.updateOne(
        { _id: depl.webServiceData.id },
        { $set: updates },
      );
    }
    return this.findDeploymentById(deplId);
  }

  async updateDeploymentStatus(deploymentId: string, status: DeploymentStatus) {
    await this.deploymentModel
      .findOneAndUpdate({ _id: deploymentId }, { status }, { new: true })
      .then((doc) => doc && doc.toObject<IDeployment>());
    return this.findDeploymentById(deploymentId);
  }

  findDeploymentsOfProject(projectId: string): Promise<IDeployment[]> {
    return this.deploymentModel
      .find({ projectId })
      .sort({ createdAt: -1 })
      .then(
        (docs) => docs && docs.map((doc) => doc && doc.toObject<IDeployment>()),
      );
  }

  updateDeployment(data: {
    deploymentId: string;
    updates: Partial<Record<keyof IDeployment, string>>;
  }): Promise<IDeployment> {
    console.log({ updatingDepl: data.updates });
    return this.deploymentModel
      .findOneAndUpdate(
        { _id: data.deploymentId },
        { $set: { ...data.updates } },
        { new: true },
      )
      .then((doc) => {
        console.log({ doc });
        return doc && doc.toObject<IDeployment>();
      });
  }

  async createDeployment(data: CreateDeploymentDto): Promise<IDeployment> {
    const project = await this.projectModel
      .findOne({ _id: data.projectId })
      .then((doc) => doc && doc.toObject<ProjectDoc>());

    console.log({ data });

    switch (project.projectType) {
      case ProjectType.WEB_SERVICE: {
        const webServiceData = await new this.webServiceModel({
          ...data.webServiceData,
        })
          .save()
          .then((doc) => doc && doc.toObject<IWebService>());
        const deployment = await new this.deploymentModel({
          projectId: project.id,
          webServiceData: webServiceData.id,
        })
          .save()
          .then((doc) => doc && doc.toObject<IDeployment>());
        return { ...deployment, webServiceData: webServiceData };
      }

      case ProjectType.STATIC_SITE: {
        const staticsitedata = await new this.staticSiteModel({
          ...data.staticSiteData,
        })
          .save()
          .then((doc) => doc && doc.toObject<IStaticSite>());
        const deployment = await new this.deploymentModel({
          projectId: project.id,
          staticSiteData: staticsitedata.id,
        })
          .save()
          .then((doc) => doc && doc.toObject<IDeployment>());
        return { ...deployment, staticSiteData: staticsitedata };
      }

      case ProjectType.IMAGE: {
        const imagedata = await new this.imageModel({ ...data.imageData })
          .save()
          .then((doc) => doc && doc.toObject<IImage>());
        const deployment = await new this.deploymentModel({
          projectid: project.id,
          imageData: imagedata.id,
        })
          .save()
          .then((doc) => doc && doc.toObject<IDeployment>());
        return { ...deployment, imageData: imagedata };
      }
    }
  }

  findLastUpdatedDeploymentOfProject(projectId: string) {
    return this.deploymentModel
      .findOne({ projectId })
      .sort({ updatedAt: -1 })
      .exec()
      .then((doc) => doc && doc.toObject<IDeployment>());
  }

  findActiveDeploymentOfProject(projectId: string): Promise<IDeployment> {
    return this.deploymentModel
      .findOne({
        projectId,
        status: { $in: [DeploymentStatus.ACTIVE, DeploymentStatus.STARTING] },
      })
      .then((doc) => doc && doc.toObject<IDeployment>());
  }

  updateActiveDeploymentStatusOfProject(
    projectId: string,
    status: DeploymentStatus,
  ): Promise<IDeployment> {
    return this.deploymentModel
      .findOneAndUpdate(
        { projectId, status: DeploymentStatus.ACTIVE },
        { $set: { status: status } },
        { new: true },
      )
      .then((doc) => doc && doc.toObject<IDeployment>());
  }

  updateAllDeploymentStatusOfProject(
    projectId: string,
    status: DeploymentStatus,
  ) {
    console.log({ updateingAllDepl: status });
    return this.deploymentModel
      .updateMany({ projectId }, { status })
      .then((doc) => doc.modifiedCount > 0);
  }

  async switchActiveDeploymentOfProject(
    deploymentId: string,
  ): Promise<IDeployment> {
    console.log({ switchActiveDepl: deploymentId });
    const startedDeployment = await this.deploymentModel
      .findOneAndUpdate(
        { _id: deploymentId },
        { status: DeploymentStatus.STARTING },
      )
      .then((doc) => doc && doc.toObject<IDeployment>());
    await this.updateAllDeploymentStatusOfProject(
      startedDeployment.projectId,
      DeploymentStatus.STOPPED,
    );
    return startedDeployment;
  }
}
