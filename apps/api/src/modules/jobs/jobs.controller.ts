import { Request, Response } from 'express';
import { JobsService } from './jobs.service';
import { success, error } from '../../common/response/envelope';
import { aiClient } from '../ai/ai.client';
import { getJobParsePrompt, JobParsedSchema } from '../ai/prompts/job-parse.prompt';
import prisma from '../../config/db';

export class JobsController {
  private jobsService = new JobsService();

  getJobs = async (req: Request, res: Response) => {
    try {
      const result = await this.jobsService.getJobs(req.query);
      res.status(200).json(success(result));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  getJob = async (req: Request, res: Response) => {
    try {
      const job = await this.jobsService.getJobById(req.params.id);
      if (!job) return res.status(404).json(error('NOT_FOUND', 'Job not found'));
      res.status(200).json(success(job));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  getMyJobs = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || req.query.userId as string;
      if (!userId) return res.status(401).json(error('UNAUTHORIZED', 'Authentication required'));

      // Find or create company for this recruiter
      let company = await prisma.company.findUnique({ where: { recruiterId: userId } });
      if (!company) {
        return res.status(404).json(error('NOT_FOUND', 'No company profile found. Please create your company profile first.'));
      }
      const jobs = await this.jobsService.getJobsByCompany(company.id);
      res.status(200).json(success({ jobs, company }));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  createJob = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || req.body.userId;
      if (!userId) return res.status(401).json(error('UNAUTHORIZED', 'Authentication required'));

      // Find or auto-create a company for this recruiter
      let company = await prisma.company.findUnique({ where: { recruiterId: userId } });
      if (!company) {
        company = await prisma.company.create({
          data: {
            recruiterId: userId,
            name: req.body.companyName || 'My Company',
          },
        });
      }

      const result = await this.jobsService.createJob(company.id, req.body);
      res.status(201).json(success(result));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  updateJob = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || req.body.userId;
      const company = await prisma.company.findUnique({ where: { recruiterId: userId } });
      if (!company) return res.status(404).json(error('NOT_FOUND', 'Company not found'));

      const result = await this.jobsService.updateJob(req.params.id, company.id, req.body);
      res.status(200).json(success(result));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  deleteJob = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || req.query.userId as string;
      const company = await prisma.company.findUnique({ where: { recruiterId: userId } });
      if (!company) return res.status(404).json(error('NOT_FOUND', 'Company not found'));

      await this.jobsService.deleteJob(req.params.id, company.id);
      res.status(200).json(success({ message: 'Job closed successfully' }));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  applyToJob = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId || req.body.userId;
      if (!userId) return res.status(401).json(error('UNAUTHORIZED', 'Authentication required'));
      const { resumeId } = req.body;
      const jobId = req.params.id;
      const result = await this.jobsService.applyToJob(userId, jobId, resumeId);
      res.status(201).json(success(result));
    } catch (err: any) {
      if (err.message === 'You have already applied to this job') {
        return res.status(409).json(error('CONFLICT', err.message));
      }
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  analyze = async (req: Request, res: Response) => {
    try {
      const { description } = req.body;
      if (!description || description.trim() === '') {
        return res.status(400).json(error('VALIDATION_ERROR', 'Job description is required'));
      }
      const prompt = getJobParsePrompt(description);
      const parsedData = await aiClient.generateStructured(prompt, JobParsedSchema);
      res.status(200).json(success(parsedData));
    } catch (err: any) {
      console.error('Job analysis error:', err);
      res.status(500).json(error('INTERNAL_ERROR', err.message || 'Failed to analyze job description'));
    }
  };
}
