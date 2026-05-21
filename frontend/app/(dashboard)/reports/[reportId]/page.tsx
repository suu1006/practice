import { ReportDetailView } from "@/features/reports/components/report-detail-view";

type ReportDetailPageProps = {
  params: {
    reportId: string;
  };
};

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  return <ReportDetailView reportId={params.reportId} />;
}
