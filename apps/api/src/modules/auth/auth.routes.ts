import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../common/validation/validateRequest';
import { registerSchema, loginSchema } from './auth.dto';

const router = Router();
const authController = new AuthController();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
// Note: /refresh and /logout require authGuard which will be implemented later.

export default router;
