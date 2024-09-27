import { ProjectStatus } from "..";

export interface DeploymentUpdatesDto {
  deploymentId: string;
  updates: {
    status?: ProjectStatus;
    nodePort?: number | undefined;
    deploymentUrl?: string | undefined;
  };
}
