import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  return (
    <>
      <Button variant="link" asChild>
        <Link
          href="/login"
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors `}
          prefetch={false}
        >
          Login
        </Link>
      </Button>
      <Button asChild>
        <Link
          href="/signup"
          className={`rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90`}
          prefetch={false}
        >
          Sign Up
        </Link>
      </Button>
    </>
  );
}
