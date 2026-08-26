import { Request, Response } from 'express';
import { InterviewService } from './interviews.service';
import { success, error } from '../../common/response/envelope';

export class InterviewController {
  private interviewService: InterviewService;

  constructor() {
    this.interviewService = new InterviewService();
  }

  createSession = async (req: Request, res: Response) => {
    try {
      const { userId, type, difficulty, role } = req.body;
      const result = await this.interviewService.createSession(userId, type, difficulty, role);
      res.status(201).json(success(result));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  submitAnswer = async (req: Request, res: Response) => {
    try {
      const { questionId, answerText } = req.body;
      const result = await this.interviewService.submitAnswer(questionId, answerText);
      res.status(200).json(success(result));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };
}
