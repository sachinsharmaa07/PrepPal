import { Router } from 'express';
import { JobsController } from './jobs.controller';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();
const jobsController = new JobsController();

router.get('/', asyncHandler(jobsController.getJobs));
router.get('/mine', asyncHandler(jobsController.getMyJobs));
router.post('/', asyncHandler(jobsController.createJob));
router.post('/analyze', asyncHandler(jobsController.analyze));
router.get('/:id', asyncHandler(jobsController.getJob));
router.patch('/:id', asyncHandler(jobsController.updateJob));
router.delete('/:id', asyncHandler(jobsController.deleteJob));
router.post('/:id/apply', asyncHandler(jobsController.applyToJob));

export default router;
