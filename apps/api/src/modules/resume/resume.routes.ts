import { Router } from 'express';
import { ResumeController } from './resume.controller';

import multer from 'multer';

const router = Router();
const resumeController = new ResumeController();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), resumeController.upload);
router.post('/analyze', resumeController.analyze);

export default router;
