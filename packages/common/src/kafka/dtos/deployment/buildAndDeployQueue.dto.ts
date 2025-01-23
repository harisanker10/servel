import { InstanceType, ProjectType } from "src/types";
import { WebServiceData, ImageData, StaticSiteData } from "src/types";

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

export type BuildAndDeployQueueDto = {
  name: string;
  deploymentId: string;
  projectId: string;
  envs?: { name: string; value: string }[] | undefined;
  instanceType: InstanceType;
} & SpecificData;
