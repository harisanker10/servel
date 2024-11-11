import {
  CreateDeploymentDto,
  CreateProjectDto,
  Deployment as DeploymentDto,
  IProjectsRepository,
  Image as ImageDto,
  Project as ProjectDto,
  StaticSite as StaticSiteDto,
  WebService as WebServiceDto,
} from './interfaces/IProjects.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectObject } from 'src/schemas/project.schema';
import mongoose, { Model, Mongoose, Types } from 'mongoose';
import { Deployment, DeploymentObject } from 'src/schemas/deployment.schema';
import { Env, EnvObject } from 'src/schemas/env.schema';
import { Injectable } from '@nestjs/common';

//TODO: Make queries efficient

@Injectable()
export class ProjectRepository implements IProjectsRepository {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(Deployment.name)
    private readonly deploymentModel: Model<Deployment>,
    @InjectModel(Env.name)
    private readonly envModel: Model<Env>,
  ) {}

  private async getEnv(envId: string): Promise<EnvObject | void> {
    return this.envModel
      .findOne({ _id: envId })
      .then((doc) => (doc ? (doc.toObject() as EnvObject) : null));
  }

  async createProject(
    data: CreateProjectDto,
  ): Promise<ProjectDto & { deployments: DeploymentDto[] }> {
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

    const deployment = await this.createDeployment({
      projectId: project.id,
      envId,
      data: data.data,
    });
    return { ...project, deployments: [{ ...deployment, env: envId }] };
  }

  async createDeployment(data: CreateDeploymentDto): Promise<DeploymentDto> {
    const env = data.envId ? await this.getEnv(data.envId) : null;
    const deployment = await new this.deploymentModel({
      projectId: data.projectId,
      env: env,
      data: data.data,
    })
      .save()
      .then((doc) => doc.toObject() as DeploymentObject);
    if (env) deployment.env = env.id;
    return deployment;
  }

  async getProjects(userId: string): Promise<(ProjectDto | void)[]> {
    console.log({ userId });
    const project = await this.projectModel
      .find({ userId: userId })
      .then((docs) => {
        return docs.map((doc) => doc.toObject() as ProjectObject);
      });

    const aggr = await this.projectModel.aggregate([
      {
        $match: { userId },
      },
      {
        $lookup: {
          from: 'deployments',
          foreignField: 'projectId',
          localField: '_id',
          as: 'Deployments',
        },
      },
    ]);
    return aggr;
  }

  async getDeployment(deploymentId: string): Promise<DeploymentDto> {
    return this.deploymentModel
      .findOne({ _id: deploymentId })
      .then((doc) => doc.toObject());
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

  async updateProjectWithDeplId(id: string, updates: Record<string, string>) {
    const project = await this.deploymentModel.findOne({ _id: id });
    const updateQuery = await this.projectModel.updateOne(
      { _id: new mongoose.Types.ObjectId(project.projectId) },
      updates,
    );
    console.log({ updates, updateQuery });
  }
}
