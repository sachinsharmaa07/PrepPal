import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  res.locals.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
};
