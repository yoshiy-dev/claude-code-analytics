
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ReportKPIsProps {
  report: {
    estimated_commit_count: number;
    learning_curve_score: number;
    active_hours_heatmap: Record<string, number>;
  };
}

export default function ReportKPIs({ report }: ReportKPIsProps) {
  const heatmapData = Object.entries(report.active_hours_heatmap || {})
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      activity: count,
      label: `${hour}:00`,
    }));

  const maxActivity = Math.max(...heatmapData.map(d => d.activity), 1);
  const peakHour = heatmapData.reduce((max, curr) =>
    curr.activity > max.activity ? curr : max,
    heatmapData[0] || { hour: 0, activity: 0, label: '0:00' }
  );

  const getActivityColor = (value: number) => {
    const percentage = value / maxActivity;
    if (percentage >= 0.8) return '#dc2626';
    if (percentage >= 0.6) return '#f97316';
    if (percentage >= 0.4) return '#eab308';
    if (percentage >= 0.2) return '#84cc16';
    return '#d1d5db';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Estimated Commits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">
              {report.estimated_commit_count}
            </div>
            <p className="text-xs text-muted-foreground">
              Total commits analyzed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Learning Curve Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-purple-600">
                {report.learning_curve_score}
              </div>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${report.learning_curve_score}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Development progress indicator
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Peak Activity Hour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-green-600">
                {peakHour.label}
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              Most active development time
            </p>
          </div>
        </CardContent>
      </Card>

      {heatmapData.length > 0 && (
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Active Hours Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={heatmapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`${value} commits`, 'Activity']}
                />
                <Bar dataKey="activity" radius={[8, 8, 0, 0]}>
                  {heatmapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getActivityColor(entry.activity)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-300" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-400" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-400" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span>Very High</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
