"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import OtpInput from "@/components/otpInput";
import { ResendOtp } from "./resendOtp";
import { useTimer } from "@/hooks/useTimer";
import { useRouter } from "next/navigation";
import ErrorCard from "@/components/errorCard";
import { sendOtpEmail } from "@/actions/auth/sendOtpEmail";
import { verifyEmailOtp } from "@/actions/auth/verifyEmailOtp";
import { resetPassword } from "@/actions/auth/resetPassword";
import { checkUserExist } from "@/actions/auth/checkUserExist";
import { useToast } from "@/components/ui/use-toast";
import { revalidatePath } from "next/cache";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [passwords, setPasswords] = useState<
    Record<"password" | "confirmPassword", string>
  >({ password: "", confirmPassword: "" });
  const [isPasswordResetting, setIsPasswordResetting] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { formattedTime, start: startTimer, reset } = useTimer();
  const router = useRouter();

  const { toast } = useToast();

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const existingUser = await checkUserExist(email);
    if (typeof existingUser === "object" && "error" in existingUser) {
      setError(existingUser.message);
    } else {
      if (!existingUser) {
        console.log("apparaelrkj", existingUser);
        setError("User doesn't exist.");
        setIsLoading(false);
        return;
      }
    }
    const res = await sendOtpEmail(email);
    if (typeof res === "object" && "error" in res) {
      setError(res.message);
    } else {
      startTimer(res.expiresIn);
      setEmailSent(true);
    }
    setIsLoading(false);
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    const res = await verifyEmailOtp(otp, email);
    console.log({ otpres: res });
    if (res && typeof res === "object" && "error" in res) {
      setError(res.message);
      setIsLoading(false);
      return;
    }
    if (res.valid) {
      setIsPasswordResetting(true);
    } else {
      setError("Invalid Otp. Try again.");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setError(null);
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    const res = await resetPassword(email, otp, passwords.password);
    console.log({ res });
    if (res && "error" in res) {
      setError(res.message);
    } else {
      console.log("password set");
      toast({
        title: "Successful",
        description: "Password updated successfully.",
      });
      router.push("/login");
    }
    setIsLoading(false);
  };

  const renderPasswordInput = () => {
    return (
      <div className="px-10 animate-fade-in max-w-md space-y-6 p-14 rounded-lg shadow-lg border">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Change Password</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {}
            Enter new password
          </p>
          <ErrorCard error={error && error} />
        </div>
        <form
          className="space-y-2 py-10 pb-4 pt-8 flex flex-col gap-4"
          onSubmit={handlePasswordSubmit}
        >
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            value={passwords.password}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, password: e.target.value }))
            }
            type="password"
            name="password"
            required
          />
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            type="password"
            name="confirm"
            required
          />
          <Button type="submit" className="w-full">
            {isLoading ? <Spinner /> : "Reset"}
          </Button>
        </form>
      </div>
    );
  };

  const renderOtpInput = () => {
    return (
      <div className="px-10 animate-fade-in max-w-md space-y-6 p-14 rounded-lg shadow-lg border">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Change Password</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your OTP</p>
        </div>
        <ErrorCard error={error && error} />

        <OtpInput value={otp} onChange={setOtp} length={6} />
        <div className="flex justify-between items-center">
          <ResendOtp
            email={email}
            onSuccess={(data) => {
              reset(data.expiresIn);
            }}
          />

          {formattedTime && <div className="w-10 text-sm">{formattedTime}</div>}
        </div>
        <Button className="w-full" onClick={handleOtpSubmit}>
          {isLoading ? <Spinner /> : "Verify"}
        </Button>
      </div>
    );
  };

  const renderEmailForm = () => {
    return (
      <div className="px-10 animate-fade-in max-w-md space-y-6 p-14 rounded-lg shadow-lg border">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Change Password</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {}
            Enter your email
          </p>
          <ErrorCard error={error && error} />
        </div>
        <form
          className="space-y-2 py-10 pb-4 pt-8 flex flex-col gap-4"
          onSubmit={handleEmailSubmit}
        >
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            placeholder="m@example.com"
            required
          />
          <Button type="submit" className="w-full">
            {isLoading ? <Spinner /> : "Send OTP"}
          </Button>
        </form>
      </div>
    );
  };

  if (isPasswordResetting) {
    return renderPasswordInput();
  }

  return emailSent ? renderOtpInput() : renderEmailForm();
}
