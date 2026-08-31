import { z } from 'zod';

export const ResumeParsedSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  skills: z.array(z.string()),
  education: z.array(
    z.object({
      degree: z.string(),
      field: z.string().nullable(),
      institution: z.string().nullable(),
      year: z.string().nullable(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string().nullable(),
      technologies: z.array(z.string()),
    })
  ),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      duration: z.string().nullable(),
      description: z.string().nullable(),
    })
  ),
  certifications: z.array(z.string()),
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
