"use server";

import { $api } from "@/http";

export async function getAllProjects() {
  const res = await $api
    .get("/projects")
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res?.projects || null;
}
