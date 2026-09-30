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
  INITIAL_USER,
  ADMIN_USER,
} from '../data/mockData';

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

// Generates showtimes with consistent pre-occupied seats
export const generateShowtimesForMovieAndDate = (movie: Movie, dateIso: string): Showtime[] => {
  const formats: ScreenFormat[] = movie.availableFormats.length > 0 ? movie.availableFormats : ['2D', '4K Dolby Atmos'];
  
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
  login: (emailOrPhone: string, role?: 'customer' | 'admin', name?: string) => void;
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
    customerDetails: { name: string; email: string; phone: string }
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
  addMovie: (movieData: Omit<Movie, 'id'>) => void;
  updateMovie: (movie: Movie) => void;
  deleteMovie: (movieId: string) => void;
  updateTicketPrices: (prices: TicketPriceConfig) => void;
  addOffer: (offer: Offer) => void;
  deleteOffer: (offerId: string) => void;
}

const CinemaContext = createContext<CinemaContextType | undefined>(undefined);

export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dates = getUpcomingDates();
  
  // Persisted state
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('babu_theatre_movies');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_MOVIES;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('babu_theatre_offers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_OFFERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('babu_theatre_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_BOOKINGS;
  });

  const [ticketPrices, setTicketPrices] = useState<TicketPriceConfig>(() => {
    const saved = localStorage.getItem('babu_theatre_prices');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TICKET_PRICES;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('babu_theatre_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USER;
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
    localStorage.setItem('babu_theatre_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('babu_theatre_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('babu_theatre_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('babu_theatre_prices', JSON.stringify(ticketPrices));
  }, [ticketPrices]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('babu_theatre_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('babu_theatre_user');
    }
  }, [currentUser]);

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
      // Discount cannot exceed ticket total
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

  // Complete demo payment & generate real ticket
  const completeBooking = (
    paymentMethod: string,
    customerDetails: { name: string; email: string; phone: string }
  ): Booking => {
    const summary = getPricingSummary();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BT2026${randomSuffix}`;
    
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBooking: Booking = {
      id: bookingId,
      userId: currentUser?.id,
      userName: customerDetails.name || currentUser?.name || 'Valued Cinema Guest',
      userEmail: customerDetails.email || currentUser?.email || 'guest@babutheatre.com',
      userPhone: customerDetails.phone || currentUser?.phone || '+91 98400 12345',
      movieId: selectedMovie?.id || 'movie-retro',
      movieTitle: selectedMovie?.title || 'Retro',
      moviePoster: selectedMovie?.posterUrl || '',
      movieFormat: selectedShowtime?.format || '4K Dolby Atmos',
      theatreName: 'BABU THEATRE',
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

    setBookings((prev) => [newBooking, ...prev]);
    setConfirmedBooking(newBooking);
    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return newBooking;
  };

  const cancelBooking = (bookingId: string): boolean => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
    );
    return true;
  };

  // Auth
  const login = (emailOrPhone: string, role: 'customer' | 'admin' = 'customer', name?: string) => {
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
  };

  const logout = () => {
    setCurrentUser(null);
    if (currentView === 'admin' || currentView === 'my-bookings') {
      setCurrentView('home');
    }
  };

  // Admin operations
  const addMovie = (movieData: Omit<Movie, 'id'>) => {
    const id = `movie-${Date.now()}`;
    const newMovie: Movie = { id, ...movieData };
    setMovies((prev) => [newMovie, ...prev]);
  };

  const updateMovie = (updated: Movie) => {
    setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    if (selectedMovie?.id === updated.id) {
      setSelectedMovie(updated);
    }
  };

  const deleteMovie = (movieId: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    if (selectedMovie?.id === movieId) {
      setSelectedMovie(movies.find((m) => m.id !== movieId) || null);
    }
  };

  const updateTicketPrices = (prices: TicketPriceConfig) => {
    setTicketPrices(prices);
  };

  const addOffer = (offer: Offer) => {
    setOffers((prev) => [offer, ...prev]);
  };

  const deleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
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
