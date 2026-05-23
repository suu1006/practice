import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "@/features/auth/types";
import { useAuthStore } from "@/stores/auth-store";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const publicHttp = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10_000
});

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10_000
});

let refreshPromise: Promise<AuthResponse> | null = null;
const REFRESH_EXCLUDED_URLS = ["/auth/login", "/auth/signup", "/auth/refresh"];

http.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as RetriableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? "";

    if (
      axiosError.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      REFRESH_EXCLUDED_URLS.some((url) => requestUrl.startsWith(url))
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= publicHttp
        .post<AuthResponse>("/auth/refresh")
        .then((response) => response.data)
        .finally(() => {
          refreshPromise = null;
        });

      const session = await refreshPromise;
      useAuthStore.getState().setSession(session);
      originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
      return http(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
      return Promise.reject(refreshError);
    }
  }
);
