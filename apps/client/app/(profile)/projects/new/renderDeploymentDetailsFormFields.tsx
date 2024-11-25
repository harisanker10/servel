import { LabeledInput } from "@/components/labeledInput";
import {
  validateRepoUrl,
  validateName,
  validateBuildCommand,
  validateRunCommand,
  validatePort,
} from "@/lib/validators/validators";
import { ProjectType } from "@servel/common/types";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, ChangeEvent } from "react";

export type DeploymentDetailsFormValues<T extends ProjectType = ProjectType> =
  T extends ProjectType.WEB_SERVICE
    ? {
        name: string;
        repoUrl: string;
        buildCommand: string;
        runCommand: string;
        port: number;
      }
    : T extends ProjectType.STATIC_SITE
      ? {
          name: string;
          repoUrl: string;
          buildCommand: string;
          outDir: string;
        }
      : T extends ProjectType.IMAGE
        ? {
            name: string;
            repoUrl: string;
            port: number;
          }
        : never;
export default function DeploymentDetailsFormDetails({
  serviceType,
  values,
  onChange,
}: {
  serviceType: ProjectType;
  values: DeploymentDetailsFormValues;
  onChange: Dispatch<SetStateAction<DeploymentDetailsFormValues>>;
}) {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };
  if (serviceType === ProjectType.WEB_SERVICE) {
    const webServiceValues =
      values as DeploymentDetailsFormValues<ProjectType.WEB_SERVICE>;
    return (
      <>
        <LabeledInput
          label="Source Code"
          id="repo-url"
          name="repoUrl"
          placeholder="https://github.com/username/repo.git"
          value={webServiceValues.repoUrl}
          onChange={handleOnChange}
          validator={validateRepoUrl}
          rightElement={<Button variant="outline">Select</Button>}
        />
        <LabeledInput
          label="Name"
          id="name"
          name="name"
          placeholder="Enter project name"
          value={webServiceValues.name}
          onChange={handleOnChange}
          validator={validateName}
        />
        <LabeledInput
          label="Build Command"
          id="build-command"
          name="buildCommand"
          placeholder="npm run build"
          value={webServiceValues.buildCommand}
          onChange={handleOnChange}
          validator={validateBuildCommand}
        />
        <LabeledInput
          label="Run Command"
          id="run-command"
          name="runCommand"
          placeholder="npm start"
          value={webServiceValues.runCommand}
          onChange={handleOnChange}
          validator={validateRunCommand}
        />
        <LabeledInput
          label="Port"
          id="port"
          name="port"
          placeholder="3000"
          value={webServiceValues.port}
          onChange={handleOnChange}
          validator={validatePort}
        />
      </>
    );
  }
  if (serviceType === ProjectType.STATIC_SITE) {
    const staticSiteValues =
      values as DeploymentDetailsFormValues<ProjectType.STATIC_SITE>;
    return (
      <>
        <LabeledInput
          label="Source Code"
          id="repo-url"
          name="repoUrl"
          placeholder="https://github.com/username/repo.git"
          value={staticSiteValues.repoUrl}
          onChange={handleOnChange}
          rightElement={<Button variant="outline">Select</Button>}
        />
        <LabeledInput
          label="Name"
          id="name"
          name="name"
          placeholder="Enter project name"
          value={staticSiteValues.name}
          onChange={handleOnChange}
        />
        <LabeledInput
          label="Build Command"
          id="build-command"
          name="buildCommand"
          placeholder="npm run build"
          value={staticSiteValues.buildCommand}
          onChange={handleOnChange}
        />
        <LabeledInput
          label="Output Directory"
          id="out-dir"
          name="outDir"
          placeholder="/build"
          value={staticSiteValues.outDir}
          onChange={handleOnChange}
        />
      </>
    );
  }
  if (serviceType === ProjectType.IMAGE) {
    const imageValues =
      values as DeploymentDetailsFormValues<ProjectType.IMAGE>;
    return (
      <>
        <LabeledInput
          label="Source Code"
          id="repo-url"
          name="repoUrl"
          placeholder="https://github.com/username/repo.git"
          value={imageValues.repoUrl}
          onChange={handleOnChange}
          rightElement={<Button variant="outline">Select</Button>}
        />
        <LabeledInput
          label="Name"
          id="name"
          name="name"
          placeholder="Enter project name"
          value={imageValues.name}
          onChange={handleOnChange}
        />
        <LabeledInput
          label="Port"
          id="port"
          name="port"
          placeholder="3000"
          value={imageValues.port}
          onChange={handleOnChange}
        />
      </>
    );
  }
}
