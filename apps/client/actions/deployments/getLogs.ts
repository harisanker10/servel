"use server";

import { $api } from "@/http";

export async function getLogs(deploymentId: string) {
  return $api
    .get(`/deployments/logs/${deploymentId}`)
    .then((data) => data?.data)
    .catch((err) => console.log(err));
}
