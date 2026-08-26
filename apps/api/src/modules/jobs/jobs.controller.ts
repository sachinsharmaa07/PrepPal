import { Request, Response } from 'express';
import { JobsService } from './jobs.service';
import { ApplicationsService } from '../applications/applications.service';
import { success, error } from '../../common/response/envelope';

export class JobsController {
  private jobsService = new JobsService();
  private applicationsService = new ApplicationsService();

  getJobs = async (req: Request, res: Response) => {
    try {
      const result = await this.jobsService.getJobs(req.query);
      res.status(200).json(success(result));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  createJob = async (req: Request, res: Response) => {
    try {
      // Stub: in a real app, companyId comes from the authenticated recruiter's context
      const companyId = req.body.companyId;
      const result = await this.jobsService.createJob(companyId, req.body);
      res.status(201).json(success(result));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };

  applyToJob = async (req: Request, res: Response) => {
    try {
      // Stub: userId comes from req.user
      const { userId, resumeId } = req.body;
      const jobId = req.params.id;
      const result = await this.applicationsService.applyToJob(userId, jobId, resumeId);
      res.status(201).json(success(result));
    } catch (err: any) {
      res.status(500).json(error('INTERNAL_ERROR', err.message));
    }
  };
}
