import { z } from 'zod';

export const ResumeParsedSchema = z.object({
  contact: z.object({
    email: z.string().nullable(),
    phone: z.string().nullable(),
    github: z.string().nullable(),
    linkedin: z.string().nullable(),
  }),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string().nullable(),
    })
  ),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      duration: z.string(),
      description: z.string(),
    })
  ),
  skills: z.array(z.string()),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      techStack: z.array(z.string()),
    })
  ),
  summary: z.string().nullable(),
});

export const getResumeParsePrompt = (rawText: string) => `
Please extract structured data from the following raw resume text. 
Identify contact information, education, work experience, technical skills, and projects. 
If a field is not found, return null or an empty array as appropriate.

Raw Resume Text:
"""
${rawText}
"""
`;
