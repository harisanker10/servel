import { LabeledInput } from "@/components/labeledInput";
import { ProjectType } from "@servel/common/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  validateRepoUrl,
  validateName,
  validateBuildCommand,
  validateRunCommand,
  validatePort,
} from "./validators";
import { SelectRepoBtn } from "./repositorySelectorBtn";
import { useRef } from "react";

export type DeploymentDetailsFormValues = {
  name: string;
  repoUrl: string;
  buildCommand?: string;
  runCommand?: string;
  port?: number;
  outDir?: string;
};

export default function DeploymentDetailsForm({
  onChange,
  projectType,
}: {
  projectType: ProjectType;
  onChange: (values: ProjectType) => void;
}) {
  const repoUrlRef = useRef<HTMLInputElement>(null);

  const commonInputs = [
    {
      label: "Source Code",
      name: "repoUrl",
      placeholder: "https://github.com/username/repo.git",
      validator: validateRepoUrl,
      ref: repoUrlRef,
      rightElement: (
        <SelectRepoBtn
          onSelect={(val) => {
            console.log({ val, repoUrlRef });
            if (repoUrlRef.current) {
              repoUrlRef.current["value"] = val;
              repoUrlRef.current.blur();
            }
          }}
        />
      ),
      error: null,
      required: true,
      defaultValue: "https://github.com/harisanker10/sort-visualizer",
    },
    {
      label: "Name",
      name: "name",
      placeholder: "Enter project name",
      validator: validateName,
      error: null,
      defaultValue: "sort" + Math.floor(Math.random() * 1000000),
      required: true,
    },
  ];

  const inputsByType = {
    [ProjectType.WEB_SERVICE]: [
      ...commonInputs,
      {
        label: "Build Command",
        name: "buildCommand",
        placeholder: "npm run build",
        validator: validateBuildCommand,
        error: null,
        required: true,
        defaultValue: "npm run build",
      },
      {
        label: "Run Command",
        name: "runCommand",
        placeholder: "npm start",
        validator: validateRunCommand,
        error: null,
        required: true,
        defaultValue: "npx serve ./dist",
      },
      {
        label: "Port",
        name: "port",
        placeholder: "3000",
        validator: validatePort,
        error: null,
        required: true,
        defaultValue: "3000",
      },
    ],
    [ProjectType.STATIC_SITE]: [
      ...commonInputs,
      {
        label: "Build Command",
        name: "buildCommand",
        placeholder: "npm run build",
        error: null,
        required: true,
        defaultValue: "npm run build",
      },
      {
        label: "Output Directory",
        name: "outDir",
        placeholder: "/build",
        error: null,
        required: true,
        defaultValue: "./dist",
      },
    ],
    [ProjectType.IMAGE]: [
      {
        label: "Image Url",
        name: "imageUrl",
        placeholder: "",
        error: null,
        required: true,
      },
      {
        label: "Name",
        name: "name",
        placeholder: "",
        error: null,
        required: true,
      },
      {
        label: "Port",
        name: "port",
        placeholder: "3000",
        error: null,
        required: true,
      },
    ],
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Deployment Details</CardTitle>
        <CardDescription>
          Enter the details for your deployment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {inputsByType[projectType].map((input) => (
          <LabeledInput
            key={input.name}
            label={input.label}
            id={input.name}
            name={input.name}
            ref={input.ref}
            placeholder={input.placeholder}
            onBlurValidator={
              "validator" in input ? input?.validator : undefined
            }
            rightElement={
              "rightElement" in input ? input.rightElement : undefined
            }
            error={input.error}
            required={input.required}
          />
        ))}
      </CardContent>
    </div>
  );
}
