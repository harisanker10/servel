"use client";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

export function DeploymentDetails({
  serviceType,
  values,
  onChange,
}: {
  serviceType: "web-service" | "static-site" | "image";
  values: Record<string, string>;
  onChange: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  const renderWebServiceForm = () => {
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: val } = e.target;
      onChange({ ...values, [name]: val });
    };
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="git-url">Git URL</Label>
            <div className="flex gap-2">
              <Input
                id="git-url"
                placeholder="https://github.com/username/repo.git"
                name="url"
                onChange={handleOnChange}
                value={values["url"] || ""}
              />
              <Button variant="outline">Select</Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="output-dir">Output Directory</Label>
            <Input
              id="output-dir"
              placeholder="/build"
              name="outDir"
              value={values["outDir"] || ""}
              onChange={handleOnChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="build-command">Build Command</Label>
            <Input
              id="build-command"
              placeholder="npm run build"
              name="buildCommand"
              value={values["buildCommand"] || ""}
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-command">Start Command</Label>
            <Input
              id="start-command"
              placeholder="npm start"
              name="runCommand"
              value={values["runCommand"] || ""}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>
          Enter the details for your deployment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{renderWebServiceForm()}</CardContent>
    </Card>
  );
}
