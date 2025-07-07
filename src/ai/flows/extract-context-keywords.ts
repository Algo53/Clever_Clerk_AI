'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting keywords from context entries.
 *
 * - extractContextKeywords - A function that takes context entries as input and returns extracted keywords.
 * - ExtractContextKeywordsInput - The input type for the extractContextKeywords function.
 * - ExtractContextKeywordsOutput - The return type for the extractContextKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractContextKeywordsInputSchema = z.object({
  contextEntries: z.array(z.string()).describe('An array of context entries from which to extract keywords.'),
});
export type ExtractContextKeywordsInput = z.infer<typeof ExtractContextKeywordsInputSchema>;

const ExtractContextKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('An array of extracted keywords.'),
});
export type ExtractContextKeywordsOutput = z.infer<typeof ExtractContextKeywordsOutputSchema>;

export async function extractContextKeywords(input: ExtractContextKeywordsInput): Promise<ExtractContextKeywordsOutput> {
  return extractContextKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractContextKeywordsPrompt',
  input: {schema: ExtractContextKeywordsInputSchema},
  output: {schema: ExtractContextKeywordsOutputSchema},
  prompt: `You are an expert keyword extractor.

  Given the following context entries, extract the most relevant keywords that represent the main topics and themes. Return the keywords as a list of strings.

  Context Entries:
  {{#each contextEntries}}
  - {{{this}}}
  {{/each}}

  Keywords:`,
});

const extractContextKeywordsFlow = ai.defineFlow(
  {
    name: 'extractContextKeywordsFlow',
    inputSchema: ExtractContextKeywordsInputSchema,
    outputSchema: ExtractContextKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
