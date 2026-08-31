import { Router } from 'express';
import { MatchingController } from './matching.controller';
import { asyncHandler } from '../../middleware/errorHandler';

const router = Router();
const matchingController = new MatchingController();

router.post('/analyze', asyncHandler(matchingController.analyze));
router.post('/suggestions', asyncHandler(matchingController.suggestions));

export default router;
