'use server';

/**
 * @fileOverview Summarizes server logs to provide a concise report of key events, errors, and performance metrics.
 *
 * - summarizeLogs - A function that takes log data as input and returns a summarized report.
 * - SummarizeLogsInput - The input type for the summarizeLogs function.
 * - SummarizeLogsOutput - The return type for the summarizeLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLogsInputSchema = z.object({
  logData: z
    .string()
    .describe('The log data to be summarized.'),
});
export type SummarizeLogsInput = z.infer<typeof SummarizeLogsInputSchema>;

const SummarizeLogsOutputSchema = z.object({
  summary: z.string().describe('A summarized report of the key events, errors, and performance metrics.'),
});
export type SummarizeLogsOutput = z.infer<typeof SummarizeLogsOutputSchema>;

export async function summarizeLogs(input: SummarizeLogsInput): Promise<SummarizeLogsOutput> {
  try {
    return await summarizeLogsFlow(input);
  } catch (e: any) {
    console.error("Error in summarizeLogs flow:", e);
    throw new Error(e.message || 'An unexpected error occurred during log summarization.');
  }
}

const prompt = ai.definePrompt({
  name: 'summarizeLogsPrompt',
  input: {schema: SummarizeLogsInputSchema},
  output: {schema: SummarizeLogsOutputSchema},
  prompt: `You are an expert DevOps engineer specializing in analyzing server logs.

You will receive server logs as input and generate a concise, human-readable summary of the key events, errors, and performance metrics.

Log Data:
{{{logData}}}`,
});

const summarizeLogsFlow = ai.defineFlow(
  {
    name: 'summarizeLogsFlow',
    inputSchema: SummarizeLogsInputSchema,
    outputSchema: SummarizeLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error('The AI model failed to summarize logs. No output was returned.');
    }
    return output;
  }
);
