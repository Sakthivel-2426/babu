import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseKey.includes('your-key')
);

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase Client Connected to URL:', supabaseUrl);
  } catch (err: any) {
    console.warn('⚠️ Supabase connection warning:', err.message);
  }
} else {
  console.log('ℹ️ Running Supabase in Local File Cache Mode. (Add SUPABASE_URL and SUPABASE_ANON_KEY to .env to connect to your live Supabase project)');
}

// Local File Persistence for Development / Fallback
const DATA_DIR = path.resolve(__dirname, '../server-data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadLocalJson<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error loading ${filename}:`, e);
    }
  }
  return fallback;
}

function saveLocalJson<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Error saving ${filename}:`, e);
  }
}

// In-Memory / File-based Storage Containers
let localMovies = loadLocalJson<any[]>('movies.json', [
  {
    id: 'movie-retro',
    title: 'Retro',
    tagline: 'Old scores, neon nights, and no turning back.',
    description: 'Set in the gritty 1980s underworld, an enigmatic ex-racer turned underground courier is pulled back into high-stakes espionage when an old rival resurfaces in the neon-lit port city.',
    genre: ['Action', 'Crime', 'Thriller'],
    language: 'Tamil',
    duration: '2h 38m',
    rating: 'U/A 16+',
    imdbScore: 8.7,
    releaseDate: '2026-09-18',
    director: 'Karthik Subbaraj',
    cast: [
      { name: 'Suriya Sivakumar', role: 'Deva' },
      { name: 'Pooja Hegde', role: 'Ananya' },
      { name: 'Bobby Deol', role: 'Bhairav' },
      { name: 'Joju George', role: 'Inspector Raghav' },
    ],
    posterUrl: '/src/assets/images/movie_poster_retro_1790660356867.jpg',
    backdropUrl: '/src/assets/images/hero_cinema_banner_1790660341119.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'now-showing',
    availableFormats: ['2D', '4K Dolby Atmos'],
    screens: ['Screen 1 - 4K Dolby Atmos', 'Screen 2 - Barco 4K'],
  },
  {
    id: 'movie-coolie',
    title: 'Coolie',
    tagline: 'When the gold runs heavy, only one man balances the scales.',
    description: 'A powerful harbor dockworker with an unyielding code of brotherhood uncovers an international gold smuggling syndicate operating under the guise of shipping containers.',
    genre: ['Action', 'Drama', 'Thriller'],
    language: 'Tamil',
    duration: '2h 52m',
    rating: 'U/A 16+',
    imdbScore: 9.1,
    releaseDate: '2026-09-12',
    director: 'Lokesh Kanagaraj',
    cast: [
      { name: 'Rajinikanth', role: 'Deva Coolie' },
      { name: 'Nagarjuna Akkineni', role: 'Simon' },
      { name: 'Soubin Shahir', role: 'Dayal' },
      { name: 'Shruti Haasan', role: 'Preethi' },
    ],
    posterUrl: '/src/assets/images/movie_poster_coolie_1790660370960.jpg',
    backdropUrl: '/src/assets/images/hero_cinema_banner_1790660341119.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'now-showing',
    availableFormats: ['2D', '4K Dolby Atmos', 'IMAX Laser'],
    screens: ['Screen 1 - 4K Dolby Atmos'],
  },
  {
    id: 'movie-dragon',
    title: 'Dragon',
    tagline: 'Unleash the fire within the tempest.',
    description: 'An ancient guardian lineage awakens in modern Tamil Nadu as dark celestial forces threaten to breach the earthly realm. A fiery college youth must embrace his draconic destiny.',
    genre: ['Fantasy', 'Action', 'Adventure'],
    language: 'Tamil',
    duration: '2h 25m',
    rating: 'U/A',
    imdbScore: 8.3,
    releaseDate: '2026-09-05',
    director: 'Ashwath Marimuthu',
    cast: [
      { name: 'Pradeep Ranganathan', role: 'Agnish / Dragon' },
      { name: 'Anupama Parameswaran', role: 'Meera' },
      { name: 'Kayadu Lohar', role: 'Tara' },
      { name: 'Gautham Vasudev Menon', role: 'Master Shankara' },
    ],
    posterUrl: '/src/assets/images/movie_poster_dragon_1790660383282.jpg',
    backdropUrl: '/src/assets/images/hero_cinema_banner_1790660341119.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'now-showing',
    availableFormats: ['2D', '3D', '4K Dolby Atmos'],
    screens: ['Screen 2 - Barco 4K', 'Screen 3 - Gold VIP'],
  },
  {
    id: 'movie-amaran',
    title: 'Amaran',
    tagline: 'Courage etched forever in the snows and hearts.',
    description: 'The heroic biographical tribute chronicling the extraordinary valour and indomitable spirit of Major Mukund Varadarajan AC of the Indian Army during counter-insurgency operations in Kashmir.',
    genre: ['Biography', 'Action', 'Drama'],
    language: 'Tamil',
    duration: '2h 47m',
    rating: 'U/A 13+',
    imdbScore: 8.9,
    releaseDate: '2026-08-28',
    director: 'Rajkumar Periasamy',
    cast: [
      { name: 'Sivakarthikeyan', role: 'Major Mukund Varadarajan' },
      { name: 'Sai Pallavi', role: 'Indu Rebecca Varghese' },
      { name: 'Bhuvan Arora', role: 'Sepoy Vikram' },
      { name: 'Rahul Bose', role: 'Col. Amit Sharma' },
    ],
    posterUrl: '/src/assets/images/movie_poster_amaran_1790660396594.jpg',
    backdropUrl: '/src/assets/images/hero_cinema_banner_1790660341119.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'now-showing',
    availableFormats: ['2D', '4K Dolby Atmos'],
    screens: ['Screen 1 - 4K Dolby Atmos', 'Screen 3 - Gold VIP'],
  },
  {
    id: 'movie-thalapathy-69',
    title: 'Jana Nayagan',
    tagline: 'The final thunder of the people’s voice.',
    description: 'An electrifying political mass saga portraying the rise of an idealistic grassroots leader who challenges corrupt institutional dynasties to restore democratic dignity to ordinary citizens.',
    genre: ['Action', 'Political', 'Drama'],
    language: 'Tamil',
    duration: '2h 55m',
    rating: 'U/A 16+',
    releaseDate: '2026-10-15',
    director: 'H. Vinoth',
    cast: [
      { name: 'Thalapathy Vijay', role: 'Vetrimaran' },
      { name: 'Pooja Hegde', role: 'Advocate Priya' },
      { name: 'Bobby Deol', role: 'Rajeshwar MP' },
      { name: 'Gautham Menon', role: 'Election Commissioner' },
    ],
    posterUrl: '/src/assets/images/movie_poster_coolie_1790660370960.jpg',
    backdropUrl: '/src/assets/images/hero_cinema_banner_1790660341119.jpg',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'coming-soon',
    availableFormats: ['2D', '4K Dolby Atmos', 'IMAX Laser'],
    screens: ['Screen 1 - 4K Dolby Atmos'],
  },
]);

let localOffers = loadLocalJson<any[]>('offers.json', [
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
    terms: ['Valid on Monday through Thursday shows only', 'Valid student ID must be presented upon entry', 'Maximum 2 tickets per student ID'],
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
    terms: ['Applicable on Friday, Saturday & Sunday showtimes', 'Requires minimum of 3 tickets in a single transaction', 'Cannot be clubbed with other promotional coupons'],
  },
  {
    id: 'offer-babu50',
    code: 'BABU50',
    title: 'Flat 50% Off Special',
    description: 'Get 50% discount on bookings of 2 or more tickets across any screen format.',
    discountType: 'percentage',
    discountValue: 50,
    minTickets: 2,
    validUntil: '31 Dec 2026',
    category: 'Weekend',
    icon: 'Sparkles',
    terms: ['Valid on minimum 2 tickets', 'Valid once per customer'],
  },
]);

let localPricing = loadLocalJson('pricing.json', {
  VIP: 250,
  Premium: 200,
  Regular: 150,
  convenienceFeePerTicket: 30,
});

let localBookings = loadLocalJson<any[]>('bookings.json', [
  {
    id: 'BC20268492',
    userName: 'Vel Shakthi',
    userEmail: 'shakthi@example.com',
    userPhone: '+91 98400 12345',
    movieId: 'movie-retro',
    movieTitle: 'Retro',
    moviePoster: '/src/assets/images/movie_poster_retro_1790660356867.jpg',
    movieFormat: '4K Dolby Atmos',
    theatreName: 'BABU CINEMAS',
    screenName: 'Screen 1 - 4K Dolby Atmos',
    date: '2026-09-30',
    showtime: '06:30 PM',
    seats: [
      { id: 'E6', tier: 'Premium', price: 200 },
      { id: 'E7', tier: 'Premium', price: 200 },
    ],
    ticketTotal: 400,
    convenienceFee: 60,
    discount: 60,
    discountCode: 'WEEKEND15',
    totalPaid: 400,
    paymentMethod: 'Razorpay UPI (Instant)',
    bookedAt: '2026-09-29 14:30',
    status: 'CONFIRMED',
  },
]);

let localPayments = loadLocalJson<any[]>('payments.json', []);

// Database Service Interface
export const dbService = {
  // Movies
  async getMovies() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('movies').select('*');
        if (!error && data && data.length > 0) {
          return data.map((m) => ({
            id: m.id,
            title: m.title,
            tagline: m.tagline,
            description: m.description,
            genre: m.genre || [],
            language: m.language,
            duration: m.duration,
            rating: m.rating,
            imdbScore: Number(m.imdb_score),
            releaseDate: m.release_date,
            director: m.director,
            cast: m.cast_members || [],
            posterUrl: m.poster_url,
            backdropUrl: m.backdrop_url,
            trailerUrl: m.trailer_url,
            status: m.status,
            availableFormats: m.available_formats || [],
            screens: m.screens || [],
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch movies error, using local fallback:', err);
      }
    }
    return localMovies;
  },

  async saveMovie(movie: any) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('movies').upsert({
          id: movie.id,
          title: movie.title,
          tagline: movie.tagline,
          description: movie.description,
          genre: movie.genre,
          language: movie.language,
          duration: movie.duration,
          rating: movie.rating,
          imdb_score: movie.imdbScore,
          release_date: movie.releaseDate,
          director: movie.director,
          cast_members: movie.cast,
          poster_url: movie.posterUrl,
          backdrop_url: movie.backdropUrl,
          trailer_url: movie.trailerUrl,
          status: movie.status,
          available_formats: movie.availableFormats,
          screens: movie.screens,
        });
      } catch (err) {
        console.warn('Supabase saveMovie error:', err);
      }
    }

    const index = localMovies.findIndex((m) => m.id === movie.id);
    if (index >= 0) {
      localMovies[index] = movie;
    } else {
      localMovies.unshift(movie);
    }
    saveLocalJson('movies.json', localMovies);
    return movie;
  },

  async deleteMovie(id: string) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('movies').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteMovie error:', err);
      }
    }
    localMovies = localMovies.filter((m) => m.id !== id);
    saveLocalJson('movies.json', localMovies);
    return true;
  },

  // Offers
  async getOffers() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('offers').select('*');
        if (!error && data && data.length > 0) {
          return data.map((o) => ({
            id: o.id,
            code: o.code,
            title: o.title,
            description: o.description,
            discountType: o.discount_type,
            discountValue: Number(o.discount_value),
            minTickets: o.min_tickets,
            validUntil: o.valid_until,
            category: o.category,
            icon: o.icon,
            terms: o.terms || [],
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch offers error:', err);
      }
    }
    return localOffers;
  },

  async saveOffer(offer: any) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('offers').upsert({
          id: offer.id,
          code: offer.code,
          title: offer.title,
          description: offer.description,
          discount_type: offer.discountType,
          discount_value: offer.discountValue,
          min_tickets: offer.minTickets,
          valid_until: offer.validUntil,
          category: offer.category,
          icon: offer.icon,
          terms: offer.terms,
        });
      } catch (err) {
        console.warn('Supabase saveOffer error:', err);
      }
    }
    const idx = localOffers.findIndex((o) => o.id === offer.id);
    if (idx >= 0) localOffers[idx] = offer;
    else localOffers.push(offer);
    saveLocalJson('offers.json', localOffers);
    return offer;
  },

  // Pricing
  async getPricing() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('pricing').select('*').eq('id', 'default').single();
        if (!error && data) {
          return {
            VIP: data.vip,
            Premium: data.premium,
            Regular: data.regular,
            convenienceFeePerTicket: data.convenience_fee,
          };
        }
      } catch (err) {
        console.warn('Supabase fetch pricing error:', err);
      }
    }
    return localPricing;
  },

  async updatePricing(pricing: any) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('pricing').upsert({
          id: 'default',
          vip: pricing.VIP,
          premium: pricing.Premium,
          regular: pricing.Regular,
          convenience_fee: pricing.convenienceFeePerTicket,
        });
      } catch (err) {
        console.warn('Supabase updatePricing error:', err);
      }
    }
    localPricing = pricing;
    saveLocalJson('pricing.json', localPricing);
    return localPricing;
  },

  // Bookings
  async getBookings() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((b) => ({
            id: b.id,
            userId: b.user_id,
            userName: b.user_name,
            userEmail: b.user_email,
            userPhone: b.user_phone,
            movieId: b.movie_id,
            movieTitle: b.movie_title,
            moviePoster: b.movie_poster,
            movieFormat: b.movie_format,
            theatreName: b.theatre_name,
            screenName: b.screen_name,
            date: b.date,
            showtime: b.showtime,
            seats: b.seats,
            ticketTotal: Number(b.ticket_total),
            convenienceFee: Number(b.convenience_fee),
            discount: Number(b.discount),
            discountCode: b.discount_code,
            totalPaid: Number(b.total_paid),
            paymentMethod: b.payment_method,
            bookedAt: b.booked_at,
            status: b.status,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch bookings error:', err);
      }
    }
    return localBookings;
  },

  async getBookingById(id: string) {
    const all = await this.getBookings();
    return all.find((b) => b.id === id) || null;
  },

  async createBooking(booking: any) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bookings').insert({
          id: booking.id,
          user_id: booking.userId || null,
          user_name: booking.userName,
          user_email: booking.userEmail,
          user_phone: booking.userPhone,
          movie_id: booking.movieId,
          movie_title: booking.movieTitle,
          movie_poster: booking.moviePoster,
          movie_format: booking.movieFormat,
          theatre_name: booking.theatreName || 'BABU CINEMAS',
          screen_name: booking.screenName,
          date: booking.date,
          showtime: booking.showtime,
          seats: booking.seats,
          ticket_total: booking.ticketTotal,
          convenience_fee: booking.convenienceFee,
          discount: booking.discount || 0,
          discount_code: booking.discountCode || null,
          total_paid: booking.totalPaid,
          payment_method: booking.paymentMethod,
          payment_id: booking.paymentId || null,
          order_id: booking.orderId || null,
          status: booking.status || 'CONFIRMED',
          booked_at: booking.bookedAt,
        });
      } catch (err) {
        console.warn('Supabase createBooking error, cached locally:', err);
      }
    }

    localBookings.unshift(booking);
    saveLocalJson('bookings.json', localBookings);
    return booking;
  },

  async cancelBooking(id: string) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bookings').update({ status: 'CANCELLED' }).eq('id', id);
      } catch (err) {
        console.warn('Supabase cancelBooking error:', err);
      }
    }
    localBookings = localBookings.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b));
    saveLocalJson('bookings.json', localBookings);
    return true;
  },

  // Payments Record
  async recordPayment(payment: any) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('payments').insert({
          id: payment.id || `pay_${Date.now()}`,
          booking_id: payment.bookingId,
          razorpay_order_id: payment.razorpayOrderId,
          razorpay_payment_id: payment.razorpayPaymentId,
          razorpay_signature: payment.razorpaySignature,
          amount: payment.amount,
          currency: payment.currency || 'INR',
          status: payment.status || 'captured',
          method: payment.method || 'Razorpay',
          customer_email: payment.customerEmail,
          customer_phone: payment.customerPhone,
        });
      } catch (err) {
        console.warn('Supabase recordPayment error:', err);
      }
    }
    localPayments.unshift(payment);
    saveLocalJson('payments.json', localPayments);
    return payment;
  },
};
