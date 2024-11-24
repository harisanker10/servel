import { Deployment, DeploymentData } from "./deployment";

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

export interface PopulatedProject<T extends DeploymentData = DeploymentData> {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deploymentUrl: string;
  projectType: ProjectType;
  deployments: Deployment<T>[];
}

export type Project = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deploymentUrl: string;
  projectType: ProjectType;
};
