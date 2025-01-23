"use client";
import { useEffect, useState } from "react";
import { SelectProjectTypeCard } from "./selectServiceCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { InstanceType, ProjectType } from "@servel/common/types";
import InstanceTypeSelector from "./instanceTypeSelectCard";
import { createProjectFormAction } from "@/actions/projects/createProject";
import DeploymentDetailsForm, {
  DeploymentDetailsFormValues,
} from "./deploymentDetailsForm";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function CreateDeployment() {
  // const [projectData, setProjectData] = useState(initialValues);
  const { toast } = useToast();
  const router = useRouter();
  const [serverState, formAction] = useFormState(
    createProjectFormAction,
    undefined,
  );

  useEffect(() => {
    console.log({ serverState });
    if (!serverState) return;
    if (serverState?.success) {
      toast({
        variant: "success",
        title: "Created project successfully",
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    }
  }, [serverState]);
  const { pending, data, method, action } = useFormStatus();

  const [projectType, setProjectType] = useState(ProjectType.WEB_SERVICE);

  return (
    <>
      <form action={formAction}>
        <div className="flex flex-col mx-auto w-3/4 gap-8 p-6 sm:p-10">
          <div>
            <h2 className="flex-1 shrink-0 whitespace-nowrap text-2xl font-semibold tracking-tight sm:grow-0">
              Create a new Project
            </h2>
          </div>
          <SelectProjectTypeCard
            projectType={projectType}
            onChange={(projectType) => setProjectType(projectType)}
            // setProjectType={(projectType) =>
            //   setProjectData({ ...projectData, projectType })
            // }
          />
          <Separator />
          <DeploymentDetailsForm
            projectType={projectType}
            onChange={(projectType) => setProjectType(projectType)}
            // values={projectData.data}
            // onChange={(values) =>
            //   setProjectData({ ...projectData, data: values })
            // }
            // serviceType={projectData.projectType}
          />
          <Separator />
          <InstanceTypeSelector
            projectType={projectType}
            // instanceType={projectData.instanceType}
            // projectType={projectData.projectType}
            // onChange={(instance) =>
            //   setProjectData({ ...projectData, instanceType: instance })
            // }
          />
          <Button className="ms-auto w-32 mb-10" type="submit">
            {pending ? <Loader2 className="w-2 h-2 mr" /> : "Create Project"}
          </Button>
        </div>
      </form>
    </>
  );
}

const initialValues: {
  name: string;
  projectType: ProjectType;
  instanceType: InstanceType;
  data: DeploymentDetailsFormValues;
  env: undefined;
} = {
  name: "",
  projectType: ProjectType.WEB_SERVICE,
  instanceType: InstanceType.TIER_0,
  data: {
    buildCommand: "",
    name: "",
    outDir: "",
    port: 0,
    repoUrl: "",
    runCommand: "",
  },
  env: undefined,
};
