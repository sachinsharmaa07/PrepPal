"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextQuestionPrompt = exports.getInterviewEvaluationPrompt = exports.InterviewEvaluationSchema = void 0;
const zod_1 = require("zod");
exports.InterviewEvaluationSchema = zod_1.z.object({
    score: zod_1.z.number().min(0).max(10).describe('Score from 0 to 10 evaluating the answer'),
    strengths: zod_1.z.array(zod_1.z.string()).describe('Key strengths in the candidate\'s answer'),
    weaknesses: zod_1.z.array(zod_1.z.string()).describe('Areas of improvement or missed points'),
    feedback: zod_1.z.string().describe('Constructive feedback paragraph'),
});
const getInterviewEvaluationPrompt = (question, answer, rubric) => `
You are an expert technical interviewer. Evaluate the candidate's answer to the following question.

Question:
"${question}"

Candidate Answer:
"${answer}"

Evaluation Rubric:
${rubric}

Provide a fair evaluation scoring the answer from 0-10, listing strengths, weaknesses, and overall feedback.
`;
exports.getInterviewEvaluationPrompt = getInterviewEvaluationPrompt;
const getNextQuestionPrompt = (type, difficulty, previousPerformance) => `
You are conducting a ${difficulty} level ${type} interview. 
${previousPerformance ? `The candidate's previous performance: ${previousPerformance}. Adjust the difficulty/focus accordingly.` : 'This is the first question.'}

Generate ONE clear, concise interview question. Do not provide the answer. Just the question.
`;
exports.getNextQuestionPrompt = getNextQuestionPrompt;
