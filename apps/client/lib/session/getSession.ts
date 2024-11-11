"use server";
import { cookies } from "next/headers";
export async function getCookie() {
  const token = cookies().get("sub")?.value;
  return token;
}
