"use server";

import { $api } from "@/http";
import { ApiError, formatApiError } from "@/lib/utils/formatApiError";
import { AxiosError } from "axios";

export async function sendOtpEmail(
  email: string,
): Promise<{ expiresIn: Date } | ApiError> {
  const data = await $api
    .post("/auth/otp", { email })
    .then((res) => {
      return res?.data;
    })
    .catch((err: AxiosError) => {
      return formatApiError(err);
    });
  console.log({ data });
  return data;
}
