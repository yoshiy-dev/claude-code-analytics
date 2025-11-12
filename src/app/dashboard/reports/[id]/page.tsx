
import DetailedReportPage from '@/components/dashboard/reports/DetailedReportPage';

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Currently, DetailedReportPage reads upload_id from search params.
  // The dynamic route id is not used here; rendering the detail page without props avoids type errors.
  return <DetailedReportPage />;
}
