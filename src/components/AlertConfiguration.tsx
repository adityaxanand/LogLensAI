'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BellPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AlertConfigurationProps {
  settings: { keyword: string; level: string } | null;
}

export function AlertConfiguration({ settings }: AlertConfigurationProps) {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState('ERROR');

  useEffect(() => {
    if (settings) {
      setKeyword(settings.keyword);
      setLevel(settings.level);
    }
  }, [settings]);

  const handleCreateAlert = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Alert Configured',
      description: `You will be notified for '${level}' events with keyword '${keyword}'.`,
      className: 'bg-accent text-accent-foreground border-accent-foreground/20',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Alerts</CardTitle>
        <CardDescription>Set up notifications for specific log events. You can get suggestions from the AI analysis on the overview tab.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="log-level">Log Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="log-level">
                <SelectValue placeholder="Select log level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ERROR">ERROR</SelectItem>
                <SelectItem value="WARN">WARN</SelectItem>
                <SelectItem value="INFO">INFO</SelectItem>
                <SelectItem value="ANY">ANY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyword">Keyword</Label>
            <Input 
              id="keyword" 
              placeholder="e.g., 'database connection', 'timeout'" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            <BellPlus className="mr-2 h-4 w-4" /> Create Alert
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
