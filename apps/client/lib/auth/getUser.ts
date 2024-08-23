"use server";

import { $api } from "@/http";
import { getCookie } from "../session/getSession";

export async function getUser() {
  // const user = await $api
  //   .get("auth/user")
  //   .then((data) => data.data)
  //   .catch((err) => console.log("error getting user"));

  try {
    const token = await getCookie();
    const response = await fetch(`${process.env.API_GATEWAY_URL}/auth/user`, {
      cache: "force-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error getting user:", err);
    return null;
  }
}
