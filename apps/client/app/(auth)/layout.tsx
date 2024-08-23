import { Navbar } from "@/components/navbar/navbar";

export default function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
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
