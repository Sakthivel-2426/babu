import { Movie, Offer, TicketPriceConfig, Booking, User } from '../types';

import heroBannerImg from '../assets/images/hero_cinema_banner_1790660341119.jpg';
import retroPosterImg from '../assets/images/movie_poster_retro_1790660356867.jpg';
import cooliePosterImg from '../assets/images/movie_poster_coolie_1790660370960.jpg';
import dragonPosterImg from '../assets/images/movie_poster_dragon_1790660383282.jpg';
import amaranPosterImg from '../assets/images/movie_poster_amaran_1790660396594.jpg';

export { heroBannerImg };

export const INITIAL_TICKET_PRICES: TicketPriceConfig = {
  VIP: 250,
  Premium: 200,
  Regular: 150,
  convenienceFeePerTicket: 30,
};

import { getRegisteredMovies } from './moviesRegistry';

export const INITIAL_MOVIES: Movie[] = getRegisteredMovies();


export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'offer-student',
    code: 'STUDENT50',
    title: 'Student Special Discount',
    description: 'Get flat ₹50 OFF per ticket on showing your college / school student ID card at the entrance gate.',
    discountType: 'fixed',
    discountValue: 50,
    validUntil: '31 Dec 2026',
    category: 'Student',
    icon: 'GraduationCap',
    terms: [
      'Valid on Monday through Thursday shows only',
      'Valid student ID must be presented upon entry',
      'Maximum 2 tickets per student ID',
    ],
  },
  {
    id: 'offer-weekend',
    code: 'WEEKEND15',
    title: 'Weekend Blockbuster Bonanza',
    description: 'Enjoy 15% instant discount on booking 3 or more tickets for Friday, Saturday, or Sunday shows.',
    discountType: 'percentage',
    discountValue: 15,
    minTickets: 3,
    validUntil: '30 Nov 2026',
    category: 'Weekend',
    icon: 'Sparkles',
    terms: [
      'Applicable on Friday, Saturday & Sunday showtimes',
      'Requires minimum of 3 tickets in a single transaction',
      'Cannot be clubbed with other promotional coupons',
    ],
  },
  {
    id: 'offer-food',
    code: 'CINEBITES',
    title: 'Popcorn & Beverage Combo',
    description: 'Save flat ₹100 on movie tickets when combined with our Gourmet Jumbo Butter Popcorn & Coke counter voucher.',
    discountType: 'fixed',
    discountValue: 100,
    minTickets: 2,
    validUntil: '31 Dec 2026',
    category: 'Food',
    icon: 'UtensilsCrossed',
    terms: [
      'Redeemable at Babu Cinemas Gourmet Canteen counter',
      'Requires minimum 2 movie tickets in booking',
      'Includes 1 Jumbo Caramel/Butter Popcorn + 2 Regular Beverages',
    ],
  },
  {
    id: 'offer-family',
    code: 'FAMILYPACK',
    title: 'Family Gala Pack',
    description: 'Book 4 or more tickets and get flat ₹150 OFF your total booking plus free priority parking.',
    discountType: 'fixed',
    discountValue: 150,
    minTickets: 4,
    validUntil: '31 Dec 2026',
    category: 'Family',
    icon: 'Users',
    terms: [
      'Requires minimum 4 tickets in single transaction',
      'Valid across all screen tiers: Regular, Premium, VIP',
      'Complimentary priority vehicle parking token included with ticket',
    ],
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BC20268491',
    userName: 'Karthik Subramanian',
    userEmail: 'karthik.s@gmail.com',
    userPhone: '+91 98401 23456',
    movieId: 'movie-retro',
    movieTitle: 'Retro',
    moviePoster: retroPosterImg,
    movieFormat: '4K Dolby Atmos',
    theatreName: 'Babu Cinemas',
    screenName: 'Screen 1 - 4K Dolby Atmos',
    date: '2026-09-29',
    showtime: '06:30 PM',
    seats: [
      { id: 'C4', tier: 'Premium', price: 200 },
      { id: 'C5', tier: 'Premium', price: 200 },
    ],
    ticketTotal: 400,
    convenienceFee: 60,
    discount: 50,
    discountCode: 'STUDENT50',
    totalPaid: 410,
    paymentMethod: 'UPI (PhonePe)',
    bookedAt: '2026-09-28 14:22',
    status: 'CONFIRMED',
  },
  {
    id: 'BC20267210',
    userName: 'Priya Soundar',
    userEmail: 'priya.cinema@yahoo.com',
    userPhone: '+91 94440 98765',
    movieId: 'movie-coolie',
    movieTitle: 'Coolie',
    moviePoster: cooliePosterImg,
    movieFormat: '4K Dolby Atmos',
    theatreName: 'Babu Cinemas',
    screenName: 'Screen 1 - 4K Dolby Atmos',
    date: '2026-09-29',
    showtime: '09:30 PM',
    seats: [
      { id: 'A3', tier: 'VIP', price: 250 },
      { id: 'A4', tier: 'VIP', price: 250 },
      { id: 'A5', tier: 'VIP', price: 250 },
    ],
    ticketTotal: 750,
    convenienceFee: 90,
    discount: 0,
    totalPaid: 840,
    paymentMethod: 'Credit Card (HDFC)',
    bookedAt: '2026-09-28 16:45',
    status: 'CONFIRMED',
  },
];

