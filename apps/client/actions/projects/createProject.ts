"use server";

import { $api } from "@/http";
import {
  CreateProjectDto,
  ImageData,
  InstanceType,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from "@servel/common/api-gateway-dto";
import { createProjectSchema } from "@servel/common/zodSchemas";

export async function createProjectFormAction(
  _prevState: any,
  formData: FormData,
): Promise<{ success: boolean }> {
  const instanceType = formData.get("instanceType") as InstanceType;
  const projectType = formData.get("projectType") as ProjectType;
  const name = formData.get("name") as string;
  const repoUrl = formData.get("repoUrl") as string;

  const port = parseInt(formData.get("port") as string);
  const buildCommand = formData.get("buildCommand") as string;
  const runCommand = formData.get("runCommand") as string;
  const outDir = formData.get("outDir") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const branch = formData.get("branch") as string;
  const commitId = formData.get("commitId") as string;

  const webServiceData: WebServiceData = {
    buildCommand,
    port,
    repoUrl,
    runCommand,
  };

  const staticSiteData: StaticSiteData = {
    buildCommand,
    outDir,
    repoUrl,
  };

  const imageData: ImageData = {
    imageUrl,
    port,
  };

  if (branch) {
    webServiceData.branch = branch;
    staticSiteData.branch = branch;
  }

  if (commitId) {
    webServiceData.commitId = commitId;
    staticSiteData.commitId = commitId;
  }

  let data: CreateProjectDto;

  if (projectType === ProjectType.IMAGE) {
    data = {
      instanceType,
      name,
      projectType,
      imageData,
    };
  } else if (projectType === ProjectType.STATIC_SITE) {
    data = {
      instanceType: InstanceType.TIER_0,
      name,
      projectType,
      staticSiteData,
    };
  } else if (projectType === ProjectType.WEB_SERVICE) {
    data = {
      instanceType,
      name,
      projectType,
      webServiceData,
    };
  } else {
    throw new Error("unknown projectType");
  }

  console.log({ data });
  const parsed = createProjectSchema.safeParse(data);
  console.log({ parsed: JSON.stringify(parsed) });

  if (!parsed.success) {
    return { success: false };
  }

  await $api
    .post("/projects", data)
    .then((data) => {
      data;
    })
    .then((data) => {
      console.log({ data });
    });

  return { success: true };
}
