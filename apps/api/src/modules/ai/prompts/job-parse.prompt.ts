import { z } from 'zod';

export const JobParsedSchema = z.object({
  role: z.string(),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  concepts: z.array(z.string()),
});

export const getJobParsePrompt = (jobDescription: string) => `
You are an expert ATS and HR system. Extract structured information from the following Job Description.
Identify the primary role title, the explicitly required technical skills, any preferred (nice-to-have) skills, and key technical concepts (like "REST APIs", "System Design", "Microservices", etc.).
Return ONLY valid JSON matching the schema.

Job Description:
"""
${jobDescription}
"""
`;
