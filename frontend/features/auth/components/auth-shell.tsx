"use client";

import Link from "next/link";
import type { Route } from "next";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { login, signup } from "@/features/auth/api/auth-api";
import type { AuthRequest, AuthResponse } from "@/features/auth/types";
import { useAuthStore } from "@/stores/auth-store";

type AuthShellProps = {
  mode: "login" | "signup";
};

export function AuthShell({ mode }: AuthShellProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const isLogin = mode === "login";
  const redirectParam = searchParams.get("redirect");
  const redirectTo = redirectParam?.startsWith("/") && !redirectParam.startsWith("//") ? redirectParam : "/reports";
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState<AuthRequest>({ email: "", password: "" });
  const [clientError, setClientError] = useState<string | null>(null);

  const mutation = useMutation<AuthResponse, AxiosError<{ message?: string }>, AuthRequest>({
    mutationFn: isLogin ? login : signup,
    onSuccess: (response) => {
      queryClient.clear();
      setSession(response);
      router.replace(redirectTo as Route);
    }
  });

  const errorMessage = useMemo(() => {
    if (clientError) {
      return clientError;
    }
    return mutation.error?.response?.data.message ?? "요청 처리 중 오류가 발생했습니다.";
  }, [clientError, mutation.error]);

  useEffect(() => {
    if (accessToken) {
      router.replace(redirectTo as Route);
    }
  }, [accessToken, redirectTo, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError(null);

    if (!form.email.trim() || !form.password.trim()) {
      setClientError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    mutation.mutate({
      email: form.email.trim(),
      password: form.password
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">{isLogin ? "로그인" : "회원가입"}</h1>
        <p className="mt-2 text-sm text-muted">이메일과 비밀번호로 신용평가 리포트 서비스에 접속합니다.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-ink">
            이메일
            <input
              className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-brand"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            비밀번호
            <input
              className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-brand"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
            {!isLogin && (
              <span className="mt-1.5 block text-xs text-muted">
                8자 이상, 영문 · 숫자 · 특수문자를 포함해야 합니다.
              </span>
            )}
          </label>
          {(clientError || mutation.isError) && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
          )}
          <button
            className="h-11 w-full rounded-md bg-brand text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={mutation.isPending}
            type="submit"
          >
            {mutation.isPending ? "처리 중" : isLogin ? "로그인" : "가입하기"}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-muted">
          {isLogin ? (
            <Link className="font-medium text-brand" href="/signup">
              계정이 없다면 회원가입
            </Link>
          ) : (
            <Link className="font-medium text-brand" href="/login">
              이미 계정이 있다면 로그인
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
