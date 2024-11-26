import { DeploymentStatus } from "..";

export interface StaticSiteUpdatesDto {
  deploymentId: string;
  s3Path?: string | undefined;
  status?: DeploymentStatus | undefined;
}
