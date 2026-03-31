import axios from "axios";
import { jotaiStore } from "@/main";
import { accessTokenAtom } from "@/store";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_REST_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token =
    jotaiStore.get(accessTokenAtom) ??
    localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
});
