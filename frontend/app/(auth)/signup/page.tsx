import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/auth-shell";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-surface text-sm text-muted">회원가입 화면을 준비하는 중입니다.</div>}>
      <AuthShell mode="signup" />
    </Suspense>
  );
}
