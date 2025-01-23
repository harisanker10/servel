import { PopulatedProject } from "../";
import { createProjectSchema } from "src/zodSchemas";
import { z } from "zod";

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type CreateProjectDtoRes = PopulatedProject;
