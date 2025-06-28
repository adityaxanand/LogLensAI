'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: 'default' | 'destructive' | 'warning';
}

export function StatCard({ title, value, icon: Icon, variant = 'default' }: StatCardProps) {
  const variantClasses = {
    default: 'text-primary',
    destructive: 'text-destructive',
    warning: 'text-yellow-500',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn('h-4 w-4 text-muted-foreground', variantClasses[variant])} />
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', variantClasses[variant])}>{value}</div>
      </CardContent>
    </Card>
  );
}
