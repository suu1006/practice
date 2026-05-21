import Link from "next/link";
import { FileClock, LogOut, ShieldCheck } from "lucide-react";

export function DashboardNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link className="flex items-center gap-2 font-semibold text-ink" href="/reports">
          <ShieldCheck className="h-5 w-5 text-brand" aria-hidden />
          KCS Credit
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link className="rounded-md px-3 py-2 text-muted hover:bg-slate-100 hover:text-ink" href="/reports">
            리포트
          </Link>
          <Link className="flex items-center gap-1 rounded-md px-3 py-2 text-muted hover:bg-slate-100 hover:text-ink" href="/history">
            <FileClock className="h-4 w-4" aria-hidden />
            조회 이력
          </Link>
          <button className="flex items-center gap-1 rounded-md px-3 py-2 text-muted hover:bg-slate-100 hover:text-ink" type="button">
            <LogOut className="h-4 w-4" aria-hidden />
            로그아웃
          </button>
        </div>
      </nav>
    </header>
  );
}
