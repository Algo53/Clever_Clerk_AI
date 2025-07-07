// 'use server';
/**
 * @fileOverview AI-powered task categorization.
 *
 * - categorizeTask - A function that categorizes a task based on content and context.
 * - CategorizeTaskInput - The input type for the categorizeTask function.
 * - CategorizeTaskOutput - The return type for the categorizeTask function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTaskInputSchema = z.object({
  taskContent: z.string().describe('The content of the task to categorize.'),
  context: z.string().describe('The context related to the task.'),
  availableCategories: z
    .array(z.string())
    .describe('A list of available categories to choose from.'),
});
export type CategorizeTaskInput = z.infer<typeof CategorizeTaskInputSchema>;

const CategorizeTaskOutputSchema = z.object({
  category: z.string().describe('The predicted category for the task from the available list.'),
  confidence: z
    .number()
    .describe('The confidence level of the category prediction (0-1).'),
});
export type CategorizeTaskOutput = z.infer<typeof CategorizeTaskOutputSchema>;

export async function categorizeTask(input: CategorizeTaskInput): Promise<CategorizeTaskOutput> {
  return categorizeTaskFlow(input);
}

const categorizeTaskPrompt = ai.definePrompt({
  name: 'categorizeTaskPrompt',
  input: {schema: CategorizeTaskInputSchema},
  output: {schema: CategorizeTaskOutputSchema},
  prompt: `You are an expert in task categorization. Given the task content and the provided context, determine the most appropriate category for the task from the list of available categories.

Task Content: {{{taskContent}}}
Context: {{{context}}}

Available Categories:
{{#each availableCategories}}
- {{{this}}}
{{/each}}

Respond with a JSON object containing the category and a confidence score (0-1).`,
});

const categorizeTaskFlow = ai.defineFlow(
  {
    name: 'categorizeTaskFlow',
    inputSchema: CategorizeTaskInputSchema,
    outputSchema: CategorizeTaskOutputSchema,
  },
  async input => {
    const {output} = await categorizeTaskPrompt(input);
    return output!;
  }
);
