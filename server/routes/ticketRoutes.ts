import { Router } from 'express';
import { getTicketQr, verifyTicketGate } from '../controllers/ticketController';

const router = Router();

router.get('/:bookingId/qr', getTicketQr);
router.get('/:bookingId/verify', verifyTicketGate);

export default router;
