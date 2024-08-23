import { DeploymentStatus } from "..";

export interface DeploymentUpdatesDto {
  deploymentId: string;
  version: number;
  updates: {
    status?: DeploymentStatus;
    nodePort?: number;
    deploymentUrl?: string;
    image?: string;
  };
}
