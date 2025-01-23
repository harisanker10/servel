import { ProjectStatus, InstanceType, ProjectType } from '@servel/common/types';
import { BaseDoc } from './baseDoc';
import { Deployment } from 'src/types';

//TODO: Make specific method to update status,... etc
export interface IProjectsRepository {
  createProject(data: CreateProjectDto): Promise<Project>;
  getProject(projectId: string): Promise<Project>;
  getProjectsOfUser(userId: string): Promise<(Project | void)[]>;
  updateProject(data: {
    projectId: string;
    updates: Partial<Record<keyof Project, any>>;
  }): Promise<Project>;
}

export interface Project extends BaseDoc {
  name: string;
  instanceType: InstanceType;
  projectType: ProjectType;
  deploymentUrl?: string | undefined;
  status: ProjectStatus;
  userId: string;
}

export interface WebService extends BaseDoc {
  repoUrl: string;
  branch?: string | undefined;
  commitId?: string | undefined;
  runCommand: string;
  buildCommand: string;
  port: number;
  builtImage?: string | undefined;
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

export type PopulatedProject = Project & {
  deployments: Deployment[];
};

export interface CreateProjectDto {
  name: string;
  instanceType: InstanceType;
  projectType: ProjectType;
  userId: string;
  envs?: { name: string; value: string }[];
}
