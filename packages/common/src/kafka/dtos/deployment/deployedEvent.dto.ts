import { ProjectType } from "src/types";

//TODO: Currently request service uses the name property as subdomain to find and route traffic. Design better

export interface DeploymentDeployedEventDto<
  T extends ProjectType = ProjectType,
> {
  name: string;
  deploymentId: string;
  projectId: string;
  projectType: T;
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
