"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import OtpInput from "@/components/otpInput";
import { ResendOtp } from "../forgotpassword/resendOtp";
import { useTimer } from "@/hooks/useTimer";
import { useRouter } from "next/navigation";
import { checkUserExist } from "@/actions/auth/checkUserExist";
import { sendOtpEmail } from "@/actions/auth/sendOtpEmail";
import { signup } from "@/actions/auth/signup";

export default function SignupForm({
  isVerifying,
  setIsVerifying,
}: {
  isVerifying: boolean;
  setIsVerifying: Dispatch<SetStateAction<boolean>>;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const { reset, start: startTimer, formattedTime, expired } = useTimer();
  const router = useRouter();
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const validate = () => {
    if (password !== confirmPassword) {
      setError("Password doesn't match.");
      return false;
    }
    let passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError("Enter a strong password.");
      return false;
    }

    if (!email.includes("@") || email.length < 8) {
      setError("Enter a valid Email address.");
      return false;
    }
    return true;
  };

  const startVerification = async () => {
    setError(null);
    setIsLoading(true);
    if (!validate()) {
      setIsLoading(false);
      return;
    }

    const existingUser = await checkUserExist(email);
    console.log({ existingUser });
    if (existingUser) {
      setError("User already exist. Try login.");
      setIsLoading(false);
      return;
    }
    const data = await sendOtpEmail(email);
    if ("error" in data) {
      setError(data.message);
      setIsLoading(false);
      return;
    }
    if ("expiresIn" in data) {
      setIsVerifying(true);
      startTimer(data.expiresIn as Date);
    } else {
      setError("Service unavailable. Please try later.");
    }
    setIsLoading(false);
  };

  const signUp = async () => {
    setIsLoading(true);
    if (otp) {
      const data = await signup(email, password, otp);
      if (data && "error" in data) {
        setError(data.message);
        setIsLoading(false);
        return;
      } else {
        setIsVerifying(false);
        setIsLoading(false);
        router.push("/profile");
      }
    }
  };

  const renderOtpCard = () => {
    return (
      <>
        <p className="text-gray-500 dark:text-gray-400 w-full mx-auto text-center">
          Otp sent to {email}
        </p>
        {error && (
          <div className="space-y-4 flex items-center justify-center bg-red-200 text-red-600 py-4 rounded-md  shadow">
            {error}
          </div>
        )}
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
        <Button className="w-full" onClick={signUp}>
          {isLoading ? <Spinner /> : "Verify"}
        </Button>
      </>
    );
  };

  return (
    <>
      {isVerifying ? (
        renderOtpCard()
      ) : (
        <>
          {error && (
            <div className="space-y-4 flex items-center justify-center bg-red-200 text-red-600 py-4 rounded-md  shadow">
              {error}
            </div>
          )}
          <div className="space-y-1">
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
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              name="confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" onClick={startVerification}>
            {isLoading ? <Spinner /> : "Sign Up"}
          </Button>
        </>
      )}
    </>
  );
}
