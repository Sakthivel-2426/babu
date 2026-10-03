import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Movie,
  Offer,
  Booking,
  Seat,
  Showtime,
  TicketPriceConfig,
  User,
  AppView,
  ScreenFormat,
} from '../types';
import {
  INITIAL_MOVIES,
  INITIAL_OFFERS,
  INITIAL_BOOKINGS,
  INITIAL_TICKET_PRICES,
  ADMIN_USER,
} from '../data/mockData';
import { api } from '../services/api';
import {
  getRegisteredMovies,
  sortMoviesLatestFirst,
  mergeMoviesWithoutDuplicates,
} from '../data/moviesRegistry';
import { movieService } from '../services/movieService';
import { firestoreService } from '../services/firestoreService';

// Generates next 7 days in YYYY-MM-DD and formatted labels
export const getUpcomingDates = () => {
  const dates = [];
  const baseDate = new Date();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    
    let label = '';
    if (i === 0) label = 'TODAY';
    else if (i === 1) label = 'TOMORROW';
    else {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      label = `${dayName}, ${monthName} ${d.getDate()}`;
    }

    dates.push({
      iso,
      label,
      fullDate: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      shortDay: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return dates;
};

// Generates showtimes with consistent occupied seats and support for daily custom showtimes
export const generateShowtimesForMovieAndDate = (movie: Movie, dateIso: string): Showtime[] => {
  const formats: ScreenFormat[] = movie.availableFormats.length > 0 ? movie.availableFormats : ['2D', '4K Dolby Atmos'];
  
  // If administrator or daily registry configured specific custom showtimes for this movie:
  if (movie.customShowtimes && movie.customShowtimes.length > 0) {
    return movie.customShowtimes.map((timeStr, idx) => {
      let period: 'Morning' | 'Afternoon' | 'Evening' | 'Night' = 'Evening';
      const lower = timeStr.toLowerCase();
      if (lower.includes('am')) {
        period = 'Morning';
      } else {
        const hourMatch = timeStr.match(/^(\d{1,2})/);
        const hour = hourMatch ? parseInt(hourMatch[1], 10) : 6;
        if (hour === 12 || hour < 4) {
          period = 'Afternoon';
        } else if (hour >= 4 && hour < 9) {
          period = 'Evening';
        } else {
          period = 'Night';
        }
      }

      const screenName =
        movie.screens && movie.screens.length > 0
          ? movie.screens[idx % movie.screens.length]
          : `Screen ${(idx % 3) + 1} - 4K Dolby Atmos`;

      const format = formats[idx % formats.length] || '4K Dolby Atmos';
      const timeClean = timeStr.replace(/[^0-9]/g, '');

      return {
        id: `${movie.id}-${dateIso}-${timeClean || idx}`,
        movieId: movie.id,
        screenName,
        time: timeStr,
        period,
        format,
        date: dateIso,
        occupiedSeatIds: ['A3', 'A4', 'C6', 'C7', 'E2', 'F5', 'G8', 'H1'].slice(0, 4 + (idx % 4)),
      };
    });
  }

  // Default standard 5 screening slots
  return [
    {
      id: `${movie.id}-${dateIso}-1000`,
      movieId: movie.id,
      screenName: 'Screen 1 - 4K Dolby Atmos',
      time: '10:00 AM',
      period: 'Morning',
      format: formats.includes('4K Dolby Atmos') ? '4K Dolby Atmos' : '2D',
      date: dateIso,
      occupiedSeatIds: ['A3', 'A4', 'C6', 'C7', 'E2', 'F5', 'G8', 'H1'],
    },
    {
      id: `${movie.id}-${dateIso}-1245`,
      movieId: movie.id,
      screenName: 'Screen 2 - Barco 4K',
      time: '12:45 PM',
      period: 'Morning',
      format: '2D',
      date: dateIso,
      occupiedSeatIds: ['B2', 'B3', 'D4', 'D5', 'D6', 'F3', 'G4', 'G5'],
    },
    {
      id: `${movie.id}-${dateIso}-1530`,
      movieId: movie.id,
      screenName: 'Screen 1 - 4K Dolby Atmos',
      time: '03:30 PM',
      period: 'Afternoon',
      format: formats.includes('3D') ? '3D' : '4K Dolby Atmos',
      date: dateIso,
      occupiedSeatIds: ['A1', 'A2', 'B5', 'B6', 'C3', 'C4', 'C5', 'E7', 'F8'],
    },
    {
      id: `${movie.id}-${dateIso}-1830`,
      movieId: movie.id,
      screenName: 'Screen 1 - 4K Dolby Atmos',
      time: '06:30 PM',
      period: 'Evening',
      format: '4K Dolby Atmos',
      date: dateIso,
      occupiedSeatIds: ['A4', 'A5', 'B4', 'B5', 'C4', 'C5', 'D4', 'D5', 'E4', 'E5'],
    },
    {
      id: `${movie.id}-${dateIso}-2130`,
      movieId: movie.id,
      screenName: 'Screen 3 - Gold VIP',
      time: '09:30 PM',
      period: 'Night',
      format: '4K Dolby Atmos',
      date: dateIso,
      occupiedSeatIds: ['A2', 'A3', 'B2', 'B3', 'C1', 'C2', 'F6', 'H7'],
    },
  ];
};

interface CinemaContextType {
  movies: Movie[];
  offers: Offer[];
  bookings: Booking[];
  ticketPrices: TicketPriceConfig;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  // Booking selections
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedShowtime: Showtime | null;
  setSelectedShowtime: (showtime: Showtime | null) => void;
  selectedSeats: Seat[];
  toggleSeat: (seat: Seat) => void;
  clearSeats: () => void;
  appliedCoupon: Offer | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  confirmedBooking: Booking | null;
  setConfirmedBooking: (booking: Booking | null) => void;
  // User & Auth
  currentUser: User | null;
  login: (emailOrPhone: string, password?: string, role?: 'customer' | 'admin', name?: string) => Promise<boolean>;
  register: (params: { name: string; email: string; phone?: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  // Modals & UI
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  activeTrailerMovie: Movie | null;
  setActiveTrailerMovie: (movie: Movie | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Actions
  startBookingForMovie: (movie: Movie, preferredDate?: string) => void;
  proceedToSeats: (showtime: Showtime) => void;
  completeBooking: (
    paymentMethod: string,
    customerDetails: { name: string; email: string; phone: string },
    existingBooking?: Booking
  ) => Booking;
  cancelBooking: (bookingId: string) => boolean;
  // Calculations
  getPricingSummary: () => {
    ticketTotal: number;
    convenienceFee: number;
    discountAmount: number;
    grandTotal: number;
  };
  // Admin Operations
  addMovie: (movieData: Omit<Movie, 'id'>) => Promise<void>;
  updateMovie: (movie: Movie) => Promise<void>;
  deleteMovie: (movieId: string) => Promise<void>;
  updateTicketPrices: (prices: TicketPriceConfig) => Promise<void>;
  addOffer: (offer: Offer) => Promise<void>;
  deleteOffer: (offerId: string) => Promise<void>;
}

const CinemaContext = createContext<CinemaContextType | undefined>(undefined);

export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dates = getUpcomingDates();
  
  // State
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('babu_cinemas_movies') || localStorage.getItem('babu_theatre_movies');
    if (saved) {
      try {
        const parsed: Movie[] = JSON.parse(saved);
        // Ensure all verified movies from the registry are present without duplicates, sorted latest first
        const merged = mergeMoviesWithoutDuplicates(parsed, INITIAL_MOVIES);
        const sorted = sortMoviesLatestFirst(merged);
        localStorage.setItem('babu_cinemas_movies', JSON.stringify(sorted));
        return sorted;
      } catch (e) {
        console.error(e);
      }
    }
    return sortMoviesLatestFirst(INITIAL_MOVIES);
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('babu_cinemas_offers') || localStorage.getItem('babu_theatre_offers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_OFFERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('babu_cinemas_bookings') || localStorage.getItem('babu_theatre_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_BOOKINGS;
  });

  const [ticketPrices, setTicketPrices] = useState<TicketPriceConfig>(() => {
    const saved = localStorage.getItem('babu_cinemas_prices') || localStorage.getItem('babu_theatre_prices');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TICKET_PRICES;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('babu_cinemas_user') || localStorage.getItem('babu_theatre_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  // Navigation and active flows
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(movies[0]);
  const [selectedDate, setSelectedDate] = useState<string>(dates[0].iso);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('babu_cinemas_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('babu_cinemas_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('babu_cinemas_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('babu_cinemas_prices', JSON.stringify(ticketPrices));
  }, [ticketPrices]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('babu_cinemas_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('babu_cinemas_user');
      localStorage.removeItem('babu_theatre_user');
    }
  }, [currentUser]);

  // Initial Sync from Backend Database (MongoDB via Express API)
  useEffect(() => {
    // 1. Verify saved auth token
    api.getMe().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    }).catch(() => {});

    // 2. Fetch movies via movieService (MongoDB / Supabase / Local)
    movieService.getMovies().then((backendMovies) => {
      if (backendMovies && backendMovies.length > 0) {
        const combined = sortMoviesLatestFirst(mergeMoviesWithoutDuplicates(backendMovies, INITIAL_MOVIES));
        setMovies(combined);
        if (!selectedMovie || !combined.some((m) => m.id === selectedMovie.id)) {
          const defaultMovie = combined.find((m) => m.status === 'now-showing') || combined[0];
          setSelectedMovie(defaultMovie);
        }
      }
    }).catch((err) => console.log('Connecting to movies backend:', err.message));

    // 3. Fetch offers from MongoDB
    api.getOffers().then((backendOffers) => {
      if (backendOffers && backendOffers.length > 0) {
        setOffers(backendOffers);
      }
    }).catch(() => {});

    // 4. Fetch pricing from MongoDB
    api.getPricing().then((backendPricing) => {
      if (backendPricing) {
        setTicketPrices(backendPricing);
      }
    }).catch(() => {});

    // 5. Fetch bookings from MongoDB
    api.getBookings().then((backendBookings) => {
      if (backendBookings && backendBookings.length > 0) {
        setBookings(backendBookings);
      }
    }).catch(() => {});
  }, []);

  // Seat toggle handler (max 10 seats)
  const toggleSeat = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        if (prev.length >= 10) {
          alert('Maximum 10 seats allowed per booking transaction.');
          return prev;
        }
        return [...prev, { ...seat, status: 'selected' }];
      }
    });
  };

  const clearSeats = () => {
    setSelectedSeats([]);
  };

  // Coupon handling
  const applyCouponCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const matched = offers.find((o) => o.code.toUpperCase() === cleanCode);
    
    if (!matched) {
      return { success: false, message: 'Invalid promo code. Please check available offers.' };
    }

    if (matched.minTickets && selectedSeats.length < matched.minTickets) {
      return {
        success: false,
        message: `This coupon requires a minimum of ${matched.minTickets} seats. (Selected: ${selectedSeats.length})`,
      };
    }

    setAppliedCoupon(matched);
    return {
      success: true,
      message: `Coupon "${matched.code}" applied! ${
        matched.discountType === 'percentage'
          ? `${matched.discountValue}% off`
          : `₹${matched.discountValue} discount`
      }`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Dynamic pricing summary
  const getPricingSummary = () => {
    const ticketTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    const convenienceFee = selectedSeats.length * ticketPrices.convenienceFeePerTicket;
    
    let discountAmount = 0;
    if (appliedCoupon && selectedSeats.length > 0) {
      if (appliedCoupon.discountType === 'percentage') {
        discountAmount = Math.round((ticketTotal * appliedCoupon.discountValue) / 100);
      } else {
        discountAmount = appliedCoupon.discountValue;
      }
      if (discountAmount > ticketTotal) {
        discountAmount = ticketTotal;
      }
    }

    const grandTotal = Math.max(0, ticketTotal + convenienceFee - discountAmount);

    return {
      ticketTotal,
      convenienceFee,
      discountAmount,
      grandTotal,
    };
  };

  // Start booking shortcut
  const startBookingForMovie = (movie: Movie, preferredDate?: string) => {
    setSelectedMovie(movie);
    if (preferredDate) {
      setSelectedDate(preferredDate);
    }
    clearSeats();
    setAppliedCoupon(null);
    setCurrentView('showtimes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const proceedToSeats = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    clearSeats();
    setAppliedCoupon(null);
    setCurrentView('seats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Complete payment & generate real ticket in MongoDB
  const completeBooking = (
    paymentMethod: string,
    customerDetails: { name: string; email: string; phone: string },
    existingBooking?: Booking
  ): Booking => {
    if (existingBooking) {
      setBookings((prev) => [existingBooking, ...prev.filter((b) => b.id !== existingBooking.id)]);
      setConfirmedBooking(existingBooking);
      setCurrentView('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return existingBooking;
    }

    const summary = getPricingSummary();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BT2026${randomSuffix}`;
    
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBooking: Booking = {
      id: bookingId,
      userId: currentUser?.id,
      userName: customerDetails.name || currentUser?.name || 'Valued Cinema Guest',
      userEmail: customerDetails.email || currentUser?.email || 'guest@babucinemas.com',
      userPhone: customerDetails.phone || currentUser?.phone || '+91 98400 12345',
      movieId: selectedMovie?.id || 'movie-retro',
      movieTitle: selectedMovie?.title || 'Retro',
      moviePoster: selectedMovie?.posterUrl || '',
      movieFormat: selectedShowtime?.format || '4K Dolby Atmos',
      theatreName: 'BABU CINEMAS',
      screenName: selectedShowtime?.screenName || 'Screen 1 - 4K Dolby Atmos',
      date: selectedDate,
      showtime: selectedShowtime?.time || '06:30 PM',
      seats: selectedSeats.map((s) => ({
        id: s.id,
        tier: s.tier,
        price: s.price,
      })),
      ticketTotal: summary.ticketTotal,
      convenienceFee: summary.convenienceFee,
      discount: summary.discountAmount,
      discountCode: appliedCoupon?.code,
      totalPaid: summary.grandTotal,
      paymentMethod,
      bookedAt: formattedDate,
      status: 'CONFIRMED',
    };

    // Async sync to MongoDB backend and Cloud Firestore
    api.createBooking(newBooking).catch((err) => console.warn('Booking sync to MongoDB error:', err));
    firestoreService.saveBooking(newBooking).catch((err) => console.warn('Booking sync to Firestore note:', err));

    setBookings((prev) => [newBooking, ...prev]);
    setConfirmedBooking(newBooking);
    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return newBooking;
  };

  const cancelBooking = (bookingId: string): boolean => {
    api.cancelBooking(bookingId).catch(() => {});
    firestoreService.cancelBooking(bookingId).catch(() => {});
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
    );
    return true;
  };

  // Auth using MongoDB backend
  const login = async (
    emailOrPhone: string,
    password?: string,
    role: 'customer' | 'admin' = 'customer',
    name?: string
  ): Promise<boolean> => {
    try {
      const defaultPassword = role === 'admin' || emailOrPhone.toLowerCase().includes('admin')
        ? 'AdminPassword2026!'
        : 'CustomerPassword2026!';

      const res = await api.login({
        emailOrPhone,
        password: password || defaultPassword,
      });

      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        return true;
      }
    } catch (err: any) {
      // Fallback for one-click demo if offline
      if (role === 'admin' || emailOrPhone.toLowerCase().includes('admin')) {
        setCurrentUser(ADMIN_USER);
      } else {
        setCurrentUser({
          id: `usr-${Date.now()}`,
          name: name || (emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Moviegoer'),
          email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@guest.com`,
          phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98765 43210',
          role: 'customer',
        });
      }
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const register = async (params: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const res = await api.register(params);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        return true;
      }
    } catch (err: any) {
      alert(`Registration error: ${err.message}`);
      return false;
    }
    return false;
  };

  const logout = () => {
    api.removeToken();
    setCurrentUser(null);
    if (currentView === 'admin' || currentView === 'my-bookings') {
      setCurrentView('home');
    }
  };

  // Admin operations connected to MongoDB backend
  // Admin operations connected to backend movieService
  const addMovie = async (movieData: Omit<Movie, 'id'>) => {
    try {
      const savedMovie = await movieService.addMovie(movieData);
      setMovies((prev) => {
        // Prevent duplicates by title or ID
        const normTitle = savedMovie.title.trim().toLowerCase();
        const filtered = prev.filter(
          (m) => m.id !== savedMovie.id && m.title.trim().toLowerCase() !== normTitle
        );
        return sortMoviesLatestFirst([savedMovie, ...filtered]);
      });
      if (savedMovie.status === 'now-showing') {
        setSelectedMovie(savedMovie);
      }
    } catch (err: any) {
      const id = `movie-${Date.now()}`;
      const newMovie: Movie = { id, ...movieData };
      setMovies((prev) => {
        const normTitle = newMovie.title.trim().toLowerCase();
        const filtered = prev.filter(
          (m) => m.id !== newMovie.id && m.title.trim().toLowerCase() !== normTitle
        );
        return sortMoviesLatestFirst([newMovie, ...filtered]);
      });
      if (newMovie.status === 'now-showing') {
        setSelectedMovie(newMovie);
      }
    }
  };

  const updateMovie = async (updated: Movie) => {
    try {
      const saved = await movieService.updateMovie(updated);
      setMovies((prev) => sortMoviesLatestFirst(prev.map((m) => (m.id === saved.id ? saved : m))));
      if (selectedMovie?.id === saved.id) {
        setSelectedMovie(saved);
      }
    } catch (err) {
      setMovies((prev) => sortMoviesLatestFirst(prev.map((m) => (m.id === updated.id ? updated : m))));
      if (selectedMovie?.id === updated.id) {
        setSelectedMovie(updated);
      }
    }
  };

  const deleteMovie = async (movieId: string) => {
    try {
      await movieService.deleteMovie(movieId);
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
      if (selectedMovie?.id === movieId) {
        setSelectedMovie(movies.find((m) => m.id !== movieId && m.status === 'now-showing') || null);
      }
    } catch (err) {
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
    }
  };

  const updateTicketPrices = async (prices: TicketPriceConfig) => {
    try {
      const updated = await api.updatePricing(prices);
      setTicketPrices(updated);
    } catch (err) {
      setTicketPrices(prices);
    }
  };

  const addOffer = async (offer: Offer) => {
    try {
      const created = await api.createOffer(offer);
      setOffers((prev) => [created, ...prev]);
    } catch (err) {
      setOffers((prev) => [offer, ...prev]);
    }
  };

  const deleteOffer = async (offerId: string) => {
    try {
      await api.deleteOffer(offerId);
      setOffers((prev) => prev.filter((o) => o.id !== offerId && o.code !== offerId));
    } catch (err) {
      setOffers((prev) => prev.filter((o) => o.id !== offerId));
    }
  };

  return (
    <CinemaContext.Provider
      value={{
        movies,
        offers,
        bookings,
        ticketPrices,
        currentView,
        setCurrentView,
        selectedMovie,
        setSelectedMovie,
        selectedDate,
        setSelectedDate,
        selectedShowtime,
        setSelectedShowtime,
        selectedSeats,
        toggleSeat,
        clearSeats,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        confirmedBooking,
        setConfirmedBooking,
        currentUser,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isSearchOpen,
        setIsSearchOpen,
        activeTrailerMovie,
        setActiveTrailerMovie,
        searchQuery,
        setSearchQuery,
        startBookingForMovie,
        proceedToSeats,
        completeBooking,
        cancelBooking,
        getPricingSummary,
        addMovie,
        updateMovie,
        deleteMovie,
        updateTicketPrices,
        addOffer,
        deleteOffer,
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
};

export const useCinema = () => {
  const context = useContext(CinemaContext);
  if (!context) {
    throw new Error('useCinema must be used within a CinemaProvider');
  }
  return context;
};
