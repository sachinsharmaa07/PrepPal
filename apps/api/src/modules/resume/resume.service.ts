import { extractTextFromPdf } from './text-extractor';
import { calculateAtsScore } from './ats-scoring-engine';
import { aiClient } from '../ai/ai.client';
import { getResumeParsePrompt, ResumeParsedSchema } from '../ai/prompts/resume-parse.prompt';
import prisma from '../../config/db';

export class ResumeService {
  /**
   * Processes a resume PDF buffer, extracts text, parses it with AI, and scores it.
   */
  async analyzeResume(fileBuffer: Buffer, jobDescriptionText?: string, jobRequiredSkills: string[] = [], userId?: string) {
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
        name: null,
        email: null,
        skills: [],
        education: [],
        projects: [],
        experience: [],
        certifications: []
      };
    }

    // 3. Update DB if userId is provided
    if (userId && parsedData.skills && parsedData.skills.length > 0) {
      try {
        // Ensure profile exists
        const profile = await prisma.profile.upsert({
          where: { userId },
          create: { userId },
          update: {}
        });

        // Add skills (connect or create)
        for (const skillName of parsedData.skills) {
          const sanitized = skillName.trim();
          if (!sanitized) continue;
          
          await prisma.skill.upsert({
            where: { name: sanitized },
            create: {
              name: sanitized,
              profiles: { connect: { id: profile.id } }
            },
            update: {
              profiles: { connect: { id: profile.id } }
            }
          });
        }
      } catch (dbErr) {
        console.error('Failed to update DB Profile with skills:', dbErr);
      }
    }

    // 4. Score against the deterministic ATS engine
    const atsResult = calculateAtsScore(rawText, parsedData, jobDescriptionText, jobRequiredSkills);

    // 5. (Optional) Generate suggestions via AI
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
