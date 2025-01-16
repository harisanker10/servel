import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/schemas/project.schema';
import {
  CreateProjectDto,
  Project as IProject,
  IProjectsRepository,
} from './interfaces/IProjects.repository';
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

  getProjectsWithUserId(userId: string): Promise<(IProject | null)[]> {
    return this.projectModel
      .find({ userId })
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

  async updateProjectStatus(projectId: string, status: ProjectStatus) {
    await this.projectModel.findOneAndUpdate(
      { _id: projectId },
      { status },
      { new: true },
    );
    return this.getProject(projectId);
  }
}
