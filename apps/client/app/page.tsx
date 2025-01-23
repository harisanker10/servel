"use server";

import { getRepositories } from "@/actions/projects/getRepositories";

export default async function Home() {
  return getRepositories().then((res) => res);
}
