'use server';

/**
 * @fileOverview A flow for suggesting actionable milestones for a given task.
 *
 * - suggestTaskMilestones - A function that suggests milestones for a task.
 * - SuggestTaskMilestonesInput - The input type for the suggestTaskMilestones function.
 * - SuggestTaskMilestonesOutput - The return type for the suggestTaskMilestones function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskMilestonesInputSchema = z.object({
  title: z.string().describe('The title of the task.'),
  description: z.string().optional().describe('The description of the task.'),
});
export type SuggestTaskMilestonesInput = z.infer<
  typeof SuggestTaskMilestonesInputSchema
>;

const SuggestTaskMilestonesOutputSchema = z.object({
  milestones: z
    .array(z.string())
    .describe(
      'A list of suggested, actionable milestones to complete the task.'
    ),
});
export type SuggestTaskMilestonesOutput = z.infer<
  typeof SuggestTaskMilestonesOutputSchema
>;

export async function suggestTaskMilestones(
  input: SuggestTaskMilestonesInput
): Promise<SuggestTaskMilestonesOutput> {
  return suggestTaskMilestonesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskMilestonesPrompt',
  input: {schema: SuggestTaskMilestonesInputSchema},
  output: {schema: SuggestTaskMilestonesOutputSchema},
  prompt: `You are an expert project manager. Based on the task title and description, break it down into a short list of 3-5 actionable milestones or checkpoints.

  Task Title: {{{title}}}
  {{#if description}}Task Description: {{{description}}}{{/if}}

  Provide a list of clear, concise milestones that would help someone complete this task.
  `,
});

const suggestTaskMilestonesFlow = ai.defineFlow(
  {
    name: 'suggestTaskMilestonesFlow',
    inputSchema: SuggestTaskMilestonesInputSchema,
    outputSchema: SuggestTaskMilestonesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
