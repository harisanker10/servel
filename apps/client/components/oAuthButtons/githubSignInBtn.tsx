"use client";
import GitHubIcon from "@/components/icons/github";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { setAccessToken } from "@/lib/session/setSession";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3001";
export default function GithubSignInBtn({
  intent = "login",
  disabled,
}: {
  intent: "login" | "signup" | "addOauth";
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    const popup = window.open(
      `${API_URL}/auth/github?intent=${intent}`,
      "Auth",
      "width=500,height=500,status=yes,toolbar=no,menubar=no,location=no",
    );

    if (typeof window !== "undefined") {
      const handleMessage = (e: MessageEvent<any>) => {
        console.log("message");
        if (e.origin !== API_URL) return;
        const userData: any = JSON.parse(e.data);
        if (userData?.error) {
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: userData?.error,
          });
        } else {
          popup?.close();
          setAccessToken(userData.token);
        }
        setIsLoading(false);
        window.removeEventListener("message", handleMessage);
      };
      window.addEventListener("message", handleMessage);
    }

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
