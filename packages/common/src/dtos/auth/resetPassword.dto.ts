import { resetPasswordSchema } from "src/schemas/auth/resetPassword.schema";
import { z } from "zod";

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
