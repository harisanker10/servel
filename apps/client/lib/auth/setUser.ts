"use client";

export function setUser(user: Record<string, any>) {
  localStorage.setItem("user", JSON.stringify(user));
}
