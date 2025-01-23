"use server";

import { $api } from "@/http";
import { throwFormattedApiError } from "@/lib/utils/formatApiError";

export async function getRepositories() {
  return $api
    .get("/repositories/github")
    .then((data) => data.data)
    .catch((err) => throwFormattedApiError(err));
}
