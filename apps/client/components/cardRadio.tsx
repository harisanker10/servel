"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Container, PanelTop, Server } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Option {
  title: string;
  value: string;
  icon?: string;
  body: ReactNode;
}

export function CardRadioGroup({
  values,
  value,
  onValueChange,
}: {
  values: Option[];
  value: string;
  onValueChange: Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <Card className="py-2">
        <CardHeader>
          <CardTitle className="text-l">Chose a service type</CardTitle>
          <CardDescription>
            Select the type of the service you want to deploy.
          </CardDescription>
        </CardHeader>
        <RadioGroup
          defaultValue={values[0]?.value}
          onValueChange={(value) => onValueChange(value)}
        >
          <CardContent className="grid grid-cols-1 gap-2 p-4 md:grid-cols-3">
            {values.map((val) => (
              <Label htmlFor={val.value}>
                <Card
                  className={`shadow-sm hover:bg-secondary ${val.value === value ? "bg-secondary" : ""}`}
                >
                  <CardHeader className="flex flex-row items-center">
                    {val.icon && <span className="px-3 m-0">{val.icon}</span>}
                    <CardTitle className="p-0 m-0 text-xl">
                      {val.title}
                    </CardTitle>
                    <RadioGroupItem
                      className="ms-auto mx-2"
                      value={val.value}
                      id={val.value}
                    />
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{val.description}</CardDescription>
                  </CardContent>
                </Card>
              </Label>
            ))}
          </CardContent>
        </RadioGroup>
      </Card>
    </>
  );
}
