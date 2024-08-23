import { resetEmailSchema } from "src/schemas/auth/resetEmail.schema";
import { z } from "zod";

export type UpdateEmailRequestDto = z.infer<typeof resetEmailSchema>;
