"use server";

import { $api } from "@/http";
import { ApiError, throwFormattedApiError } from "@/lib/utils/formatApiError";
import { AxiosError } from "axios";

export async function sendOtpEmail(
  email: string,
): Promise<{ expiresIn: Date; success: true } | ApiError> {
  const data = await $api
    .post("/auth/otp", { email })
    .then((res) => {
      if (res.data) return { ...res?.data, success: true };
    })
    .catch((err: AxiosError) => {
      return throwFormattedApiError(err);
    });
  return data;
}
