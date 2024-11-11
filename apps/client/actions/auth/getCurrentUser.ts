"use server";

import { cookies } from "next/headers";

export async function getCurrentUser() {
  const access_token = cookies().get("session")?.value;
  const user = await fetch(`${process.env.API_GATEWAY_URL}/`);
}
