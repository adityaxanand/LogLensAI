'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type ProposeSolutionsOutput } from '@/ai/flows/propose-solutions';
import { BrainCircuit, FlaskConical, Lightbulb, ListOrdered, Telescope, Wrench, BellPlus, Loader2, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type Solution = ProposeSolutionsOutput['solutions'][0];

interface SolutionSimulatorProps {
  solutions: Solution[];
  onSetupAlert: (keyword: string) => void;
  dialogueAudio: string | null;
  isDialogueLoading: boolean;
}

export function SolutionSimulator({ solutions, onSetupAlert, dialogueAudio, isDialogueLoading }: SolutionSimulatorProps) {
  if (!solutions || solutions.length === 0) {
    return (
        <Card className="border-dashed">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Telescope className="h-6 w-6 text-accent" />
                    <CardTitle>No Critical Anomalies Detected</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">The AI analysis did not find any high-priority issues or anomalies in the provided logs. The system appears to be stable.</p>
            </CardContent>
        </Card>
    );
  }

  const getConfidenceColor = (score: number) => {
    if (score > 80) return 'bg-green-500';
    if (score > 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className='flex justify-between items-start'>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <Wrench className="h-6 w-6 text-primary" />
                    <CardTitle>AI Solution Simulator & Root Cause Analysis</CardTitle>
                </div>
                <CardDescription className="mt-1.5">Actionable recommendations from our AI to address detected issues, including simulated outcomes.</CardDescription>
            </div>
            <div className="flex items-center gap-2 pl-4">
                {isDialogueLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading audio dialogue" />}
                {dialogueAudio && !isDialogueLoading && (
                    <div className='flex flex-col items-center gap-2'>
                        <audio controls src={dialogueAudio} className="h-8 max-w-[250px] min-w-[200px]">
                            Your browser does not support the audio element.
                        </audio>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>SRE Dialogue</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {solutions.map((solution, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-base hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                    <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">{solution.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                
                <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-muted-foreground" />Root Cause Analysis</h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">{solution.rootCauseAnalysis}</p>
                </div>

                <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><ListOrdered className="h-5 w-5 text-muted-foreground" />Step-by-Step Guide</h4>
                    <ol className="list-decimal space-y-2 py-2 pl-6 pr-2 text-sm text-foreground/80 border-l border-border">
                        {solution.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="pl-1 leading-relaxed">{step}</li>
                        ))}
                    </ol>
                </div>

                <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><FlaskConical className="h-5 w-5 text-muted-foreground" />Simulated Outcome</h4>
                    <div className="p-3 bg-muted/50 rounded-md font-mono text-xs text-accent whitespace-pre-wrap border border-dashed border-accent/20">
                        {solution.simulatedOutcome}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2">Confidence Score</h4>
                        <div className="flex items-center gap-3">
                            <Progress value={solution.confidenceScore} className="w-full h-3" indicatorClassName={getConfidenceColor(solution.confidenceScore)} />
                            <Badge variant="outline" className="text-base font-bold w-20 justify-center">{solution.confidenceScore}%</Badge>
                        </div>
                    </div>
                     <Button variant="outline" onClick={() => onSetupAlert(solution.title)}>
                        <BellPlus className="mr-2 h-4 w-4" /> Create Alert for this Issue
                    </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
