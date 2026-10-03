import { Router } from 'express';
import {
  submitContactMessage,
  getContactMessages,
} from '../controllers/contactController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', submitContactMessage);
router.get('/', optionalAuth, getContactMessages);

export default router;
