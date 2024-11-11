"use server";

import { $api } from "@/http";
import {
  InstanceType,
  ProjectType,
  StaticSiteData,
  WebServiceData,
  CreateProjectDto,
} from "@servel/common";
import { AxiosError } from "axios";

export async function createDeployment(data: CreateProjectDto) {
  console.log("sending....");
  const res = await $api
    .post("/projects", data)
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      console.log({ err: err.response?.data });
    });
  return res;
}
