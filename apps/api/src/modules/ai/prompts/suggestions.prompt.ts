import { z } from 'zod';

export const SuggestionsSchema = z.object({
  missingSkills: z.array(z.string()),
  weakSections: z.array(z.string()),
  wordingImprovements: z.array(
    z.object({
      original: z.string(),
      improved: z.string(),
      reason: z.string()
    })
  ),
  overallAdvice: z.string()
});

export const getSuggestionsPrompt = (candidateJson: string, jobJson: string) => `
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
