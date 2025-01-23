"use server";

import { $api } from "@/http";

export async function rollback(deploymentId: string) {
  console.log({ rollbacking: deploymentId });
  const res = await $api
    .patch(`/projects/rollback`, { deploymentId })
    .then((res) => res.data)
    .catch((err) => {});
  return res || null;
}
