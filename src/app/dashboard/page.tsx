
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, BarChart3, Trophy } from 'lucide-react';
import Link from 'next/link';
import { generateSampleAnalysis, type SampleAnalysisData } from '@/lib/sample-data';
import ReportKPIs from '@/components/dashboard/reports/ReportKPIs';

export default function Dashboard() {
  const [analysis, setAnalysis] = useState<SampleAnalysisData | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      // Generate sample analysis based on filename
      const sampleData = generateSampleAnalysis(file.name);
      setAnalysis(sampleData);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Claude Code Analysis Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Upload your chat history to see instant analysis results
        </p>
      </div>

      {!analysis ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload Your ZIP File</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Upload your Claude Code chat history ZIP file to see instant analysis with sample data
            </p>
            <label htmlFor="file-upload">
              <Button asChild>
                <span>Choose File</span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-4">
              ZIP files only • Maximum 200MB
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analysis Results: {analysis.filename}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnalysis(null)}
                >
                  Upload New File
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {analysis.summary_json.summary}
              </p>
              <div className="flex gap-2 flex-wrap">
                {analysis.summary_json.main_topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <ReportKPIs report={analysis} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Issue Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.summary_json.issue_categories.map((issue, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 list-decimal list-inside">
                  {analysis.summary_json.recommended_actions.slice(0, 5).map((action, idx) => (
                    <li key={idx} className="text-sm">
                      {action}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Link href="/dashboard/rankings">
              <Button size="lg" className="gap-2">
                <Trophy className="h-5 w-5" />
                View Team Rankings
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
