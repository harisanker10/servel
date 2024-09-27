import {
  ProjectStatus,
  InstanceType,
  ProjectType,
  DeploymentStatus,
} from '@servel/dto';

export interface IProjectsRepository {
  createProject(
    data: CreateProjectDto,
  ): Promise<Project & { deployments: Deployment[] }>;

  createWebServiceDeployment(
    data: CreateWebServiceDeploymentDto,
  ): Promise<Deployment & { webServiceData: WebService }>;

  createStaticSiteDeployment(
    data: CreateStaticSiteDeploymentDto,
  ): Promise<Deployment & { staticSiteData: StaticSite }>;

  createImageDeployment(
    data: CreateImageDeploymentDto,
  ): Promise<Deployment & { imageData: Image }>;

  getProject(
    projectId: string,
  ): Promise<Project & { deployments: Deployment[] }>;

  getProjects(userId: string): Promise<(Project | void)[]>;

  getDeployment(deploymentId: string): Promise<Deployment>;
}
export interface Project extends BaseDoc {
  name: string;
  instanceType: InstanceType;
  projectType: ProjectType;
  deploymentUrl: string;
  status: ProjectStatus;
  userId: string;
}

export interface Deployment extends BaseDoc {
  imageData?: Image | undefined;
  webServiceData?: WebService | undefined;
  staticSiteData?: StaticSite | undefined;
  status: DeploymentStatus;
  env?: Env | void;
}

export interface WebService extends BaseDoc {
  repoUrl: string;
  branch: string;
  commitId: string;
  runCommand: string;
  buildCommand: string;
  port: number;
}

export interface StaticSite extends BaseDoc {
  repoUrl: string;
  branch: string;
  commitId: string;
  bucketPath: string;
  outDir: string;
  buildCommand: string;
}

export interface Image extends BaseDoc {
  imageUrl: string;
  port: number;
  createdAt: string;
  updatedAt: string;
}

export interface Env extends BaseDoc {
  envs: Record<string, string>;
}

export type PopulatedProject = Project & {};

export interface CreateProjectDto {
  name?: string | undefined;
  instanceType: InstanceType;
  projectType: ProjectType;
  userId: string;
  env?: string | void;
  imageData?: Pick<Image, 'imageUrl' | 'port'> | undefined;
  webServiceData?:
    | Pick<
        WebService,
        | 'port'
        | 'runCommand'
        | 'commitId'
        | 'branch'
        | 'repoUrl'
        | 'buildCommand'
      >
    | undefined;
  staticSiteData?:
    | Pick<
        StaticSite,
        'repoUrl' | 'branch' | 'commitId' | 'buildCommand' | 'outDir'
      >
    | undefined;
}

export interface CreateWebServiceDeploymentDto {
  projectId: string;
  env?: string | void;
  webServiceData: {
    repoUrl: string;
    branch?: string | undefined;
    commitId?: string | undefined;
    runCommand: string;
    buildCommand: string;
    port: number;
  };
}
export interface CreateStaticSiteDeploymentDto {
  env?: string | void;
  projectId: string;
  staticSiteData: {
    repoUrl: string;
    branch?: string | undefined;
    commitId?: string | undefined;
    buildCommand: string;
    outDir: string;
  };
}

export interface BaseDoc {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImageDeploymentDto {
  env?: string | void;
  projectId: string;
  imageData: {
    imageUrl: string;
    port: number;
  };
}
