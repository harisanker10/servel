"use server";

import { $api } from "@/http";
import { AxiosError } from "axios";

export async function stopProject(projectId: string) {
  const res = await $api
    .patch(`/projects/stop`, { projectId })
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      console.log(err.response?.data);
    });
  console.log({ stopData: res?.data });
  return res || null;
}
