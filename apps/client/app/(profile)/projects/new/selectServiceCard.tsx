"use client";

import {
  Card as div,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProjectType } from "@servel/common/types";
import { Container, PanelTop, Server } from "lucide-react";
import { useState } from "react";

export function SelectProjectTypeCard({
  projectType,
  onChange,
}: {
  projectType: ProjectType;
  onChange: (service: ProjectType) => void;
}) {
  const serviceTypes = [
    {
      value: ProjectType.WEB_SERVICE,
      title: "Web Service",
      description:
        "Deploy a dynamic application that interacts with users and processes data.",
      icon: <Server />,
    },
    {
      value: ProjectType.STATIC_SITE,
      title: "Static Site",
      description:
        "Showcase your work with a fast, responsive, and visually appealing website.",
      icon: <PanelTop />,
    },
    {
      value: ProjectType.IMAGE,
      title: "Image",
      description:
        "Utilize pre-built software packages to streamline your project.",
      icon: <Container />,
    },
  ];

  return (
    <>
      <div className="py-2">
        <CardHeader>
          <CardTitle className="text-l">Chose a service type</CardTitle>
          <CardDescription>
            Select the type of the service you want to deploy.
          </CardDescription>
        </CardHeader>
        <RadioGroup
          name="projectType"
          defaultValue={ProjectType.WEB_SERVICE}
          onValueChange={(value) => onChange(value as ProjectType)}
        >
          <CardContent className="grid grid-cols-1 gap-2 p-4 md:grid-cols-3">
            {serviceTypes.map((type) => (
              <Label htmlFor={type.value}>
                <div
                  className={`shadow-sm border rounded-lg hover:bg-secondary ${type.value === projectType ? "bg-secondary" : ""}`}
                >
                  <CardHeader className="flex flex-row items-center">
                    <span className="px-3 m-0">{type.icon}</span>
                    <CardTitle className="p-0 m-0 text-xl">
                      {type.title}
                    </CardTitle>
                    <RadioGroupItem
                      className="ms-auto mx-2"
                      value={type.value}
                      id={type.value}
                    />
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{type.description}</CardDescription>
                  </CardContent>
                </div>
              </Label>
            ))}
          </CardContent>
        </RadioGroup>
      </div>
    </>
  );
}
