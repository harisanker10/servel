"use client";
import GoogleSignInBtn from "@/components/oAuthButtons/googleSignUp";
import SignupForm from "./signupForm";
import { Separator } from "@/components/ui/separator";
import { useRef, useState } from "react";
import GithubSignInBtn from "@/components/oAuthButtons/githubSignInBtn";
import OtpInput from "@/components/otpInput";
import { ResendOtp } from "../forgotpassword/resendOtp";
import { useTimer } from "@/hooks/useTimer";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { signup } from "@/actions/auth/signup";
import { checkUserExist } from "@/actions/auth/checkUserExist";
import { sendOtpEmail } from "@/actions/auth/sendOtpEmail";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth/getUser";
import ErrorCard from "@/components/errorCard";

export default function SignupPage() {
  const [isEmailVerification, setIsEmailVerification] = useState(false);
  const router = useRouter();
  const [values, setValues] = useState<{
    email: string;
    password: string;
    confirmPassword: string;
  }>({ email: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { reset, start: startTimer, formattedTime, expired } = useTimer();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const renderOtpCard = () => {
    return (
      <>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">OTP</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 w-full mx-auto text-center">
          Otp sent to {values.email}
        </p>
        {error && (
          <div className="space-y-4 flex items-center justify-center bg-red-200 text-red-600 py-4 rounded-md  shadow">
            {error}
          </div>
        )}
        <OtpInput value={otp} onChange={setOtp} length={6} />
        <div className="flex justify-between items-center">
          <ResendOtp
            email={values.email}
            onSuccess={(data) => {
              reset(data.expiresIn);
            }}
          />

          {formattedTime && <div className="w-10 text-sm">{formattedTime}</div>}
        </div>
        <Button
          className="w-full"
          onClick={async () => {
            setIsLoading(true);
            const data = await signup(values.email, values.password, otp);
            //@ts-ignore
            if (data?.statusCode === 401) {
              setError("Invalid Otp. Try again.");
            }
            setIsLoading(false);
          }}
        >
          {isLoading ? <Spinner /> : "Verify"}
        </Button>
      </>
    );
  };

  const startVerification = async () => {
    console.log("starting verification................");
    setError(null);
    try {
      const existingUserRes = await checkUserExist(values.email);
      if (existingUserRes && existingUserRes.exist) {
        setError("User already exist");
        return;
      }
      const data = await sendOtpEmail(values.email);
      if ("expiresIn" in data) {
        startTimer(data.expiresIn as Date);
      }
      setIsEmailVerification(true);
    } catch (error: any) {
      console.log({ error });
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSignupForm = () => {
    return (
      <>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email below to register an account
          </p>
        </div>
        <ErrorCard error={error} />
        <SignupForm
          values={values}
          setValues={setValues}
          setError={setError}
          onSubmit={async () => {
            await startVerification();
          }}
        />
        <Separator />
        <div className="w-full flex gap-2">
          <GoogleSignInBtn intent="signup" />
          <GithubSignInBtn intent="signup" />
        </div>
      </>
    );
  };
  return (
    <>
      <div className="max-w-md animate-fade-in space-y-6 p-14 rounded-lg shadow-md border border-light">
        <div className="space-y-4">
          {isEmailVerification ? renderOtpCard() : renderSignupForm()}
        </div>
      </div>
    </>
  );
}
