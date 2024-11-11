"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RouterProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouteChange = (url: string) => {};

    handleRouteChange(pathname + searchParams);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
  }, [pathname, searchParams]);

  return "elonma";
}
