"use client";
import { checkUserExist } from "@/actions/auth/checkUserExist";
import updateEmail from "@/actions/user/updateEmail";
import ErrorCard from "@/components/errorCard";
import SendOtpBtn from "@/components/otp/sendOtpBtn";
import OtpInput from "@/components/otpInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logout } from "@/lib/auth/logout";
import { validateEmail, validateStrongPassword } from "@/utils/validate";
import { Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function UpdateEmailBtn() {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const validate = () => {
    setError(null);
    if (!validateEmail(email)) {
      setError("Invalid email");
      return false;
    }
    return true;
  };

  const handleUpdateEmail = async () => {
    if (!validate()) return;
    const existingUser = await checkUserExist(email);
    if (existingUser && existingUser?.exist) {
      setError("User already exist");
      return null;
    }
    try {
      await updateEmail(email, otp);
      await logout();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Dialog
      onOpenChange={(e) => {
        if (e) setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Change
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Email Address</DialogTitle>
          <DialogDescription>
            Enter your new email address. You'll need to verify this email.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="new-email">New Email Address</Label>
          <Input
            id="new-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="otp">Otp</Label>
          <Input
            id="otp"
            type="number"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            required
          />
        </div>
        <ErrorCard error={error} />
        <div className="flex justify-between">
          <SendOtpBtn email={email} validator={validate} />
          <Button disabled={isLoading} onClick={handleUpdateEmail}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
