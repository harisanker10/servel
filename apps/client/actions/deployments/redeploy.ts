"use server";

import { $api } from "@/http";

export async function reDeploy(deploymentId: string) {
  const res = await $api
    .patch("/projects/redeploy", { deploymentId })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res || null;
}
