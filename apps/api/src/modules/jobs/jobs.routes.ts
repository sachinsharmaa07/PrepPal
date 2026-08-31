import { Router } from 'express';
import { JobsController } from './jobs.controller';

const router = Router();
const jobsController = new JobsController();

router.get('/', jobsController.getJobs);
router.get('/mine', jobsController.getMyJobs);
router.post('/', jobsController.createJob);
router.post('/analyze', jobsController.analyze);
router.get('/:id', jobsController.getJob);
router.patch('/:id', jobsController.updateJob);
router.delete('/:id', jobsController.deleteJob);
router.post('/:id/apply', jobsController.applyToJob);

export default router;
