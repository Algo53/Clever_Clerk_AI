'use server';

/**
 * @fileOverview An AI agent that prioritizes tasks based on urgency and context.
 *               It takes a list of tasks and context entries as input and returns
 *               the tasks with updated priority scores.
 *
 * - prioritizeTasks - A function that handles the task prioritization process.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.number().optional(),
});

const ContextEntrySchema = z.object({
  id: z.string(),
  content: z.string(),
  timestamp: z.string(),
});

const PrioritizeTasksInputSchema = z.object({
  tasks: z.array(TaskSchema).describe('A list of tasks to prioritize.'),
  contextEntries: z
    .array(ContextEntrySchema)
    .describe('A list of daily context entries.'),
});
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizedTaskSchema = TaskSchema.extend({
  priority: z.number().describe('The updated priority score for the task.'),
});

const PrioritizeTasksOutputSchema = z.array(PrioritizedTaskSchema);
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are an AI assistant designed to prioritize tasks based on their urgency and context.

  Given the following list of tasks:
  {{#each tasks}}
  - Title: {{this.title}}
    Description: {{this.description}}
    Deadline: {{this.deadline}}
  {{/each}}

  And the following context entries:
  {{#each contextEntries}}
  - Content: {{this.content}}
    Timestamp: {{this.timestamp}}
  {{/each}}

  Determine the priority of each task on a scale of 1 to 10 (1 being the lowest, 10 being the highest).
  Consider the context entries to understand the user's current situation and urgency.
  Return the tasks with updated priority scores.

  Prioritized Tasks:
  `,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
