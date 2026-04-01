import axios from "axios";
import { authStorage } from "@/lib/authStorage";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_REST_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
});
