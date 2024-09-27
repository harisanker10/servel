import {
  CreateImageDeploymentDto,
  CreateProjectDto,
  CreateStaticSiteDeploymentDto,
  CreateWebServiceDeploymentDto,
  Deployment as DeploymentDto,
  IProjectsRepository,
  Image as ImageDto,
  Project as ProjectDto,
  StaticSite as StaticSiteDto,
  WebService as WebServiceDto,
} from './interfaces/IProjects.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectObject } from 'src/schemas/project.schema';
import { Model, Types } from 'mongoose';
import { Deployment, DeploymentObject } from 'src/schemas/deployment.schema';
import { Env, EnvObject } from 'src/schemas/env.schema';
import { WebService, WebServiceObject } from 'src/schemas/webService.schema';
import { StaticSite, StaticSiteObject } from 'src/schemas/staticsite.schema';
import { Image, ImageObject } from 'src/schemas/image.schema';
import { Injectable } from '@nestjs/common';
import { ProjectType } from '@servel/dto';

//TODO: Make queries efficient

@Injectable()
export class ProjectRepository implements IProjectsRepository {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(Deployment.name)
    private readonly deploymentModel: Model<Deployment>,
    @InjectModel(WebService.name)
    private readonly webServiceModel: Model<WebService>,
    @InjectModel(StaticSite.name)
    private readonly staticSiteModel: Model<StaticSite>,
    @InjectModel(Env.name)
    private readonly envModel: Model<Env>,
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
  ) {}

  private async getEnv(envId: string): Promise<EnvObject | void> {
    return this.envModel
      .findOne({ _id: envId })
      .then((doc) => (doc ? (doc.toObject() as EnvObject) : null));
  }

  async createProject(
    data: CreateProjectDto,
  ): Promise<ProjectDto & { deployments: DeploymentDto[] }> {
    console.log({ data });
    const env = data.env ? await this.getEnv(data.env) : null;
    const envId = env && env.id;
    const project = await new this.projectModel({
      userId: data.userId,
      name: data.name,
      instanceType: data.instanceType,
      projectType: data.projectType,
    })
      .save()
      .then((doc) => doc.toObject() as ProjectObject);
    if (data.projectType === ProjectType.staticSite) {
      const deployment = await this.createStaticSiteDeployment({
        projectId: project.id,
        env: envId,
        staticSiteData: data.staticSiteData,
      });
      return { ...project, deployments: [{ ...deployment, env: env }] };
    } else if (data.projectType === ProjectType.webService) {
      const deployment = await this.createWebServiceDeployment({
        projectId: project.id,
        env: envId,
        webServiceData: data.webServiceData,
      });
      return { ...project, deployments: [{ ...deployment, env: env }] };
    } else if (data.projectType === ProjectType.dockerImage) {
      const deployment = await this.createImageDeployment({
        projectId: project.id,
        env: envId,
        imageData: data.imageData,
      });
      return { ...project, deployments: [{ ...deployment, env: env }] };
    }
  }

  async createWebServiceDeployment(
    data: CreateWebServiceDeploymentDto,
  ): Promise<DeploymentDto & { webServiceData: WebServiceDto }> {
    const env = data.env ? await this.getEnv(data.env) : null;
    const deployment = await new this.deploymentModel({
      projectId: new Types.ObjectId(data.projectId),
      env: env,
    })
      .save()
      .then((doc) => doc.toObject() as DeploymentObject);
    if (env) deployment.env = env;
    const webService = await new this.webServiceModel({
      deploymentId: new Types.ObjectId(deployment.id),
      ...data.webServiceData,
    })
      .save()
      .then((doc) => doc.toObject() as WebServiceObject);
    return { ...deployment, webServiceData: webService };
  }

  async createStaticSiteDeployment(
    data: CreateStaticSiteDeploymentDto,
  ): Promise<DeploymentDto & { staticSiteData: StaticSiteDto }> {
    const env = data.env ? await this.getEnv(data.env) : null;

    const deployment = await new this.deploymentModel({
      projectId: new Types.ObjectId(data.projectId),
      env: env && env.id,
    })
      .save()
      .then((doc) => doc.toObject() as DeploymentObject);
    if (env) deployment.env = env;
    const staticSite = await new this.staticSiteModel({
      deploymentId: new Types.ObjectId(deployment.id),
      ...data.staticSiteData,
    })
      .save()
      .then((doc) => doc.toObject() as StaticSiteObject);
    return { ...deployment, staticSiteData: staticSite };
  }

  async createImageDeployment(
    data: CreateImageDeploymentDto,
  ): Promise<DeploymentDto & { imageData: ImageDto }> {
    const env = data.env ? await this.getEnv(data.env) : null;

    const deployment = await new this.deploymentModel({
      projectId: new Types.ObjectId(data.projectId),
      env: env && env.id,
    })
      .save()
      .then((doc) => doc.toObject() as DeploymentObject);
    if (env) deployment.env = env;

    const image = await new this.imageModel({
      deploymentId: new Types.ObjectId(deployment.id),
      ...data.imageData,
    })
      .save()
      .then((doc) => doc.toObject() as ImageObject);
    return { ...deployment, imageData: image };
  }

  async getProjects(userId: string): Promise<(ProjectDto | void)[]> {
    console.log({ userId });
    return this.projectModel.find({ userId: userId }).then((docs) => {
      return docs.map((doc) => doc.toObject() as ProjectObject);
    });
  }

  async getDeployment(deploymentId: string): Promise<DeploymentDto> {
    console.log({ deploymentId });
    const depl = await this.deploymentModel
      .findOne({ _id: deploymentId })
      .then((doc) => doc && (doc.toObject() as DeploymentObject));
    const project = await this.projectModel
      .findOne({ _id: depl.projectId })
      .then((doc) => doc && (doc.toObject() as ProjectObject));
    if (project.projectType === ProjectType.staticSite) {
      const staticSiteData = await this.staticSiteModel
        .findOne({ deploymentId: new Types.ObjectId(deploymentId) })
        .then((doc) => doc && (doc.toObject() as StaticSiteObject));
      return { ...depl, staticSiteData };
    } else if (project.projectType === ProjectType.webService) {
      const webServiceData = await this.webServiceModel
        .findOne({ deploymentId: new Types.ObjectId(deploymentId) })
        .then((doc) => doc && (doc.toObject() as WebServiceObject));
      console.log({ webServiceData });
      return { ...depl, webServiceData };
    } else if (project.projectType === ProjectType.dockerImage) {
      const imageData = await this.imageModel
        .findOne({ deploymentId: new Types.ObjectId(deploymentId) })
        .then((doc) => doc && (doc.toObject() as ImageObject));
      return { ...depl, imageData };
    }
  }

  async getProject(
    projectId: string,
  ): Promise<ProjectDto & { deployments: DeploymentDto[] }> {
    const deployments = this.deploymentModel
      .find({ projectId: new Types.ObjectId(projectId) })
      .then((docs) => docs.map((doc) => doc.toObject() as DeploymentObject));
    const project = this.projectModel
      .findOne({ _id: projectId })
      .then((doc) => doc.toObject() as ProjectObject);
    const [deploymentObj, projectObj] = await Promise.all([
      deployments,
      project,
    ]);
    return { ...projectObj, deployments: deploymentObj };
  }

  async deleteProject(projectId: string): Promise<ProjectDto | void> {
    return this.projectModel.findOneAndDelete({ _id: projectId });
  }
}
