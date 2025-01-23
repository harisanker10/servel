import { ProjectType } from "src/types";
export interface DeploymentDeployingEventDto<
  T extends ProjectType = ProjectType,
> {
  deploymentId: string;
  projectId: string;
  projectType: ProjectType;
  imageServiceData: T extends ProjectType.IMAGE
    ? {
        clusterServiceName: string;
        clusterDeploymentName: string;
        clusterContainerName: string;
        clusterImageName: string;
        namespace: string;
        port: number;
      }
    : never;
  webServiceData: T extends ProjectType.WEB_SERVICE
    ? {
        clusterServiceName: string;
        clusterDeploymentName: string;
        clusterContainerName: string;
        clusterImageName: string;
        namespace: string;
        port: number;
      }
    : never;
  staticSiteServiceData: T extends ProjectType.STATIC_SITE
    ? { bucketPath: string }
    : never;
}
