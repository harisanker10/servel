"use server";

import { $api } from "@/http";
import { CreateWebServiceDto, createWebServiceSchema } from "@servel/dto";

export async function createDeployment(webService: CreateWebServiceDto) {
  const parsed = createWebServiceSchema.safeParse(webService);
  if (!parsed.success) {
    return { error: "validation error" };
  }
  const res = await $api
    .post("/deployments", webService)
    .then((res) => res.data);
}
