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
    if (refreshQuery.isSuccess && refreshQuery.data) {
      setSession(refreshQuery.data);
    }
  }, [refreshQuery.data, refreshQuery.isSuccess, setSession]);

  useEffect(() => {
    if (refreshQuery.isError && !isInitialized) {
      clearSession();
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [clearSession, isInitialized, pathname, refreshQuery.isError, router]);

  useEffect(() => {
    if (isInitialized && !accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [accessToken, isInitialized, pathname, router]);

  useEffect(() => {
    if (isInitialized || accessToken) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      clearSession();
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [accessToken, clearSession, isInitialized, pathname, router]);

  if (refreshQuery.isPending && !isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-muted">
        인증 상태를 확인하는 중입니다.
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-muted">
        로그인 페이지로 이동하는 중입니다.
      </div>
    );
  }

  return <>{children}</>;
}
