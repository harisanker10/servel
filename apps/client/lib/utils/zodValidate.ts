import { ZodSchema } from "zod";

export function zodVaidate(
  data: any,
  schema: ZodSchema,
): { success: boolean; error: string | null } {
  const { success, error } = schema.safeParse(data);
  const errors = error?.errors;
  return {
    success,
    error: (errors && errors[0]?.message) || null,
  };
}
