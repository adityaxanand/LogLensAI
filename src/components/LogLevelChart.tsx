'use client';

import { useMemo } from 'react';
import type { LogEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LogAnalysisChartsProps {
  logs: LogEntry[];
}

const levelChartConfig = {
  ERROR: { label: 'Error', color: 'hsl(var(--destructive))' },
  WARN: { label: 'Warning', color: 'hsl(var(--primary))' },
  INFO: { label: 'Info', color: 'hsl(var(--accent))' },
  DEBUG: { label: 'Debug', color: 'hsl(var(--muted-foreground))' },
  UNKNOWN: { label: 'Unknown', color: 'hsl(var(--border))' },
} as const;

const aggregateLogsByTime = (logs: LogEntry[], defaultBucketMinutes: number) => {
  const validLogs = logs.filter(log => log.timestamp && !isNaN(log.timestamp.getTime()));
  if (validLogs.length < 2) return [];

  const timestamps = validLogs.map(log => log.timestamp!.getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  
  let bucketDurationMinutes = defaultBucketMinutes;
  const timeRangeMinutes = (maxTime - minTime) / (1000 * 60);

  if (timeRangeMinutes < 1) bucketDurationMinutes = 0.1; // 6 seconds
  else if (timeRangeMinutes < 10) bucketDurationMinutes = 0.5; // 30 seconds
  else if (timeRangeMinutes < 60) bucketDurationMinutes = 1; // 1 minute
  else if (timeRangeMinutes < 24 * 60) bucketDurationMinutes = 10; // 10 minutes
  else bucketDurationMinutes = 60; // 1 hour

  const bucketDuration = bucketDurationMinutes * 60 * 1000;
  const buckets = new Map<number, Record<string, number> & { time: number }>();

  for (const log of validLogs) {
    const bucketTime = Math.floor(log.timestamp!.getTime() / bucketDuration) * bucketDuration;
    if (!buckets.has(bucketTime)) {
      buckets.set(bucketTime, {
        time: bucketTime,
        ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0, UNKNOWN: 0,
      });
    }
    const bucket = buckets.get(bucketTime)!;
    const level = log.level.toUpperCase();
    if (bucket[level] !== undefined) {
      bucket[level]++;
    } else {
        bucket['UNKNOWN']++;
    }
  }

  return Array.from(buckets.values()).sort((a, b) => a.time - b.time);
};

export function LogAnalysisCharts({ logs }: LogAnalysisChartsProps) {
  const distributionData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    const counts = logs.reduce((acc, log) => {
      const category = log.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = [
        'hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(220, 70%, 70%)',
        'hsl(180, 60%, 50%)', 'hsl(340, 80%, 60%)', 'hsl(40, 90%, 60%)'
    ];
    
    return Object.entries(counts)
      .map(([name, value], index) => ({
        name,
        count: value,
        fill: colors[index % colors.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [logs]);

  const categoryChartConfig = useMemo(() => {
      const config = { count: { label: "Count" } };
      for (const item of distributionData) {
          config[item.name] = { label: item.name, color: item.fill };
      }
      return config;
  }, [distributionData]);

  const timelineData = useMemo(() => aggregateLogsByTime(logs, 5), [logs]);
  const hasTimelineData = timelineData && timelineData.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visual Analysis</CardTitle>
        <CardDescription>Breakdown of log entries by category and severity over time.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <Tabs defaultValue="distribution">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="distribution">Category Distribution</TabsTrigger>
            <TabsTrigger value="timeline" disabled={!hasTimelineData}>Severity Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="distribution" className="pt-4">
            <ChartContainer config={categoryChartConfig} className="min-h-[200px] w-full h-80">
              <BarChart accessibilityLayer data={distributionData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <YAxis
                  dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false}
                  tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                  content={<ChartTooltipContent indicator="dot" />} 
                />
                <Bar dataKey="count" layout="vertical" radius={4} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="timeline" className="pt-4">
             {hasTimelineData ? (
                <ChartContainer config={levelChartConfig} className="min-h-[200px] w-full h-80">
                  <AreaChart accessibilityLayer data={timelineData} margin={{ left: 12, right: 24 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    />
                     <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      cursor={true}
                      content={
                        <ChartTooltipContent
                          indicator="line"
                          labelFormatter={(label) => new Date(parseInt(label)).toLocaleString()}
                        />
                      }
                    />
                    <defs>
                      <linearGradient id="fillError" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={levelChartConfig.ERROR.color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={levelChartConfig.ERROR.color} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="fillWarn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={levelChartConfig.WARN.color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={levelChartConfig.WARN.color} stopOpacity={0.1}/>
                      </linearGradient>
                       <linearGradient id="fillInfo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={levelChartConfig.INFO.color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={levelChartConfig.INFO.color} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area dataKey="ERROR" type="natural" fill="url(#fillError)" strokeWidth={2} stroke={levelChartConfig.ERROR.color} stackId="a" />
                    <Area dataKey="WARN" type="natural" fill="url(#fillWarn)" strokeWidth={2} stroke={levelChartConfig.WARN.color} stackId="a" />
                    <Area dataKey="INFO" type="natural" fill="url(#fillInfo)" strokeWidth={2} stroke={levelChartConfig.INFO.color} stackId="a" />
                  </AreaChart>
                </ChartContainer>
             ) : (
                <div className="flex flex-col items-center justify-center h-80 rounded-lg border-2 border-dashed border-border">
                    <p className="text-muted-foreground text-center">Not enough timestamp data to show timeline.</p>
                     <p className="text-sm text-muted-foreground text-center">Ensure logs have valid timestamps.</p>
                </div>
             )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
