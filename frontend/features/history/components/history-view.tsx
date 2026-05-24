"use client";

import Link from "next/link";
import type { Route } from "next";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getHistories } from "@/features/history/api/history-api";
import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";

const PAGE_SIZE = 10;

export function HistoryView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = parsePositiveInteger(searchParams.get("page"));

  const historiesQuery = useQuery({
    queryKey: ["histories", { page, size: PAGE_SIZE }],
    queryFn: () => getHistories({ page, size: PAGE_SIZE }),
    staleTime: 30 * 1000,
    gcTime: 3 * 60 * 1000
  });

  const histories = historiesQuery.data?.content ?? [];
  const totalPages = historiesQuery.data?.totalPages ?? 0;
  const totalElements = historiesQuery.data?.totalElements ?? 0;
  const hasHistories = histories.length > 0;
  const canGoPrev = page > 0;
  const canGoNext = totalPages > 0 && page + 1 < totalPages;

  const updatePage = (nextPage: number) => {
    const query = new URLSearchParams();
    if (nextPage > 0) {
      query.set("page", String(nextPage));
    }
    const nextUrl = query.toString() ? `${pathname}?${query.toString()}` : pathname;
    router.replace(nextUrl as Route);
  };

  return (
    <section>
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">조회 이력</h1>
          <p className="mt-2 text-sm text-muted">같은 리포트를 여러 번 조회해도 각 시점을 기록합니다.</p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-muted md:items-end">
          <span>총 {totalElements.toLocaleString()}건</span>
          {historiesQuery.isError && hasHistories && (
            <span className="text-red-700">최신 정보를 불러오지 못했습니다.</span>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {historiesQuery.isLoading && <StateMessage message="조회 이력을 불러오는 중입니다." />}
        {historiesQuery.isError && !hasHistories && <StateMessage message="조회 이력을 불러오지 못했습니다." tone="danger" />}
        {!historiesQuery.isLoading && !historiesQuery.isError && !hasHistories && (
          <StateMessage message="아직 조회한 리포트가 없습니다." />
        )}
        {histories.map((history) => (
          <Link
            key={history.id}
            className="grid gap-2 border-b border-slate-100 p-5 last:border-b-0 hover:bg-slate-50 md:grid-cols-[1fr_120px_120px_180px]"
            href={`/reports/${history.reportId}`}
          >
            <div>
              <h2 className="font-medium text-ink">{history.reportTitle}</h2>
              <p className="mt-1 text-sm text-muted">{history.agencyName}</p>
            </div>
            <span className="text-sm text-muted">점수 {history.creditScore}</span>
            <span className="text-sm text-muted">{history.creditGrade}등급</span>
            <time className="text-sm text-muted">{formatViewedAt(history.viewedAt)}</time>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button type="button" variant="secondary" disabled={!canGoPrev} onClick={() => updatePage(page - 1)}>
          <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
          이전
        </Button>
        <span className="text-sm text-muted">
          {totalPages === 0 ? 0 : page + 1} / {totalPages}
        </span>
        <Button type="button" variant="secondary" disabled={!canGoNext} onClick={() => updatePage(page + 1)}>
          다음
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
        </Button>
      </div>
    </section>
  );
}

function formatViewedAt(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function parsePositiveInteger(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}
