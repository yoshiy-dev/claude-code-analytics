
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';

interface Action {
  id: number;
  action_text: string;
  priority: number;
}

interface ReportActionsProps {
  reportId: number;
}

export default function ReportActions({ reportId }: ReportActionsProps) {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActions();
  }, [reportId]);

  const fetchActions = async () => {
    setLoading(true);
    try {
      const data = await api.get<Action[]>(
        `/report-actions?report_id=${reportId}`
      );
      setActions(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority: number) => {
    if (priority <= 2) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else if (priority <= 3) {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getPriorityLabel = (priority: number) => {
    if (priority <= 2) return 'High';
    if (priority <= 3) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'destructive';
    if (priority <= 3) return 'secondary';
    return 'outline';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Recommended Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No recommended actions</p>
        ) : (
          <ol className="space-y-3">
            {actions.map((action, index) => (
              <li key={action.id} className="flex gap-3 p-4 bg-muted rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex-shrink-0 pt-0.5 font-bold text-lg text-muted-foreground">
                  {index + 1}.
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed break-words">{action.action_text}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  {getPriorityIcon(action.priority)}
                  <Badge variant={getPriorityColor(action.priority) as any}>
                    {getPriorityLabel(action.priority)}
                  </Badge>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
