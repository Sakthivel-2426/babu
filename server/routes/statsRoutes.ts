import { Router } from 'express';
import { getDashboardSummary } from '../controllers/statsController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/summary', optionalAuth, getDashboardSummary);

export default router;
