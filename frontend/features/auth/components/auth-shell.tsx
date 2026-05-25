"use client";

import Link from "next/link";
import type { Route } from "next";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, signup } from "@/features/auth/api/auth-api";
import type { AuthRequest, AuthResponse } from "@/features/auth/types";
import { useAuthStore } from "@/stores/auth-store";

type AuthShellProps = {
  mode: "login" | "signup";
};

type ApiErrorResponse = {
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
};

const PASSWORD_POLICY_MESSAGE = "8자 이상, 영문 · 숫자 · 특수문자를 포함해야 합니다.";
const PASSWORD_POLICY_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const EMAIL_FORMAT_MESSAGE = "이메일 형식이 올바르지 않습니다.";
const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const mutation = useMutation<AuthResponse, AxiosError<ApiErrorResponse>, AuthRequest>({
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
    const response = mutation.error?.response?.data;
    return response?.errors?.[0]?.message ?? response?.message ?? "요청 처리 중 오류가 발생했습니다.";
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

    if (!EMAIL_FORMAT_REGEX.test(form.email.trim())) {
      setClientError(EMAIL_FORMAT_MESSAGE);
      return;
    }

    if (!isLogin && !PASSWORD_POLICY_REGEX.test(form.password)) {
      setClientError(PASSWORD_POLICY_MESSAGE);
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
        <form className="mt-8 space-y-4" noValidate onSubmit={handleSubmit}>
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
          <div className="text-sm font-medium text-ink">
            <label htmlFor="auth-password">비밀번호</label>
            <span className="relative mt-2 block">
              <input
                id="auth-password"
                className="h-11 w-full rounded-md border border-slate-300 py-0 pl-3 pr-11 outline-none focus:border-brand"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              />
              <button
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted transition hover:bg-slate-100 hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
                type="button"
                aria-label={isPasswordVisible ? "입력값 숨기기" : "입력값 보기"}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-4 w-4" aria-hidden />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden />
                )}
              </button>
            </span>
          </div>
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
