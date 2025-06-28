'use server';
/**
 * @fileOverview An advanced AI agent for root cause analysis and solution simulation.
 *
 * - proposeSolutions - A function that handles the solution proposal process.
 * - ProposeSolutionsInput - The input type for the proposeSolutions function.
 * - ProposeSolutionsOutput - The return type for the proposeSolutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ProposeSolutionsOutputSchema } from '@/ai/schemas';

const ProposeSolutionsInputSchema = z.object({
  logData: z
    .string()
    .describe("A string containing multiple log entries, each on a new line."),
});
export type ProposeSolutionsInput = z.infer<typeof ProposeSolutionsInputSchema>;
export type ProposeSolutionsOutput = z.infer<typeof ProposeSolutionsOutputSchema>;


export async function proposeSolutions(input: ProposeSolutionsInput): Promise<ProposeSolutionsOutput> {
  try {
    return await proposeSolutionsFlow(input);
  } catch (e: any) {
    console.error("Error in proposeSolutions flow:", e);
    throw new Error(e.message || 'An unexpected error occurred while proposing solutions.');
  }
}

const prompt = ai.definePrompt({
  name: 'proposeSolutionsPrompt',
  input: {schema: ProposeSolutionsInputSchema},
  output: {schema: ProposeSolutionsOutputSchema},
  prompt: `You are a world-class site reliability engineer (SRE) with deep expertise in root cause analysis.

You will analyze the provided log data to identify critical errors, security threats, and performance bottlenecks.

For each major issue you identify, you must provide a comprehensive solution proposal with the following components:
1.  **Title**: A concise heading for the solution.
2.  **Root Cause Analysis**: A thorough but easy-to-understand explanation of the fundamental problem. This field must be plain text without any markdown formatting (e.g., no '**').
3.  **Step-by-Step Guide**: A list of clear, actionable steps for an engineer. Each step in the array should be a complete, numbered sentence (e.g., "1. Investigate database performance."). Do not use markdown.
4.  **Confidence Score**: Your confidence level (0-100) that your analysis is correct.
5.  **Simulated Outcome**: A small, realistic snippet of what the logs would look like after your proposed fix is implemented, demonstrating a successful resolution.

If there are no critical issues, return an empty array for the solutions.

Log Data:
{{{logData}}}
`,
});

const proposeSolutionsFlow = ai.defineFlow(
  {
    name: 'proposeSolutionsFlow',
    inputSchema: ProposeSolutionsInputSchema,
    outputSchema: ProposeSolutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI model failed to propose solutions. No output was returned.');
    }
    return output;
  }
);
