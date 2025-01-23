import { ProjectType } from "src/api-gateway-dto";

export interface DeploymentStoppedEventDto<
  T extends ProjectType = ProjectType,
> {
  projectId: string;
  deploymentId: string;
  projectType: T;
}
