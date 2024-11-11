"use client";
import { sendOtpEmail } from "@/actions/auth/sendOtpEmail";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ResendOtp({
  email,
  onSuccess,
  onFailure,
}: {
  email: string;
  onSuccess?: (data: { success: true; expiresIn: Date }) => void;
  onFailure?: () => void;
}) {
  const [sending, setSending] = useState(false);
  return (
    <div
      className={`flex justify-between items-center ${sending && "animate-pulse"}`}
    >
      <Button
        disabled={sending}
        className="bg-background hover:underline text-primary hover:bg-background"
        onClick={async () => {
          setSending(true);
          const data = await sendOtpEmail(email);
          if (data && "error" in data) {
            if (onFailure) onFailure();
          } else {
            if (onSuccess)
              onSuccess({ success: true, expiresIn: data.expiresIn as Date });
          }
          setSending(false);
        }}
      >
        Resend otp
      </Button>
    </div>
  );
}
