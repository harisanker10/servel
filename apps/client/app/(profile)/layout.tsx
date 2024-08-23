import { Navbar } from "@/components/navbar/navbar";
import SideBar from "@/components/sidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
