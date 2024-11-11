import { getCookie } from "@/lib/session/getSession";
import axios, { AxiosError } from "axios";

export const $api = axios.create({
  baseURL: process.env.API_GATEWAY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

$api.interceptors.request.use(async function (config) {
  const token = await getCookie();
  if (token) config.headers.Authorization = token;

  return config;
});
