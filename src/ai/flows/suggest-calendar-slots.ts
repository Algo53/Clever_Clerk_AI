// src/ai/flows/suggest-calendar-slots.ts
'use server';

/**
 * @fileOverview Suggests calendar/time-blocking slots based on user context and tasks.
 *
 * - suggestCalendarSlots - A function that suggests calendar slots.
 * - SuggestCalendarSlotsInput - The input type for the suggestCalendarSlots function.
 * - SuggestCalendarSlotsOutput - The return type for the suggestCalendarSlots function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCalendarSlotsInputSchema = z.object({
  context: z
    .string()
    .describe('The daily context entries, including WhatsApp messages, emails, and notes.'),
  tasks: z.string().describe('A list of tasks to be scheduled.'),
});
export type SuggestCalendarSlotsInput = z.infer<typeof SuggestCalendarSlotsInputSchema>;

const SuggestCalendarSlotsOutputSchema = z.object({
  suggestedSlots: z
    .array(z.string())
    .describe('A list of suggested calendar slots in ISO format.'),
  reasoning: z.string().describe('The reasoning behind the suggested slots.'),
});
export type SuggestCalendarSlotsOutput = z.infer<typeof SuggestCalendarSlotsOutputSchema>;

export async function suggestCalendarSlots(input: SuggestCalendarSlotsInput): Promise<SuggestCalendarSlotsOutput> {
  return suggestCalendarSlotsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCalendarSlotsPrompt',
  input: {schema: SuggestCalendarSlotsInputSchema},
  output: {schema: SuggestCalendarSlotsOutputSchema},
  prompt: `You are a personal assistant helping the user to schedule their tasks in a calendar.

  Given the following context and tasks, suggest calendar slots in ISO format to complete the tasks.
  Explain your reasoning behind the suggested slots.

  Context: {{{context}}}
  Tasks: {{{tasks}}}

  Return the suggested slots and reasoning in the format specified in the output schema.
  `,
});

const suggestCalendarSlotsFlow = ai.defineFlow(
  {
    name: 'suggestCalendarSlotsFlow',
    inputSchema: SuggestCalendarSlotsInputSchema,
    outputSchema: SuggestCalendarSlotsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
