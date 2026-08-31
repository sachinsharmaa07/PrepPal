"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeService = void 0;
const text_extractor_1 = require("./text-extractor");
const ats_scoring_engine_1 = require("./ats-scoring-engine");
const ai_client_1 = require("../ai/ai.client");
const resume_parse_prompt_1 = require("../ai/prompts/resume-parse.prompt");
const db_1 = __importDefault(require("../../config/db"));
class ResumeService {
    /**
     * Processes a resume PDF buffer, extracts text, parses it with AI, and scores it.
     */
    async analyzeResume(fileBuffer, jobDescriptionText, jobRequiredSkills = [], userId) {
        // 1. Extract raw text from PDF
        const rawText = await (0, text_extractor_1.extractTextFromPdf)(fileBuffer);
        if (!rawText || rawText.trim() === '') {
            throw new Error('Could not extract text from the provided PDF.');
        }
        // 2. Parse text into structured JSON using AI
        const prompt = (0, resume_parse_prompt_1.getResumeParsePrompt)(rawText);
        let parsedData;
        try {
            parsedData = await ai_client_1.aiClient.generateStructured(prompt, resume_parse_prompt_1.ResumeParsedSchema);
        }
        catch (err) {
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
                const profile = await db_1.default.profile.upsert({
                    where: { userId },
                    create: { userId },
                    update: {}
                });
                // Add skills (connect or create)
                for (const skillName of parsedData.skills) {
                    const sanitized = skillName.trim();
                    if (!sanitized)
                        continue;
                    await db_1.default.skill.upsert({
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
            }
            catch (dbErr) {
                console.error('Failed to update DB Profile with skills:', dbErr);
            }
        }
        // 4. Score against the deterministic ATS engine
        const atsResult = (0, ats_scoring_engine_1.calculateAtsScore)(rawText, parsedData, jobDescriptionText, jobRequiredSkills);
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
exports.ResumeService = ResumeService;
