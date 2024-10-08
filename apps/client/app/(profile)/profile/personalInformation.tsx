import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function PersonalInfoCard({
  email,
  fullname,
  githubId,
}: {
  email: string;
  fullname: string;
  githubId: string;
}) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              className="w-full"
              defaultValue={fullname}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="w-full"
              defaultValue={email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Github</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="github"
                type="text"
                className="w-full"
                defaultValue={githubId}
              />
              <Button size="sm">Add Github</Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" disabled>
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
