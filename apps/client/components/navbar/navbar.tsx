import Link from "next/link";
import AuthButtons from "./authButtons";
import ProfileButton from "./profileButton";
import DarkModeBtn from "./themeSwitchBtn";
import { getCookie } from "@/lib/session/getSession";
import { getUser } from "@/lib/auth/getUser";

export async function Navbar() {
  const user = await getUser();

  const renderButtons = () => {
    if (user) {
      return <ProfileButton user={user} />;
    } else {
      return <AuthButtons />;
    }
  };

  return (
    <header className="flex w-full items-center py-3 z-10 shadow-sm sticky top-0 justify-between border-b px-8 sm:px-6 md:px-40 transition-colors bg-background">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="text-lg font-semibold">Servel</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <DarkModeBtn />
        {renderButtons()}
      </div>
    </header>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
