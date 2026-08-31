import { Router } from 'express';
import { requireAuth } from '../../common/middleware/auth';
import { CodingController } from './coding.controller';

const router = Router();
const controller = new CodingController();

// Code Editor State Routes
router.get('/code/:problemId', requireAuth, controller.getUserCode);
router.put('/code/:problemId', requireAuth, controller.saveUserCode);

// Problem Routes (for fetching details)
router.get('/problems/:slug', requireAuth, controller.getProblem);

// Submissions / Executions
router.post('/executions', requireAuth, controller.runCode); // Run (public tests)
router.post('/submissions', requireAuth, controller.submitCode); // Submit (hidden tests)
router.get('/submissions/problem/:problemId', requireAuth, controller.getSubmissionHistory);
router.get('/submissions/:submissionId', requireAuth, controller.getSubmissionDetails);

export const codingRoutes = router;
