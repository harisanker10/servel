import { InstanceType, ProjectType } from "./project";

export enum DeploymentStatus {
  ACTIVE = "ACTIVE",
  STOPPED = "STOPPED",
  STARTING = "STARTING",
}

export interface Deployment {
  id: string;
  projectId: string;

  status: DeploymentStatus;

  env?: string;
  imageData?: ImageData;
  webServiceData?: WebServiceData;
  staticSiteData?: StaticSiteData;

  buildLogBucketPath?: string;
  runLogBucketPath?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ImageData {
  imageUrl: string;
  port: number;
  accessToken?: string;
}

export interface WebServiceData {
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
  namespace?: string;
}

export interface StaticSiteData {
  repoUrl: string;
  outDir: string;
  buildCommand: string;
  accessToken?: string;
  branch?: string;
  commitId?: string;
  bucketPath?: string;
}

export type DeploymentData<T> = (T extends ProjectType.IMAGE
  ? { imageData: ImageData; instanceType: InstanceType }
  : { imageData?: undefined }) &
  (T extends ProjectType.WEB_SERVICE
    ? { webServiceData: WebServiceData; instanceType: InstanceType }
    : { webServiceData?: undefined }) &
  (T extends ProjectType.STATIC_SITE
    ? { staticSiteData: StaticSiteData }
    : { staticSiteData?: undefined });
