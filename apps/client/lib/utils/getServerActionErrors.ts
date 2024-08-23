import { AxiosError } from "axios";

export function getServerActionErrors(err: AxiosError | any): string | null {
  const serverMessage = (err?.response?.data as any)?.message;
  if (typeof serverMessage === "string") {
    return serverMessage;
  }
  return null;
}
