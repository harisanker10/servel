"use server";

import { $api } from "@/http";

export async function startProject(projectId: string) {
  const res = await $api
    .post(`/projects/start`, { projectId })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res || null;
}
