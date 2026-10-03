import { Router } from 'express';
import { getPricing, updatePricing } from '../controllers/pricingController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', getPricing);
router.put('/', optionalAuth, updatePricing);

export default router;
