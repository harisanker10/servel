"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthErrorCard from "@/components/errorCard";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Spinner from "@/components/spinner";
import Link from "next/link";
import { getServerActionErrors } from "@/lib/utils/getServerActionErrors";
import { login } from "@/actions/auth/login";
import GoogleSignInBtn from "@/components/oAuthButtons/googleSignUp";
import GithubSignInBtn from "@/components/oAuthButtons/githubSignInBtn";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleLogin = async () => {
    setIsLoading(true);
    const res = await login(email, password);
    if (res && "error" in res) {
      setError(res.message);
      setIsLoading(false);
    } else {
      router.push("/profile");
      setIsLoading(false);
    }
  };

  return (
    <div className="px-10 max-w-md animate-fade-in space-y-6 p-14 rounded-lg shadow-lg border">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email below to login to your account
        </p>
      </div>
      <AuthErrorCard error={error} />

      <>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={email}
            placeholder="m@example.com"
            onChange={handleInput}
            required
          />
        </div>
        <div className="">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href={"/forgotpassword"}>
              <Button className="outline-none bg-background hover:bg-background hover:underline text-primary">
                Forgot password?
              </Button>
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button className="w-full" onClick={handleLogin}>
          {isLoading ? <Spinner /> : "Login"}
        </Button>
      </>
      <div>
        <div className="w-full flex gap-2">
          <GoogleSignInBtn intent="login" disabled={isLoading} />
          <GithubSignInBtn intent="login" disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
