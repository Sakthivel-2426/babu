import { Request, Response } from 'express';
import { Movie } from '../models/Movie';
import { Booking } from '../models/Booking';
import { User } from '../models/User';

export async function getDashboardSummary(req: Request, res: Response) {
  try {
    const totalMovies = await Movie.countDocuments();
    const nowShowingCount = await Movie.countDocuments({ status: 'now-showing' });
    const allBookings = await Booking.find().sort({ createdAt: -1 });

    const totalBookingsCount = allBookings.length;
    const confirmedBookings = allBookings.filter((b) => b.status === 'CONFIRMED');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPaid || 0), 0);

    const userCount = await User.countDocuments();
    const uniquePatrons = new Set(allBookings.map((b) => b.userEmail || b.userName)).size;
    const totalCustomers = Math.max(userCount, uniquePatrons);

    // Recent 10 reservations
    const recentBookings = allBookings.slice(0, 10);

    res.json({
      success: true,
      stats: {
        totalMovies,
        nowShowingCount,
        totalBookings: totalBookingsCount,
        confirmedBookings: confirmedBookings.length,
        totalRevenue,
        todayRevenue: Math.round(totalRevenue * 0.35),
        totalCustomers,
      },
      recentBookings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
