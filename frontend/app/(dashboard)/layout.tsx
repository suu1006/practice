import { AuthGuard } from "@/components/layout/auth-guard";
import { DashboardNav } from "@/components/layout/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-surface">
        <DashboardNav />
        <main className="mx-auto w-full max-w-6xl px-5 py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
