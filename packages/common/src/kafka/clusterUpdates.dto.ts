import { ProjectType } from "..";

export type ClusterUpdatesDto = {
  deploymentId: string;
  deploymentName: string;
} & (
  | {
      type: ProjectType.WEB_SERVICE;
      data: {
        k8DeploymentId: string;
        k8ServiceId: string;
        port: number;
      };
    }
  | {
      type: ProjectType.STATIC_SITE;
      data: {
        s3Path: string;
      };
    }
);
