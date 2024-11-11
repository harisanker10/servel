"use server";

import { $api } from "@/http";
import { ApiError, throwFormattedApiError } from "@/lib/utils/formatApiError";

export async function verifyEmailOtp(
  otp: string,
  email: string,
): Promise<{ valid: boolean } | ApiError> {
  return $api
    .get(`/auth/otp/verify?otp=${otp}&email=${email}`)
    .then(({ data }) => {
      return data;
    })
    .catch((err) => throwFormattedApiError(err));
}
