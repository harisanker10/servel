import { z } from "zod";
import {
  imageSchema,
  webServiceSchema,
  staticSiteSchema,
  envSchema,
} from "./projectServicesSchema";

export const redeployProjectSchema = z
  .object({
    projectId: z.string(),
    env: z.optional(envSchema),
    imageData: z.optional(imageSchema),
    webServiceData: z.optional(webServiceSchema),
    staticSiteData: z.optional(staticSiteSchema),
  })
  .refine(
    (deployment) => {
      return (
        deployment.imageData !== undefined ||
        deployment.webServiceData !== undefined ||
        deployment.staticSiteData !== undefined
      );
    },
    {
      message:
        "At least one of imageData, webServiceData, or staticSiteData is required.",
    },
  );
