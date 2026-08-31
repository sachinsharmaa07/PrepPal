import { Request, Response, NextFunction } from 'express';

// Mock auth middleware for MVP
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // In a real app, verify JWT here
  (req as any).user = { id: 'dummy-user-id' };
  next();
};
