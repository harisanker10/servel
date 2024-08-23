export interface Deployment {
  id: string;
  repoName: string;
  type: ServiceTypes;
  repoUrl: string;
  deploymentUrl: string;
  outDir: string;
  buildCommand: string;
  runCommand: string;
  instanceType: InstanceType;
  status: DeploymentStatus;
  userId: string;
  version: number;
  githubAccessToken: string;
  port: number;
  createdAt: number;
  updatedAt: number;
}

export enum ServiceTypes {
  WebService = "web-service",
  StaticSite = "static-site",
  Image = "image",
}

export enum InstanceType {
  tier_0 = "tier-0",
  tier_1 = "tier-1",
  tier_2 = "tier-2",
}

export enum DeploymentStatus {
  queued = "queued",
  building = "building",
  deploying = "deploying",
  deployed = "deployed",
  failed = "failed",
  stopped = "stopped",
}
