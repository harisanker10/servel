// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.1
//   protoc               v3.20.3
// source: proto/projects.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "projects";

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

export interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deploymentUrl: string;
  projectType: ProjectType;
  instanceType: InstanceType;
}

export interface Deployment {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  imageData?: ImageData | undefined;
  webServiceData?: WebServiceData | undefined;
  staticSiteData?: StaticSiteData | undefined;
  env?: string | undefined;
}

export interface RollbackProjectDto {
  projectId: string;
  deploymentId: string;
}

export interface Request {
  deploymentId: string;
  ip: string;
  method: string;
  url: string;
  userAgent: string;
  referer: string;
  timestamp: string;
}

export interface Requests {
  requests: Request[];
}

export interface CreateEnvDto {
  userId: string;
  name: string;
  envs: { [key: string]: string };
}

export interface CreateEnvDto_EnvsEntry {
  key: string;
  value: string;
}

export interface GetEnvDto {
  envId: string;
}

export interface GetAllEnvDto {
  userId: string;
}

export interface UpdateEnvDto {
  envId: string;
  envs: { [key: string]: string };
}

export interface UpdateEnvDto_EnvsEntry {
  key: string;
  value: string;
}

export interface Env {
  id: string;
  name: string;
  envs: { [key: string]: string };
  createdAt: string;
  updatedAt: string;
}

export interface Env_EnvsEntry {
  key: string;
  value: string;
}

export interface GetUserDto {
  userId: string;
}

export interface GetProjectDto {
  projectId: string;
}

export interface PopulatedProject {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deploymentUrl: string;
  projectType: ProjectType;
  deployments: Deployment[];
}

export interface Projects {
  projects: Project[];
}

export interface UpdateInstanceTypeDto {
  id: string;
  instanceType: InstanceType;
}

export interface ImageDeployments {
  imageDeployments: ImageData[];
}

export interface ImageData {
  imageUrl: string;
  accessToken?: string | undefined;
  port: number;
}

export interface WebServiceData {
  repoUrl: string;
  runCommand: string;
  buildCommand: string;
  accessToken?: string | undefined;
  branch?: string | undefined;
  commitId?: string | undefined;
  port: number;
}

export interface StaticSiteData {
  repoUrl: string;
  outDir: string;
  buildCommand: string;
  accessToken?: string | undefined;
  branch?: string | undefined;
  commitId?: string | undefined;
}

export interface GetDeploymentByUserIdDto {
  userId: string;
}

export interface UpdateDeploymentDto {
  id: string;
  updates: Updates | undefined;
}

export interface UpdateProjectNameDto {
  id: string;
  name: string;
}

export interface Updates {
  repoName?: string | undefined;
  userId: string;
  imageData?: ImageData | undefined;
  webServiceData?: WebServiceData | undefined;
  staticSiteData?: StaticSiteData | undefined;
}

export interface CreateProjectDto {
  name?: string | undefined;
  projectType: ProjectType;
  instanceType: InstanceType;
  userId: string;
  imageData?: ImageData | undefined;
  webServiceData?: WebServiceData | undefined;
  staticSiteData?: StaticSiteData | undefined;
  env?: string | undefined;
}

export interface CreateDeploymentDto {
  projectId: string;
  userId: string;
  env?: string | undefined;
  imageData?: ImageData | undefined;
  webServiceData?: WebServiceData | undefined;
  staticSiteData?: StaticSiteData | undefined;
}

export interface Deployments {
  deployments: Deployment[];
}

export interface GetDeploymentDto {
  deploymentId: string;
}

export interface GetDeploymentsDto {
  projectId: string;
}

export const PROJECTS_PACKAGE_NAME = "projects";

export interface ProjectsServiceClient {
  getAllProjects(request: GetUserDto): Observable<Projects>;

  getProject(request: GetProjectDto): Observable<PopulatedProject>;

  createProject(request: CreateProjectDto): Observable<PopulatedProject>;

  deleteProject(request: GetProjectDto): Observable<Project>;

  stopProject(request: GetProjectDto): Observable<Project>;

  startProject(request: GetProjectDto): Observable<Project>;

  updateInstanceType(request: UpdateInstanceTypeDto): Observable<Project>;

