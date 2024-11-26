"use server";

import { $api } from "@/http";

export async function getAnalytics(projectId: string) {
  const res = await $api
    .get(`/projects/analytics/${projectId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res || null;
}
