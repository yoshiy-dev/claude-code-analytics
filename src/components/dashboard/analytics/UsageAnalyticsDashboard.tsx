'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Clock,
  Code2,
  TrendingUp,
  Activity,
  Calendar,
  Download,
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

interface UsageStats {
  total_users: number;
  active_users: number;
  total_sessions: number;
  total_hours: number;
  avg_session_duration: number;
  growth_rate: number;
}

interface UserActivity {
  user_id: string;
  user_name: string;
  total_sessions: number;
  total_hours: number;
  last_active: string;
}

interface HourlyUsage {
  hour: number;
  sessions: number;
  label: string;
}

interface DailyUsage {
  date: string;
  sessions: number;
  users: number;
}

interface ProjectUsage {
  project_name: string;
  usage_count: number;
  percentage: number;
}

export default function UsageAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState<UsageStats>({
    total_users: 0,
    active_users: 0,
    total_sessions: 0,
    total_hours: 0,
    avg_session_duration: 0,
    growth_rate: 0,
  });
  const [topUsers, setTopUsers] = useState<UserActivity[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyUsage[]>([]);
  const [dailyData, setDailyData] = useState<DailyUsage[]>([]);
  const [projectData, setProjectData] = useState<ProjectUsage[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch all analytics data
      const [statsData, usersData, hourlyUsage, dailyUsage, projects] = await Promise.all([
        api.get<UsageStats>('/analytics/usage-stats', { timeRange }),
        api.get<UserActivity[]>('/analytics/top-users', { timeRange, limit: 10 }),
        api.get<HourlyUsage[]>('/analytics/hourly-usage', { timeRange }),
        api.get<DailyUsage[]>('/analytics/daily-usage', { timeRange }),
        api.get<ProjectUsage[]>('/analytics/project-usage', { timeRange }),
      ]);

      setStats(statsData);
      setTopUsers(usersData);
      setHourlyData(hourlyUsage);
      setDailyData(dailyUsage);
      setProjectData(projects);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      console.error(error);
      // Set sample data for demonstration
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = () => {
    setStats({
      total_users: 48,
      active_users: 32,
      total_sessions: 1247,
      total_hours: 3856,
      avg_session_duration: 3.1,
      growth_rate: 12.5,
    });

    setTopUsers([
      { user_id: '1', user_name: 'John Doe', total_sessions: 145, total_hours: 432, last_active: '2025-11-12T10:30:00Z' },
      { user_id: '2', user_name: 'Jane Smith', total_sessions: 132, total_hours: 398, last_active: '2025-11-12T09:15:00Z' },
      { user_id: '3', user_name: 'Bob Johnson', total_sessions: 118, total_hours: 356, last_active: '2025-11-11T16:45:00Z' },
      { user_id: '4', user_name: 'Alice Williams', total_sessions: 105, total_hours: 312, last_active: '2025-11-12T08:20:00Z' },
      { user_id: '5', user_name: 'Charlie Brown', total_sessions: 98, total_hours: 289, last_active: '2025-11-11T14:30:00Z' },
    ]);

    setHourlyData(
      Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        sessions: Math.floor(Math.random() * 100) + 20,
        label: `${i}:00`,
      }))
    );

    setDailyData(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          sessions: Math.floor(Math.random() * 200) + 100,
          users: Math.floor(Math.random() * 40) + 20,
        };
      })
    );

    setProjectData([
      { project_name: 'Frontend App', usage_count: 456, percentage: 35 },
      { project_name: 'Backend API', usage_count: 342, percentage: 26 },
      { project_name: 'Mobile App', usage_count: 278, percentage: 21 },
      { project_name: 'DevOps', usage_count: 145, percentage: 11 },
      { project_name: 'Other', usage_count: 89, percentage: 7 },
    ]);
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Usage Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Company-wide Claude Code usage insights
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-blue-600">
                {stats.active_users}
              </div>
              <p className="text-xs text-muted-foreground">
                of {stats.total_users} total users
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-purple-600">
                {stats.total_sessions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatHours(stats.avg_session_duration)} avg duration
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Total Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-green-600">
                {stats.total_hours.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Usage hours tracked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-orange-600">
                +{stats.growth_rate}%
              </div>
              <p className="text-xs text-muted-foreground">
                vs previous period
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Usage Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Sessions"
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Active Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hourly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hourly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sessions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Project Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="usage_count"
                  nameKey="project_name"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div
                key={user.user_id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{user.user_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last active:{' '}
                      {new Date(user.last_active).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-center">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Sessions</p>
                    <p className="font-bold">{user.total_sessions}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Hours</p>
                    <p className="font-bold">{formatHours(user.total_hours)}</p>
                  </div>
                  <Badge variant="outline">
                    {((user.total_hours / stats.total_hours) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
