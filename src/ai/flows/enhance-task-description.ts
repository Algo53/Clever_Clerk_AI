'use server';

/**
 * @fileOverview A flow for enhancing task descriptions by incorporating relevant details from context entries.
 *
 * - enhanceTaskDescription - A function that enhances the task description.
 * - EnhanceTaskDescriptionInput - The input type for the enhanceTaskDescription function.
 * - EnhanceTaskDescriptionOutput - The return type for the enhanceTaskDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceTaskDescriptionInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The original task description to be enhanced.'),
  contextEntries: z
    .string()
    .describe('The context entries for the day, as a single string.'),
});
export type EnhanceTaskDescriptionInput = z.infer<
  typeof EnhanceTaskDescriptionInputSchema
>;

const EnhanceTaskDescriptionOutputSchema = z.object({
  enhancedTaskDescription: z
    .string()
    .describe('The enhanced task description with context-aware details.'),
});
export type EnhanceTaskDescriptionOutput = z.infer<
  typeof EnhanceTaskDescriptionOutputSchema
>;

export async function enhanceTaskDescription(
  input: EnhanceTaskDescriptionInput
): Promise<EnhanceTaskDescriptionOutput> {
  return enhanceTaskDescriptionFlow(input);
}

const enhanceTaskDescriptionPrompt = ai.definePrompt({
  name: 'enhanceTaskDescriptionPrompt',
  input: {schema: EnhanceTaskDescriptionInputSchema},
  output: {schema: EnhanceTaskDescriptionOutputSchema},
  prompt: `You are an AI assistant designed to enhance task descriptions by incorporating relevant details from daily context entries.

  Original Task Description: {{{taskDescription}}}

  Daily Context Entries: {{{contextEntries}}}

  Please provide an enhanced task description that includes specific and actionable details from the context entries to provide a more complete and informative understanding of what needs to be done.
  Focus on identifying the most relevant information to improve the task description.
  The enhanced task description should be clear and concise.`,
});

const enhanceTaskDescriptionFlow = ai.defineFlow(
  {
    name: 'enhanceTaskDescriptionFlow',
    inputSchema: EnhanceTaskDescriptionInputSchema,
    outputSchema: EnhanceTaskDescriptionOutputSchema,
  },
  async input => {
    const {output} = await enhanceTaskDescriptionPrompt(input);
    return output!;
  }
);
