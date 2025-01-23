"use server";

import { $api } from "@/http";

export async function retryDeployment(deploymentId: string) {
  const res = await $api
    .patch("/projects/retry", { deploymentId })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res || null;
}
