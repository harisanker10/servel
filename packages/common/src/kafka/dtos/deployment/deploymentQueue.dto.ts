import {
  DeploymentData,
  ImageData,
  InstanceType,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from "src/types";
type SpecificData =
  | {
      projectType: ProjectType.WEB_SERVICE;
      webServiceData: WebServiceData & {
        buildLogsPushUrl: string;
      };
    }
  | {
      projectType: ProjectType.IMAGE;
      imageServiceData: ImageData;
    }
  | {
      projectType: ProjectType.STATIC_SITE;
      staticSiteServiceData: StaticSiteData & {
        buildLogsPushUrl: string;
        assetsPushUrl: string;
      };
    };
export type DeploymentQueueDto<T extends ProjectType = ProjectType> = {
  name: string;
  deploymentId: string;
  projectId: string;
  projectType: T;
  envs?: { name: string; value: string }[];
  instanceType: InstanceType;
} & SpecificData;
