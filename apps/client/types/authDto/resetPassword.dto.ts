import { z } from "zod";

const strongPasswordSchema = z
  .string()
  .min(8, { message: "Password must contain at least 8 characters" })
  .max(20, { message: "Password must contain at most 20 characters" })
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character");

export const resetPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Email must be a valid email address" }),
  password: strongPasswordSchema,
  otp: z.string({ message: "otp is required" }).min(6).max(6),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
