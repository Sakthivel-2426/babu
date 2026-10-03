import { Movie, Offer, Booking, TicketPriceConfig, User, Showtime } from '../types';

const API_BASE = '/api';

export interface RazorpayOrderData {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  mock: boolean;
  upiIntentUrl: string;
  upiQrDataUrl: string;
  keyId: string;
}

export interface PaymentGatewayConfig {
  isConfigured: boolean;
  keyId: string;
  mode: 'live_or_test_key' | 'sandbox_mock';
  theatreName: string;
  currency: string;
  upiVpa: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('babu_cinemas_token') || localStorage.getItem('babu_theatre_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Token management
  getToken(): string | null {
    return localStorage.getItem('babu_cinemas_token') || localStorage.getItem('babu_theatre_token');
  },
  setToken(token: string) {
    localStorage.setItem('babu_cinemas_token', token);
  },
  removeToken() {
    localStorage.removeItem('babu_cinemas_token');
    localStorage.removeItem('babu_theatre_token');
  },

  // Health & Gateway Status
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getPaymentConfig(): Promise<PaymentGatewayConfig> {
    try {
      const res = await fetch(`${API_BASE}/payments/config`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Could not fetch payment config, using fallback:', e);
    }
    return {
      isConfigured: false,
      keyId: 'rzp_test_BABUCINEMAS2026',
      mode: 'sandbox_mock',
      theatreName: 'Babu Cinemas',
      currency: 'INR',
      upiVpa: 'babucinemas@upi',
    };
  },

  // Auth Endpoints
  async register(params: { name: string; email: string; phone?: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    if (data.token) this.setToken(data.token);
    return data;
  },

  async login(params: { emailOrPhone: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (data.token) this.setToken(data.token);
    return data;
  },

  async getMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) {
        this.removeToken();
        return null;
      }
      const data = await res.json();
      return data.user || null;
    } catch (e) {
      return null;
    }
  },

  // Movies
  async getMovies(query?: { status?: string; q?: string }): Promise<Movie[]> {
    let url = `${API_BASE}/movies`;
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.q) params.append('q', query.q);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch movies');
    return data.data;
  },

  async getMovieById(id: string): Promise<Movie> {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Movie not found');
    return data.data;
  },

  async createMovie(movie: Omit<Movie, 'id'>): Promise<Movie> {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(movie),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create movie');
    return data.data;
  },

  async updateMovie(movie: Movie): Promise<Movie> {
    const res = await fetch(`${API_BASE}/movies/${movie.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(movie),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update movie');
    return data.data;
  },

  async deleteMovie(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/movies/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    return Boolean(data.success);
  },

  // Showtimes
  async getShowtimes(params?: { movieId?: string; date?: string; format?: string }): Promise<Showtime[]> {
    let url = `${API_BASE}/showtimes`;
    const searchParams = new URLSearchParams();
    if (params?.movieId) searchParams.append('movieId', params.movieId);
    if (params?.date) searchParams.append('date', params.date);
    if (params?.format) searchParams.append('format', params.format);
    if (searchParams.toString()) url += `?${searchParams.toString()}`;

    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
  },

  // Offers
  async getOffers(): Promise<Offer[]> {
    const res = await fetch(`${API_BASE}/offers`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch offers');
    return data.data;
  },

  async createOffer(offer: Partial<Offer>): Promise<Offer> {
    const res = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(offer),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create offer');
    return data.data;
  },

  async deleteOffer(idOrCode: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/offers/${idOrCode}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    return Boolean(data.success);
  },

  async validateOffer(code: string, ticketCount: number, ticketTotal: number) {
    const res = await fetch(`${API_BASE}/offers/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, ticketCount, ticketTotal }),
    });
    return res.json();
  },

  // Pricing
  async getPricing(): Promise<TicketPriceConfig> {
    const res = await fetch(`${API_BASE}/pricing`);
    const data = await res.json();
    return data.data;
  },

  async updatePricing(pricing: TicketPriceConfig): Promise<TicketPriceConfig> {
    const res = await fetch(`${API_BASE}/pricing`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(pricing),
    });
    const data = await res.json();
    return data.data;
  },

  // Bookings
  async getBookings(filter?: { email?: string; phone?: string }): Promise<Booking[]> {
    let url = `${API_BASE}/bookings`;
    const params = new URLSearchParams();
    if (filter?.email) params.append('userEmail', filter.email);
    if (filter?.phone) params.append('userPhone', filter.phone);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    return data.data || [];
  },

  async getBookingById(id: string): Promise<Booking | null> {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  },

  async createBooking(booking: Booking): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(booking),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create booking');
    return data.data;
  },

  async cancelBooking(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    return Boolean(data.success);
  },

  // Payments (Razorpay & Direct UPI)
  async createRazorpayOrder(params: {
    amount: number;
    receipt: string;
    notes?: Record<string, string>;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }): Promise<{ success: boolean; order: RazorpayOrderData }> {
    const res = await fetch(`${API_BASE}/payments/razorpay/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Payment order initialization failed');
    return data;
  },

  async verifyRazorpayPayment(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
    bookingDetails: Partial<Booking>;
    paymentMethod?: string;
  }): Promise<{ success: boolean; verified: boolean; booking: Booking; message: string }> {
    const res = await fetch(`${API_BASE}/payments/razorpay/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Payment verification failed');
    return data;
  },

  // Ticket QR & Gate Verification
  async getTicketQr(bookingId: string): Promise<string> {
    const res = await fetch(`${API_BASE}/tickets/${bookingId}/qr`);
    const data = await res.json();
    return data.qrDataUrl;
  },

  async verifyTicketGate(bookingId: string) {
    const res = await fetch(`${API_BASE}/tickets/${bookingId}/verify`);
    return res.json();
  },

  // Contact Messages
  async submitContactMessage(params: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Dashboard Stats
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE}/stats/summary`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },
};
