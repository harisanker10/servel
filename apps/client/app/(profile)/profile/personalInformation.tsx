"use client";
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
import { updateFullName } from "@/actions/user/updateFullName";
import {
  Cross,
  CrossIcon,
  Github,
  Loader2,
  Mail,
  Pencil,
  RotateCcwIcon,
  Undo,
  Undo2,
  X,
} from "lucide-react";
import { useState } from "react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OtpInput from "@/components/otpInput";
import UpdateEmailBtn from "./updateEmailBtn";

export function PersonalInfoCard({
  email,
  fullname,
  githubId,
}: {
  email: string;
  fullname: string;
  githubId: string;
}) {
  const [updatedName, setUpdatedName] = useState(fullname);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
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
            <div className="flex gap-2 items-center">
              <div className="relative w-full flex items-center ">
                <Input
                  id="name"
                  type="text"
                  className="w-full"
                  value={updatedName}
                  onChange={(e) => {
                    setUpdatedName(e.target.value);
                  }}
                />
                <Button
                  variant="icon"
                  className={`right-0 absolute ${fullname === updatedName ? "hidden" : null}`}
                  onClick={() => setUpdatedName(fullname)}
                >
                  <RotateCcwIcon className="mr-2 h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                disabled={updatedName === fullname}
                onClick={() => {
                  updateFullName(updatedName).then((data) => {
                    console.log({ data });
                    router.refresh();
                    toast({
                      variant: "success",
                      title: "Success",
                      description: "Fullname updated successfully",
                    });
                  });
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="email"
                type="email"
                className="w-full appearance-none"
                defaultValue={email}
                disabled
              />
              <UpdateEmailBtn />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Github</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="github"
                type="text"
                className="w-full"
                defaultValue={githubId}
                disabled
              />
              <Button variant="outline">
                <Github className="mr-2 h-4 w-4" />
                {githubId ? "Change Github account" : "Add Github account"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
