
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import ReportKPIs from './ReportKPIs';
import ReportTopics from './ReportTopics';
import ReportIssues from './ReportIssues';
import ReportActions from './ReportActions';

interface AnalysisReport {
  id: number;
  file_upload_id: number;
  estimated_commit_count: number;
  learning_curve_score: number;
  active_hours_heatmap: Record<string, number>;
  summary_json: {
    main_topics: Array<{ topic: string; frequency: number }>;
    issue_categories: Array<{ category: string; count: number }>;
    recommended_actions: Array<{ action: string; priority: string }>;
    warnings: string[];
  };
  analysis_timestamp: string;
}

export default function DetailedReportPage() {
  const searchParams = useSearchParams();
  const uploadId = searchParams.get('upload_id');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uploadId) {
      fetchReport();
    }
  }, [uploadId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const reports = await api.get<AnalysisReport[]>('/analysis-reports', {
        file_upload_id: uploadId!,
      });

      if (reports.length === 0) {
        setError('No report found for this upload');
        return;
      }

      setReport(reports[0]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch report';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Report not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analysis Report</h1>
        <p className="text-muted-foreground mt-2">
          Generated on {new Date(report.analysis_timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {report.summary_json?.warnings && report.summary_json.warnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">Analysis Warnings:</p>
              <ul className="list-disc list-inside space-y-1">
                {report.summary_json.warnings.map((warning, idx) => (
                  <li key={idx} className="text-sm">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <ReportKPIs report={report} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportTopics reportId={report.id} />
        <ReportIssues reportId={report.id} />
      </div>

      <ReportActions reportId={report.id} />
    </div>
  );
}