  getRequests(request: GetProjectDto): Observable<Requests>;

  createDeployment(request: CreateDeploymentDto): Observable<Deployment>;

  getDeployments(request: GetDeploymentsDto): Observable<Deployments>;

  getDeployment(request: GetDeploymentDto): Observable<Deployment>;

  stopDeployment(request: GetDeploymentDto): Observable<Deployment>;

  startDeployment(request: GetDeploymentDto): Observable<Deployment>;

  deleteDeployment(request: GetDeploymentDto): Observable<Deployment>;

  retryDeployment(request: GetDeploymentDto): Observable<Deployment>;

  rollbackProject(request: GetDeploymentDto): Observable<Deployment>;
}

export interface ProjectsServiceController {
  getAllProjects(request: GetUserDto): Promise<Projects> | Observable<Projects> | Projects;

  getProject(request: GetProjectDto): Promise<PopulatedProject> | Observable<PopulatedProject> | PopulatedProject;

  createProject(request: CreateProjectDto): Promise<PopulatedProject> | Observable<PopulatedProject> | PopulatedProject;

  deleteProject(request: GetProjectDto): Promise<Project> | Observable<Project> | Project;

  stopProject(request: GetProjectDto): Promise<Project> | Observable<Project> | Project;

  startProject(request: GetProjectDto): Promise<Project> | Observable<Project> | Project;

  updateInstanceType(request: UpdateInstanceTypeDto): Promise<Project> | Observable<Project> | Project;

  getRequests(request: GetProjectDto): Promise<Requests> | Observable<Requests> | Requests;

  createDeployment(request: CreateDeploymentDto): Promise<Deployment> | Observable<Deployment> | Deployment;

  getDeployments(request: GetDeploymentsDto): Promise<Deployments> | Observable<Deployments> | Deployments;

  getDeployment(request: GetDeploymentDto): Promise<Deployment> | Observable<Deployment> | Deployment;

  stopDeployment(request: GetDeploymentDto): Promise<Deployment> | Observable<Deployment> | Deployment;

  startDeployment(request: GetDeploymentDto): Promise<Deployment> | Observable<Deployment> | Deployment;

  deleteDeployment(request: GetDeploymentDto): Promise<Deployment> | Observable<Deployment> | Deployment;

  retryDeployment(request: GetDeploymentDto): Promise<Deployment> | Observable<Deployment> | Deployment;

  rollbackProject(request: GetDeploymentDto): Promise<Deployment> | Observable<Deployment> | Deployment;
}

export function ProjectsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAllProjects",
      "getProject",
      "createProject",
      "deleteProject",
      "stopProject",
      "startProject",
      "updateInstanceType",
      "getRequests",
      "createDeployment",
      "getDeployments",
      "getDeployment",
      "stopDeployment",
      "startDeployment",
      "deleteDeployment",
      "retryDeployment",
      "rollbackProject",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProjectsService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProjectsService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PROJECTS_SERVICE_NAME = "ProjectsService";

export interface EnvServiceClient {
  createEnvironment(request: CreateEnvDto): Observable<Env>;

  getEnvironment(request: GetEnvDto): Observable<Env>;

  getAllEnvironments(request: GetAllEnvDto): Observable<Env>;

  updateEnvironment(request: UpdateEnvDto): Observable<Env>;

  deleteEnvironment(request: GetEnvDto): Observable<Env>;
}

export interface EnvServiceController {
  createEnvironment(request: CreateEnvDto): Promise<Env> | Observable<Env> | Env;

  getEnvironment(request: GetEnvDto): Promise<Env> | Observable<Env> | Env;

  getAllEnvironments(request: GetAllEnvDto): Promise<Env> | Observable<Env> | Env;

  updateEnvironment(request: UpdateEnvDto): Promise<Env> | Observable<Env> | Env;

  deleteEnvironment(request: GetEnvDto): Promise<Env> | Observable<Env> | Env;
}

export function EnvServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createEnvironment",
      "getEnvironment",
      "getAllEnvironments",
      "updateEnvironment",
      "deleteEnvironment",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("EnvService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("EnvService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ENV_SERVICE_NAME = "EnvService";
