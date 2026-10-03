import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { Booking } from '../models/Booking';

export async function getTicketQr(req: Request, res: Response) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ id: bookingId });

    const ticketPayload = JSON.stringify({
      theatre: 'BABU CINEMAS',
      bookingId,
      movie: booking?.movieTitle || 'Movie Ticket',
      date: booking?.date,
      showtime: booking?.showtime,
      seats: booking?.seats?.map((s) => s.id) || [],
      entryToken: `BC-GATE-${bookingId}-${Date.now().toString(36)}`,
    });

    const qrDataUrl = await QRCode.toDataURL(ticketPayload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 8,
      color: {
        dark: '#991b1b', // Theatre crimson red
        light: '#ffffff',
      },
    });

    res.json({
      success: true,
      bookingId,
      qrDataUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function verifyTicketGate(req: Request, res: Response) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ id: bookingId });

    if (!booking) {
      return res.status(404).json({
        valid: false,
        message: 'Ticket not found in cinema registry.',
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        valid: false,
        message: 'Ticket has been CANCELLED. Access denied at turnstile.',
      });
    }

    res.json({
      valid: true,
      message: 'Ticket Valid - Access Granted to Babu Cinemas Auditorium',
      theatre: 'BABU CINEMAS',
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ valid: false, message: error.message });
  }
}
