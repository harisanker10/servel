import { z } from "zod";
import { InstanceType } from "src/types";

export const createWebServiceSchema = z.object({
  repoName: z.string(),
  url: z.string().url(),
  outDir: z.string().optional(),
  runCommand: z.string(),
  buildCommand: z.string().optional(),
  instanceType: z.enum([
    InstanceType.tier_0,
    InstanceType.tier_1,
    InstanceType.tier_2,
  ]),
});
