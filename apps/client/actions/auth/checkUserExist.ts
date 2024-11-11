"use server";

import { $api } from "@/http";
import { ApiError, throwFormattedApiError } from "@/lib/utils/formatApiError";
import { AxiosError } from "axios";

export async function checkUserExist(
  email: string,
): Promise<{ exist?: boolean | null; success: true } | ApiError> {
  return $api
    .get(`/auth/exist/${email}`)
    .then((res) => res.data && { ...res.data, success: true })
    .catch((err: AxiosError) => {
      throwFormattedApiError(err);
    });
}
