import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/schemas/project.schema';
import {
  CreateProjectDto,
  IProjectsRepository,
} from './interfaces/IProjects.repository';
import { Project as IProject } from 'src/types';
import { ProjectStatus } from '@servel/common/types';

@Injectable()
export class ProjectRepository implements IProjectsRepository {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
  ) {}

  createProject(data: CreateProjectDto): Promise<IProject> {
    return new this.projectModel({ ...data })
      .save()
      .then((doc) => doc && doc.toObject<IProject>());
  }

  async getProject(projectId: string): Promise<IProject> {
    return this.projectModel
      .findOne({ _id: projectId })
      .then((doc) => doc?.toObject<IProject>());
  }

  getProjectsOfUser(userId: string): Promise<(IProject | null)[]> {
    return this.projectModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .then(
        (docs) =>
          docs.length && docs.map((doc) => doc && doc.toObject<IProject>()),
      );
  }

  async updateProject(data: {
    projectId: string;
    updates: Partial<Record<keyof IProject, any>>;
  }): Promise<IProject> {
    return await this.projectModel
      .findOneAndUpdate(
        { _id: data.projectId },
        { ...data.updates },
        { new: true },
      )
      .then((doc) => doc?.toObject<IProject>());
  }

  async updateProjectStatus(
    projectId: string,
    status: ProjectStatus,
  ): Promise<IProject> {
    return this.projectModel
      .findOneAndUpdate({ _id: projectId }, { status }, { new: true })
      .then((doc) => doc && doc.toObject<IProject>());
  }
}
