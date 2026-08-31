"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiClient = exports.AiClient = void 0;
const generative_ai_1 = require("@google/generative-ai");
const zod_to_json_schema_1 = require("zod-to-json-schema");
class AiClient {
    genAI;
    constructor() {
        this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    }
    /**
     * Generates a structured JSON response from the LLM based on a Zod schema.
     */
    async generateStructured(prompt, schema) {
        const jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(schema, 'ResponseSchema');
        const systemPrompt = `You are an expert AI assistant. Your output must STRICTLY follow this JSON schema:\n${JSON.stringify(jsonSchema)}`;
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
        }
        catch (error) {
            console.error('AI Structured Generation Error:', error);
            throw new Error('Failed to generate structured AI response.');
        }
    }
    async generateText(prompt, systemContext) {
        try {
            const modelConfig = {
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
        }
        catch (error) {
            console.error('AI Text Generation Error:', error);
            throw new Error('Failed to generate AI response.');
        }
    }
}
exports.AiClient = AiClient;
exports.aiClient = new AiClient();
