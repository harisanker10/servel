import { CardRadioGroup } from "@/components/cardRadio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dispatch, SetStateAction } from "react";

export function InstanceTypeSelectCard({
  instance,
  onInstanceChange,
}: {
  instance: string;
  onInstanceChange: Dispatch<SetStateAction<string>>;
}) {
  const tiers = [
    {
      title: "Free",
      value: "tier-0",
      price: "$0/month",
      ram: "512 MB",
      cpu: "0.1 CPU",
    },
    {
      title: "Starter",
      value: "tier-1",
      price: "$5/month",
      ram: "512 MB",
      cpu: "0.5 CPU",
    },
    {
      title: "Standard",
      value: "tier-2",
      price: "$20/month",
      ram: "2 GB",
      cpu: "1 CPU",
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instance Type</CardTitle>
      </CardHeader>
      <CardRadioGroup
        values={tiers}
        value={instance}
        onValueChange={onInstanceChange}
      />
    </Card>
  );
}
