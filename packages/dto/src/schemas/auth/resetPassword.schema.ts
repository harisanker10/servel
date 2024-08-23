import { z } from "zod";
import { strongPasswordSchema } from "./strongPassword.schema";

export const resetPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" }),
  password: strongPasswordSchema,
  otp: z.string({ required_error: "otp is required" }).min(6).max(6),
});
