"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { refreshSession } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const refreshQuery = useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: refreshSession,
    enabled: !isInitialized,
    retry: false,
    staleTime: 0,
    gcTime: 0
  });

  useEffect(() => {
    if (refreshQuery.data) {
      setSession(refreshQuery.data);
    }
  }, [refreshQuery.data, setSession]);

  useEffect(() => {
    if (refreshQuery.isError) {
      clearSession();
    }
  }, [clearSession, refreshQuery.isError]);

  useEffect(() => {
    if (isInitialized && !accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [accessToken, isInitialized, pathname, router]);

  if (!isInitialized || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-muted">
        인증 상태를 확인하는 중입니다.
      </div>
    );
  }

  return <>{children}</>;
}
