import { Router } from 'express';
import { ResumeController } from './resume.controller';

const router = Router();
const resumeController = new ResumeController();

router.post('/analyze', resumeController.analyze);

export default router;
