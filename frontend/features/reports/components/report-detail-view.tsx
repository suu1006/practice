"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, CalendarDays, Fingerprint, ShieldCheck } from "lucide-react";
import { getReportDetail } from "@/features/reports/api/report-api";
import { StateMessage } from "@/components/ui/state-message";

type ReportDetailViewProps = {
  reportId: string;
};

export function ReportDetailView({ reportId }: ReportDetailViewProps) {
  const queryClient = useQueryClient();
  const reportQuery = useQuery({
    queryKey: ["reports", reportId],
    queryFn: () => getReportDetail(reportId),
    enabled: Number.isFinite(Number(reportId)),
    staleTime: 0,
    refetchOnMount: "always"
  });

  useEffect(() => {
    if (reportQuery.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    }
  }, [reportQuery.isSuccess, queryClient]);

  if (reportQuery.isLoading) {
    return <StateMessage message="리포트를 불러오는 중입니다." variant="panel" />;
  }

  if (reportQuery.isError || !reportQuery.data) {
    return (
      <section className="space-y-5">
        <BackLink />
        <StateMessage message="리포트 상세 정보를 불러오지 못했습니다." tone="danger" variant="panel" />
      </section>
    );
  }

  const report = reportQuery.data;
  const scoreRate = Math.min(Math.max(report.creditScore / 1000, 0), 1);

  return (
    <section className="space-y-5">
      <BackLink />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <p className="text-sm text-muted">리포트 ID: {report.id}</p>
          <h1 className="mt-3 text-2xl font-semibold text-ink">{report.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{report.summary}</p>
          <div className="mt-8">
            <div className="flex items-end gap-3">
              <strong className="text-5xl text-brand">{report.creditScore}</strong>
              <span className="pb-2 text-sm text-muted">/ 1000</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-accent" style={{ width: `${scoreRate * 100}%` }} />
            </div>
          </div>
        </div>
        <aside className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-ink">기본 정보</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <InfoRow icon={<ShieldCheck className="h-4 w-4" />} label="신용등급" value={`${report.creditGrade}등급`} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="발급기관" value={report.agencyName} />
            <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="발급일자" value={report.issuedAt} />
            <InfoRow
              icon={<Fingerprint className="h-4 w-4" />}
              label="주민등록번호"
              value={report.maskedResidentRegistrationNumber}
            />
          </dl>
        </aside>
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <Link
      className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-ink transition hover:bg-slate-50"
      href="/reports"
    >
      <ArrowLeft className="mr-1 h-4 w-4" aria-hidden />
      목록으로
    </Link>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex items-center gap-2 text-muted">
        <span className="text-slate-400">{icon}</span>
        {label}
      </dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
