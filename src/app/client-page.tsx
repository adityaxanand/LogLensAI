'use client';
import { useState, useEffect } from 'react';
import { proposeSolutions, type ProposeSolutionsOutput } from '@/ai/flows/propose-solutions';
import { summarizeLogs } from '@/ai/flows/summarize-logs';
import { categorizeLogs } from '@/ai/flows/categorize-logs';
import { generateSpeech } from '@/ai/flows/generate-speech';
import { generateDialogue } from '@/ai/flows/generate-dialogue';
import { Header } from '@/components/Header';
import { LogUploader } from '@/components/LogUploader';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import type { LogEntry } from '@/types';
import { BotMessageSquare, FileText } from 'lucide-react';
import pako from 'pako';
import { SettingsDialog } from '@/components/SettingsDialog';

// Helper functions for URL state
const compressAndEncode = (str: string): string => {
  if (!str) return '';
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(str);
  const compressed = pako.deflate(data);
  const binaryString = String.fromCharCode.apply(null, Array.from(compressed));
  return btoa(binaryString);
};

const decodeAndDecompress = (encoded: string): string => {
  if (!encoded) return '';
  try {
    const binaryString = atob(encoded);
    const compressed = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        compressed[i] = binaryString.charCodeAt(i);
    }
    const decompressed = pako.inflate(compressed);
    const textDecoder = new TextDecoder();
    return textDecoder.decode(decompressed);
  } catch (e) {
    console.error("Failed to decode or decompress data from URL", e);
    window.location.hash = '';
    return '';
  }
};

export function ClientPage() {
  const [logData, setLogData] = useState('');
  const [parsedLogs, setParsedLogs] = useState<LogEntry[]>([]);
  const [proposedSolutions, setProposedSolutions] = useState<ProposeSolutionsOutput['solutions']>([]);
  const [logSummary, setLogSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisPerformed, setAnalysisPerformed] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [alertSettings, setAlertSettings] = useState<{ keyword: string; level: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [summaryAudio, setSummaryAudio] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [dialogueAudio, setDialogueAudio] = useState<string | null>(null);
  const [isDialogueLoading, setIsDialogueLoading] = useState(false);


  // Effect to run analysis from URL on initial load
  useEffect(() => {
    if (window.location.hash) {
      const decodedData = decodeAndDecompress(window.location.hash.substring(1));
      if (decodedData) {
        setLogData(decodedData);
        setTimeout(() => handleAnalyze(decodedData), 0);
      }
    }
    setIsInitialLoad(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async (data: string | null = null) => {
    const currentLogData = data ?? logData;
    if (!currentLogData.trim()) return;

    setIsLoading(true);
    setAnalysisPerformed(true);
    setSummaryAudio(null);
    setDialogueAudio(null);
    
    if (!isInitialLoad) {
        const encoded = compressAndEncode(currentLogData);
        window.history.replaceState(null, '', '#' + encoded);
    }

    try {
      const [solutionsResult, summaryResult, categorizationResult] = await Promise.all([
        proposeSolutions({ logData: currentLogData }),
        summarizeLogs({ logData: currentLogData }),
        categorizeLogs({ logData: currentLogData }),
      ]);

      const categorizedEntries: LogEntry[] = categorizationResult.logs.map((log, index) => ({
        id: index,
        originalLine: log.originalLine,
        timestamp: log.timestamp ? new Date(log.timestamp) : null,
        level: log.level.toUpperCase(),
        message: log.message,
        category: log.category || 'Uncategorized',
      }));
      setParsedLogs(categorizedEntries);
      setProposedSolutions(solutionsResult.solutions);
      setLogSummary(summaryResult.summary);
      setIsLoading(false);

      // Asynchronously generate audio without blocking the UI
      if (summaryResult.summary) {
        setIsAudioLoading(true);
        generateSpeech({ text: summaryResult.summary })
          .then(audioResult => setSummaryAudio(audioResult.media))
          .catch(audioError => {
            console.error('Failed to generate summary audio:', audioError);
            setSummaryAudio(null);
          })
          .finally(() => setIsAudioLoading(false));
      }
      
      if (solutionsResult.solutions && solutionsResult.solutions.length > 0) {
        setIsDialogueLoading(true);
        generateDialogue({ solutions: solutionsResult.solutions })
          .then(dialogueResult => generateSpeech({ text: dialogueResult.dialogue }))
          .then(audioResult => setDialogueAudio(audioResult.media))
          .catch(dialogueError => {
            console.error('Failed to generate dialogue audio:', dialogueError);
            setDialogueAudio(null);
          })
          .finally(() => setIsDialogueLoading(false));
      }

    } catch (error) {
      console.error('AI analysis failed:', error);
      setLogSummary('An error occurred during log summarization.');
      setProposedSolutions([]);
      setParsedLogs([]);
      setIsLoading(false);
      setIsAudioLoading(false);
      setIsDialogueLoading(false);
    }
  };

  const handleSetupAlert = (keyword: string) => {
    setAlertSettings({ keyword, level: 'ERROR' });
    setActiveTab('alerts');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <LogUploader
              logData={logData}
              setLogData={setLogData}
              onAnalyze={() => handleAnalyze()}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            {analysisPerformed ? (
              isLoading ? (
                <div className="flex flex-col items-center justify-center h-96 rounded-lg border-2 border-dashed border-border">
                  <BotMessageSquare className="h-16 w-16 text-primary animate-pulse" />
                  <p className="mt-4 text-muted-foreground">AI is analyzing your logs...</p>
                </div>
              ) : (
                <AnalysisDashboard
                  logs={parsedLogs}
                  logSummary={logSummary}
                  proposedSolutions={proposedSolutions}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  alertSettings={alertSettings}
                  onSetupAlert={handleSetupAlert}
                  summaryAudio={summaryAudio}
                  isAudioLoading={isAudioLoading}
                  dialogueAudio={dialogueAudio}
                  isDialogueLoading={isDialogueLoading}
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-96 rounded-lg border-2 border-dashed border-border">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground text-center">Your analysis results will appear here.</p>
                <p className="mt-1 text-sm text-muted-foreground text-center">Paste logs or load a shared URL to get started.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
