export enum DeploymentStatus {
  active = "active",
  stopped = "stopped",
  starting = "starting",
}

export interface Deployment<T extends DeploymentData = DeploymentData> {
  id: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  data: T;
  env?: string;
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
}

export interface StaticSiteData {
  repoUrl: string;
  outDir: string;
  buildCommand: string;
  accessToken?: string;
  branch?: string;
  commitId?: string;
}

export type DeploymentData = ImageData | WebServiceData | StaticSiteData;
