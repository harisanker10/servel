"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EnvVariable = {
  key: string;
  value: string;
};

export function EnvVariableCard({
  envs,
  setEnvs,
}: {
  envs: Record<string, string>[];
  setEnvs: Dispatch<SetStateAction<Record<string, string>[]>>;
}) {
  const addVariable = () => {
    setEnvs([...envs, { key: "", value: "" }]);
  };

  const removeVariable = (index: number) => {
    setEnvs(envs.filter((_, i) => i !== index));
  };

  const updateVariable = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const updatedVariables = [...envs];
    updatedVariables[index] = {};
    updatedVariables[index][field] = value;
    setEnvs(updatedVariables);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {envs.map((variable, index) => (
            <div key={index} className="flex items-end space-x-4">
              <div className="flex-grow space-y-2">
                <Label htmlFor={`key-${index}`}>Key</Label>
                <Input
                  id={`key-${index}`}
                  value={variable.key}
                  onChange={(e) => updateVariable(index, "key", e.target.value)}
                  placeholder="NEXT_PUBLIC_API_URL"
                />
              </div>
              <div className="flex-grow space-y-2">
                <Label htmlFor={`value-${index}`}>Value</Label>
                <Input
                  id={`value-${index}`}
                  value={variable.value}
                  onChange={(e) =>
                    updateVariable(index, "value", e.target.value)
                  }
                  placeholder="https://api.example.com"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeVariable(index)}
                className="mb-0.5"
                aria-label="Remove variable"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={addVariable} className="mt-4" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Variable
        </Button>
      </CardContent>
    </Card>
  );
}
