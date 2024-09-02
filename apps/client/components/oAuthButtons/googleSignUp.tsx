"use client";
import GoogleIcon from "@/components/icons/google";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { setAccessToken } from "@/lib/session/setSession";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";
import { useToast } from "../ui/use-toast";

const API_URL = "http://localhost:3001";

export default function GoogleSignInBtn({
  intent = "login",
  disabled,
}: {
  intent: "login" | "signup";
  disabled?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const handleClick = () => {
    const popup = window.open(
      `${API_URL}/auth/google?intent=${intent}`,
      "Auth",
      "width=500,height=500,status=yes,toolbar=no,menubar=no,location=no",
    );

    if (typeof window !== "undefined") {
      const handleMessage = (e: MessageEvent<any>) => {
        console.log("message", e.data);
        if (e.origin !== API_URL) return;
        const userData: any = JSON.parse(e.data);
        if (userData?.error) {
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: userData?.error,
          });
        } else {
          setAccessToken(userData.token);
          router.push("/profile");
        }
        setIsLoading(false);
        popup?.close();
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
          <GoogleIcon />
          Google
        </>
      )}
    </Button>
  );
}
