import { Image, StaticSite, WebService } from './IProjects.repository';
import { Deployment } from 'src/types';

export interface IDeploymentsRepository {
  createDeployment(data: CreateDeploymentDto): Promise<Deployment>;
  findDeploymentById(deploymentId: string): Promise<Deployment>;
  findDeploymentsOfProject(projectId: string): Promise<Deployment[]>;
  updateDeployment(data: {
    deploymentId: string;
    updates: Partial<Record<keyof Deployment, string>>;
  }): Promise<Deployment>;
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

export type CreateDeploymentDto = {
  envId?: string | undefined;
  projectId: string;
  webServiceData?: Omit<WebService, 'id' | 'createdAt' | 'updatedAt'>;
  staticSiteData?: Omit<StaticSite, 'id' | 'createdAt' | 'updatedAt'>;
  imageData?: Omit<Image, 'id' | 'createdAt' | 'updatedAt'>;
};
