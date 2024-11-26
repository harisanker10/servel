import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeploymentStatus, ProjectType, RequestDto } from '@servel/common';
import { Model } from 'mongoose';
import { Deployment } from 'src/schemas/deployment.schema';
import { Env } from 'src/schemas/env.schema';
import { Image } from 'src/schemas/image.schema';
import { Project } from 'src/schemas/project.schema';
import { Request } from 'src/schemas/request.schema';
import { StaticSite } from 'src/schemas/staticsite.schema';
import { WebService } from 'src/schemas/webService.schema';
import {
  CreateProjectDto,
  Image as IImage,
  Project as IProject,
  IProjectsRepository,
  StaticSite as IStaticSite,
  WebService as IWebService,
  PopulatedProject,
} from './interfaces/IProjects.repository';
import { Deployment as IDeployment } from './interfaces/IDeployment.repository';

@Injectable()
export class ProjectRepository implements IProjectsRepository {
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

  async createProject<T extends ProjectType = ProjectType>(
    data: CreateProjectDto,
  ): Promise<PopulatedProject<T>> {
    console.log({ data });
    const project = await new this.projectModel({ ...data })
      .save()
      .then((doc) => doc.toObject() as IProject);
    switch (data.projectType) {
      case ProjectType.WEB_SERVICE: {
        const webServiceData = await new this.webServiceModel({ ...data.data })
          .save()
          .then((doc) => doc.toObject() as IWebService);
        const deployment = await new this.deploymentModel({
          projectId: project.id,
          ...project,
          data: webServiceData.id,
          dataModelRef: 'WebService',
          status: DeploymentStatus.starting,
        })
          .save()
          .then((doc) => doc.toObject() as IDeployment);
        return {
          ...project,
          projectType: project.projectType as T,
          deployments: [{ ...deployment, data: webServiceData }],
        };
      }

      case ProjectType.STATIC_SITE: {
        const staticSiteData = await new this.staticSiteModel({ ...data.data })
          .save()
          .then((doc) => doc.toObject() as IStaticSite);
        const deployment = await new this.deploymentModel({
          projectId: project.id,
          ...project,
          data: staticSiteData.id,
          dataModelRef: 'StaticSite',
          status: DeploymentStatus.starting,
        })
          .save()
          .then((doc) => doc.toObject() as IDeployment);
        return {
          ...project,
          projectType: project.projectType as T,
          deployments: [{ ...deployment, data: staticSiteData }],
        };
      }

      case ProjectType.IMAGE: {
        const imageData = await new this.imageModel({ ...data.data })
          .save()
          .then((doc) => doc.toObject() as IImage);
        const deployment = await new this.deploymentModel({
          projectId: project.id,
          ...project,
          data: imageData.id,
          dataModelRef: 'Image',
          status: DeploymentStatus.starting,
        })
          .save()
          .then((doc) => doc.toObject() as IDeployment);
        return {
          ...project,
          projectType: project.projectType as T,
          deployments: [{ ...deployment, data: imageData }],
        };
      }
    }
  }

  async getProject(projectId: string): Promise<PopulatedProject> {
    const deploymentsPromise = this.deploymentModel
      .find({ projectId: projectId })
      .then((docs) =>
        docs.map((doc) => {
          if (doc) {
            doc.populate('data');
            return doc?.toObject() as IDeployment;
          }
        }),
      );
    const projectPromise = this.projectModel
      .findOne({ _id: projectId })
      .then((doc) => doc?.toObject() as IProject);
    const [deployments, project] = await Promise.all([
      deploymentsPromise,
      projectPromise,
    ]);
    return { ...project, deployments };
  }

  getProjects(userId: string): Promise<(void | IProject)[]> {
    return this.projectModel
      .find({ userId })
      .then((docs) => docs.length && docs.map((doc) => doc.toObject()));
  }

  async updateProject(data: {
    projectId: string;
    updates: Partial<Record<keyof IProject, any>>;
  }): Promise<IProject> {
    console.log(`updating project ${data.projectId} with`, data.updates);
    return await this.projectModel
      .findOneAndUpdate(
        { _id: data.projectId },
        { ...data.updates },
        { new: true },
      )
      .then((doc) => doc?.toObject() as IProject);
  }

  async addRequest(data: RequestDto & { projectId: string }) {
    return new this.reqModel({ ...data }).save().then((doc) => doc.toObject());
  }

  async getRequestsOfProject(projectId: string) {
    return this.reqModel
      .find({ projectId })
      .then((docs) => docs.length && docs.map((doc) => doc.toObject()));
  }
}
