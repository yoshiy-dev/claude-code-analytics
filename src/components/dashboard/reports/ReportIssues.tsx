
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

interface Issue {
  id: number;
  category: string;
  issue_count: number;
}

interface ReportIssuesProps {
  reportId: number;
}

const COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04',
  '#16a34a', '#0891b2', '#0369a1', '#6366f1', '#8b5cf6',
];

export default function ReportIssues({ reportId }: ReportIssuesProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, [reportId]);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await api.get<Issue[]>(
        `/report-issues?report_id=${reportId}`
      );
      setIssues(data);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = issues.map((issue) => ({
    name: issue.category,
    value: issue.issue_count,
  }));

  const totalIssues = issues.reduce((sum, issue) => sum + issue.issue_count, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Issue Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No issues found</p>
        ) : (
          <div className="space-y-4">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value} issues`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {issues.map((issue, index) => (
                <div 
                  key={issue.id} 
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length] + '10',
                    borderColor: COLORS[index % COLORS.length] + '30',
                  }}
                >
                  <p className="text-sm font-medium text-muted-foreground truncate">
                    {issue.category}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: COLORS[index % COLORS.length] }}>
                    {issue.issue_count}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((issue.issue_count / totalIssues) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
