import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth';
import { CodingController } from './coding.controller';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();
const controller = new CodingController();

// Code Editor State Routes
router.get('/code/:problemId', requireAuth, asyncHandler(controller.getUserCode));
router.put('/code/:problemId', requireAuth, asyncHandler(controller.saveUserCode));

// Problem Routes (for fetching details)
router.get('/problems/:slug', requireAuth, asyncHandler(controller.getProblem));

// Submissions / Executions
router.post('/executions', requireAuth, asyncHandler(controller.runCode)); // Run (public tests)
router.post('/submissions', requireAuth, asyncHandler(controller.submitCode)); // Submit (hidden tests)
router.get('/submissions/problem/:problemId', requireAuth, asyncHandler(controller.getSubmissionHistory));
router.get('/submissions/:submissionId', requireAuth, asyncHandler(controller.getSubmissionDetails));

export const codingRoutes = router;
