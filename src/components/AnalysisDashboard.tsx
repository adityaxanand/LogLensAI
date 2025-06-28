import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { LogEntry } from '@/types';
import { LogSummary } from './LogSummary';
import { LogAnalysisCharts } from './LogAnalysisCharts';
import { LogViewer } from './LogViewer';
import { AlertConfiguration } from './AlertConfiguration';
import { SolutionSimulator } from './SolutionSimulator';
import type { ProposeSolutionsOutput } from '@/ai/flows/propose-solutions';
import { AlertTriangle, Bell, Bot, GanttChartSquare, List, ShieldAlert, Siren } from 'lucide-react';
import { StatCard } from './StatCard';
import type { Dispatch, SetStateAction } from 'react';


interface AnalysisDashboardProps {
  logs: LogEntry[];
  logSummary: string;
  proposedSolutions: ProposeSolutionsOutput['solutions'];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  alertSettings: { keyword: string; level: string } | null;
  onSetupAlert: (keyword: string) => void;
  summaryAudio: string | null;
  isAudioLoading: boolean;
  dialogueAudio: string | null;
  isDialogueLoading: boolean;
}

export function AnalysisDashboard({ 
  logs, 
  logSummary, 
  proposedSolutions, 
  activeTab,
  setActiveTab,
  alertSettings,
  onSetupAlert,
  summaryAudio,
  isAudioLoading,
  dialogueAudio,
  isDialogueLoading,
}: AnalysisDashboardProps) {
  const stats = {
    total: logs.length,
    errors: logs.filter(log => log.level === 'ERROR').length,
    warnings: logs.filter(log => log.level === 'WARN').length,
    anomalies: proposedSolutions.length,
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">
          <GanttChartSquare className="mr-2 h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="logs">
          <List className="mr-2 h-4 w-4" />
          Log Explorer
        </TabsTrigger>
        <TabsTrigger value="alerts">
          <Bell className="mr-2 h-4 w-4" />
          Alerting
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Logs" value={stats.total.toLocaleString()} icon={List} />
            <StatCard title="Errors" value={stats.errors.toLocaleString()} icon={AlertTriangle} variant="destructive" />
            <StatCard title="Warnings" value={stats.warnings.toLocaleString()} icon={Siren} variant="warning" />
            <StatCard title="Anomalies" value={stats.anomalies.toLocaleString()} icon={ShieldAlert} variant="destructive" />
        </div>

        <div className="grid gap-6">
          <LogSummary summary={logSummary} summaryAudio={summaryAudio} isAudioLoading={isAudioLoading} />
        </div>
        
        <SolutionSimulator 
            solutions={proposedSolutions} 
            onSetupAlert={onSetupAlert}
            dialogueAudio={dialogueAudio}
            isDialogueLoading={isDialogueLoading}
        />

        <LogAnalysisCharts logs={logs} />
      </TabsContent>

      <TabsContent value="logs" className="mt-6">
          <LogViewer logs={logs} />
      </TabsContent>
      
      <TabsContent value="alerts" className="mt-6">
        <AlertConfiguration settings={alertSettings} />
      </TabsContent>
    </Tabs>
  );
}
