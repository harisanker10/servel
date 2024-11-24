"use server";

import { $api } from "@/http";
import { CreateProjectDto, CreateProjectDtoRes } from "@servel/common/dto";
import { AxiosError } from "axios";

export async function createProject(data: CreateProjectDto) {
  console.log("sending....");
  const res = await $api
    .post("/projects", data)
    .then((res) => res.data as CreateProjectDtoRes)
    .catch((err: AxiosError) => {
      console.log({ err: err.response?.data });
    });
  return res;
}
