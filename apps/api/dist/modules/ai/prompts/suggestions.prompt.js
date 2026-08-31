"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestionsPrompt = exports.SuggestionsSchema = void 0;
const zod_1 = require("zod");
exports.SuggestionsSchema = zod_1.z.object({
    missingSkills: zod_1.z.array(zod_1.z.string()),
    weakSections: zod_1.z.array(zod_1.z.string()),
    wordingImprovements: zod_1.z.array(zod_1.z.object({
        original: zod_1.z.string(),
        improved: zod_1.z.string(),
        reason: zod_1.z.string()
    })),
    overallAdvice: zod_1.z.string()
});
const getSuggestionsPrompt = (candidateJson, jobJson) => `
You are an expert Career Coach and ATS optimizer. 
Compare the candidate's parsed resume with the parsed job description.
Provide targeted suggestions to improve their resume for this specific role.
Do NOT invent achievements or skills the candidate does not have. Only suggest improvements to wording or highlight where they should expand if they have the experience.

Candidate JSON:
"""
${candidateJson}
"""

Job Description JSON:
"""
${jobJson}
"""

Identify missing skills, weak sections (e.g. lack of measurable impact in Experience), and suggest 2-3 specific wording improvements for their bullet points.
Return ONLY valid JSON matching the schema.
`;
exports.getSuggestionsPrompt = getSuggestionsPrompt;
