import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const api_key = process.env.GEMINI_API_KEY;

export const ai = genkit({
  plugins: [googleAI(api_key as any)],
  model: 'googleai/gemini-2.0-flash',
});
