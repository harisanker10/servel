"use client";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "@/components/ui/card";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { getRepoNameFromUrl } from "@/lib/getRepoName";
import { LabeledInput } from "@/components/labeledInput";
import {
  validateBuildCommand,
  validateName,
  validatePort,
  validateRepoUrl,
  validateRunCommand,
} from "@/lib/validators/validators";
import { ProjectType } from "@servel/common/types";

export type FormValues =
  | {
      name: string;
      repoUrl: string;
      buildCommand: string;
      runCommand: string;
      port: number;
    }
  | {
      name: string;
      repoUrl: string;
      buildCommand: string;
      outDir: string;
    }
  | {
      name: string;
      repoUrl: string;
      port: number;
    };

export function DeploymentDetails({
  serviceType,
  values,
  onChange,
}: {
  serviceType: ProjectType;
  values: FormValues;
  onChange: Dispatch<SetStateAction<FormValues>>;
}) {
  useEffect(() => {
    onChange({ ...values, name: getRepoNameFromUrl(values.repoUrl) ?? "" });
  }, [values.repoUrl]);
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  const renderFormFields = () => {
    if (serviceType === ProjectType.WEB_SERVICE) {
      return (
        <>
          <LabeledInput
            label="Source Code"
            id="repo-url"
            name="repoUrl"
            placeholder="https://github.com/username/repo.git"
            value={values.repoUrl || ""}
            onChange={handleOnChange}
            validator={validateRepoUrl}
            rightElement={<Button variant="outline">Select</Button>}
          />
          <LabeledInput
            label="Name"
            id="name"
            name="name"
            placeholder="Enter project name"
            value={values.name || ""}
            onChange={handleOnChange}
            validator={validateName}
          />
          <LabeledInput
            label="Build Command"
            id="build-command"
            name="buildCommand"
            placeholder="npm run build"
            value={values.buildCommand || ""}
            onChange={handleOnChange}
            validator={validateBuildCommand}
          />
          <LabeledInput
            label="Run Command"
            id="run-command"
            name="runCommand"
            placeholder="npm start"
            value={values.runCommand || ""}
            onChange={handleOnChange}
            validator={validateRunCommand}
          />
          <LabeledInput
            label="Port"
            id="port"
            name="port"
            placeholder="3000"
            value={values.port || ""}
            onChange={handleOnChange}
            validator={validatePort}
          />
        </>
      );
    }
    if (serviceType === ProjectType.STATIC_SITE) {
      return (
        <>
          <LabeledInput
            label="Source Code"
            id="repo-url"
            name="repoUrl"
            placeholder="https://github.com/username/repo.git"
            value={values.repoUrl || ""}
            onChange={handleOnChange}
            rightElement={<Button variant="outline">Select</Button>}
          />
          <LabeledInput
            label="Name"
            id="name"
            name="name"
            placeholder="Enter project name"
            value={values.name || ""}
            onChange={handleOnChange}
          />
          <LabeledInput
            label="Build Command"
            id="build-command"
            name="buildCommand"
            placeholder="npm run build"
            value={values.buildCommand || ""}
            onChange={handleOnChange}
          />
          <LabeledInput
            label="Output Directory"
            id="out-dir"
            name="outDir"
            placeholder="/build"
            value={values.outDir || ""}
            onChange={handleOnChange}
          />
        </>
      );
    }
    if (serviceType === ProjectType.IMAGE) {
      return (
        <>
          <LabeledInput
            label="Source Code"
            id="repo-url"
            name="repoUrl"
            placeholder="https://github.com/username/repo.git"
            value={values.repoUrl || ""}
            onChange={handleOnChange}
            rightElement={<Button variant="outline">Select</Button>}
          />
          <LabeledInput
            label="Name"
            id="name"
            name="name"
            placeholder="Enter project name"
            value={values.name || ""}
            onChange={handleOnChange}
          />
          <LabeledInput
            label="Port"
            id="port"
            name="port"
            placeholder="3000"
            value={values.port || ""}
            onChange={handleOnChange}
          />
        </>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Details</CardTitle>
        <CardDescription>
          Enter the details for your deployment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{renderFormFields()}</CardContent>
    </Card>
  );
}
