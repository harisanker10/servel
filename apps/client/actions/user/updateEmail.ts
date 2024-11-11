"use server";

import { $api } from "@/http";
import { throwFormattedApiError } from "@/lib/utils/formatApiError";

export default async function updateEmail(email: string, otp: string) {
  console.log({ email, otp });
  const res = await $api
    .patch("/user/email", { email, otp })
    .then((data) => {
      console.log({ data });
      return data;
    })
    .catch((err) => {
      console.log({ err: throwFormattedApiError(err) });
    });
}
