import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Deployment, DeploymentDoc } from 'src/schemas/deployment.schema';
import { Project, ProjectDoc } from 'src/schemas/project.schema';
import { StaticSite, StaticSiteDoc } from 'src/schemas/staticSite.schema';
import { WebService, WebServiceDoc } from 'src/schemas/webService.schema';
import { Image, ImageDoc } from 'src/schemas/image.schema';
import {
  CreateImageDeploymentDto,
  CreateProjectDto,
  CreateStaticSiteDeploymentDto,
  CreateWebServiceDeploymentDto,
  IDeploymentRepository,
} from './IDeployment.repository';
import { DeploymentType } from '@servel/dto';

export class DeploymentsRepository implements IDeploymentRepository {
  constructor(
    @InjectModel(Deployment.name) private deploymentModel: Model<DeploymentDoc>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDoc>,
    @InjectModel(Image.name) private imageModel: Model<ImageDoc>,
    @InjectModel(StaticSite.name) private staticSiteModel: Model<StaticSiteDoc>,
    @InjectModel(WebService.name) private webServiceModel: Model<WebServiceDoc>,
  ) {}

  createProject(data: CreateProjectDto): Promise<ProjectDoc> {
    return this.projectModel.create(data).then((doc) => doc.toObject());
  }

  getDeploymentsOfProject(projectId: string): Promise<DeploymentDoc[]> {
    return this.deploymentModel.find({ projectId });
  }

  async getDeployment(deploymentId: string): Promise<
    DeploymentDoc & {
      imageData?: ImageDoc | undefined;
      webServiceData?: WebServiceDoc | undefined;
      staticSiteData?: StaticSiteDoc | undefined;
    }
  > {
    const deployment = await this.deploymentModel
      .findOne({
        _id: deploymentId,
      })
      .then((doc) => doc.toObject());
    const project = await this.projectModel.findOne({
      _id: deployment.projectId,
    });
    if (project.type === DeploymentType.staticSite) {
      deployment['staticSiteData'] = await this.staticSiteModel.findOne({
        deploymentId,
      });
    } else if (project.type === DeploymentType.webService) {
      deployment['webServiceData'] = await this.webServiceModel.findOne({
        deploymentId,
      });
    } else if (project.type === DeploymentType.dockerImage) {
      deployment['imageData'] = await this.imageModel.findOne({ deploymentId });
    }
    return deployment;
  }

  getProjects(userId: string): Promise<ProjectDoc[]> {
    return this.projectModel.find({ userId });
  }

  private async createEmptyDeployment(projectId: string) {
    return await this.deploymentModel.create({
      projectId,
    });
  }

  async createWebServiceDeployment(
    data: CreateWebServiceDeploymentDto,
  ): Promise<WebServiceDoc> {
    const deployment = await this.createEmptyDeployment(data.projectId);
    return this.webServiceModel
      .create({
        ...data.webServiceData,
        env: data.env,
        deploymentId: deployment.id,
      })
      .then((doc) => doc.toObject());
  }

  async createImageDeployment(
    data: CreateImageDeploymentDto,
  ): Promise<ImageDoc> {
    const deployment = await this.createEmptyDeployment(data.projectId);
    return this.imageModel
      .create({
        ...data.imageData,
        env: data.env,
        deploymentId: deployment.id,
      })
      .then((doc) => doc.toObject());
  }

  async createStaticSiteDeployment(
    data: CreateStaticSiteDeploymentDto,
  ): Promise<StaticSiteDoc> {
    const deployment = await this.createEmptyDeployment(data.projectId);
    return this.staticSiteModel
      .create({
        ...data.staticSiteData,
        env: data.env,
        deploymentId: deployment.id,
      })
      .then((doc) => doc.toObject());
  }
}
