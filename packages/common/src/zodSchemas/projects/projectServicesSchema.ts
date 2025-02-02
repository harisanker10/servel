import { InstanceType, ProjectType } from "src/types";
import { z } from "zod";

export const envSchema = z.array(
  z.object({
    name: z.string(),
    value: z.string(),
  }),
);

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
