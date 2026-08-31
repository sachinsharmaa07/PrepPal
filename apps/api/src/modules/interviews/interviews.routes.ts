import { Router } from 'express';
import { InterviewController } from './interviews.controller';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();
const interviewController = new InterviewController();

router.post('/', asyncHandler(interviewController.createSession));
router.post('/answer', asyncHandler(interviewController.submitAnswer));

export default router;
