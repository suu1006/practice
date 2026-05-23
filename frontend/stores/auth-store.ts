import { create } from "zustand";
import type { AuthResponse, AuthUser } from "@/features/auth/types";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  isInitialized: boolean;
  setSession: (response: AuthResponse) => void;
  clearSession: () => void;
  finishInitialization: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitialized: false,
  setSession: (response) =>
    set({
      accessToken: response.accessToken,
      user: response.user,
      isInitialized: true
    }),
  clearSession: () =>
    set({
      accessToken: null,
      user: null,
      isInitialized: true
    }),
  finishInitialization: () => set({ isInitialized: true })
}));
