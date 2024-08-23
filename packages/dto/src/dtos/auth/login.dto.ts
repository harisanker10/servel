import { User } from "src/proto";
import { loginSchema } from "src/schemas";
import { z } from "zod";
import { ErrorResponse } from "../common";

export type LoginRequestDto = z.infer<typeof loginSchema>;

export type LoginResponseDto = { user: User; token: string };
