import { z } from 'zod';

export const InterviewEvaluationSchema = z.object({
  score: z.number().min(0).max(10).describe('Score from 0 to 10 evaluating the answer'),
  strengths: z.array(z.string()).describe('Key strengths in the candidate\'s answer'),
  weaknesses: z.array(z.string()).describe('Areas of improvement or missed points'),
  feedback: z.string().describe('Constructive feedback paragraph'),
});

export const getInterviewEvaluationPrompt = (question: string, answer: string, rubric: string) => `
You are an expert technical interviewer. Evaluate the candidate's answer to the following question.

Question:
"${question}"

Candidate Answer:
"${answer}"

Evaluation Rubric:
${rubric}

Provide a fair evaluation scoring the answer from 0-10, listing strengths, weaknesses, and overall feedback.
`;

export const getNextQuestionPrompt = (type: string, difficulty: string, previousPerformance?: string) => `
You are conducting a ${difficulty} level ${type} interview. 
${previousPerformance ? `The candidate's previous performance: ${previousPerformance}. Adjust the difficulty/focus accordingly.` : 'This is the first question.'}

Generate ONE clear, concise interview question. Do not provide the answer. Just the question.
`;
