export interface DeploymentBuildingEventDto {
  projectId: string;
  deploymentId: string;
  buildLogBucketPath?: string;
}
