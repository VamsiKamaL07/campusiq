import axios from "axios";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1" });

let tokenProvider: (() => Promise<string | null>) | null = null;
export const setTokenProvider = (fn: () => Promise<string | null>) => { tokenProvider = fn; };

api.interceptors.request.use(async (config) => {
  const token = tokenProvider ? await tokenProvider() : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const errorMessage = (e: unknown): string =>
  axios.isAxiosError(e) ? (e.response?.data?.detail as string) ?? "Request failed. Please try again." : "Something went wrong.";
