"use client";
import { FormEvent, useState } from "react";
import { SelectServiceCard } from "./selectServiceCard";
import { DeploymentDetails } from "./deploymentDetails";
import { EnvCard } from "./envInputCard";
import { Button } from "@/components/ui/button";
import { InstanceTypeSelectCard } from "./instanceTypeSelectCard";
import { createDeployment } from "@/actions/deployments/createDeployment";

interface FormValues {
  url: string;
  outDir: string;
  buildCommand: string;
  runCommand: string;
}

export default function CreateDeployment() {
  const [service, setService] = useState<
    "web-service" | "static-site" | "image"
  >("web-service");
  const [instanceType, setInstanceType] = useState("tier_0");
  const [envs, setEnvs] = useState<Record<string, string>>({});
  const [values, setValues] = useState<FormValues>({
    url: "",
    outDir: "",
    runCommand: "",
    buildCommand: "",
  });

  const deploy = () => {
    const deployment = {
      ...values,
      instanceType,
    };
    //@ts-ignore
    createDeployment({
      instanceType,
      ...values,
      envs,
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
        <EnvCard />
        {service !== "static-site" && (
          <InstanceTypeSelectCard
            instance={instanceType}
            onInstanceChange={setInstanceType}
          />
        )}
        <Button className="ms-auto w-32 mb-10" onClick={deploy}>
          Deploy
        </Button>
      </div>
    </>
  );
}
