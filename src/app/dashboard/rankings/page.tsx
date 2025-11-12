
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp, Calendar, GitCommit } from 'lucide-react';
import { generateTeamRankings, type TeamMember } from '@/lib/sample-data';

export default function RankingsPage() {
  const [rankings, setRankings] = useState<TeamMember[]>([]);

  useEffect(() => {
    setRankings(generateTeamRankings());
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">🏆 Champion</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">🥈 Runner-up</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">🥉 Third Place</Badge>;
    return null;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Team Rankings
        </h1>
        <p className="text-muted-foreground mt-2">
          Compare your performance with team members
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rankings.slice(0, 3).map((member, index) => (
          <Card
            key={member.id}
            className={`border-2 ${
              index === 0
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                : index === 1
                ? 'border-gray-400 bg-gray-50 dark:bg-gray-950/20'
                : 'border-amber-600 bg-amber-50 dark:bg-amber-950/20'
            }`}
          >
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                {getRankIcon(member.rank)}
              </div>
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              {getRankBadge(member.rank)}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <GitCommit className="h-4 w-4" />
                  Commits
                </span>
                <span className="font-bold">{member.commit_count}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Score
                </span>
                <span className="font-bold">{member.learning_score}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Active Days
                </span>
                <span className="font-bold">{member.active_days}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rankings.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(member.rank)}
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.commit_count} commits • {member.active_days} active days
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Learning Score</p>
                    <p className="text-lg font-bold">{member.learning_score}%</p>
                  </div>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${member.learning_score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Team Commits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {rankings.reduce((sum, m) => sum + m.commit_count, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Learning Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Math.round(rankings.reduce((sum, m) => sum + m.learning_score, 0) / rankings.length)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{rankings.length}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
