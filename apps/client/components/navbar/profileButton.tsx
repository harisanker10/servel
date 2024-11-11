"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { logout } from "@/lib/auth/logout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SettingsIcon from "../icons/settings";
import { LogOut, ReceiptIcon, UserRoundCog } from "lucide-react";

export default function ProfileButton({
  user,
}: {
  user: { email: string; avatar: string };
}) {
  console.log({ userrrrrrrrrrr: user.avatar });
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user?.avatar || ""} alt="profile picture" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuLabel className="p-4">{user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile" className="flex">
              <UserRoundCog className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ReceiptIcon className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-400 data-[highlighted]:bg-red-400"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
