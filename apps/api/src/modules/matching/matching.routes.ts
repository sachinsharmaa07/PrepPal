import { Router } from 'express';
import { MatchingController } from './matching.controller';

const router = Router();
const matchingController = new MatchingController();

router.post('/analyze', matchingController.analyze);
router.post('/suggestions', matchingController.suggestions);

export default router;
