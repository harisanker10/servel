import { DeploymentStatus, ProjectType } from '@servel/common/types';
import { BaseDoc } from './baseDoc';

export interface Deployment {
  id: string;
  projectId: string;

  status: DeploymentStatus;

  envs?: { name: string; value: string }[];
  imageData?: ImageData;
  webServiceData?: WebServiceData;
  staticSiteData?: StaticSiteData;

  buildLogBucketPath?: string;
  runLogBucketPath?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ImageData extends BaseDoc {
  imageUrl: string;
  port: number;
  accessToken?: string;
  runLogBucketPath?: string;
  clusterServiceName?: string;
  clusterDeploymentName?: string;
}

export interface WebServiceData extends BaseDoc {
  repoUrl: string;
  runCommand: string;
  buildCommand: string;
  accessToken?: string;
  branch?: string;
  commitId?: string;
  port: number;

  builtImage?: string;
  clusterServiceName?: string;
  clusterDeploymentName?: string;
}

export interface StaticSiteData extends BaseDoc {
  repoUrl: string;
  outDir: string;
  buildCommand: string;
  accessToken?: string;
  branch?: string;
  commitId?: string;
  bucketPath?: string;
}

export type DeploymentData<T> = (T extends ProjectType.IMAGE
  ? { imageData: ImageData }
  : { imageData?: undefined }) &
  (T extends ProjectType.WEB_SERVICE
    ? { webServiceData: WebServiceData }
    : { webServiceData?: undefined }) &
  (T extends ProjectType.STATIC_SITE
    ? { staticSiteData: StaticSiteData }
    : { staticSiteData?: undefined });
