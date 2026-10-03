import { Router } from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  cancelBooking,
} from '../controllers/bookingController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getBookings);
router.get('/:id', getBookingById);
router.post('/', optionalAuth, createBooking);
router.patch('/:id/cancel', optionalAuth, cancelBooking);

export default router;
