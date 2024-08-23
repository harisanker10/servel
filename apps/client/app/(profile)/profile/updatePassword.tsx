"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { sendOtpEmail } from "@/actions/auth/sendOtpEmail";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/spinner";
import { resetPassword } from "@/actions/auth/resetPassword";

export function UpdatePasswordCard({ email }: { email: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpIsLoading, setOtpIsLoading] = useState(false);
  const [otp, setOtp] = useState<string>();
  const { toast } = useToast();

  console.log({ password, bool: !!password });

  const handleSendOtp = async () => {
    setOtpIsLoading(true);
    const sent = await sendOtpEmail(email);
    if (sent && "error" in sent) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description:
          "The service might not be available right now. Please try again later.",
      });
    } else {
      toast({
        title: "Successful",
        description: `Otp sent successfully to email ${email}`,
      });
    }
    setOtpIsLoading(false);
  };

  const validate = () => {
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        description: "Password doesn't match.",
      });
      return false;
    }
    let passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast({
        variant: "destructive",
        description: "Enter a strong password.",
      });
      return false;
    }
    if (!otp || otp?.length < 6) {
      toast({
        variant: "destructive",
        description: "Enter a valid otp",
      });
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    const valid = validate();
    if (valid) {
      const res = await resetPassword(email, otp as string, password);
      if (res && "error" in res) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: res.message,
        });
      } else {
        toast({
          title: "Success",
          description: "Password updated successfully.",
        });
        setPassword("");
        setConfirmPassword("");
        setOtp("");
      }
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Change your password</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="otp">Otp</Label>
            <Input
              id="otp"
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full flex items-center justify-between">
        <Button variant="outline" onClick={handleSendOtp}>
          {otpIsLoading ? <Spinner /> : "Send Otp"}
        </Button>
        <Button size="sm" disabled={!password} onClick={handleResetPassword}>
          Update Password
        </Button>
      </CardFooter>
    </Card>
  );
}
