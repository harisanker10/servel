"use client";

import { ChangeEvent, forwardRef, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface LabeledInputProps {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  rightElement?: React.ReactNode;
  onBlurValidator?: (value: string) => Promise<string | null>;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
  readonly?: boolean;
  className?: string;
}

export const LabeledInput = forwardRef<HTMLInputElement, LabeledInputProps>(
  (
    {
      label,
      id,
      name,
      placeholder,
      onChange,
      rightElement,
      onBlurValidator,
      disabled = false,
      required = false,
      error: externalError,
      defaultValue = "",
      readonly = false,
      className,
    },
    ref,
  ) => {
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);

    // Combine external ref with internal ref
    const inputRef = (ref as any) || internalRef;

    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
      if (!onBlurValidator) return;

      setIsLoading(true);
      setValidationError("");
      try {
        const error = await onBlurValidator(e.target.value);
        setValidationError(error);
      } catch (err) {
        setValidationError("Validation failed");
      } finally {
        setIsLoading(false);
      }
    };

    // Display either external or validation error
    const displayError = externalError || validationError;

    return (
      <div className={cn("space-y-2 w-full", className)}>
        <div className="flex items-start gap-2">
          <Label
            htmlFor={id}
            className="w-60 pt-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <div className="flex-grow space-y-1">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                id={id}
                name={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={onChange}
                readOnly={readonly}
                disabled={disabled}
                required={required}
                onBlur={handleBlur}
                className={cn(
                  "flex-grow",
                  displayError &&
                    "border-destructive focus-visible:ring-destructive",
                )}
                aria-invalid={!!displayError}
                aria-describedby={displayError ? `${id}-error` : undefined}
              />
              {rightElement}
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">Validating...</span>
              </div>
            ) : (
              displayError && (
                <p id={`${id}-error`} className="text-sm text-destructive">
                  {displayError}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    );
  },
);

LabeledInput.displayName = "LabeledInput";
