
'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FileText } from 'lucide-react';

export default function DashboardNav() {
  return (
    <nav className="border-b bg-background px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <span className="text-lg font-semibold">Claude Code Analysis</span>
      </div>
      <ThemeToggle />
    </nav>
  );
}
