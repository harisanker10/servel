import { z } from "zod";

export const resetEmailSchema = z.object({
  oldEmail: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" }),
  newEmail: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email address" }),
  otp: z.string({ required_error: "otp is required" }).min(6).max(6),
});
