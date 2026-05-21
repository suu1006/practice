import Link from "next/link";

type AuthShellProps = {
  mode: "login" | "signup";
};

export function AuthShell({ mode }: AuthShellProps) {
  const isLogin = mode === "login";

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">{isLogin ? "로그인" : "회원가입"}</h1>
        <p className="mt-2 text-sm text-muted">이메일과 비밀번호로 신용평가 리포트 서비스에 접속합니다.</p>
        <form className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-ink">
            이메일
            <input className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-brand" type="email" placeholder="user@example.com" />
          </label>
          <label className="block text-sm font-medium text-ink">
            비밀번호
            <input className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-brand" type="password" placeholder="8자 이상" />
          </label>
          <button className="h-11 w-full rounded-md bg-brand text-sm font-semibold text-white hover:bg-blue-700" type="button">
            {isLogin ? "로그인" : "가입하기"}
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
