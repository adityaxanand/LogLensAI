'use server';
/**
 * @fileOverview An AI agent for categorizing log entries.
 *
 * - categorizeLogs - A function that handles the log categorization process.
 * - CategorizeLogsInput - The input type for the categorizeLogs function.
 * - CategorizeLogsOutput - The return type for the categorizeLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeLogsInputSchema = z.object({
  logData: z
    .string()
    .describe("Log data as a string, with each entry on a new line."),
});
export type CategorizeLogsInput = z.infer<typeof CategorizeLogsInputSchema>;

const LogEntrySchema = z.object({
    originalLine: z.string().describe("The original, unmodified log line."),
    timestamp: z.string().nullable().optional().describe("The timestamp of the log entry in ISO 8601 format. If a timestamp cannot be found or parsed, this MUST be null."),
    level: z.string().describe("The log level (e.g., 'INFO', 'WARN', 'ERROR'). Infer if not explicit."),
    message: z.string().describe("The main message content of the log entry."),
    category: z.string().describe("A concise, high-level category for the log message based on its content (e.g., 'Authentication', 'Database', 'API Request', 'Background Job'). Group similar messages under the same category."),
});

const CategorizeLogsOutputSchema = z.object({
  logs: z.array(LogEntrySchema).describe('A structured list of all categorized log entries.'),
});
export type CategorizeLogsOutput = z.infer<typeof CategorizeLogsOutputSchema>;

export async function categorizeLogs(input: CategorizeLogsInput): Promise<CategorizeLogsOutput> {
  try {
    return await categorizeLogsFlow(input);
  } catch (e: any) {
    console.error("Error in categorizeLogs flow:", e);
    throw new Error(e.message || 'An unexpected error occurred during log categorization.');
  }
}

const prompt = ai.definePrompt({
  name: 'categorizeLogsPrompt',
  input: {schema: CategorizeLogsInputSchema},
  output: {schema: CategorizeLogsOutputSchema},
  prompt: `You are a log analysis expert. Your task is to process a block of raw log data and structure it.

For each line in the log data, you will perform the following actions:
1.  Parse the line to extract its components: timestamp, log level, and message. Also include the original line in your output.
2.  Analyze the content of the log message to determine a meaningful, high-level category. Examples of categories include 'Authentication', 'Database', 'API Request', 'Performance', 'Background Job', or 'Configuration'.
3.  Be consistent with your categorization. Similar log messages should receive the same category.
4.  If a timestamp is not present or cannot be parsed, you MUST represent it as null.
5.  If a log level is not explicit, infer it from the message content (e.g., words like 'failed' or 'error' imply 'ERROR') or default to 'INFO'.
6.  Return the final result as a JSON object containing a list of structured log entries.

Log Data:
{{{logData}}}
`,
});

const categorizeLogsFlow = ai.defineFlow(
  {
    name: 'categorizeLogsFlow',
    inputSchema: CategorizeLogsInputSchema,
    outputSchema: CategorizeLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI model failed to categorize logs. No output was returned.');
    }
    return output;
  }
);
