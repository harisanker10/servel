import { ChangeEvent, useState } from "react";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";

interface LabeledInputProps {
  label: string;
  id: string;
  name: string;
  value: string | number;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
  validator?: (value: string) => string | null | Promise<string | null>;
  disabled?: boolean;
}

export function LabeledInput({
  label,
  id,
  name,
  value,
  placeholder,
  onChange,
  rightElement,
  validator,
  disabled = false,
  ...rest
}: LabeledInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const renderError = () => {
    if (isLoading) {
      return <Loader2 />;
    }
    if (error) {
      return <p className="text-red-500 text-sm">{error}</p>;
    }
  };
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="w-60">
          {label}
        </Label>
        <div className="flex gap-2 flex-grow">
          <Input
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onBlur={async (e) => {
              if (validator) {
                setIsLoading(true);
                const error = await validator(e.target.value);
                console.log({ error });
                setIsLoading(false);
                setError(error);
              }
            }}
          />
          {rightElement}
        </div>
      </div>
      {renderError()}
    </div>
  );
}
