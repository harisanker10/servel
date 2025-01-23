"use server";

import { createProjectSchema } from "@servel/common";
import { CreateProjectDto } from "@servel/common/api-gateway-dto";

export async function createProject(data: CreateProjectDto) {
  console.log({ data });
  const parsed = createProjectSchema.safeParse(data);
  console.log({ parsed });
  // const res = await $api
  //   .post("/projects", data)
  //   .then((res) => {
  //     console.log({ res });
  //     return res.data as CreateProjectDtoRes;
  //   })
  //   .catch((err: AxiosError) => {});
  // return res;
}
