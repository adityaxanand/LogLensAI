'use server';
/**
 * @fileOverview Creates a conversational dialogue from a solution analysis.
 *
 * - generateDialogue - A function that takes solution data and returns a script.
 * - GenerateDialogueInput - The input type for the generateDialogue function.
 * - GenerateDialogueOutput - The return type for the generateDialogue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ProposeSolutionsOutputSchema } from '@/ai/schemas';

const GenerateDialogueInputSchema = ProposeSolutionsOutputSchema;
export type GenerateDialogueInput = z.infer<typeof GenerateDialogueInputSchema>;

const GenerateDialogueOutputSchema = z.object({
  dialogue: z.string().describe('The generated dialogue script with speaker tags (e.g., Speaker1:, Speaker2:).'),
});
export type GenerateDialogueOutput = z.infer<typeof GenerateDialogueOutputSchema>;


export async function generateDialogue(input: GenerateDialogueInput): Promise<GenerateDialogueOutput> {
  try {
    return await generateDialogueFlow(input);
  } catch (e: any) {
    console.error("Error in generateDialogue flow:", e);
    throw new Error(e.message || 'An unexpected error occurred during dialogue generation.');
  }
}

const prompt = ai.definePrompt({
  name: 'generateDialoguePrompt',
  input: {schema: GenerateDialogueInputSchema},
  output: {schema: GenerateDialogueOutputSchema},
  prompt: `You are an expert scriptwriter for technical educational content.

Your task is to create a short, insightful dialogue between a senior Site Reliability Engineer (SRE), "Speaker1," and a junior SRE, "Speaker2."

The dialogue must be based on the provided list of solutions for issues detected in server logs. The senior SRE should explain one of the primary issues, its root cause, and the proposed step-by-step solution to the junior SRE in a clear, mentoring tone. The junior SRE can ask clarifying questions.

Keep the dialogue concise and focused on the technical details.

Format the output as a single string, with each line prefixed by "Speaker1: " or "Speaker2: ".

Here is the analysis data:
{{{json input}}}
`,
});

const generateDialogueFlow = ai.defineFlow(
  {
    name: 'generateDialogueFlow',
    inputSchema: GenerateDialogueInputSchema,
    outputSchema: GenerateDialogueOutputSchema,
  },
  async (input) => {
    if (!input.solutions || input.solutions.length === 0) {
      return { dialogue: '' };
    }
    
    // To keep the prompt focused, we only use the first, most critical solution.
    const focusedInput = { solutions: [input.solutions[0]] };

    const {output} = await prompt(focusedInput);
    if (!output) {
      throw new Error('The AI model failed to generate a dialogue. No output was returned.');
    }
    return output;
  }
);
