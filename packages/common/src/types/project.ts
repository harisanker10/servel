export enum ProjectType {
  WEB_SERVICE = "WEB_SERVICE",
  STATIC_SITE = "STATIC_SITE",
  IMAGE = "IMAGE",
}

export enum InstanceType {
  TIER_0 = "TIER_0",
  TIER_1 = "TIER_1",
  TIER_2 = "TIER_2",
}

export enum ProjectStatus {
  QUEUED = "QUEUED",
  BUILDING = "BUILDING",
  DEPLOYING = "DEPLOYING",
  DEPLOYED = "DEPLOYED",
  FAILED = "FAILED",
  STOPPED = "STOPPED",
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
