import { http, publicHttp } from "@/lib/http";
import type { AuthRequest, AuthResponse, MessageResponse } from "@/features/auth/types";

export async function login(request: AuthRequest) {
  const { data } = await publicHttp.post<AuthResponse>("/auth/login", request);
  return data;
}

export async function signup(request: AuthRequest) {
  const { data } = await publicHttp.post<AuthResponse>("/auth/signup", request);
  return data;
}

export async function refreshSession() {
  const { data } = await publicHttp.post<AuthResponse>("/auth/refresh");
  return data;
}

export async function logout() {
  const { data } = await http.post<MessageResponse>("/auth/logout");
  return data;
}
