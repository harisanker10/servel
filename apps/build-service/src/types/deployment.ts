import {
  ProjectType,
  InstanceType,
  WebServiceData,
  StaticSiteData,
  ImageData,
} from '@servel/common/types';

export type DeploymentData = {
  name: string;

  projectId: string;
  deploymentId: string;

  envs?: { name: string; value: string }[] | undefined;

  projectType: ProjectType;
  instanceType?: InstanceType | undefined;

  imageData?: undefined | ImageData;
  webServiceData?: undefined | WebServiceData;
  staticSiteData?: undefined | StaticSiteData;
};
