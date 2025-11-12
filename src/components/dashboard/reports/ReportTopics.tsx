
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

interface Topic {
  id: number;
  topic_name: string;
  frequency: number;
}

interface ReportTopicsProps {
  reportId: number;
}

const TOPIC_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04',
  '#16a34a', '#0891b2', '#0369a1', '#6366f1', '#8b5cf6',
];

export default function ReportTopics({ reportId }: ReportTopicsProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, [reportId]);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const data = await api.get<Topic[]>(
        `/report-topics?report_id=${reportId}`
      );
      setTopics(data);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = topics.slice(0, 10).map((topic) => ({
    name: topic.topic_name.length > 15 ? topic.topic_name.substring(0, 15) + '...' : topic.topic_name,
    fullName: topic.topic_name,
    frequency: topic.frequency,
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Main Development Topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Main Development Topics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topics.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No topics found</p>
        ) : (
          <>
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
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
                    formatter={(value) => [`${value} mentions`, 'Frequency']}
                    labelFormatter={(label) => {
                      const topic = chartData.find(d => d.name === label);
                      return topic?.fullName || label;
                    }}
                  />
                  <Bar dataKey="frequency" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TOPIC_COLORS[index % TOPIC_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">All Topics</p>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                  <Badge 
                    key={topic.id} 
                    variant="secondary"
                    className="cursor-default"
                    style={{
                      backgroundColor: TOPIC_COLORS[index % TOPIC_COLORS.length] + '20',
                      color: TOPIC_COLORS[index % TOPIC_COLORS.length],
                      borderColor: TOPIC_COLORS[index % TOPIC_COLORS.length],
                    }}
                  >
                    {topic.topic_name} ({topic.frequency})
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
