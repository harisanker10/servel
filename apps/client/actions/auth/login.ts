"use server";

import { $api } from "@/http";
import { setAccessToken } from "@/lib/session/setSession";
import { throwFormattedApiError } from "@/lib/utils/formatApiError";
import { ErrorResponse, LoginResponseDto } from "@servel/common/dto";
import { AxiosError } from "axios";

export async function login(email: string, password: string) {
  console.log("in login server action");
  const body = { email, password };
  const data = await $api
    .post<LoginResponseDto | ErrorResponse>("/auth/login", body)
    .then((res) => {
      console.log({ res });
      if (res.data && "token" in res.data) {
        setAccessToken(res.data.token);
      }
    })
    .catch((err: AxiosError) => {
      console.log({ err });
      return throwFormattedApiError(err);
    });

  console.log({ data });

  return data;
}
