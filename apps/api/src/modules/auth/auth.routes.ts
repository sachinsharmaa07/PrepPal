import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateBody } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/errorHandler';
import { registerSchema, loginSchema, googleLoginSchema } from './auth.dto';
import { z } from 'zod';

const router = Router();
const authController = new AuthController();

// Convert existing schemas (which were wrapped in body/query/params) to just body schemas
const registerBodySchema = registerSchema.shape.body as any;
const loginBodySchema = loginSchema.shape.body as any;
const googleLoginBodySchema = googleLoginSchema.shape.body as any;

router.post('/register', validateBody(registerBodySchema), asyncHandler(authController.register));
router.post('/login', validateBody(loginBodySchema), asyncHandler(authController.login));
router.post('/google', validateBody(googleLoginBodySchema), asyncHandler(authController.googleLogin));

// Note: /refresh and /logout require authGuard which will be implemented later.

export default router;
