import { ImageData, StaticSiteData, WebServiceData } from '@servel/common';

export type DeploymentData = {
  deploymentId: string;
  deploymentName: string;
} & (WebServiceData | ImageData | StaticSiteData);
