"use client";

import type { Route } from "next";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getReports, type ReportListParams } from "@/features/reports/api/report-api";
import { Button } from "@/components/ui/button";
import { StateMessage } from "@/components/ui/state-message";

const PAGE_SIZE = 10;

const gradeOptions = Array.from({ length: 10 }, (_, index) => String(index + 1));

export function ReportListView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(() => parseReportListParams(searchParams), [searchParams]);
  const [keywordInput, setKeywordInput] = useState(params.keyword ?? "");

  const updateParams = useCallback(
    (next: Partial<ReportListParams>) => {
      const merged = { ...params, ...next };
      const query = new URLSearchParams();

      if (merged.page > 0) {
        query.set("page", String(merged.page));
      }
      if (merged.keyword) {
        query.set("keyword", merged.keyword);
      }
      if (merged.creditGrade) {
        query.set("creditGrade", merged.creditGrade);
      }
      if (merged.from) {
        query.set("from", merged.from);
      }
      if (merged.to) {
        query.set("to", merged.to);
      }
      if (merged.sortBy !== "issuedAt") {
        query.set("sortBy", merged.sortBy);
      }
      if (merged.direction !== "desc") {
        query.set("direction", merged.direction);
      }

      const nextUrl = query.toString() ? `${pathname}?${query.toString()}` : pathname;
      router.replace(nextUrl as Route);
    },
    [params, pathname, router]
  );

  useEffect(() => {
    setKeywordInput(params.keyword ?? "");
  }, [params.keyword]);

  useEffect(() => {
    const keyword = keywordInput.trim();

    if (keyword === (params.keyword ?? "")) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateParams({ keyword, page: 0 });
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [keywordInput, params.keyword, updateParams]);

  const reportsQuery = useQuery({
    queryKey: ["reports", params],
    queryFn: () => getReports(params),
    staleTime: 60 * 1000
  });

  const handleReset = () => {
    setKeywordInput("");
    router.replace(pathname as Route);
  };

  const handleDateInputClick = (event: MouseEvent<HTMLInputElement>) => {
    event.currentTarget.showPicker?.();
  };

  const reports = reportsQuery.data?.content ?? [];
  const page = reportsQuery.data?.page ?? params.page;
  const totalPages = reportsQuery.data?.totalPages ?? 0;
  const totalElements = reportsQuery.data?.totalElements ?? 0;
  const hasReports = reports.length > 0;
  const canGoPrev = page > 0;
  const canGoNext = totalPages > 0 && page + 1 < totalPages;

  return (
    <section>
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">신용평가 리포트</h1>
            <p className="mt-2 text-sm text-muted">검색, 필터, 정렬 조건은 URL에 저장됩니다.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <div className="flex h-10 min-w-72 items-center gap-2 rounded-md border border-slate-300 bg-white px-3">
              <Search className="h-4 w-4 text-muted" aria-hidden />
              <input
                className="w-full border-0 bg-transparent text-sm outline-none"
                placeholder="제목 또는 발급기관 검색"
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
              />
            </div>
            <Button type="button" variant="secondary" onClick={handleReset} aria-label="조건 초기화">
              <RotateCcw className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <label className="text-sm font-medium text-ink">
            신용등급
            <span className="relative mt-2 block">
              <select
                className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white py-0 pl-3 pr-11 text-sm outline-none focus:border-brand"
                value={params.creditGrade ?? ""}
                onChange={(event) => updateParams({ creditGrade: event.target.value, page: 0 })}
              >
                <option value="">전체</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}등급
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink"
                aria-hidden
              />
            </span>
          </label>
          <label className="text-sm font-medium text-ink">
            발급 시작일
            <input
              className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand"
              type="date"
              value={params.from ?? ""}
              onClick={handleDateInputClick}
              onChange={(event) => updateParams({ from: event.target.value, page: 0 })}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            발급 종료일
            <input
              className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand"
              type="date"
              value={params.to ?? ""}
              onClick={handleDateInputClick}
              onChange={(event) => updateParams({ to: event.target.value, page: 0 })}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            정렬
            <span className="relative mt-2 block">
              <select
                className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white py-0 pl-3 pr-11 text-sm outline-none focus:border-brand"
                value={`${params.sortBy}:${params.direction}`}
                onChange={(event) => {
                  const [sortBy, direction] = event.target.value.split(":") as [
                    ReportListParams["sortBy"],
                    ReportListParams["direction"]
                  ];
                  updateParams({ sortBy, direction, page: 0 });
                }}
              >
                <option value="issuedAt:desc">발급일 최신순</option>
                <option value="issuedAt:asc">발급일 오래된순</option>
                <option value="creditScore:desc">신용점수 높은순</option>
                <option value="creditScore:asc">신용점수 낮은순</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink"
                aria-hidden
              />
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-muted">
        <span>총 {totalElements.toLocaleString()}건</span>
        {reportsQuery.isError && hasReports && <span className="text-red-700">최신 정보를 불러오지 못했습니다.</span>}
        {reportsQuery.isFetching && !reportsQuery.isError && <span>조회 중</span>}
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {reportsQuery.isLoading && <StateMessage message="리포트를 불러오는 중입니다." />}
        {reportsQuery.isError && !hasReports && <StateMessage message="리포트를 불러오지 못했습니다." tone="danger" />}
        {!reportsQuery.isLoading && !reportsQuery.isError && !hasReports && (
          <StateMessage message="조건에 맞는 리포트가 없습니다." />
        )}
        {hasReports && (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-muted">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-3">리포트명</th>
                  <th className="px-5 py-3">발급기관</th>
                  <th className="px-5 py-3">점수</th>
                  <th className="px-5 py-3">등급</th>
                  <th className="px-5 py-3">발급일</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  const reportPath = `/reports/${report.id}` as Route;
                  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>) => {
                    if (event.target instanceof Element && event.target.closest("a")) {
                      return;
                    }

                    router.push(reportPath);
                  };

                  return (
                    <tr
                      key={report.id}
                      className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                      onClick={handleRowClick}
                    >
                      <td className="px-5 py-4 font-medium text-ink">
                        <Link
                          className="text-brand underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-brand"
                          href={reportPath}
                        >
                          {report.title}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-muted">{report.agencyName}</td>
                      <td className="px-5 py-4 text-muted">{report.creditScore}</td>
                      <td className="px-5 py-4 text-muted">{report.creditGrade}등급</td>
                      <td className="px-5 py-4 text-muted">{report.issuedAt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={!canGoPrev}
          onClick={() => updateParams({ page: page - 1 })}
        >
          <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
          이전
        </Button>
        <span className="text-sm text-muted">
          {totalPages === 0 ? 0 : page + 1} / {totalPages}
        </span>
        <Button
          type="button"
          variant="secondary"
          disabled={!canGoNext}
          onClick={() => updateParams({ page: page + 1 })}
        >
          다음
          <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
        </Button>
      </div>
    </section>
  );
}

function parseReportListParams(searchParams: URLSearchParams): ReportListParams {
  const sortBy = searchParams.get("sortBy");
  const direction = searchParams.get("direction");

  return {
    page: parsePositiveInteger(searchParams.get("page")),
    size: PAGE_SIZE,
    keyword: searchParams.get("keyword") ?? "",
    creditGrade: searchParams.get("creditGrade") ?? "",
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
    sortBy: sortBy === "creditScore" ? "creditScore" : "issuedAt",
    direction: direction === "asc" ? "asc" : "desc"
  };
}

function parsePositiveInteger(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}
