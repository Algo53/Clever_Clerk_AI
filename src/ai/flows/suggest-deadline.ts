// src/ai/flows/suggest-deadline.ts
'use server';
/**
 * @fileOverview A flow for suggesting deadlines for tasks based on user context and task complexity.
 *
 * - suggestDeadline - A function that suggests a deadline for a task.
 * - SuggestDeadlineInput - The input type for the suggestDeadline function.
 * - SuggestDeadlineOutput - The return type for the suggestDeadline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDeadlineInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  contextEntries: z.string().optional().describe('The user context entries for the day.'),
  taskComplexity: z.string().optional().describe('The complexity of the task (e.g., easy, medium, hard).'),
});
export type SuggestDeadlineInput = z.infer<typeof SuggestDeadlineInputSchema>;

const SuggestDeadlineOutputSchema = z.object({
  suggestedDeadline: z.string().describe('The suggested deadline for the task in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ).'),
  reasoning: z.string().describe('The reasoning behind the suggested deadline.'),
});
export type SuggestDeadlineOutput = z.infer<typeof SuggestDeadlineOutputSchema>;

export async function suggestDeadline(input: SuggestDeadlineInput): Promise<SuggestDeadlineOutput> {
  return suggestDeadlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDeadlinePrompt',
  input: {schema: SuggestDeadlineInputSchema},
  output: {schema: SuggestDeadlineOutputSchema},
  prompt: `You are a helpful assistant that suggests deadlines for tasks based on user context and task complexity.

  Consider the following task description, context entries, and task complexity to suggest a deadline for the task.
  The deadline should be based on how long the task takes, and when they should do it based on their other context entries.

  Task Description: {{{taskDescription}}}
  {{#if contextEntries}}Context Entries: {{{contextEntries}}}{{/if}}
  {{#if taskComplexity}}Task Complexity: {{{taskComplexity}}}{{/if}}

  Suggest a deadline in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ) and provide a reasoning for the suggested deadline.
  Format the response as a JSON object.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestDeadlineFlow = ai.defineFlow(
  {
    name: 'suggestDeadlineFlow',
    inputSchema: SuggestDeadlineInputSchema,
    outputSchema: SuggestDeadlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
