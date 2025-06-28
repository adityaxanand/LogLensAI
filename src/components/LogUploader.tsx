'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TestTube2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface LogUploaderProps {
  logData: string;
  setLogData: Dispatch<SetStateAction<string>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

export function LogUploader({ logData, setLogData, onAnalyze, isLoading }: LogUploaderProps) {
  const sampleLog = `2023-10-27T10:00:00.123Z [INFO] User 'admin' logged in successfully.
2023-10-27T10:01:15.456Z [INFO] Starting background job: 'daily-report'.
2023-10-27T10:02:30.789Z [WARN] API response time is high: 1500ms for endpoint '/api/data'.
2023-10-27T10:02:31.123Z [DEBUG] Database query: SELECT * FROM users WHERE id = 123
2023-10-27T10:03:00.999Z [ERROR] Failed to connect to database: Connection refused.
2023-10-27T10:03:01.456Z [ERROR] Unhandled exception in background job 'daily-report': NullPointerException.
`;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Log Input</CardTitle>
        <CardDescription>
          Paste your raw log data below or{' '}
          <Button variant="link" className="p-0 h-auto" onClick={() => setLogData(sampleLog)}>
            load sample data
          </Button>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your logs here..."
          value={logData}
          onChange={(e) => setLogData(e.target.value)}
          className="h-64 font-mono text-xs border-dashed border-2"
          rows={15}
        />
        <Button onClick={onAnalyze} disabled={isLoading || !logData.trim()} className="w-full text-lg py-6">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TestTube2 className="mr-2 h-5 w-5" />
              Run Analysis
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
