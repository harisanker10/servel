"use server";

import { $api } from "@/http";

export async function getProject(projectId: string) {
  const res = await $api
    .get(`/projects/${projectId}`)
    .then((res) => res.data)
    .catch((err) => {});
  return res || null;
}
