export type MovieStatus = 'now-showing' | 'coming-soon';

export type ScreenFormat = '2D' | '3D' | '4K Dolby Atmos' | 'IMAX Laser';

export type SeatTier = 'VIP' | 'Premium' | 'Regular';

export interface Seat {
  id: string; // e.g. "A1"
  row: string; // "A"
  number: number; // 1
  tier: SeatTier;
  price: number;
  status: 'available' | 'occupied' | 'selected';
}

export interface CastMember {
  name: string;
  role: string;
}

export interface Movie {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  genre: string[];
  language: string;
  duration: string; // e.g. "2h 45m"
  rating: string; // e.g. "U/A 16+"
  imdbScore?: number; // e.g. 8.6
  releaseDate: string; // e.g. "2026-09-18"
  director: string;
  cast: CastMember[];
  posterUrl: string;
  backdropUrl?: string;
  trailerUrl?: string;
  status: MovieStatus;
  availableFormats: ScreenFormat[];
  screens: string[];
}

export interface Showtime {
  id: string;
  movieId: string;
  screenName: string; // e.g. "Screen 1 - 4K Dolby Atmos"
  time: string; // e.g. "10:00 AM"
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  format: ScreenFormat;
  date: string; // "2026-09-29"
  occupiedSeatIds: string[];
}

export interface TicketPriceConfig {
  VIP: number;
  Premium: number;
  Regular: number;
  convenienceFeePerTicket: number;
}

export interface Booking {
  id: string; // e.g. "BT20268492"
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieFormat: ScreenFormat;
  theatreName: string;
  screenName: string;
  date: string;
  showtime: string;
  seats: {
    id: string;
    tier: SeatTier;
    price: number;
  }[];
  ticketTotal: number;
  convenienceFee: number;
  discount: number;
  discountCode?: string;
  totalPaid: number;
  paymentMethod: string;
  bookedAt: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minTickets?: number;
  validUntil: string;
  category: 'Student' | 'Weekend' | 'Food' | 'Family';
  icon: string;
  terms: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

export type AppView =
  | 'home'
  | 'movies'
  | 'details'
  | 'showtimes'
  | 'seats'
  | 'summary'
  | 'payment'
  | 'confirmation'
  | 'theatre'
  | 'offers'
  | 'contact'
  | 'my-bookings'
  | 'admin';
