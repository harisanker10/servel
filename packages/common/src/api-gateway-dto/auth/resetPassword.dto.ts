import { resetPasswordSchema } from "src/zodSchemas";
import { z } from "zod";

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