export const INITIAL_USER: User = {
  id: 'usr-1',
  name: 'Vel Shakthi',
  email: 'velshakthi347@gmail.com',
  phone: '+91 98765 43210',
  role: 'customer',
};

export const ADMIN_USER: User = {
  id: 'admin-1',
  name: 'Babu Cinemas Admin',
  email: 'admin@babucinemas.com',
  phone: '+91 98400 12345',
  role: 'admin',
};

export const THEATRE_FACILITIES = [
  {
    title: '4K RGB Laser Projection',
    description: 'Ultra-high luminance Barco RGB laser digital projectors producing razor-sharp visual clarity, vibrant colors, and true inky blacks.',
    icon: 'Projector',
    tag: 'Visuals',
  },
  {
    title: 'Dolby Atmos 128 Channels',
    description: 'Next-generation object-based immersive acoustic sound with 128 discreet audio channels and overhead spatial speaker arrays.',
    icon: 'Volume2',
    tag: 'Audio',
  },
  {
    title: 'Plush Ergonomic Recliners',
    description: 'Gold Class motorized push-back recliners with personal charging ports, fold-away tables, and generous legroom spacing.',
    icon: 'Armchair',
    tag: 'Comfort',
  },
  {
    title: 'Gourmet CineBites Canteen',
    description: 'Hygienic multi-cuisine snack bar offering piping hot butter popcorn, nachos, crispy samosas, mocktails, and fresh espresso.',
    icon: 'Utensils',
    tag: 'Dining',
  },
  {
    title: 'Central Chilled Air Conditioning',
    description: 'Heavy duty high-efficiency HVAC chillers with HEPA air filtration maintaining an optimal pleasant 22°C temperature throughout.',
    icon: 'Wind',
    tag: 'Climate',
  },
  {
    title: 'Secure Multi-Level Parking',
    description: 'Spacious dedicated surveillance-monitored parking for over 250 two-wheelers and 120 cars with EV charging stations.',
    icon: 'Car',
    tag: 'Valet & Parking',
  },
];

export const THEATRE_SCREENS = [
  {
    name: 'Screen 1 - 4K Laser Dolby Atmos',
    capacity: 480,
    sound: 'Dolby Atmos 128 Channel',
    projection: 'Christie 4K Dual RGB Laser',
    seatsBreakdown: 'VIP Recliner: 60 | Premium: 240 | Regular: 180',
    curvedScreen: '62 ft Silver Curved Screen',
  },
  {
    name: 'Screen 2 - Barco 4K Digital Cinema',
    capacity: 350,
    sound: 'Dolby 7.1 Surround Master Audio',
    projection: 'Barco DP4K-32B Digital',
    seatsBreakdown: 'VIP Recliner: 40 | Premium: 180 | Regular: 130',
    curvedScreen: '48 ft Matte White Screen',
  },
  {
    name: 'Screen 3 - Gold Class Luxury Lounge',
    capacity: 120,
    sound: 'Meyer Sound Linear Acoustic',
    projection: 'Sony 4K HDR High Brightness',
    seatsBreakdown: 'Exclusive Motorized Luxury Recliners with In-Seat Dining',
    curvedScreen: '36 ft High Contrast Screen',
  },
];

export const THEATRE_INFO = {
  name: 'Babu Cinemas',
  location: 'Uthiramerur, Kanchipuram, Tamil Nadu, India',
  shortLocation: 'Uthiramerur, Kanchipuram',
  address: 'Babu Cinemas, Uthiramerur, Kanchipuram, Tamil Nadu, India',
  city: 'Uthiramerur',
  district: 'Kanchipuram',
  state: 'Tamil Nadu',
  country: 'India',
  googleMapsUrl: 'https://maps.google.com/?q=Babu+Cinemas,+Uthiramerur,+Kanchipuram,+Tamil+Nadu',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Babu+Cinemas+Uthiramerur+Kanchipuram+Tamil+Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed',
  phone: '+91 98400 12345 / +91 4175 222333',
  email: 'support@babucinemas.com',
  operatingHours: 'Daily 09:00 AM – 11:30 PM',
};

