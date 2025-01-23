"use server";

import { $api } from "@/http";
import { Deployment } from "@servel/common/types";
import { AxiosError } from "axios";

export async function getDeployment(deplId: string) {
  const res = await $api
    .get(`/deployments/${deplId}`)
    .then((res) => res.data as Deployment)
    .catch((err: AxiosError) => {
      // console.log({ err: err.response?.data });
    });
  return res;
}
