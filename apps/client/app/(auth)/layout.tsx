import { Navbar } from "@/components/navbar/navbar";
import { getUser } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user) {
    console.log({ user });
    redirect("/projects");
  }
  return (
    <>
      <div className="mx-auto h-screen flex flex-col items-center">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          {children}
        </div>
      </div>
    </>
  );
}
