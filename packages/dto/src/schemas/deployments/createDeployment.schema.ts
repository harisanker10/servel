import { z } from "zod";
import { InstanceType } from "src/types";

export const createWebServiceSchema = z.object({
  repoName: z.string(),
  url: z.string().url(),
  outDir: z.string().optional(),
  runCommand: z.string(),
  buildCommand: z.string().optional(),
  instanceType: z.number().min(0).max(2),
});
