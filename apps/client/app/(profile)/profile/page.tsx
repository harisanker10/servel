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
import { getUser } from "@/lib/auth/getUser";
import { PersonalInfoCard } from "./personalInformation";
import { UpdatePasswordCard } from "./updatePassword";

export default async function Profile() {
  const user = await getUser();
  return (
    <>
      <div className="min-h-screen w-3/4 items-start flex flex-col gap-4 mx-auto px-8 py-10">
        <h1 className="flex-1 shrink-0 whitespace-nowrap flex-wrap text-2xl font-semibold tracking-tight sm:grow-0">
          Profile
        </h1>
        <div className="grid gap-6 grid-cols-5 w-full h-auto items-start">
          <div className="col-span-3 h-auto row-span-2">
            <PersonalInfoCard email={user.email} fullname={user.fullname} />
          </div>
          <div className="col-span-2 row-span-3">
            <UpdatePasswordCard email={user.email} />
          </div>
          <Card className="col-span-3 row-span-3">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>
                Edit your billing account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="password">New Password</Label>
                  <Input id="password" type="password" className="w-full" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="w-full"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="otp">Otp</Label>
                  <Input id="otp" type="number" className="w-full" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" disabled>
                Update Password
              </Button>
            </CardFooter>
          </Card>
          <Card className="col-span-2 row-span-1">
            <CardHeader>
              <CardTitle>Github</CardTitle>
              <CardDescription>Edit your github account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="password">Github Account</Label>
                  <Input id="password" type="password" className="w-full" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" disabled>
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
