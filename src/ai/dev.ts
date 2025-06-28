import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-logs.ts';
import '@/ai/flows/propose-solutions.ts';
import '@/ai/flows/summarize-logs.ts';
import '@/ai/flows/generate-speech.ts';
import '@/ai/flows/generate-dialogue.ts';
