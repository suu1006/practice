import Link from "next/link";
import { Search } from "lucide-react";

const sampleReports = [
  { id: "sample-1", title: "2026 상반기 개인 신용평가", agency: "KCS 평가정보", score: 842, grade: 2, issuedAt: "2026-05-18" },
  { id: "sample-2", title: "카드 이용 기반 신용 리포트", agency: "KCS 평가정보", score: 773, grade: 4, issuedAt: "2026-04-29" }
];

export function ReportListView() {
  return (
    <section>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">신용평가 리포트</h1>
          <p className="mt-2 text-sm text-muted">검색, 필터, 정렬은 서버 쿼리 파라미터와 동기화할 예정입니다.</p>
        </div>
        <div className="flex h-10 min-w-72 items-center gap-2 rounded-md border border-slate-300 bg-white px-3">
          <Search className="h-4 w-4 text-muted" aria-hidden />
          <input className="w-full border-0 bg-transparent text-sm outline-none" placeholder="제목 또는 발급기관 검색" />
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {sampleReports.map((report) => (
          <Link key={report.id} className="grid gap-2 border-b border-slate-100 p-5 last:border-b-0 hover:bg-slate-50 md:grid-cols-[1fr_140px_120px_120px]" href={`/reports/${report.id}`}>
            <div>
              <h2 className="font-medium text-ink">{report.title}</h2>
              <p className="mt-1 text-sm text-muted">{report.agency}</p>
            </div>
            <span className="text-sm text-muted">점수 {report.score}</span>
            <span className="text-sm text-muted">{report.grade}등급</span>
            <span className="text-sm text-muted">{report.issuedAt}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
