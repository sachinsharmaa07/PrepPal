import { Express, Request, Response } from 'express';
import authRoutes from './modules/auth/auth.routes';
import resumeRoutes from './modules/resume/resume.routes';
import interviewsRoutes from './modules/interviews/interviews.routes';
import jobsRoutes from './modules/jobs/jobs.routes';

export const setupRoutes = (app: Express) => {
  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ success: true, data: { status: 'OK' } });
  });

  app.use('/v1/auth', authRoutes);
  app.use('/v1/resume', resumeRoutes);
  app.use('/v1/interviews', interviewsRoutes);
  app.use('/v1/jobs', jobsRoutes);
};
