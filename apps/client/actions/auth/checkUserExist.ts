"use server";

import { $api } from "@/http";
import { ApiError, formatApiError } from "@/lib/utils/formatApiError";
import { AxiosError } from "axios";

export async function checkUserExist(
  email: string,
): Promise<{ exist: boolean } | ApiError> {
  return $api
    .get(`/auth/exist/${email}`)
    .then((res) => res.data?.exist)
    .catch((err: AxiosError) => {
      return formatApiError(err);
    });
}
