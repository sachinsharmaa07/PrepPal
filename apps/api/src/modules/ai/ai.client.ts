import { GoogleGenerativeAI } from '@google/generative-ai';
import { z, ZodType } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export class AiClient {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  private async withRetry<T>(operation: () => Promise<T>, attempts: number = 3): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error: any) {
        const isRateLimit = error?.message?.includes('429') || error?.status === 429;
        const isServiceUnavailable = error?.message?.includes('503') || error?.status === 503;
        
        if ((isRateLimit || isServiceUnavailable) && i < attempts - 1) {
          const delay = Math.pow(2, i) * 1000;
          console.log(`LLM Error: ${error.message}. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
    throw new Error('LLM operation failed after max retries');
  }

  /**
   * Generates a structured JSON response from the LLM based on a Zod schema.
   */
  async generateStructured<T>(prompt: string, schema: ZodType<T>): Promise<T> {
    const jsonSchema = zodToJsonSchema(schema as any, 'ResponseSchema');

    const systemPrompt = `You are an expert AI assistant. Your output must STRICTLY follow this JSON schema:\n${JSON.stringify(
      jsonSchema
    )}`;

    return this.withRetry(async () => {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: systemPrompt,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        throw new Error('LLM did not return valid JSON');
      }

      const safeParsed = schema.safeParse(parsed);
      if (!safeParsed.success) {
        console.error('LLM output schema validation failed. Token count might be logged here instead of raw output.');
        throw safeParsed.error;
      }
      return safeParsed.data;
    });
  }

  async generateText(prompt: string, systemContext?: string): Promise<string> {
    return this.withRetry(async () => {
      const modelConfig: any = {
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
        },
      };

      if (systemContext) {
        modelConfig.systemInstruction = systemContext;
      }

      const model = this.genAI.getGenerativeModel(modelConfig);
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
  }
}

export const aiClient = new AiClient();
