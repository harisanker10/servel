"use server";

import { $api } from "@/http";

export async function startProject(deploymentId: string) {
  const res = await $api
    .post(`/projects/start`, { deploymentId })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res || null;
}
