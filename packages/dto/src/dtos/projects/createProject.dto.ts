import { createProjectSchema } from "src/schemas";
import { z } from "zod";

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
