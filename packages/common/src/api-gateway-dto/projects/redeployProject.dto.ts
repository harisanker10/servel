import { PopulatedProject } from "../";
import { createProjectSchema, redeployProjectSchema } from "src/zodSchemas";
import { z } from "zod";

export type RedeployProjectDto = z.infer<typeof redeployProjectSchema>;
export type RedeployProjectResDto = PopulatedProject;
