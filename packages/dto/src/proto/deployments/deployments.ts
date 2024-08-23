export const protobufPackage = "deployments";

export interface CreateStaticSiteDto {
  url: string;
  userId: string;
  outDir?: string | undefined;
  runCommand: string;
  buildCommand?: string | undefined;
  envs: { [key: string]: string };
}

export interface CreateStaticSiteDto_EnvsEntry {
  key: string;
  value: string;
}

export interface CreateWebServiceDto {
  url: string;
  userId: string;
  outDir?: string | undefined;
  runCommand: string;
  buildCommand?: string | undefined;
  instanceType: string;
  envs: { [key: string]: string };
}

export interface CreateWebServiceDto_EnvsEntry {
  key: string;
  value: string;
}

export interface CreateImageDeploymentDto {
  url: string;
  userId: string;
  outDir?: string | undefined;
  runCommand: string;
  buildCommand?: string | undefined;
  instanceType: string;
}

export interface GetDeploymentDto {
  id: string;
}

export const DEPLOYMENTS_PACKAGE_NAME = "deployments";
