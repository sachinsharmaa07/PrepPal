import { Router } from 'express';
import { JobsController } from './jobs.controller';

const router = Router();
const jobsController = new JobsController();

router.get('/', jobsController.getJobs);
router.post('/', jobsController.createJob);
router.post('/:id/apply', jobsController.applyToJob);

export default router;
