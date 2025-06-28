'use client';

import { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { LogEntry } from '@/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { CheckIcon, ChevronsUpDown, Download, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';


const levelConfig: Record<string, { badge: 'destructive' | 'secondary' | 'default' | 'outline', color: string }> = {
  ERROR: { badge: 'destructive', color: 'text-destructive' },
  WARN: { badge: 'default', color: 'text-primary' },
  INFO: { badge: 'secondary', color: 'text-accent-foreground' },
  DEBUG: { badge: 'outline', color: 'text-muted-foreground' },
  UNKNOWN: { badge: 'outline', color: 'text-muted-foreground' },
};

const ALL_LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'UNKNOWN'];

export function LogViewer({ logs }: {logs: LogEntry[]}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const allCategories = useMemo(() => {
    if (!logs) return [];
    return Array.from(new Set(logs.map(log => log.category || 'Uncategorized'))).sort();
  }, [logs]);

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedCategories(new Set(allCategories));
    setSelectedLevels(new Set(ALL_LEVELS));
  }, [allCategories]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(category);
      else newSet.delete(category);
      return newSet;
    });
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    setSelectedLevels(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(level);
      else newSet.delete(level);
      return newSet;
    });
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const categoryMatch = selectedCategories.size === 0 || selectedCategories.has(log.category || 'Uncategorized');
      const levelMatch = selectedLevels.size === 0 || selectedLevels.has(log.level.toUpperCase());
      const searchMatch = searchTerm ? log.originalLine.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      return categoryMatch && searchMatch && levelMatch;
    });
  }, [logs, searchTerm, selectedCategories, selectedLevels]);

  const clearFilters = () => {
    setSelectedCategories(new Set(allCategories));
    setSelectedLevels(new Set(ALL_LEVELS));
    setSearchTerm('');
  };
  
  const handleDownload = () => {
    const logText = filteredLogs.map(log => log.originalLine).join('\\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Input
            placeholder="Search all log fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  Filter by Category
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandList>
                    <CommandEmpty>No categories found.</CommandEmpty>
                    <CommandGroup>
                      {allCategories.map(category => (
                        <CommandItem key={category} onSelect={() => handleCategoryChange(category, !selectedCategories.has(category))} className="cursor-pointer">
                          <CheckIcon className={cn("mr-2 h-4 w-4", selectedCategories.has(category) ? "opacity-100" : "opacity-0")} />
                          {category}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  Filter by Level
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search levels..." />
                  <CommandList>
                    <CommandEmpty>No levels found.</CommandEmpty>
                    <CommandGroup>
                      {ALL_LEVELS.map(level => (
                        <CommandItem key={level} onSelect={() => handleLevelChange(level, !selectedLevels.has(level))} className="cursor-pointer">
                          <CheckIcon className={cn("mr-2 h-4 w-4", selectedLevels.has(level) ? "opacity-100" : "opacity-0")} />
                          {level}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" onClick={clearFilters}><X className="mr-2 h-4 w-4" />Clear</Button>
            <Button variant="outline" onClick={handleDownload} disabled={filteredLogs.length === 0}><Download className="mr-2 h-4 w-4" />Download</Button>
          </div>
        </div>
        <ScrollArea className="h-[600px] rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[220px]">Timestamp</TableHead>
                <TableHead className="w-[120px]">Level</TableHead>
                <TableHead className="w-[180px]">Category</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.timestamp?.toLocaleString() ?? 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={levelConfig[log.level]?.badge ?? 'outline'} className="capitalize">{log.level.toLowerCase()}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.category}</TableCell>
                  <TableCell className={cn("font-mono text-xs", levelConfig[log.level]?.color ?? 'text-foreground')}>
                    {log.message}
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No results found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs.length.toLocaleString()} of {logs.length.toLocaleString()} log entries.
        </div>
      </CardContent>
    </Card>
  );
}
