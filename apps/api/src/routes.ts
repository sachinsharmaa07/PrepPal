import { Express, Request, Response } from 'express';
import authRoutes from './modules/auth/auth.routes';

export const setupRoutes = (app: Express) => {
  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ success: true, data: { status: 'OK' } });
  });

  app.use('/v1/auth', authRoutes);
};
