"use client";
import {
  Arrow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Link from "next/link";
import UserIcon from "../icons/user";
import PackageIcon from "../icons/packageIcon";
import MonitorDotIcon from "../icons/monitoDtoIcon";
import SettingsIcon from "../icons/settings";
import { useParams, usePathname, useSearchParams } from "next/navigation";
export default function SideBar() {
  const path = usePathname();

  const activeStyle = "bg-accent text-accent-foreground";
  const inactiveStle = "text-muted-foreground";

  return (
    <aside className="sticky top-0 flex w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Link
            href="/profile"
            className={`flex h-9 w-9 ${path === "/profile" ? activeStyle : inactiveStle} items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
          >
            <UserIcon className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Profile</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/deployments"
                className={`flex h-9 w-9 ${path === "/deployments" ? activeStyle : inactiveStle} items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <PackageIcon className="h-6 w-6" />
                <span className="sr-only">Deployments</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="relative left-2 text-sm bg-secondary rounded-md p-2"
            >
              Deployments
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={`flex h-9 w-9 ${path === "/metrics" ? activeStyle : inactiveStle} items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <MonitorDotIcon className="h-5 w-5 bg-red" />
                <span className="sr-only">Metrics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="relative left-2 text-sm bg-secondary rounded-md p-2"
            >
              Metrics
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <SettingsIcon className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className="relative left-2 text-sm bg-secondary rounded-md p-2"
              side="right"
            >
              Settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
