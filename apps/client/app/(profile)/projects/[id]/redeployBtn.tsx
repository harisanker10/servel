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
import { LabeledInput } from "@/components/labeledInput";
import {
  validateBuildCommand,
  validateOutDir,
  validatePort,
  validateRunCommand,
} from "@/lib/validators/validators";
import { CardHeader } from "@/components/ui/card";
import ErrorCard from "@/components/errorCard";
import { redeployFormAction } from "@/actions/deployments/redeploy";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { toast } from "@/components/ui/use-toast";

const renderInputs = ({
  initialValues,
  projectType,
}: {
  projectType: ProjectType;
  initialValues: {
    projectId: string;
    data: WebServiceData | StaticSiteData | ImageData;
  };
}) => {
  switch (projectType) {
    case ProjectType.WEB_SERVICE: {
      const data = initialValues.data as WebServiceData;
      return (
        <>
          <LabeledInput
            label="Repo Url"
            id="repo-url"
            name="repoUrl"
            value={data.repoUrl}
            placeholder={data.repoUrl}
            defaultValue={data.repoUrl}
            readonly
          />
          <LabeledInput
            label="Build Command"
            id="build-command"
            name="buildCommand"
            placeholder="npm run build"
            defaultValue={data.buildCommand}
            onBlurValidator={validateBuildCommand}
          />
          <LabeledInput
            label="Run Command"
            id="run-command"
            name="runCommand"
            placeholder="npm start"
            onBlurValidator={validateRunCommand}
            defaultValue={data.runCommand}
          />
          <LabeledInput
            label="Port"
            id="port"
            name="port"
            placeholder="3000"
            onBlurValidator={validatePort}
            defaultValue={data.port.toString()}
          />
        </>
      );
    }
    case ProjectType.STATIC_SITE: {
      const data = initialValues.data as StaticSiteData;
      return (
        <>
          <LabeledInput
            label="Repo Url"
            id="repo-url"
            name="repoUrl"
            value={data.repoUrl}
            placeholder={data.repoUrl}
            defaultValue={data.repoUrl}
            disabled
          />
          <LabeledInput
            label="Build Command"
            id="build-command"
            name="buildCommand"
            placeholder="npm run build"
            defaultValue={data.buildCommand}
            onBlurValidator={validateBuildCommand}
          />
          <LabeledInput
            label="Output Directory"
            id="out-dir"
            name="outDir"
            placeholder="/build"
            onBlurValidator={validateOutDir}
            defaultValue={data.outDir}
          />
        </>
      );
    }

    case ProjectType.IMAGE:
      const data = initialValues.data as ImageData;
      return (
        <>
          <LabeledInput
            label="Image Url"
            id="image-url"
            name="imageUrl"
            placeholder="docker.io/nginx"
            value={data.imageUrl}
          />
          <LabeledInput
            label="Port"
            id="port"
            name="port"
            placeholder="3000"
            value={data.port}
            onBlurValidator={validatePort}
          />
        </>
      );

    default:
      return null;
  }
};

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
  const [serverState, formAction] = useFormState(redeployFormAction, undefined);

  console.log({ initialValues });
  useEffect(() => {
    if (!serverState) return;
    if (serverState?.success) {
      toast({
        variant: "success",
        title: "Redeploying project",
      });
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    }
  }, [serverState]);

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
        <form action={formAction}>
          <div className="my-6 space-y-4 px-5">
            <input name="projectId" value={initialValues.projectId} hidden />
            <input name="projectType" value={projectType} hidden />
            {renderInputs({ projectType, initialValues })}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 /> : "Redeploy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
