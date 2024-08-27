"use server";

import { $api } from "@/http";

export interface CreateWebServiceDto {
  url: string;
  userId: string;
  outDir?: string | undefined;
  runCommand: string;
  buildCommand?: string | undefined;
  instanceType: string;
  envs: {
    [key: string]: string;
  };
}

export async function createDeployment(webService: CreateWebServiceDto) {
  console.log({ webService });
  // const parsed = createWebServiceSchema.safeParse(webService);
  // if (!parsed.success) {
  //   console.log(parsed.error);
  //   return { error: "validation error" };
  // }
  const res = await $api
    .post("/deployments", webService)
    .then((res) => res.data);

  console.log({ res });
}
