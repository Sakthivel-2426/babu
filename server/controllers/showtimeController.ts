import { Request, Response } from 'express';
import { Showtime } from '../models/Showtime';
import { Booking } from '../models/Booking';
import { Movie } from '../models/Movie';

export async function getShowtimes(req: Request, res: Response) {
  try {
    const { movieId, date, format } = req.query;

    const query: any = {};
    if (movieId) query.movieId = movieId;
    if (date) query.date = date;
    if (format && format !== 'All') query.format = format;

    let showtimes = await Showtime.find(query);

    // If no explicit showtimes exist for this movie and date, generate standard theatre screen showtimes
    if (showtimes.length === 0 && movieId && date) {
      const movie: any = await Movie.findOne({ id: String(movieId) });
      const formats = movie?.availableFormats && movie.availableFormats.length > 0
        ? movie.availableFormats
        : ['2D', '4K Dolby Atmos'];

      const dateStr = String(date);
      const defaultShows = [
        {
          id: `${movieId}-${dateStr}-1000`,
          movieId: String(movieId),
          screenName: 'Screen 1 - 4K Dolby Atmos',
          time: '10:00 AM',
          period: 'Morning' as const,
          format: (formats.includes('4K Dolby Atmos') ? '4K Dolby Atmos' : '2D') as any,
          date: dateStr,
          occupiedSeatIds: ['A3', 'A4', 'C6', 'C7', 'E2', 'F5'],
        },
        {
          id: `${movieId}-${dateStr}-1245`,
          movieId: String(movieId),
          screenName: 'Screen 2 - Barco 4K',
          time: '12:45 PM',
          period: 'Morning' as const,
          format: '2D' as any,
          date: dateStr,
          occupiedSeatIds: ['B2', 'B3', 'D4', 'D5', 'F3'],
        },
        {
          id: `${movieId}-${dateStr}-1530`,
          movieId: String(movieId),
          screenName: 'Screen 1 - 4K Dolby Atmos',
          time: '03:30 PM',
          period: 'Afternoon' as const,
          format: (formats.includes('3D') ? '3D' : '4K Dolby Atmos') as any,
          date: dateStr,
          occupiedSeatIds: ['A1', 'A2', 'B5', 'B6', 'C3'],
        },
        {
          id: `${movieId}-${dateStr}-1830`,
          movieId: String(movieId),
          screenName: 'Screen 1 - 4K Dolby Atmos',
          time: '06:30 PM',
          period: 'Evening' as const,
          format: '4K Dolby Atmos' as any,
          date: dateStr,
          occupiedSeatIds: ['A4', 'A5', 'B4', 'B5', 'C4', 'C5', 'D4', 'D5'],
        },
        {
          id: `${movieId}-${dateStr}-2130`,
          movieId: String(movieId),
          screenName: 'Screen 3 - Gold VIP',
          time: '09:30 PM',
          period: 'Night' as const,
          format: '4K Dolby Atmos' as any,
          date: dateStr,
          occupiedSeatIds: ['A2', 'A3', 'B2', 'B3', 'C1', 'C2'],
        },
      ];

      // Overlay real confirmed bookings from MongoDB for this movie and date
      const confirmedBookings: any[] = await Booking.find({
        movieId: String(movieId),
        date: dateStr,
        status: 'CONFIRMED',
      });

      for (const show of defaultShows) {
        const bookingsForShow = confirmedBookings.filter((b: any) => b.showtime === show.time);
        const bookedSeatIds = bookingsForShow.flatMap((b: any) => (b.seats || []).map((s: any) => s.id));
        show.occupiedSeatIds = Array.from(new Set([...show.occupiedSeatIds, ...bookedSeatIds]));
      }

      showtimes = defaultShows as any;
    }

    res.json({
      success: true,
      count: showtimes.length,
      data: showtimes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getOccupiedSeats(req: Request, res: Response) {
  try {
    const { movieId, date, showtime } = req.query;

    if (!movieId || !date || !showtime) {
      return res.status(400).json({
        success: false,
        message: 'movieId, date, and showtime query parameters are required.',
      });
    }

    const bookings = await Booking.find({
      movieId: String(movieId),
      date: String(date),
      showtime: String(showtime),
      status: 'CONFIRMED',
    });

    const occupiedSeatIds = bookings.flatMap((b) => b.seats.map((s) => s.id));

    res.json({
      success: true,
      count: occupiedSeatIds.length,
      occupiedSeatIds,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
