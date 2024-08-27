"use server";

import { $api } from "@/http";

export async function getUsersDeployments() {
  const res = await $api.get("/deployments").then((res) => res.data);
  return res.deployments;
}
