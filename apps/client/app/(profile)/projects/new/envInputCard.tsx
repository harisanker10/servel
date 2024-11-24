"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EnvCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Env</CardTitle>
        <CardDescription>Enter your enviornment variables</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
