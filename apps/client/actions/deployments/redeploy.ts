"use server";

import { $api } from "@/http";
import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from "@servel/common/types";

export interface RedeployValues {
  projectId: string;
  projectType: ProjectType;
  env?: string | undefined;
  imageData?: ImageData | undefined;
  staticSiteData?: StaticSiteData | undefined;
  webServiceData?: WebServiceData | undefined;
}

export async function reDeploy(data: RedeployValues) {
  const res = await $api
    .patch("/projects/redeploy", data)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res || null;
}
