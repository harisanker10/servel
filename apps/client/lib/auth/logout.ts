"use server";
import { cookies } from "next/headers";

export async function logout() {
  cookies().delete("sub");
  return true;
}
