"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobParsePrompt = exports.JobParsedSchema = void 0;
const zod_1 = require("zod");
exports.JobParsedSchema = zod_1.z.object({
    role: zod_1.z.string(),
    requiredSkills: zod_1.z.array(zod_1.z.string()),
    preferredSkills: zod_1.z.array(zod_1.z.string()),
    concepts: zod_1.z.array(zod_1.z.string()),
});
const getJobParsePrompt = (jobDescription) => `
You are an expert ATS and HR system. Extract structured information from the following Job Description.
Identify the primary role title, the explicitly required technical skills, any preferred (nice-to-have) skills, and key technical concepts (like "REST APIs", "System Design", "Microservices", etc.).
Return ONLY valid JSON matching the schema.

Job Description:
"""
${jobDescription}
"""
`;
exports.getJobParsePrompt = getJobParsePrompt;
