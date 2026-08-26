import { Router } from 'express';
import { InterviewController } from './interviews.controller';

const router = Router();
const interviewController = new InterviewController();

router.post('/', interviewController.createSession);
router.post('/answer', interviewController.submitAnswer);

export default router;
