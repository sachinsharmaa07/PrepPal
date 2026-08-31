import { Request, Response } from 'express';
import prisma from '../../config/db';
// import { executionQueue } from '../../queues/execution.queue';

export class CodingController {
  
  // GET /api/code/:problemId
  getUserCode = async (req: Request, res: Response) => {
    try {
      const { problemId } = req.params;
      const { language } = req.query;
      // req.user from auth middleware
      const userId = (req as any).user.id;

      if (!language || typeof language !== 'string') {
        return res.status(400).json({ error: 'Language query parameter is required' });
      }

      const userCode = await prisma.userProblemCode.findUnique({
        where: {
          userId_problemId_language: {
            userId,
            problemId,
            language: language.toUpperCase() as any
          }
        }
      });

      return res.json({ code: userCode ? userCode.code : null });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // PUT /api/code/:problemId
  saveUserCode = async (req: Request, res: Response) => {
    try {
      const { problemId } = req.params;
      const { language, code } = req.body;
      const userId = (req as any).user.id;

      const userCode = await prisma.userProblemCode.upsert({
        where: {
          userId_problemId_language: {
            userId,
            problemId,
            language: language.toUpperCase() as any
          }
        },
        update: { code },
        create: {
          userId,
          problemId,
          language: language.toUpperCase() as any,
          code
        }
      });

      return res.json(userCode);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET /api/problems/:slug
  getProblem = async (req: Request, res: Response) => {
    try {
      // For now, assuming problemId is passed instead of slug, or we map it
      const { slug } = req.params;
      
      const problem = await prisma.codingProblem.findFirst({
        where: { OR: [{ id: slug }, { title: { equals: slug, mode: 'insensitive' } }] },
        include: {
          testCases: {
            where: { isSample: true } // NEVER expose hidden tests
          }
        }
      });

      if (!problem) return res.status(404).json({ error: 'Problem not found' });
      return res.json(problem);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST /api/executions (Run Code - Public Tests Only)
  runCode = async (req: Request, res: Response) => {
    try {
      const { problemId, language, code } = req.body;
      const userId = (req as any).user.id;

      // Ensure problem exists
      const problem = await prisma.codingProblem.findUnique({ where: { id: problemId } });
      if (!problem) return res.status(404).json({ error: 'Problem not found' });

      // Create a transient execution (Not saved as a Submission, or saved with type "RUN")
      // To mimic the spec: we add to BullMQ and return an executionId
      
      // executionQueue.add("execute", { userId, problemId, language, code, mode: 'run' });
      
      return res.json({ executionId: "mock-exec-id", status: 'queued' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST /api/submissions (Submit Code - Hidden Tests)
  submitCode = async (req: Request, res: Response) => {
    try {
      const { problemId, language, code } = req.body;
      const userId = (req as any).user.id;

      const submission = await prisma.submission.create({
        data: {
          userId,
          problemId,
          language: language.toUpperCase() as any,
          code,
          verdict: 'PENDING'
        }
      });

      // executionQueue.add("execute", { submissionId: submission.id, mode: 'submit' });

      return res.json({ submissionId: submission.id, status: 'queued' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET /api/submissions/problem/:problemId
  getSubmissionHistory = async (req: Request, res: Response) => {
    try {
      const { problemId } = req.params;
      const userId = (req as any).user.id;
      
      const submissions = await prisma.submission.findMany({
        where: { userId, problemId },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      return res.json(submissions);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET /api/submissions/:submissionId
  getSubmissionDetails = async (req: Request, res: Response) => {
    try {
      const { submissionId } = req.params;
      const userId = (req as any).user.id;

      const submission = await prisma.submission.findFirst({
        where: { id: submissionId, userId },
        include: {
          testResults: true
        }
      });

      if (!submission) return res.status(404).json({ error: 'Submission not found' });

      return res.json(submission);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
