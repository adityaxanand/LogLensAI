'use server';
/**
 * @fileOverview Converts text into speech using an AI model. Supports multi-speaker dialogue.
 *
 * - generateSpeech - A function that takes a text string and returns a playable audio data URI.
 * - GenerateSpeechInput - The input type for the generateSpeech function.
 * - GenerateSpeechOutput - The return type for the generateSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech. For dialogues, use "Speaker1:" and "Speaker2:" prefixes.'),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

const GenerateSpeechOutputSchema = z.object({
    media: z.string().describe("A data URI of the generated audio in WAV format. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

export async function generateSpeech(input: GenerateSpeechInput): Promise<GenerateSpeechOutput> {
  try {
    return await generateSpeechFlow(input);
  } catch (e: any) {
    console.error("Error in generateSpeech flow:", e);
    throw new Error(e.message || 'An unexpected error occurred during speech generation.');
  }
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: GenerateSpeechOutputSchema,
  },
  async (input) => {
    const isDialogue = input.text.includes('Speaker1:') && input.text.includes('Speaker2:');

    const speechConfig = isDialogue
      ? {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Speaker1', // Senior SRE
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Achernar' } },
              },
              {
                speaker: 'Speaker2', // Junior SRE
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Algenib' } },
              },
            ],
          },
        }
      : {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        };

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig,
      },
      prompt: input.text,
    });

    if (!media) {
      throw new Error('The AI model failed to generate speech. No media was returned.');
    }
    
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      media: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
