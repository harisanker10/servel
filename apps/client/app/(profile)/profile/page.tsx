import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth/getUser";
import { PersonalInfoCard } from "./personalInformation";
import { UpdatePasswordCard } from "./updatePassword";

export default async function Profile() {
  const user = await getUser();
  console.log({ user });
  return (
    <>
      <div className="min-h-screen w-3/4 items-start flex flex-col gap-4 mx-auto px-8 py-10">
        <h1 className="flex-1 shrink-0 whitespace-nowrap flex-wrap text-2xl font-semibold tracking-tight sm:grow-0">
          Profile
        </h1>
        {
          //<div className="grid gap-6 grid-cols-5 w-full h-auto items-start">
        }
        <div className="flex flex-col gap-5 w-full h-auto items-start">
          <div className="h-auto w-full bg-card">
            <PersonalInfoCard
              email={user?.email}
              fullname={user?.fullname}
              githubId={user?.githubId}
            />
          </div>
          <div className="h-auto w-full">
            <UpdatePasswordCard email={user.email} />
          </div>
          <Card className="h-auto w-full">
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>
                Edit your billing account details
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}
