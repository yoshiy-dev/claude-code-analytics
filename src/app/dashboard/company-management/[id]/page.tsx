
import CompanyDetailPage from '@/components/dashboard/company-management/CompanyDetailPage';

export default async function CompanyDetailPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyDetailPage />;
}
