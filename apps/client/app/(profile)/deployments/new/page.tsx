"use client";
import { useEffect, useState } from "react";
import { SelectServiceCard } from "./selectServiceCard";
import { DeploymentDetails, FormValues } from "./deploymentDetails";
import { Button } from "@/components/ui/button";
import { createDeployment } from "@/actions/deployments/createDeployment";
import { useRouter } from "next/navigation";
import { EnvVariableCard } from "@/components/env-variable-card";
import { useToast } from "@/components/ui/use-toast";
import { InstanceType, ProjectType } from "@servel/common";
import InstanceTypeSelector from "./instanceTypeSelectCard";

const getInitialValues = (service: ProjectType): FormValues => {
  switch (service) {
    case ProjectType.WEB_SERVICE:
      return {
        name: "",
        repoUrl: "",
        buildCommand: "",
        runCommand: "",
        port: 0,
      };
    case ProjectType.STATIC_SITE:
      return {
        name: "",
        repoUrl: "",
        buildCommand: "",
        outDir: "",
      };
    case ProjectType.IMAGE:
      return {
        name: "",
        repoUrl: "",
        port: 0,
      };
  }
};

export default function CreateDeployment() {
  const router = useRouter();
  const [service, setService] = useState<ProjectType>(ProjectType.WEB_SERVICE);
  const [instanceType, setInstanceType] = useState<InstanceType>(
    InstanceType.TIER_0,
  );
  const [envs, setEnvs] = useState<Record<"key" | "value", string>[]>([]);
  const { toast } = useToast();
  const [values, setValues] = useState<FormValues>(getInitialValues(service));

  console.log({ service });
  useEffect(() => {
    const { name, repoUrl } = values;
    setValues({ ...getInitialValues(service), name, repoUrl });
  }, [service]);
  const deploy = async () => {
    if (
      Object.values(values).includes("") ||
      Object.values(values).includes(0)
    ) {
      toast({
        title: "Deployment Failed",
        description: "Please enter all fields.",
        variant: "destructive",
      });
      return;
    }
    createDeployment({
      name: values.name,
      projectType: service,
      instanceType,
      env: envs,
      //@ts-ignore
      data: {
        ...values,
      },
    }).then((data) => {
      // if (data) {
      // router.push("/deployments");
      // }
    });
  };

  return (
    <>
      <div className="flex flex-col mx-auto w-3/4 gap-8 p-6 sm:p-10">
        <div>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-2xl font-semibold tracking-tight sm:grow-0">
            Create a new deployment
          </h1>
          <span className="text-sm">
            Enter the details for your new deployment.
          </span>
        </div>
        <SelectServiceCard service={service} setService={setService} />
        <DeploymentDetails
          serviceType={service}
          values={values}
          onChange={setValues}
        />
        <EnvVariableCard envs={envs} setEnvs={setEnvs} />
        {service !== "STATIC_SITE" && (
          <InstanceTypeSelector
            onChange={(instance) => setInstanceType(instance)}
          />
        )}
        <Button className="ms-auto w-32 mb-10" onClick={deploy}>
          Deploy
        </Button>
      </div>
    </>
  );
}
