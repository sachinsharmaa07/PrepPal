import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { error } from '../response/envelope';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json(error('VALIDATION_ERROR', err.errors.map((e) => e.message).join(', ')));
      }
      return res.status(500).json(error('INTERNAL_ERROR', 'Internal server error during validation'));
    }
  };
};
