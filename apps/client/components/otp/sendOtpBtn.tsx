import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { sendOtpEmail } from "@/actions/auth/sendOtpEmail";
import { Button } from "../ui/button";
import Spinner from "../spinner";

export default function SendOtpBtn({
  email,
  validator,
}: {
  email: string;
  validator: () => boolean;
}) {
  const { toast } = useToast();
  const [otpIsLoading, setOtpIsLoading] = useState(false);
  const handleSendOtp = async () => {
    if (!validator()) return;
    setOtpIsLoading(true);
    try {
      const sent = await sendOtpEmail(email);
      console.log({ sent });
      toast({
        variant: "success",
        title: "Successful",
        description: `Otp sent successfully to email ${email}`,
      });
    } catch (err) {
      console.log({ err });
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description:
          "The service might not be available right now. Please try again later.",
      });
    } finally {
      setOtpIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleSendOtp}>
      {otpIsLoading ? <Spinner /> : "Send Otp"}
    </Button>
  );
}
