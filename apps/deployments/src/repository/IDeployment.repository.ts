import { DeploymentType, InstanceType } from '@servel/dto';
import { DeploymentDoc } from 'src/schemas/deployment.schema';
import { ImageDoc } from 'src/schemas/image.schema';
import { ProjectDoc } from 'src/schemas/project.schema';
import { StaticSiteDoc } from 'src/schemas/staticSite.schema';
import { WebServiceDoc } from 'src/schemas/webService.schema';

export interface IDeploymentRepository {
  createWebServiceDeployment(
    data: CreateWebServiceDeploymentDto,
  ): Promise<WebServiceDoc>;
  createStaticSiteDeployment(
    data: CreateStaticSiteDeploymentDto,
  ): Promise<StaticSiteDoc>;
  createImageDeployment(data: CreateImageDeploymentDto): Promise<ImageDoc>;
  createProject(data: CreateProjectDto): Promise<ProjectDoc>;
  getDeploymentsOfProject(projectId: string): Promise<DeploymentDoc[]>;
  getProjects(userId: string): Promise<ProjectDoc[]>;
  getDeployment(deploymentId: string): Promise<
    DeploymentDoc & {
      imageData?: ImageDoc | undefined;
      webServiceData?: WebServiceDoc | undefined;
      staticSiteData?: StaticSiteDoc | undefined;
    }
  >;
}

export interface CreateProjectDto {
  name?: string | undefined;
  instanceType: InstanceType;
  type: DeploymentType;
  userId: string;
}

export interface CreateWebServiceDeploymentDto {
  env: string;
  projectId: string;
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
  env: string;
  projectId: string;
  staticSiteData: {
    repoUrl: string;
    branch?: string | undefined;
    commitId?: string | undefined;
    buildCommand: string;
    outDir: string;
  };
}

export interface CreateImageDeploymentDto {
  env: string;
  projectId: string;
  imageData: {
    imageUrl: string;
    port: number;
  };
}
