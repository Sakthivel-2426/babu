import { Router } from 'express';
import {
  getOffers,
  createOffer,
  deleteOffer,
  validateOffer,
} from '../controllers/offerController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', getOffers);
router.post('/', optionalAuth, createOffer);
router.delete('/:id', optionalAuth, deleteOffer);
router.post('/validate', validateOffer);

export default router;
