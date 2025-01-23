import { ProjectType } from "./project";

export enum DeploymentStatus {
  ACTIVE = "ACTIVE",
  STOPPED = "STOPPED",
  STARTING = "STARTING",
}

export type Deployment<T extends ProjectType = ProjectType> = {
  id: string;

  status: DeploymentStatus;

  env?: string;

  logsUrl: string;

  createdAt: string;
  updatedAt: string;
} & DeploymentData<T>;

export interface ImageData {
  imageUrl: string;
  port: number;
}

export interface WebServiceData {
  repoUrl: string;
  runCommand: string;
  buildCommand: string;
  branch?: string;
  commitId?: string;
  port: number;
}

export interface StaticSiteData {
  repoUrl: string;
  outDir: string;
  buildCommand: string;
  branch?: string;
  commitId?: string;
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
