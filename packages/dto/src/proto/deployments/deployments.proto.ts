import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import {
  CreateImageDeploymentDto,
  CreateStaticSiteDto,
  CreateWebServiceDto,
  GetDeploymentDto,
} from "./deployments";
import { Deployment } from "src/types";

export interface DeploymentsServiceClient {
  createWebService(request: CreateWebServiceDto): Observable<Deployment>;

  createStaticSite(request: CreateStaticSiteDto): Observable<Deployment>;

  createImageDeployment(
    request: CreateImageDeploymentDto,
  ): Observable<Deployment>;

  getDeployment(request: GetDeploymentDto): Observable<Deployment>;
}

export interface DeploymentsServiceController {
  createWebService(
    request: CreateWebServiceDto,
  ): Promise<Deployment> | Observable<Deployment> | Deployment;

  createStaticSite(
    request: CreateStaticSiteDto,
  ): Promise<Deployment> | Observable<Deployment> | Deployment;

  createImageDeployment(
    request: CreateImageDeploymentDto,
  ): Promise<Deployment> | Observable<Deployment> | Deployment;

  getDeployment(
    request: GetDeploymentDto,
  ): Promise<Deployment> | Observable<Deployment> | Deployment;
}

export function DeploymentsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createWebService",
      "createStaticSite",
      "createImageDeployment",
      "getDeployment",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod("DeploymentsService", method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod("DeploymentsService", method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const DEPLOYMENTS_SERVICE_NAME = "DeploymentsService";
