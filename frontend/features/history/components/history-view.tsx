const sampleHistory = [
  { id: "history-1", reportTitle: "2026 상반기 개인 신용평가", viewedAt: "2026-05-21 10:24" },
  { id: "history-2", reportTitle: "카드 이용 기반 신용 리포트", viewedAt: "2026-05-20 18:12" }
];

export function HistoryView() {
  return (
    <section>
      <h1 className="text-2xl font-semibold text-ink">조회 이력</h1>
      <p className="mt-2 text-sm text-muted">같은 리포트를 여러 번 조회해도 각 시점을 기록합니다.</p>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {sampleHistory.map((history) => (
          <div key={history.id} className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 last:border-b-0">
            <span className="font-medium text-ink">{history.reportTitle}</span>
            <time className="text-sm text-muted">{history.viewedAt}</time>
          </div>
        ))}
      </div>
    </section>
  );
}
