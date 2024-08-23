import { AxiosError } from "axios";

export interface ApiError {
  error: true;
  message: string;
}

export function formatApiError(err: AxiosError): ApiError {
  const responseData = err.response?.data;
  if (typeof responseData === "object") {
    return { message: "Something went wrong.", ...responseData, error: true };
  }
  return { message: "Something went wrong", error: true };
}
