import { Router } from 'express';
import {
  getPaymentConfig,
  createOrder,
  verifyPayment,
} from '../controllers/paymentController';

const router = Router();

router.get('/config', getPaymentConfig);
router.post('/razorpay/create-order', createOrder);
router.post('/razorpay/verify', verifyPayment);

export default router;
