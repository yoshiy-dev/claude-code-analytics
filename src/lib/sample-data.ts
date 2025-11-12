
// Sample data generator for demo purposes

export interface SampleAnalysisData {
  id: number;
  filename: string;
  estimated_commit_count: number;
  learning_curve_score: number;
  active_hours_heatmap: Record<string, number>;
  summary_json: {
    main_topics: string[];
    issue_categories: string[];
    recommended_actions: string[];
    warnings: string[];
    summary: string;
  };
  analysis_timestamp: string;
}

export interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  commit_count: number;
  learning_score: number;
  active_days: number;
  rank: number;
}

export function generateSampleAnalysis(filename: string): SampleAnalysisData {
  const seed = filename.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate deterministic but varied data based on filename
  const commitCount = 100 + (seed % 400);
  const learningScore = 60 + (seed % 40);
  
  // Generate active hours heatmap
  const activeHoursHeatmap: Record<string, number> = {};
  for (let i = 0; i < 24; i++) {
    const base = Math.sin((seed + i) / 3) * 50 + 50;
    activeHoursHeatmap[i.toString()] = Math.max(0, Math.floor(base));
  }

  const topicsList = [
    'React Components',
    'API Integration',
    'Database Design',
    'Authentication',
    'UI/UX Improvements',
    'Performance Optimization',
    'Testing',
    'Documentation',
    'Bug Fixes',
    'Code Refactoring'
  ];

  const issuesList = [
    'Type Errors',
    'Null Reference',
    'Performance Issues',
    'Security Vulnerabilities',
    'Code Duplication',
    'Missing Tests',
    'Deprecated APIs'
  ];

  const actionsList = [
    'Add comprehensive unit tests',
    'Refactor legacy code modules',
    'Implement error boundaries',
    'Optimize database queries',
    'Update documentation',
    'Fix security vulnerabilities',
    'Improve code coverage'
  ];

  // Select random items based on seed
  const selectedTopics = topicsList.slice(seed % 3, (seed % 3) + 5);
  const selectedIssues = issuesList.slice(seed % 2, (seed % 2) + 4);
  const selectedActions = actionsList.slice(seed % 2, (seed % 2) + 5);

  return {
    id: Date.now(),
    filename,
    estimated_commit_count: commitCount,
    learning_curve_score: learningScore,
    active_hours_heatmap: activeHoursHeatmap,
    summary_json: {
      main_topics: selectedTopics,
      issue_categories: selectedIssues,
      recommended_actions: selectedActions,
      warnings: commitCount > 300 ? ['High commit count detected'] : [],
      summary: `Analysis of ${filename} shows ${commitCount} commits with a learning curve score of ${learningScore}%. The codebase demonstrates active development with focus on ${selectedTopics[0]} and ${selectedTopics[1]}.`
    },
    analysis_timestamp: new Date().toISOString()
  };
}

export function generateTeamRankings(): TeamMember[] {
  const names = [
    'Alex Chen',
    'Sarah Johnson',
    'Michael Park',
    'Emily Rodriguez',
    'David Kim',
    'Jessica Lee',
    'Ryan Martinez',
    'Sophia Wang'
  ];

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia'
  ];

  return names.map((name, index) => ({
    id: index + 1,
    name,
    avatar: avatars[index],
    commit_count: 500 - (index * 50) + Math.floor(Math.random() * 30),
    learning_score: 95 - (index * 5) + Math.floor(Math.random() * 5),
    active_days: 30 - Math.floor(index * 2) + Math.floor(Math.random() * 3),
    rank: index + 1
  })).sort((a, b) => b.commit_count - a.commit_count);
}
