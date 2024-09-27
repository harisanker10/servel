// export type BuildQueueMessage = Omit<
//   Deployment,
//   "createdAt" | "updatedAt" | "deploymentUrl" | "status"
// > & { env: Record<string, string>; port: number };
import { ImageData, ProjectType, StaticSiteData, WebServiceData } from "..";

export type BuildQueueMessage = {
  projectId: string;
  deploymentId: string;
  deploymentType: ProjectType;
  data: WebServiceData | ImageData | StaticSiteData;
  env?: { id: string; values: Record<string, string> };
};
