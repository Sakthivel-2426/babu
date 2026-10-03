import { Request, Response } from 'express';
import { Booking } from '../models/Booking';

export async function getBookings(req: Request, res: Response) {
  try {
    const { userEmail, userPhone } = req.query;
    const filter: any = {};

    if (userEmail) {
      filter.userEmail = String(userEmail).trim().toLowerCase();
    } else if (userPhone) {
      filter.userPhone = String(userPhone).trim();
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getBookingById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    let booking = await Booking.findOne({ id });
    if (!booking && id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(id);
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createBooking(req: Request, res: Response) {
  try {
    const bookingData = req.body;

    if (!bookingData.movieTitle || !bookingData.seats || bookingData.seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking payload. Movie title and seats are required.',
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = bookingData.id || `BC2026${randomSuffix}`;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBooking = await Booking.create({
      ...bookingData,
      id: bookingId,
      theatreName: 'BABU CINEMAS',
      bookedAt: bookingData.bookedAt || formattedDate,
      status: 'CONFIRMED',
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function cancelBooking(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const booking = await Booking.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { status: 'CANCELLED' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found to cancel' });
    }

    res.json({
      success: true,
      message: `Booking ${booking.id} has been cancelled successfully`,
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
