import { ProjectType } from "src/types";

export type BuiltEvent<T extends ProjectType = ProjectType> = {
  projectId: string;
  deploymentId: string;
  projectType: T;
  webServiceData: T extends ProjectType.WEB_SERVICE
    ? { builtImage: string }
    : never;
};
