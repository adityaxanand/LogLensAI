/**
 * @fileOverview Shared Zod schemas for AI flows.
 */
import {z} from 'genkit';

export const SolutionSchema = z.object({
  title: z.string().describe('A short, descriptive title for the proposed solution.'),
  rootCauseAnalysis: z.string().describe("A detailed explanation of the issue's underlying cause, formatted as plain text without any markdown."),
  steps: z.array(z.string()).describe('A list of concrete, numbered, technical steps to resolve the issue, with each step as a plain text string.'),
  confidenceScore: z.number().min(0).max(100).describe('The AI\'s confidence in this analysis, from 0 to 100.'),
  simulatedOutcome: z.string().describe('A simulated log snippet showing what the logs might look like after the fix is applied. This should reflect a healthy or resolved state.'),
});

export const ProposeSolutionsOutputSchema = z.object({
  solutions: z.array(SolutionSchema).describe('A list of proposed solutions for the most critical issues found. If no significant issues are found, this can be an empty array.'),
});
