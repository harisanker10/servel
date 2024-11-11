import {
  ProjectStatus,
  InstanceType,
  ProjectType,
  DeploymentStatus,
} from '@servel/common';

export interface IProjectsRepository {
  createProject(
    data: CreateProjectDto,
  ): Promise<Project & { deployments: Deployment[] }>;

  createDeployment(data: CreateDeploymentDto): Promise<Deployment>;

  getProject(
    projectId: string,
  ): Promise<Project & { deployments: Deployment[] }>;

  getProjects(userId: string): Promise<(Project | void)[]>;

  getDeployment(deploymentId: string): Promise<Deployment>;
}

export type CreateDeploymentDto = {
  envId?: string | undefined;
  data: WebService | Image | StaticSite;
  projectId: string;
};

export interface Project extends BaseDoc {
  name: string;
  instanceType: InstanceType;
  projectType: ProjectType;
  deploymentUrl: string;
  status: ProjectStatus;
  userId: string;
  deployments: Deployment[];
}

export interface Deployment extends BaseDoc {
  data: Image | WebService | StaticSite;
  status: DeploymentStatus;
  env?: string | undefined;
}

export interface WebService {
  repoUrl: string;
  branch: string;
  commitId: string;
  runCommand: string;
  buildCommand: string;
  port: number;
}

export interface StaticSite {
  repoUrl: string;
  branch: string;
  commitId: string;
  outDir: string;
  buildCommand: string;
}

export interface Image {
  imageUrl: string;
  port: number;
}

export interface Env extends BaseDoc {
  envs: Record<string, string>;
}

export type PopulatedProject = Project & {};

export interface CreateProjectDto {
  name: string;
  instanceType: InstanceType;
  projectType: ProjectType;
  userId: string;
  env?: string | void;
  data: WebService | Image | StaticSite;
}

export interface BaseDoc {
  id: string;
  createdAt: string;
  updatedAt: string;
}
