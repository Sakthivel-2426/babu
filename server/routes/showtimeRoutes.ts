import { Router } from 'express';
import { getShowtimes, getOccupiedSeats } from '../controllers/showtimeController';

const router = Router();

router.get('/', getShowtimes);
router.get('/occupied-seats', getOccupiedSeats);

export default router;
