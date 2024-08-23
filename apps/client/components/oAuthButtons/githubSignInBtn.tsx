"use client";
import GitHubIcon from "@/components/icons/github";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function GithubSignInBtn({
  intent = "login",
  disabled,
}: {
  intent: "login" | "signup" | "addOauth";
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setIsLoading(true);
  };
  return (
    <Button
      variant="outline"
      className="w-1/2 flex items-center justify-center gap-2"
      onClick={handleClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <GitHubIcon />
          Github
        </>
      )}
    </Button>
  );
}
