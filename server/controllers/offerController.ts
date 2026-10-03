import { Request, Response } from 'express';
import { Offer } from '../models/Offer';

export async function getOffers(req: Request, res: Response) {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createOffer(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.code || !data.title || data.discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Offer code, title, and discountValue are required.',
      });
    }

    const cleanCode = String(data.code).trim().toUpperCase();
    const existing = await Offer.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `An offer with code "${cleanCode}" already exists.`,
      });
    }

    const newOffer = await Offer.create({
      ...data,
      id: data.id || `offer-${Date.now()}`,
      code: cleanCode,
      validUntil: data.validUntil || '31 Dec 2026',
    });

    res.status(201).json({ success: true, data: newOffer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteOffer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await Offer.findOneAndDelete({
      $or: [{ id }, { code: id.toUpperCase() }],
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function validateOffer(req: Request, res: Response) {
  try {
    const { code, ticketCount, ticketTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const matched = await Offer.findOne({ code: cleanCode });

    if (!matched) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code. Please check available offers.',
      });
    }

    if (matched.minTickets && (ticketCount || 0) < matched.minTickets) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum of ${matched.minTickets} seats. (Selected: ${ticketCount || 0})`,
      });
    }

    let discount = 0;
    const baseTotal = Number(ticketTotal) || 0;
    if (matched.discountType === 'percentage') {
      discount = Math.round((baseTotal * matched.discountValue) / 100);
    } else {
      discount = matched.discountValue;
    }

    if (discount > baseTotal && baseTotal > 0) {
      discount = baseTotal;
    }

    res.json({
      success: true,
      offer: matched,
      calculatedDiscount: discount,
      message: `Coupon "${matched.code}" applied successfully!`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
