"use server";

import { $api } from "@/http";

export async function rollback(deploymentId: string) {
  const res = await $api
    .patch(`/projects/rollback`, { deploymentId })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res || null;
}
