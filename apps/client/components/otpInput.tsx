import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

export function OtpInput({
  length = 4,
  className,
  value,
  onChange,
}: {
  length: number;
  className?: string;
  value: string;
  onChange: (newValue: string) => void;
}) {
  const ref = useRef<Array<HTMLInputElement>>([]);

  useEffect(() => {
    const first = ref.current[0] as HTMLInputElement;
    if (first.focus) {
      first.focus();
    }
  }, []);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value: inputValue } = e.target;
    console.log({ inputValue });
    if (inputValue.toString().length > 1) return;
    onChange(index === 0 ? inputValue : `${value}${inputValue}`);
    const nextSibling = ref.current[index + 1];
    if (nextSibling && nextSibling.focus) {
      nextSibling.focus();
    }
  };

  const getInputArray = (str: string): string[] => {
    const inputArray = Array(length).fill("");
    if (str !== "") {
      const digits = str.toString().split("");
      for (let i = 0; i < length; i++) {
        inputArray[i] = digits[i];
      }
      return inputArray;
    } else {
      return inputArray;
    }
  };

  const handleBackspace = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key !== "Backspace") return;
    const updatedValue = value.split("");
    updatedValue.pop();
    onChange(updatedValue.join(""));
    if (i < length - 1 || (e.target as HTMLInputElement)?.value === "") {
      const prevSibling = ref.current[i - 1];
      if (prevSibling) {
        prevSibling.value = "";
        prevSibling.focus();
      }
    }
  };

  return (
    <>
      <div className={`flex gap-2 p-4 ${className}`}>
        {getInputArray(value).map((char, i: number) => (
          <input
            key={i}
            value={Number.isInteger(parseInt(char)) ? parseInt(char) : ""}
            type="number"
            maxLength={1}
            onKeyDown={(e) => handleBackspace(e, i)}
            className={`flex h-10 w-10 items-center bg-background rounded-md justify-center border border-gray-300 text-center`}
            onChange={(e) => handleOnChange(e, i)}
            ref={(el) => (ref.current[i] = el)}
          />
        ))}
      </div>
    </>
  );
}

export default OtpInput;
