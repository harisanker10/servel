import { signupAuthSchema } from "src/schemas";
import { User } from "../..";
import { z } from "zod";

export type SignupRequestDto = z.infer<typeof signupAuthSchema>;

export interface SignupResponseDto {
  token: string;
  user: User;
}
