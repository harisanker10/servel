import { InstanceType, ProjectType } from "src/types";
import { z } from "zod";
import {
  envSchema,
  imageSchema,
  staticSiteSchema,
  webServiceSchema,
} from "./projectServicesSchema";

export const createProjectSchema = z
  .object({
    name: z.string(),
    projectType: z.nativeEnum(ProjectType),
    instanceType: z.nativeEnum(InstanceType),
    imageData: z.optional(imageSchema),
    webServiceData: z.optional(webServiceSchema),
    staticSiteData: z.optional(staticSiteSchema),
    env: z.optional(envSchema),
  })
  .refine(
    (project) => {
      switch (project.projectType) {
        case ProjectType.IMAGE: {
          return imageSchema.safeParse(project.imageData).success;
        }
        case ProjectType.STATIC_SITE: {
          return staticSiteSchema.safeParse(project.staticSiteData).success;
        }
        case ProjectType.WEB_SERVICE: {
          return webServiceSchema.safeParse(project.webServiceData).success;
        }
      }
    },
    { message: "Project data is required" },
  );
