"use server";

import { $api } from "@/http";

export async function getAllDeploymentsOfProject(projectId: string) {
  const res = await $api
    .get(`/deployments/all/${projectId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res || null;
}
