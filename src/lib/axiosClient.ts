import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_REST_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
