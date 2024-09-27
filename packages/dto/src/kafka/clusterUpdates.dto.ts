import { ImageData, StaticSiteData, WebServiceData } from "..";

export interface ClusterUpdatesDto {
  deploymentId: string;
  data: ImageData | WebServiceData | StaticSiteData;
  k8ContainerId?: string | undefined;
  k8DeploymentId?: string | undefined;
  k8ServiceId?: string | undefined;
  s3Path?: string | undefined;
}
