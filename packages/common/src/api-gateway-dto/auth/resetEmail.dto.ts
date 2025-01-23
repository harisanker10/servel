import { resetEmailSchema } from "src/zodSchemas";
import { z } from "zod";

export type UpdateEmailRequestDto = z.infer<typeof resetEmailSchema>;
