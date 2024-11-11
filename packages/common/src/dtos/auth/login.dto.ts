import { loginSchema } from "src/schemas";
import { z } from "zod";
import { User } from "src/types";

export type LoginRequestDto = z.infer<typeof loginSchema>;

export type LoginResponseDto = { user: User; token: string };
