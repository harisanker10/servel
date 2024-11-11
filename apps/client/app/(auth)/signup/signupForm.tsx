"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/spinner";
import { PasswordInput } from "@/components/password-input";

interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm({
  values,
  setValues,
  setError,
  onSubmit,
}: {
  values: SignupFormValues;
  setValues: Dispatch<SetStateAction<SignupFormValues>>;
  setError: Dispatch<SetStateAction<string | null>>;
  onSubmit: () => any;
}) {
  useEffect(() => {
    setIsLoading(false);
  }, []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setValues(() => ({ ...values, [event.target.name]: event.target.value }));
  };

  const validate = () => {
    if (values.password !== values.confirmPassword) {
      setError("Password doesn't match.");
      return false;
    }
    let passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(values.password)) {
      setError("Enter a strong password.");
      return false;
    }

    if (!values.email.includes("@") || values.email.length < 8) {
      setError("Enter a valid Email address.");
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={values.email}
          placeholder="john@example.com"
          onChange={handleInput}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          value={values.password}
          onChange={handleInput}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirm">Confirm Password</Label>
        <PasswordInput
          id="confirm"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleInput}
          required
        />
      </div>
      <Button
        className="w-full"
        onClick={async () => {
          if (validate()) {
            setIsLoading(true);
            await onSubmit();
            setIsLoading(false);
          }
        }}
      >
        {isLoading ? <Spinner /> : "Sign Up"}
      </Button>
    </>
  );
}
