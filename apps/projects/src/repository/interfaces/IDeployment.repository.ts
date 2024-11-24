import { DeploymentStatus, ProjectType } from '@servel/common';
import { Image, StaticSite, WebService } from './IProjects.repository';
import { BaseDoc } from './baseDoc';

export interface Deployment extends BaseDoc {
  data: Image | WebService | StaticSite;
  status: DeploymentStatus;
  env?: string | undefined;
  projectId: string;
}

export interface IDeploymentsRepository {
  createDeploymentForProject(data: CreateDeploymentDto): Promise<Deployment>;
  getDeployment(deploymentId: string): Promise<Deployment>;
  getDeployments(projectId: string): Promise<Deployment[]>;
  updateDeployment(data: {
    deploymentId: string;
    updates: Partial<Record<keyof Deployment, string>>;
  }): Promise<Deployment>;
  updateAllDeploymentsWithProjectId(data: {
    projectId: string;
    updates: Partial<Record<keyof Deployment, string>>;
  }): Promise<Deployment[]>;
  updateDeploymentData(
    deplId: string,
    updates: Partial<
      Record<
        Exclude<
          keyof (WebService | StaticSite | Image),
          'id' | 'createdAt' | 'updatedAt'
        >,
        string
      >
    >,
  ): Promise<Deployment>;
}

export type CreateDeploymentDto<T = WebService | StaticSite | Image> = {
  envId?: string | undefined;
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
  projectId: string;
};
