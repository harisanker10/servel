export enum ProjectType {
  webService = 0,
  staticSite = 1,
  dockerImage = 2,
}

export enum InstanceType {
  tier_0 = 0,
  tier_1 = 1,
  tier_2 = 2,
}

export enum ProjectStatus {
  queued = "queued",
  building = "building",
  deploying = "deploying",
  deployed = "deployed",
  failed = "failed",
  stopped = "stopped",
}

export interface ImageData {
  imageUrl: string;
  port: number;
  accessToken?: string;
}

// Interface for Web Service Data
export interface WebServiceData {
  repoUrl: string;
  runCommand: string;
  buildCommand: string;
  accessToken?: string;
  branch?: string;
  commitId?: string;
  port: number;
}

// Interface for Static Site Data
export interface StaticSiteData {
  repoUrl: string;
  outDir: string;
  buildCommand: string;
  accessToken?: string;
  branch?: string;
  commitId?: string;
}
