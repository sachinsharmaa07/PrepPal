import { extractTextFromPdf } from './text-extractor';
import { calculateAtsScore } from './ats-scoring-engine';
import { aiClient } from '../ai/ai.client';
import { getResumeParsePrompt, ResumeParsedSchema } from '../ai/prompts/resume-parse.prompt';

export class ResumeService {
  /**
   * Processes a resume PDF buffer, extracts text, parses it with AI, and scores it.
   */
  async analyzeResume(fileBuffer: Buffer, jobDescriptionText?: string, jobRequiredSkills: string[] = []) {
    // 1. Extract raw text from PDF
    const rawText = await extractTextFromPdf(fileBuffer);

    if (!rawText || rawText.trim() === '') {
      throw new Error('Could not extract text from the provided PDF.');
    }

    // 2. Parse text into structured JSON using AI
    const prompt = getResumeParsePrompt(rawText);
    let parsedData;
    try {
      parsedData = await aiClient.generateStructured(prompt, ResumeParsedSchema);
    } catch (err) {
      console.error('Failed to parse resume with AI:', err);
      // Provide a fallback empty structure so ATS engine doesn't crash completely
      parsedData = {
        contact: { email: null, phone: null, github: null, linkedin: null },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        summary: null
      };
    }

    // 3. Score against the deterministic ATS engine
    const atsResult = calculateAtsScore(rawText, parsedData, jobDescriptionText, jobRequiredSkills);

    // 4. (Optional) Generate suggestions via AI
    // We could make another LLM call here asking for suggestions based on atsResult.missingKeywords.
    const suggestions = atsResult.missingKeywords.map(kw => ({
      type: 'missing_keyword',
      text: `Consider adding the missing keyword "${kw}" to your resume to better match this role.`
    }));

    return {
      parsedData,
      atsScore: atsResult.totalScore,
      breakdown: atsResult,
      suggestions,
    };
  }
}
