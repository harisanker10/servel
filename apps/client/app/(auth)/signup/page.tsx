"use client";
import GoogleSignInBtn from "@/components/oAuthButtons/googleSignUp";
import SignupForm from "./signupForm";
import { Separator } from "@/components/ui/separator";
import { useRef, useState } from "react";
import GithubSignInBtn from "@/components/oAuthButtons/githubSignInBtn";

export default function SignupPage() {
  const [isEmailVerification, setIsEmailVerification] = useState(false);
  return (
    <>
      <div className="px-10 max-w-md animate-fade-in space-y-6 p-14 rounded-lg shadow-lg border">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          {!isEmailVerification && (
            <p className="text-gray-500 dark:text-gray-400">
              Enter your email below to register an account
            </p>
          )}
        </div>
        <div className="space-y-4">
          <SignupForm
            setIsVerifying={setIsEmailVerification}
            isVerifying={isEmailVerification}
          />
          {!isEmailVerification && (
            <>
              <Separator />
              <div className="w-full flex gap-2">
                <GoogleSignInBtn intent="signup" />
                <GithubSignInBtn intent="signup" />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
