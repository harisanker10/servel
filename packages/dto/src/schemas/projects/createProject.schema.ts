import { InstanceType, ProjectType } from "src/types";
import { z } from "zod";

export const imageSchema = z.object({
  imageUrl: z.string(),
  port: z.number(),
  accessToken: z.optional(z.string()),
});

export const webServiceSchema = z.object({
  repoUrl: z.string(),
  runCommand: z.string(),
  buildCommand: z.string(),
  accessToken: z.optional(z.string()),
  branch: z.optional(z.string()),
  commitId: z.optional(z.string()),
  port: z.number(),
});

export const staticSiteSchema = z.object({
  repoUrl: z.string(),
  outDir: z.string(),
  buildCommand: z.string(),
  accessToken: z.optional(z.string()),
  branch: z.optional(z.string()),
  commitId: z.optional(z.string()),
});

export const createProjectSchema = z
  .object({
    name: z.optional(z.string()),
    projectType: z.nativeEnum(ProjectType),
    instanceType: z.nativeEnum(InstanceType),
    imageData: z.optional(imageSchema),
    webServiceData: z.optional(webServiceSchema),
    staticSiteData: z.optional(staticSiteSchema),
    env: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.projectType === ProjectType.staticSite) {
        return !!data.staticSiteData;
      } else if (data.projectType === ProjectType.webService) {
        return !!data.webServiceData;
      } else if (data.projectType === ProjectType.dockerImage) {
        return !!data.imageData;
      }
    },
    { message: "Invalid data" },
  );
