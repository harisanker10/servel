import { InstanceType } from "..";

export interface DeploymentQueueDto {
  deploymentId: string;
  image: string;
  deploymentName: string;
  port: number;
  envs?: { key: string; value: string }[] | undefined;
  instanceType: InstanceType;
}
