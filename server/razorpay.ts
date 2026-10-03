import crypto from 'crypto';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

// Razorpay SDK initialization
let razorpayInstance: any = null;

const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

const isRazorpayConfigured = Boolean(
  keyId &&
  keySecret &&
  !keyId.includes('YOUR_') &&
  !keySecret.includes('YOUR_')
);

if (isRazorpayConfigured) {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log('✅ Razorpay initialized with Key ID:', keyId.substring(0, 10) + '...');
  } catch (err) {
    console.warn('⚠️ Razorpay initialization error:', err);
  }
} else {
  console.log('ℹ️ Running Razorpay in Sandbox/Simulation Mode (Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env for live gateway)');
}

export interface CreateOrderParams {
  amount: number; // in INR rupees
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  status: string;
  mock: boolean;
  upiIntentUrl: string;
  upiQrDataUrl: string;
  keyId: string;
}

/**
 * Creates a Razorpay Order or generates a high-fidelity Sandbox Order
 */
export async function createPaymentOrder(params: CreateOrderParams): Promise<RazorpayOrderResponse> {
  const { amount, currency = 'INR', receipt, notes = {} } = params;
  const amountInPaise = Math.round(amount * 100);

  // Generate UPI deep link & QR code for Babu Cinemas
  const vpa = process.env.THEATRE_UPI_ID || 'babucinemas@upi';
  const payeeName = 'Babu Cinemas';
  const transactionNote = encodeURIComponent(`Babu Cinemas Ticket - Ref ${receipt}`);
  const upiIntentUrl = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${transactionNote}&tr=${receipt}`;
  
  // High-resolution QR code data URL
  const upiQrDataUrl = await QRCode.toDataURL(upiIntentUrl, {
    errorCorrectionLevel: 'H',
    margin: 2,
    scale: 8,
    color: {
      dark: '#111827',
      light: '#ffffff',
    },
  });

  if (isRazorpayConfigured && razorpayInstance) {
    try {
      const order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency,
        receipt,
        notes: {
          ...notes,
          theatre: 'Babu Cinemas',
        },
      });

      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        mock: false,
        upiIntentUrl,
        upiQrDataUrl,
        keyId,
      };
    } catch (err: any) {
      console.error('Razorpay live order creation failed, falling back to mock mode:', err.message);
    }
  }

  // Fallback / Sandbox Mock Order
  const mockOrderId = `order_mock_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    id: mockOrderId,
    amount: amountInPaise,
    currency,
    receipt,
    status: 'created',
    mock: true,
    upiIntentUrl,
    upiQrDataUrl,
    keyId: keyId || 'rzp_test_BABUCINEMAS2026',
  };
}

export interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/**
 * Verifies Razorpay payment signature
 */
export function verifyPaymentSignature(params: VerifyPaymentParams): { verified: boolean; message: string } {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;

  // Mock / Sandbox Order Verification
  if (razorpayOrderId.startsWith('order_mock_') || !isRazorpayConfigured) {
    return {
      verified: true,
      message: 'Verified via Babu Cinemas Sandbox Payment Simulator',
    };
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isValid = generatedSignature === razorpaySignature;
    return {
      verified: isValid,
      message: isValid ? 'Signature successfully verified' : 'Invalid payment signature from gateway',
    };
  } catch (error: any) {
    return {
      verified: false,
      message: `Signature verification error: ${error.message}`,
    };
  }
}

export function getGatewayConfig() {
  return {
    isConfigured: isRazorpayConfigured,
    keyId: keyId || 'rzp_test_BABUCINEMAS2026',
    mode: isRazorpayConfigured ? 'live_or_test_key' : 'sandbox_mock',
    theatreName: 'Babu Cinemas',
    currency: 'INR',
    upiVpa: process.env.THEATRE_UPI_ID || 'babucinemas@upi',
  };
}
