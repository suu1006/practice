import { ReportDetailView } from "@/features/reports/components/report-detail-view";

type ReportDetailPageProps = {
  params:
    | {
        reportId: string;
      }
    | Promise<{
        reportId: string;
      }>;
};

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { reportId } = await params;
  return <ReportDetailView reportId={reportId} />;
}
