"use server";

import { $api } from "@/http";
import { throwFormattedApiError } from "@/lib/utils/formatApiError";

export async function updateFullName(fullname: string) {
  $api
    .patch("/user", { fullname })
    .then((res) => res.data)
    .catch((err) => throwFormattedApiError(err));
}
