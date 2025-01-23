import { ProjectStatus } from "src/types";

export interface DeploymentFailedEventDto {
  deploymentId: string;
  projectId: string;
  err: string;
}
