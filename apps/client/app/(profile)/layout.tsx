import { Navbar } from "@/components/navbar/navbar";
import SideBar from "@/components/sidebar";
import { getUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    console.log({ user });
    redirect("/login");
  }

  return (
    <>
      <div className="mx-auto h-screen flex flex-col items-center">
        <Navbar />
        <div className="flex w-full">
          <SideBar />
          {children}
        </div>
        <div className="w-full h-40">Footer</div>
      </div>
    </>
  );
}
