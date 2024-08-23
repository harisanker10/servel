"use server";

import { $api } from "@/http";
import { ApiError, formatApiError } from "@/lib/utils/formatApiError";
import { SignupResponseDto } from "@servel/dto";

export async function resetPassword(
  email: string,
  otp: string,
  password: string,
): Promise<SignupResponseDto | ApiError> {
  console.log("patching password");
  return $api
    .patch("/auth/password", { email, otp, password })
    .then((res) => {
      return res.data;
    })
    .catch((err) => formatApiError(err));
}
