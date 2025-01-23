import { ProjectType } from '@servel/common/api-gateway-dto';
import {
  ImageData,
  InstanceType,
  StaticSiteData,
  WebServiceData,
} from '@servel/common/types';
import { DeploymentData } from 'src/types/deployment';

export abstract class DeploymentStrategy<
  T extends ImageData | WebServiceData | StaticSiteData =
    | ImageData
    | WebServiceData
    | StaticSiteData,
> {
  protected readonly envs: { key: string; value: string }[];
  protected readonly data: T & {
    envs?: { name: string; value: string }[];
  };
  protected readonly metadata: {
    name: string;
    projectId: string;
    deploymentId: string;
    instanceType?: InstanceType | undefined;
  };

  constructor(data: DeploymentData) {
    const { projectType } = data;
    if (projectType === ProjectType.STATIC_SITE) {
      this.data = data.staticSiteData as T;
    } else if (projectType === ProjectType.IMAGE) {
      this.data = data.imageData as T;
    } else if (projectType === ProjectType.WEB_SERVICE) {
      this.data = data.webServiceData as T;
    }
    this.metadata = data;
  }

  abstract build(): Promise<any>;
  abstract deploy(): Promise<any>;

  protected getData() {
    return this.data as T;
  }

  protected getMetadata() {
    return this.metadata;
  }
}
