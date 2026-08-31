"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResumeParsePrompt = exports.ResumeParsedSchema = void 0;
const zod_1 = require("zod");
exports.ResumeParsedSchema = zod_1.z.object({
    name: zod_1.z.string().nullable(),
    email: zod_1.z.string().nullable(),
    skills: zod_1.z.array(zod_1.z.string()),
    education: zod_1.z.array(zod_1.z.object({
        degree: zod_1.z.string(),
        field: zod_1.z.string().nullable(),
        institution: zod_1.z.string().nullable(),
        year: zod_1.z.string().nullable(),
    })),
    projects: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string().nullable(),
        technologies: zod_1.z.array(zod_1.z.string()),
    })),
    experience: zod_1.z.array(zod_1.z.object({
        role: zod_1.z.string(),
        company: zod_1.z.string(),
        duration: zod_1.z.string().nullable(),
        description: zod_1.z.string().nullable(),
    })),
    certifications: zod_1.z.array(zod_1.z.string()),
});
const getResumeParsePrompt = (rawText) => `
Please extract structured data from the following raw resume text. 
Identify contact information, education, work experience, technical skills, and projects. 
If a field is not found, return null or an empty array as appropriate.

Raw Resume Text:
"""
${rawText}
"""
`;
exports.getResumeParsePrompt = getResumeParsePrompt;
