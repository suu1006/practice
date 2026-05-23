import { http } from "@/lib/http";
import type { PageResponse, ReportViewHistory } from "@/types/api";

export type HistoryListParams = {
  page: number;
  size: number;
};

export async function getHistories(params: HistoryListParams) {
  const { data } = await http.get<PageResponse<ReportViewHistory>>("/histories", {
    params
  });

  return data;
}
