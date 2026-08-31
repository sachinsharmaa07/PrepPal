"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const ai_client_1 = require("../ai/ai.client");
const interview_prompt_1 = require("../ai/prompts/interview.prompt");
class InterviewService {
    async createSession(userId, type, difficulty, role) {
        // 1. Create the session
        const session = await db_1.default.interviewSession.create({
            data: {
                userId,
                type,
                difficulty,
                role,
            }
        });
        // 2. Generate the first question
        const prompt = (0, interview_prompt_1.getNextQuestionPrompt)(type, difficulty);
        const firstQuestionText = await ai_client_1.aiClient.generateText(prompt, 'You are a technical interviewer.');
        // 3. Save question
        const question = await db_1.default.interviewQuestion.create({
            data: {
                interviewId: session.id,
                questionText: firstQuestionText,
                orderIndex: 1,
                difficulty,
            }
        });
        return {
            sessionId: session.id,
            firstQuestion: question
        };
    }
    async submitAnswer(questionId, answerText) {
        const question = await db_1.default.interviewQuestion.findUnique({
            where: { id: questionId },
            include: { interview: true }
        });
        if (!question)
            throw new Error('Question not found');
        // Evaluate answer via AI
        const rubric = "Evaluate based on correctness, clarity, and depth of knowledge.";
        const evalPrompt = (0, interview_prompt_1.getInterviewEvaluationPrompt)(question.questionText, answerText, rubric);
        let evaluation;
        try {
            evaluation = await ai_client_1.aiClient.generateStructured(evalPrompt, interview_prompt_1.InterviewEvaluationSchema);
        }
        catch (err) {
            console.error('AI Eval Failed', err);
            throw new Error('Failed to evaluate answer via AI');
        }
        // Save answer and evaluation
        const answerRecord = await db_1.default.interviewAnswer.create({
            data: {
                questionId: question.id,
                answerText,
                score: evaluation.score,
                strengths: evaluation.strengths,
                weaknesses: evaluation.weaknesses
            }
        });
        // Determine next step or end session (mocking simple logic: max 3 questions)
        const questionsCount = await db_1.default.interviewQuestion.count({
            where: { interviewId: question.interviewId }
        });
        let nextQuestion = null;
        if (questionsCount < 3) {
            const nextPrompt = (0, interview_prompt_1.getNextQuestionPrompt)(question.interview.type, question.interview.difficulty, `Score: ${evaluation.score}/10`);
            const nextQText = await ai_client_1.aiClient.generateText(nextPrompt, 'You are a technical interviewer.');
            nextQuestion = await db_1.default.interviewQuestion.create({
                data: {
                    interviewId: question.interviewId,
                    questionText: nextQText,
                    orderIndex: questionsCount + 1,
                    difficulty: question.interview.difficulty,
                }
            });
        }
        else {
            await db_1.default.interviewSession.update({
                where: { id: question.interviewId },
                data: { status: 'COMPLETED' }
            });
        }
        return {
            evaluation,
            nextQuestion
        };
    }
}
exports.InterviewService = InterviewService;
