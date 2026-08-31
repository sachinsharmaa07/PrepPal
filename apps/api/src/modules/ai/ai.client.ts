import { GoogleGenerativeAI } from '@google/generative-ai';
import { z, ZodType } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export class AiClient {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  /**
   * Generates a structured JSON response from the LLM based on a Zod schema.
   */
  async generateStructured<T>(prompt: string, schema: ZodType<T>): Promise<T> {
    const jsonSchema = zodToJsonSchema(schema as any, 'ResponseSchema');

    const systemPrompt = `You are an expert AI assistant. Your output must STRICTLY follow this JSON schema:\n${JSON.stringify(
      jsonSchema
    )}`;

    try {
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
      
      // Attempt to parse and validate
      const parsed = JSON.parse(responseText);
      return schema.parse(parsed);
    } catch (error) {
      console.error('AI Structured Generation Error:', error);
      throw new Error('Failed to generate structured AI response.');
    }
  }

  async generateText(prompt: string, systemContext?: string): Promise<string> {
    try {
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
    } catch (error) {
      console.error('AI Text Generation Error:', error);
      throw new Error('Failed to generate AI response.');
    }
  }
}

export const aiClient = new AiClient();
