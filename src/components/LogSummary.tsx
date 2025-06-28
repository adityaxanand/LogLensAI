import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Loader2 } from 'lucide-react';

interface LogSummaryProps {
  summary: string;
  summaryAudio: string | null;
  isAudioLoading: boolean;
}

export function LogSummary({ summary, summaryAudio, isAudioLoading }: LogSummaryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
            <CardTitle>AI-Generated Summary</CardTitle>
            <Bot className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-center gap-2">
            {isAudioLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading audio summary" />}
            {summaryAudio && !isAudioLoading && (
                <audio controls src={summaryAudio} className="h-8 max-w-[250px]">
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{summary}</p>
      </CardContent>
    </Card>
  );
}
