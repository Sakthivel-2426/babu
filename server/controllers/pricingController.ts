import { Request, Response } from 'express';
import { Pricing } from '../models/Pricing';

export async function getPricing(req: Request, res: Response) {
  try {
    let pricing = await Pricing.findOne({ id: 'default' });
    if (!pricing) {
      pricing = await Pricing.create({
        id: 'default',
        VIP: 250,
        Premium: 200,
        Regular: 150,
        convenienceFeePerTicket: 30,
      });
    }

    res.json({
      success: true,
      data: {
        VIP: pricing.VIP,
        Premium: pricing.Premium,
        Regular: pricing.Regular,
        convenienceFeePerTicket: pricing.convenienceFeePerTicket,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updatePricing(req: Request, res: Response) {
  try {
    const { VIP, Premium, Regular, convenienceFeePerTicket } = req.body;

    const pricing = await Pricing.findOneAndUpdate(
      { id: 'default' },
      {
        ...(VIP !== undefined && { VIP: Number(VIP) }),
        ...(Premium !== undefined && { Premium: Number(Premium) }),
        ...(Regular !== undefined && { Regular: Number(Regular) }),
        ...(convenienceFeePerTicket !== undefined && { convenienceFeePerTicket: Number(convenienceFeePerTicket) }),
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Ticket pricing updated successfully',
      data: {
        VIP: pricing.VIP,
        Premium: pricing.Premium,
        Regular: pricing.Regular,
        convenienceFeePerTicket: pricing.convenienceFeePerTicket,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
