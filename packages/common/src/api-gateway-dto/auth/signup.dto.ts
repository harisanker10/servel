import { User } from "src/types";
import { signupAuthSchema } from "src/zodSchemas";
import { z } from "zod";

export type SignupRequestDto = z.infer<typeof signupAuthSchema>;

export interface SignupResponseDto {
  token: string;
  user: User;
}
