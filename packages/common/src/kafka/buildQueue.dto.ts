// export type BuildQueueMessage = Omit<
//   Deployment,
//   "createdAt" | "updatedAt" | "deploymentUrl" | "status"
// > & { env: Record<string, string>; port: number };
import { ImageData, ProjectType, StaticSiteData, WebServiceData } from "..";

export type BuildQueueMessage<T extends ProjectType = ProjectType> = {
  name: string;
  projectId: string;
  deploymentId: string;
  deploymentType: T;
  data: T extends ProjectType.STATIC_SITE
    ? StaticSiteData
    : T extends ProjectType.WEB_SERVICE
      ? WebServiceData
      : T extends ProjectType.IMAGE
        ? ImageData
        : never;
  env?: { id: string; values: Record<string, string> };
};
