import { Groq } from 'groq-sdk';
import { z, ZodType } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export class AiClient {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  /**
   * Generates a structured JSON response from the LLM based on a Zod schema.
   */
  async generateStructured<T>(prompt: string, schema: ZodType<T>): Promise<T> {
    const jsonSchema = zodToJsonSchema(schema, 'ResponseSchema');

    const systemPrompt = `You are an expert AI assistant. Your output must STRICTLY follow this JSON schema:\n${JSON.stringify(
      jsonSchema
    )}\n\nDo not include any other text, markdown formatting like \`\`\`json, or explanations. Only return the raw JSON object.`;

    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        model: 'llama3-8b-8192', // Fast, free tier Groq model
        temperature: 0.1,
        response_format: { type: 'json_object' },
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      
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
      const messages: any[] = [];
      if (systemContext) {
        messages.push({ role: 'system', content: systemContext });
      }
      messages.push({ role: 'user', content: prompt });

      const completion = await this.groq.chat.completions.create({
        messages,
        model: 'llama3-8b-8192',
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('AI Text Generation Error:', error);
      throw new Error('Failed to generate AI response.');
    }
  }
}

export const aiClient = new AiClient();
