import { Request, Response } from 'express';
import {
  createPaymentOrder,
  verifyPaymentSignature,
  getGatewayConfig,
} from '../services/razorpayService';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';

export function getPaymentConfig(req: Request, res: Response) {
  res.json(getGatewayConfig());
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { amount, receipt, notes, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }

    const orderReceipt = receipt || `rcpt_${Date.now()}`;
    const orderResponse = await createPaymentOrder({
      amount: Number(amount),
      receipt: orderReceipt,
      notes: {
        ...(notes || {}),
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
      },
    });

    res.json({
      success: true,
      order: orderResponse,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function verifyPayment(req: Request, res: Response) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      bookingDetails,
      paymentMethod = 'Razorpay (Instant)',
    } = req.body;

    if (!razorpayOrderId) {
      return res.status(400).json({ success: false, message: 'Missing order ID' });
    }

    // Verify HMAC signature
    const verification = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
      razorpaySignature: razorpaySignature || 'simulated_signature',
    });

    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    // Save Confirmed Booking into MongoDB
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = bookingDetails.id || `BC2026${randomSuffix}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const confirmedBooking = await Booking.create({
      ...bookingDetails,
      id: bookingId,
      theatreName: 'BABU CINEMAS',
      paymentMethod,
      paymentId: razorpayPaymentId || `pay_${Date.now()}`,
      orderId: razorpayOrderId,
      status: 'CONFIRMED',
      bookedAt: formattedDate,
    });

    // Record Payment Transaction in MongoDB
    await Payment.create({
      bookingId,
      razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || `pay_${Date.now()}`,
      razorpaySignature,
      amount: bookingDetails.totalPaid || bookingDetails.grandTotal,
      currency: 'INR',
      status: 'captured',
      method: paymentMethod,
      customerEmail: bookingDetails.userEmail,
      customerPhone: bookingDetails.userPhone,
    });

    res.json({
      success: true,
      verified: true,
      booking: confirmedBooking,
      message: 'Payment verified and ticket booking successfully confirmed!',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
