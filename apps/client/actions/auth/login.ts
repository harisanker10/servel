"use server";

import { $api } from "@/http";
import { setAccessToken } from "@/lib/session/setSession";
import { formatApiError } from "@/lib/utils/formatApiError";
import { ErrorResponse, LoginResponseDto } from "@servel/dto";
import { AxiosError } from "axios";

export async function login(email: string, password: string) {
  console.log("in login server action");
  const body = { email, password };
  const data = await $api
    .post<LoginResponseDto | ErrorResponse>("/auth/login", body)
    .then((res) => {
      console.log("elon ma", res.data);
      if ("token" in res.data) {
        setAccessToken(res.data.token);
      }
    })
    .catch((err: AxiosError) => {
      return formatApiError(err);
    });

  console.log({ data });

  return data;
}
