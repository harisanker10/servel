import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  success: false;
}

export function throwFormattedApiError(err: AxiosError): void {
  const responseData = err.response?.data;
  console.log({ responseData });
  if (
    responseData &&
    typeof responseData === "object" &&
    "message" in responseData
  ) {
    throw new Error((responseData.message as string) || "Something went wrong");
  }
}
