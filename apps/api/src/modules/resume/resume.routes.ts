import { Router } from 'express';
import { ResumeController } from './resume.controller';
import { asyncHandler } from '../../middleware/errorHandler';
import multer from 'multer';

const router = Router();
const resumeController = new ResumeController();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), asyncHandler(resumeController.upload));
router.post('/analyze', asyncHandler(resumeController.analyze));

export default router;
