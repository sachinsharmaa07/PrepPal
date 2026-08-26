import prisma from '../../config/db';
import { aiClient } from '../ai/ai.client';
import { getNextQuestionPrompt, getInterviewEvaluationPrompt, InterviewEvaluationSchema } from '../ai/prompts/interview.prompt';
import { InterviewType, InterviewDifficulty } from '@prisma/client';

export class InterviewService {
  async createSession(userId: string, type: InterviewType, difficulty: InterviewDifficulty, role?: string) {
    // 1. Create the session
    const session = await prisma.interviewSession.create({
      data: {
        userId,
        type,
        difficulty,
        role,
      }
    });

    // 2. Generate the first question
    const prompt = getNextQuestionPrompt(type, difficulty);
    const firstQuestionText = await aiClient.generateText(prompt, 'You are a technical interviewer.');

    // 3. Save question
    const question = await prisma.interviewQuestion.create({
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

  async submitAnswer(questionId: string, answerText: string) {
    const question = await prisma.interviewQuestion.findUnique({
      where: { id: questionId },
      include: { interview: true }
    });

    if (!question) throw new Error('Question not found');
    
    // Evaluate answer via AI
    const rubric = "Evaluate based on correctness, clarity, and depth of knowledge.";
    const evalPrompt = getInterviewEvaluationPrompt(question.questionText, answerText, rubric);
    
    let evaluation;
    try {
      evaluation = await aiClient.generateStructured(evalPrompt, InterviewEvaluationSchema);
    } catch (err) {
      console.error('AI Eval Failed', err);
      throw new Error('Failed to evaluate answer via AI');
    }

    // Save answer and evaluation
    const answerRecord = await prisma.interviewAnswer.create({
      data: {
        questionId: question.id,
        answerText,
        score: evaluation.score,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses
      }
    });

    // Determine next step or end session (mocking simple logic: max 3 questions)
    const questionsCount = await prisma.interviewQuestion.count({
      where: { interviewId: question.interviewId }
    });

    let nextQuestion = null;
    if (questionsCount < 3) {
      const nextPrompt = getNextQuestionPrompt(question.interview.type, question.interview.difficulty, \`Score: \${evaluation.score}/10\`);
      const nextQText = await aiClient.generateText(nextPrompt, 'You are a technical interviewer.');
      
      nextQuestion = await prisma.interviewQuestion.create({
        data: {
          interviewId: question.interviewId,
          questionText: nextQText,
          orderIndex: questionsCount + 1,
          difficulty: question.interview.difficulty,
        }
      });
    } else {
      await prisma.interviewSession.update({
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
