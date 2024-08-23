import { z } from "zod";

export const strongPasswordSchema = z
  .string()
  .min(8, { message: "Password must contain at least 8 characters" })
  .max(20, { message: "Password must contain at most 20 characters" })
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character");
