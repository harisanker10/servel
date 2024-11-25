"use client";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Dispatch, SetStateAction, useEffect } from "react";
import { getRepoNameFromUrl } from "@/lib/getRepoName";
import { ProjectType } from "@servel/common/types";
import DeploymentDetailsFormDetails, {
  DeploymentDetailsFormValues,
} from "./renderDeploymentDetailsFormFields";

export function DeploymentDetails({
  serviceType,
  values,
  onChange,
}: {
  serviceType: ProjectType;
  values: DeploymentDetailsFormValues;
  onChange: Dispatch<SetStateAction<DeploymentDetailsFormValues>>;
}) {
  useEffect(() => {
    onChange({ ...values, name: getRepoNameFromUrl(values.repoUrl) ?? "" });
  }, [values.repoUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Details</CardTitle>
        <CardDescription>
          Enter the details for your deployment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {
          <DeploymentDetailsFormDetails
            values={values}
            serviceType={serviceType}
            onChange={onChange}
          />
        }
      </CardContent>
    </Card>
  );
}
