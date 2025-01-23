import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InstanceType } from "@servel/common";

const tiers = [
  {
    title: "Free",
    value: 0,
    price: "$0/month",
    ram: "512 MB",
    cpu: "0.1 CPU",
  },
  {
    title: "Starter",
    value: 1,
    price: "$5/month",
    ram: "512 MB",
    cpu: "0.5 CPU",
  },
  {
    title: "Standard",
    value: 2,
    price: "$20/month",
    ram: "2 GB",
    cpu: "1 CPU",
  },
];

export default function InstanceTypeSelector({
  onChange,
}: {
  onChange: (instance: InstanceType) => void;
}) {
  const [selectedTier, setSelectedTier] = useState(0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Instance Type</CardTitle>
        <CardDescription>
          Choose the instance type that best fits your needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedTier.toString()}
          onValueChange={(value) => setSelectedTier(parseInt(value))}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {tiers.map((tier) => (
              <div key={tier.value}>
                <RadioGroupItem
                  value={tier.value.toString()}
                  id={`tier-${tier.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`tier-${tier.value}`}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-secondary [&:has([data-state=checked])]:bg-secondary"
                >
                  <div className="text-center mb-4">
                    <h3 className="font-semibold">{tier.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tier.price}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>RAM: {tier.ram}</p>
                    <p>CPU: {tier.cpu}</p>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
