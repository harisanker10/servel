"use server";

import { $api } from "@/http";
import { RedeployProjectDto } from "@servel/common/api-gateway-dto";
import { ProjectType } from "@servel/common/types";
export async function reDeploy(data: RedeployProjectDto) {
  const res = await $api
    .patch("/projects/redeploy", data)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });
  return res || null;
}

export async function redeployFormAction(
  _prevState: any,
  formData: FormData,
): Promise<{ success: boolean }> {
  const projectId = formData.get("projectId") as string;
  const projectType = formData.get("projectType") as ProjectType;

  console.log({ formData: formData.values() });

  const repoUrl = formData.get("repoUrl") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const port = parseInt(formData.get("port") as string);
  const buildCommand = formData.get("buildCommand") as string;
  const runCommand = formData.get("runCommand") as string;
  const outDir = formData.get("outDir") as string;
  const branch = formData.get("branch") as string | null;
  const commitId = formData.get("commitId") as string | null;

  const data: RedeployProjectDto = {
    projectId,
  };

  // Helper function to add optional fields
  const addOptionalFields = (target: any) => {
    if (commitId) target.commitId = commitId;
    if (branch) target.branch = branch;
  };

  switch (projectType) {
    case ProjectType.IMAGE:
      data.imageData = { port, imageUrl };
      addOptionalFields(data.imageData);
      break;

    case ProjectType.STATIC_SITE:
      data.staticSiteData = { repoUrl, buildCommand, outDir };
      addOptionalFields(data.staticSiteData);
      break;

    case ProjectType.WEB_SERVICE:
      data.webServiceData = { repoUrl, buildCommand, port, runCommand };
      addOptionalFields(data.webServiceData);
      break;

    default:
      throw new Error("Invalid project type");
  }

  try {
    const response = await $api.patch("/projects/redeploy", data);
    console.log({ response });
  } catch (error) {
    console.error("Error during redeployment:", error);
    throw new Error("Redeployment failed");
  }

  return { success: true };
}
