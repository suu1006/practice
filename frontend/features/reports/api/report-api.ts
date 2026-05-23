import { http } from "@/lib/http";
import type { CreditReportDetail, CreditReportSummary, PageResponse } from "@/types/api";

export type ReportListParams = {
  page: number;
  size: number;
  keyword?: string;
  creditGrade?: string;
  from?: string;
  to?: string;
  sortBy: "issuedAt" | "creditScore";
  direction: "asc" | "desc";
};

export async function getReports(params: ReportListParams) {
  const { data } = await http.get<PageResponse<CreditReportSummary>>("/reports", {
    params: {
      page: params.page,
      size: params.size,
      keyword: params.keyword || undefined,
      creditGrade: params.creditGrade || undefined,
      from: params.from || undefined,
      to: params.to || undefined,
      sortBy: params.sortBy,
      direction: params.direction
    }
  });

  return data;
}

export async function getReportDetail(reportId: string) {
  const { data } = await http.get<CreditReportDetail>(`/reports/${reportId}`);
  return data;
}
