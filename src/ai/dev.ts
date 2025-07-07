import { config } from 'dotenv';
config();

import '@/ai/flows/enhance-task-description.ts';
import '@/ai/flows/extract-context-keywords.ts';
import '@/ai/flows/categorize-task.ts';
import '@/ai/flows/prioritize-task.ts';
import '@/ai/flows/suggest-calendar-slots.ts';
import '@/ai/flows/analyze-context-sentiment.ts';
import '@/ai/flows/suggest-deadline.ts';
import '@/ai/flows/suggest-task-milestones.ts';
