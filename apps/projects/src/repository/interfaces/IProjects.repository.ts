import { ProjectStatus, InstanceType, ProjectType } from '@servel/common';
import { BaseDoc } from './baseDoc';
import { Deployment } from './IDeployment.repository';

export interface IProjectsRepository {
  createProject(data: CreateProjectDto): Promise<PopulatedProject>;

  getProject(projectId: string): Promise<PopulatedProject>;

  getProjects(userId: string): Promise<(Project | void)[]>;

  updateProject(data: {
    projectId: string;
    updates: Partial<Record<keyof Project, any>>;
  }): Promise<Project>;
}

export type CreateDeploymentDto = {
  envId?: string | undefined;
  data: WebService | Image | StaticSite;
  projectId: string;
};

export interface Project<T extends ProjectType = ProjectType> extends BaseDoc {
  name: string;
  instanceType: InstanceType;
  projectType: T;
  deploymentUrl?: string | undefined;
  status: ProjectStatus;
  userId: string;
}

export interface CreateWebServiceProject extends BaseDoc {}

export interface WebService extends BaseDoc {
  repoUrl: string;
  branch?: string | undefined;
  commitId?: string | undefined;
  runCommand: string;
  buildCommand: string;
  port: number;
  image?: string | undefined;
  clusterServiceName?: string | undefined;
  clusterDeploymentName?: string | undefined;
}

export interface StaticSite extends BaseDoc {
  repoUrl: string;
  branch?: string | undefined;
  commitId?: string | undefined;
  outDir: string;
  buildCommand: string;
  bucketPath?: string | undefined;
}

export interface Image extends BaseDoc {
  imageUrl: string;
  port: number;
}

export interface Env extends BaseDoc {
  envs: Record<string, string>;
}

export type PopulatedProject<T extends ProjectType = ProjectType> =
  Project<T> & {
    deployments: Deployment[];
  };

export interface CreateProjectDto<T = WebService | StaticSite | Image> {
  name: string;
  instanceType: InstanceType;
  projectType: ProjectType;
  userId: string;
  env?: string | void;
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
}
