type ReportDetailViewProps = {
  reportId: string;
};

export function ReportDetailView({ reportId }: ReportDetailViewProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-muted">리포트 ID: {reportId}</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">2026 상반기 개인 신용평가</h1>
        <div className="mt-8">
          <div className="flex items-end gap-3">
            <strong className="text-5xl text-brand">842</strong>
            <span className="pb-2 text-sm text-muted">/ 1000</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[84%] rounded-full bg-accent" />
          </div>
        </div>
      </div>
      <aside className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-ink">기본 정보</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">신용등급</dt>
            <dd className="font-medium text-ink">2등급</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">발급기관</dt>
            <dd className="font-medium text-ink">KCS 평가정보</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">발급일자</dt>
            <dd className="font-medium text-ink">2026-05-18</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">주민등록번호</dt>
            <dd className="font-medium text-ink">900101-1******</dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
