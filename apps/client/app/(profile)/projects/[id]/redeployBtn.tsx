"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, RefreshCcw } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import {
  ImageData,
  ProjectType,
  StaticSiteData,
  WebServiceData,
} from "@servel/common/types";
import { getInitialDeploymentDetailsValues } from "../new/page";
import { DeploymentDetailsFormValues } from "../new/renderDeploymentDetailsFormFields";
import { LabeledInput } from "@/components/labeledInput";
import {
  validateBuildCommand,
  validateOutDir,
  validatePort,
  validateRunCommand,
} from "@/lib/validators/validators";
import { CardHeader } from "@/components/ui/card";
import ErrorCard from "@/components/errorCard";
import { RedeployValues, reDeploy } from "@/actions/deployments/redeploy";
import { useRouter } from "next/navigation";

// type RedeployFormValues =
//   | {
//       buildCommand: string;
//       runCommand: string;
//       port: number;
//     }
//   | {
//       buildCommand: string;
//       outDir: string;
//     }
//   | {
//       port: number;
//     };
//
// function getInitialValues(service: ProjectType): RedeployFormValues {
//   switch (service) {
//     case ProjectType.WEB_SERVICE:
//       return {
//         buildCommand: "",
//         runCommand: "",
//         port: 0,
//       };
//     case ProjectType.STATIC_SITE:
//       return {
//         buildCommand: "",
//         outDir: "",
//       };
//     case ProjectType.IMAGE:
//       return {
//         port: 0,
//       };
//   }
// }

export default function RedeployBtn({
  projectType,
  initialValues,
}: {
  projectType: ProjectType;
  initialValues: {
    projectId: string;
    data: WebServiceData | StaticSiteData | ImageData;
  };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(
    initialValues.data || getInitialDeploymentDetailsValues(projectType),
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  console.log({ isOpen });

  const handleRedeployment = async () => {
    if (values && "commitId" in values) {
      delete values.commitId;
      delete values.branch;
    }
    if (Object.values(values).includes("")) {
      setError("Some field are empty");
      return;
    }
    setIsLoading(true);
    await reDeploy({ ...initialValues, ...values, projectType });
    setIsLoading(false);
    setIsOpen(false);
    router.refresh();
  };

  const renderInputs = () => {
    if (
      "buildCommand" in values &&
      "runCommand" in values &&
      "port" in values
    ) {
      return (
        <>
          <LabeledInput
            label="Repo Url"
            id="repo-url"
            name="repoUrl"
            placeholder="npm run build"
            value={values.repoUrl || ""}
            onChange={onChange}
            validator={validateBuildCommand}
            disabled
          />
          <LabeledInput
            label="Build Command"
            id="build-command"
            name="buildCommand"
            placeholder="npm run build"
            value={values.buildCommand || ""}
            onChange={onChange}
            validator={validateBuildCommand}
          />
          <LabeledInput
            label="Run Command"
            id="run-command"
            name="runCommand"
            placeholder="npm start"
            value={values.runCommand || ""}
            onChange={onChange}
            validator={validateRunCommand}
          />
          <LabeledInput
            label="Port"
            id="port"
            name="port"
            placeholder="3000"
            value={values.port || ""}
            onChange={onChange}
            validator={validatePort}
          />
        </>
      );
    }

    if ("buildCommand" in values && "outDir" in values) {
      return (
        <>
          <LabeledInput
            label="Build Command"
            id="build-command"
            name="buildCommand"
            placeholder="npm run build"
            value={values.buildCommand || ""}
            onChange={onChange}
            validator={validateBuildCommand}
          />
          <LabeledInput
            label="Output Directory"
            id="out-dir"
            name="outDir"
            placeholder="/build"
            value={values.outDir || ""}
            onChange={onChange}
            validator={validateOutDir}
          />
        </>
      );
    }

    if ("port" in values) {
      return (
        <>
          <LabeledInput
            label="Port"
            id="port"
            name="port"
            placeholder="3000"
            value={String(values.port) || ""}
            onChange={onChange}
            validator={validatePort}
          />
        </>
      );
    }

    return null;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Redeploy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CardHeader>
          <h1 className="text-2xl font-bold mb-2">Redeploy</h1>
          <ErrorCard error={error} />
        </CardHeader>
        <div className="my-6 space-y-4 px-5">{renderInputs()}</div>
        <DialogFooter>
          <Button onClick={handleRedeployment}>
            {isLoading ? <Loader2 /> : "Redeploy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
