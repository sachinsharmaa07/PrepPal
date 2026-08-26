import { Request, Response } from 'express';
import { ResumeService } from './resume.service';
import { success, error } from '../../common/response/envelope';

export class ResumeController {
  private resumeService: ResumeService;

  constructor() {
    this.resumeService = new ResumeService();
  }

  analyze = async (req: Request, res: Response) => {
    try {
      // In a real scenario, the file would come via multer or pre-signed S3 URL download
      // For this MVP stub, we assume the raw text or file is available in the request
      
      // Let's assume we receive base64 encoded pdf buffer in req.body.fileBase64
      if (!req.body.fileBase64) {
        return res.status(400).json(error('VALIDATION_ERROR', 'File buffer required in base64 format'));
      }

      const fileBuffer = Buffer.from(req.body.fileBase64, 'base64');
      const jobDescription = req.body.jobDescription;
      const jobRequiredSkills = req.body.jobRequiredSkills || [];

      const result = await this.resumeService.analyzeResume(fileBuffer, jobDescription, jobRequiredSkills);
      
      res.status(200).json(success(result));
    } catch (err: any) {
      console.error(err);
      res.status(500).json(error('INTERNAL_ERROR', err.message || 'Failed to analyze resume'));
    }
  };
}
