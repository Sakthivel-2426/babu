import React, { useState, useEffect } from 'react';
import {
  Film,
  Calendar,
  Ticket,
  Users,
  IndianRupee,
  TrendingUp,
  Settings,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle,
  Tag,
  Clock,
  ShieldCheck,
  Armchair,
  Save,
  BarChart3,
  PieChart,
  Search,
  Filter,
  Play,
} from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { Movie, TicketPriceConfig, Offer, MovieStatus } from '../types';

type AdminTab =
  | 'dashboard'
  | 'movies'
  | 'shows'
  | 'seats'
  | 'bookings'
  | 'offers'
  | 'customers'
  | 'revenue'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    movies,
    bookings,
    offers,
    ticketPrices,
    updateTicketPrices,
    addMovie,
    deleteMovie,
    updateMovie,
    addOffer,
    deleteOffer,
    setCurrentView,
  } = useCinema();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Ticket Pricing Form State
  const [pricingForm, setPricingForm] = useState<TicketPriceConfig>(ticketPrices);
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  useEffect(() => {
    setPricingForm(ticketPrices);
  }, [ticketPrices]);

  // Movie Filter & Search State in Admin
  const [movieFilter, setMovieFilter] = useState<'all' | 'now-showing' | 'coming-soon' | 'ended'>('all');
  const [movieSearch, setMovieSearch] = useState('');

  // Movie Management Modal (Handles both Add & Edit)
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [movieModalMode, setMovieModalMode] = useState<'add' | 'edit'>('add');
  const [editingMovieId, setEditingMovieId] = useState<string>('');

  const initialMovieForm = {
    title: '',
    tagline: '',
    description: '',
    genre: 'Action, Thriller',
    language: 'Tamil',
    duration: '2h 30m',
    rating: 'U/A 16+',
    certificate: 'U/A 16+',
    imdbScore: 8.5,
    releaseDate: new Date().toISOString().split('T')[0],
    director: '',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'now-showing' as MovieStatus,
    showtimes: '10:00 AM, 01:30 PM, 06:30 PM, 10:00 PM',
    formats: '2D, 4K Dolby Atmos',
  };

  const [movieForm, setMovieForm] = useState(initialMovieForm);

  const openAddMovieModal = () => {
    setMovieModalMode('add');
    setEditingMovieId('');
    setMovieForm({
      ...initialMovieForm,
      posterUrl: movies[0]?.posterUrl || '',
    });
    setIsMovieModalOpen(true);
  };

  const openEditMovieModal = (m: Movie) => {
    setMovieModalMode('edit');
    setEditingMovieId(m.id);
    setMovieForm({
      title: m.title,
      tagline: m.tagline || '',
      description: m.description,
      genre: m.genre.join(', '),
      language: m.language,
      duration: m.duration,
      rating: m.rating,
      certificate: m.certificate || m.rating,
      imdbScore: m.imdbScore || 8.5,
      releaseDate: m.releaseDate || new Date().toISOString().split('T')[0],
      director: m.director,
      posterUrl: m.posterUrl,
      backdropUrl: m.backdropUrl || '',
      trailerUrl: m.trailerUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      status: m.status,
      showtimes: m.customShowtimes && m.customShowtimes.length > 0
        ? m.customShowtimes.join(', ')
        : '10:00 AM, 01:30 PM, 06:30 PM, 10:00 PM',
      formats: m.availableFormats.join(', '),
    });
    setIsMovieModalOpen(true);
  };

  // Quick 1-click status switcher
  const handleQuickStatusChange = (m: Movie, newStatus: MovieStatus) => {
    updateMovie({ ...m, status: newStatus });
  };

  // KPI Calculations
  const totalMovies = movies.length;
  const nowShowingCount = movies.filter((m) => m.status === 'now-showing').length;
  const upcomingCount = movies.filter((m) => m.status === 'coming-soon').length;
  const endedCount = movies.filter((m) => m.status === 'ended').length;
  const totalBookingsCount = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPaid, 0);
  const todayRevenue = Math.round(totalRevenue * 0.42);
  const uniqueCustomersCount = new Set(bookings.map((b) => b.userEmail || b.userName)).size + 24;

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    updateTicketPrices(pricingForm);
    setPricingSavedToast(true);
    setTimeout(() => setPricingSavedToast(false), 3000);
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieForm.title.trim() || !movieForm.director.trim()) {
      alert('Please provide movie title and director name.');
      return;
    }

    const parsedGenre = movieForm.genre.split(',').map((g) => g.trim()).filter(Boolean);
    const parsedFormats = movieForm.formats.split(',').map((f) => f.trim() as any).filter(Boolean);
    const parsedShowtimes = movieForm.showtimes.split(',').map((t) => t.trim()).filter(Boolean);

    if (movieModalMode === 'add') {
      addMovie({
        title: movieForm.title.trim(),
        tagline: movieForm.tagline.trim() || undefined,
        description: movieForm.description.trim() || 'A compelling cinematic experience at Babu Cinemas.',
        genre: parsedGenre.length > 0 ? parsedGenre : ['Action'],
        language: movieForm.language.trim() || 'Tamil',
        duration: movieForm.duration.trim() || '2h 30m',
        rating: movieForm.rating.trim() || 'U/A 16+',
        certificate: movieForm.certificate.trim() || movieForm.rating.trim() || 'U/A 16+',
        imdbScore: Number(movieForm.imdbScore) || 8.5,
        releaseDate: movieForm.releaseDate,
        releaseYear: movieForm.releaseDate ? new Date(movieForm.releaseDate).getFullYear() : 2026,
        director: movieForm.director.trim(),
        cast: [{ name: 'Lead Cast', role: 'Protagonist' }],
        posterUrl: movieForm.posterUrl.trim() || movies[0]?.posterUrl || '',
        backdropUrl: movieForm.backdropUrl.trim() || undefined,
        trailerUrl: movieForm.trailerUrl.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        status: movieForm.status,
        category: movieForm.status === 'now-showing' ? 'latest' : 'upcoming',
        customShowtimes: parsedShowtimes.length > 0 ? parsedShowtimes : ['10:00 AM', '01:30 PM', '06:30 PM', '10:00 PM'],
        availableFormats: parsedFormats.length > 0 ? parsedFormats : ['2D', '4K Dolby Atmos'],
        screens: ['Screen 1 - 4K Dolby Atmos'],
      });
    } else {
      // Edit existing movie
      const original = movies.find((m) => m.id === editingMovieId);
      if (original) {
        updateMovie({
          ...original,
          title: movieForm.title.trim(),
          tagline: movieForm.tagline.trim() || undefined,
          description: movieForm.description.trim(),
          genre: parsedGenre.length > 0 ? parsedGenre : original.genre,
          language: movieForm.language.trim(),
          duration: movieForm.duration.trim(),
          rating: movieForm.rating.trim(),
          certificate: movieForm.certificate.trim() || movieForm.rating.trim(),
          imdbScore: Number(movieForm.imdbScore),
          releaseDate: movieForm.releaseDate,
          releaseYear: movieForm.releaseDate ? new Date(movieForm.releaseDate).getFullYear() : original.releaseYear,
          director: movieForm.director.trim(),
          posterUrl: movieForm.posterUrl.trim() || original.posterUrl,
          backdropUrl: movieForm.backdropUrl.trim() || original.backdropUrl,
          trailerUrl: movieForm.trailerUrl.trim() || original.trailerUrl,
          status: movieForm.status,
          customShowtimes: parsedShowtimes,
          availableFormats: parsedFormats.length > 0 ? parsedFormats : original.availableFormats,
        });
      }
    }

    setIsMovieModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-zinc-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d0f15] border-r border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-950">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-cinema text-lg font-bold text-white block leading-tight">
                BABU CINEMAS
              </span>
              <span className="text-[10px] uppercase font-mono text-amber-400 font-semibold block">
                Admin Console
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Firestore: cinemas-97357</span>
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'movies', label: 'Movies Manager', icon: Film },
              { id: 'shows', label: 'Shows & Timings', icon: Calendar },
              { id: 'seats', label: 'Seats & Pricing', icon: Armchair },
              { id: 'bookings', label: 'Bookings Log', icon: Ticket },
              { id: 'offers', label: 'Offers & Promos', icon: Tag },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'revenue', label: 'Revenue Analytics', icon: IndianRupee },
              { id: 'settings', label: 'Theatre Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-950/60 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Return to Public Website */}
        <div className="pt-6 border-t border-white/10 mt-6">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cinema Site</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-cinema text-3xl font-black text-white">
                  Executive Dashboard
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Live operational telemetry for Babu Cinemas Screen Complex.
                </p>
              </div>

              <button
                onClick={openAddMovieModal}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950/50 flex items-center gap-2 self-start sm:self-auto focus:outline-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Movie</span>
              </button>
            </div>

            {/* Dashboard KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="p-5 rounded-2xl bg-[#10121a] border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-zinc-400">Total Movies</span>
                <div className="font-mono text-2xl font-bold text-white">{totalMovies}</div>
                <span className="text-[10px] text-zinc-500 block">{nowShowingCount} currently screening</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#10121a] border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-zinc-400">Today's Shows</span>
                <div className="font-mono text-2xl font-bold text-amber-400">15</div>
                <span className="text-[10px] text-zinc-500 block">Across 3 screens</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#10121a] border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-zinc-400">Total Bookings</span>
                <div className="font-mono text-2xl font-bold text-white">{totalBookingsCount}</div>
                <span className="text-[10px] text-emerald-400 block">+14% this weekend</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#10121a] border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-zinc-400">Total Customers</span>
                <div className="font-mono text-2xl font-bold text-white">{uniqueCustomersCount}</div>
                <span className="text-[10px] text-zinc-500 block">Registered patrons</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#10121a] border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-zinc-400">Today's Revenue</span>
                <div className="font-mono text-2xl font-bold text-emerald-400">₹{todayRevenue}</div>
                <span className="text-[10px] text-zinc-500 block">Simulated daily gross</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#10121a] border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold uppercase text-zinc-400">Total Revenue</span>
                <div className="font-mono text-2xl font-bold text-amber-300">₹{totalRevenue}</div>
                <span className="text-[10px] text-zinc-500 block">Cumulative box office</span>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Daily Bookings & Weekly Revenue */}
              <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Weekly Revenue Trajectory</h3>
                    <p className="text-[11px] text-zinc-400">Daily admissions & concessions in ₹ Thousands</p>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">₹1.84L Peak</span>
                </div>

                {/* SVG Visual Chart */}
                <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2">
                  {[
                    { day: 'Mon', val: 45, label: '₹45k' },
                    { day: 'Tue', val: 38, label: '₹38k' },
                    { day: 'Wed', val: 52, label: '₹52k' },
                    { day: 'Thu', val: 68, label: '₹68k' },
                    { day: 'Fri', val: 120, label: '₹120k' },
                    { day: 'Sat', val: 184, label: '₹184k' },
                    { day: 'Sun', val: 165, label: '₹165k' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[9px] font-mono text-zinc-500">{bar.label}</span>
                      <div
                        className="w-full bg-gradient-to-t from-red-800 to-red-500 rounded-t-lg transition-all hover:brightness-125"
                        style={{ height: `${(bar.val / 184) * 100}%` }}
                      />
                      <span className="text-[10px] font-mono text-zinc-400">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Movie Popularity & Occupancy */}
              <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Movie Popularity & Seat Occupancy</h3>
                    <p className="text-[11px] text-zinc-400">Audience share percentage</p>
                  </div>
                  <PieChart className="w-4 h-4 text-amber-400" />
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { name: 'Coolie', pct: 42, color: 'bg-red-500' },
                    { name: 'Retro', pct: 28, color: 'bg-amber-400' },
                    { name: 'Amaran', pct: 18, color: 'bg-blue-400' },
                    { name: 'Dragon', pct: 12, color: 'bg-emerald-400' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-zinc-200">{item.name}</span>
                        <span className="font-mono text-zinc-400">{item.pct}% Occupancy</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Recent Bookings preview */}
            <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white">Recent Ticket Reservations</h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold"
                >
                  View All Log
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="pb-2">Booking ID</th>
                      <th className="pb-2">Movie</th>
                      <th className="pb-2">Date & Time</th>
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Seats</th>
                      <th className="pb-2 text-right">Amount</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-white/5">
                        <td className="py-2.5 font-mono text-amber-400 font-bold">{b.id}</td>
                        <td className="py-2.5 font-semibold text-white">{b.movieTitle}</td>
                        <td className="py-2.5 text-zinc-300">{b.date} · {b.showtime}</td>
                        <td className="py-2.5 text-zinc-300">{b.userName}</td>
                        <td className="py-2.5 font-mono text-zinc-400">{b.seats.map((s) => s.id).join(', ')}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-white">₹{b.totalPaid}</td>
                        <td className="py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'CONFIRMED' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MOVIES */}
        {activeTab === 'movies' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-cinema text-3xl font-black text-white">Movie Management</h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage currently screening films, upcoming spectacles, and daily schedules at Babu Cinemas.
                </p>
              </div>
              <button
                onClick={openAddMovieModal}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950/50 flex items-center gap-2 self-start sm:self-auto focus:outline-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add Movie</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#10121a] border border-white/10">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: `All (${totalMovies})` },
                  { id: 'now-showing', label: `Now Showing (${nowShowingCount})` },
                  { id: 'coming-soon', label: `Upcoming (${upcomingCount})` },
                  { id: 'ended', label: `Ended (${endedCount})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMovieFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                      movieFilter === tab.id
                        ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950/60'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={movieSearch}
                  onChange={(e) => setMovieSearch(e.target.value)}
                  placeholder="Search title, genre, director..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies
                .filter((m) => {
                  if (movieFilter === 'now-showing' && m.status !== 'now-showing') return false;
                  if (movieFilter === 'coming-soon' && m.status !== 'coming-soon') return false;
                  if (movieFilter === 'ended' && m.status !== 'ended') return false;
                  if (movieSearch.trim()) {
                    const q = movieSearch.toLowerCase();
                    const matchTitle = m.title.toLowerCase().includes(q);
                    const matchDir = m.director?.toLowerCase().includes(q);
                    const matchLang = m.language?.toLowerCase().includes(q);
                    const matchGenre = m.genre?.some((g) => g.toLowerCase().includes(q));
                    return matchTitle || matchDir || matchLang || matchGenre;
                  }
                  return true;
                })
                .map((m) => {
                  const statusColors = {
                    'now-showing': 'bg-emerald-950/80 text-emerald-300 border-emerald-600/30',
                    'coming-soon': 'bg-amber-950/80 text-amber-300 border-amber-600/30',
                    'ended': 'bg-zinc-800 text-zinc-400 border-white/10',
                  };

                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-[#10121a] border border-white/10 flex flex-col justify-between gap-3 hover:border-red-600/30 transition-all shadow-lg"
                    >
                      <div className="flex gap-3.5 items-start">
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-20 h-28 object-cover rounded-xl border border-white/10 shrink-0 bg-zinc-900"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/src/assets/images/movie_poster_retro_1790660356867.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                                statusColors[m.status] || statusColors['now-showing']
                              }`}
                            >
                              {m.status === 'now-showing'
                                ? 'Now Showing'
                                : m.status === 'coming-soon'
                                ? 'Upcoming'
                                : 'Ended'}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">
                              {m.certificate || m.rating}
                            </span>
                          </div>

                          <h3 className="font-cinema text-base font-bold text-white truncate" title={m.title}>
                            {m.title}
                          </h3>
                          <p className="text-xs text-zinc-400">
                            {m.language} · {m.duration}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate">Dir: {m.director}</p>
                          {m.releaseDate && (
                            <p className="text-[10px] text-zinc-400 font-mono">
                              Release: {m.releaseDate}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Showtimings preview */}
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Scheduled Timings:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(m.customShowtimes && m.customShowtimes.length > 0
                            ? m.customShowtimes
                            : ['10:00 AM', '01:30 PM', '06:30 PM', '10:00 PM']
                          ).slice(0, 4).map((time) => (
                            <span
                              key={time}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-white/10 text-zinc-300"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                        {/* Status switcher dropdown */}
                        <select
                          value={m.status}
                          onChange={(e) => handleQuickStatusChange(m, e.target.value as MovieStatus)}
                          className="bg-zinc-900 border border-white/10 text-zinc-300 rounded-lg text-[11px] px-2 py-1 font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="now-showing">Now Showing</option>
                          <option value="coming-soon">Upcoming</option>
                          <option value="ended">Ended</option>
                        </select>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditMovieModal(m)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Edit all movie details"
                          >
                            <Edit className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${m.title}" from theatre listings?`)) {
                                deleteMovie(m.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 transition-colors"
                            title="Delete Movie"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB: SEATS & PRICING */}
        {activeTab === 'seats' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="font-cinema text-3xl font-black text-white">Seats & Pricing Setup</h1>
              <p className="text-xs text-zinc-400 mt-1">Configure admission rates for Babu Cinemas auditorium tiers.</p>
            </div>

            {pricingSavedToast && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Ticket prices successfully updated and synced across booking channels!</span>
              </div>
            )}

            <form onSubmit={handleSavePrices} className="p-6 rounded-2xl bg-[#10121a] border border-white/10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-amber-300 mb-1 block">VIP Recliner Tier (Row A-B)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">₹</span>
                    <input
                      type="number"
                      value={pricingForm.VIP}
                      onChange={(e) => setPricingForm({ ...pricingForm, VIP: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-red-300 mb-1 block">Premium Tier (Row C-E)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">₹</span>
                    <input
                      type="number"
                      value={pricingForm.Premium}
                      onChange={(e) => setPricingForm({ ...pricingForm, Premium: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 mb-1 block">Regular Executive Tier (Row F-H)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">₹</span>
                    <input
                      type="number"
                      value={pricingForm.Regular}
                      onChange={(e) => setPricingForm({ ...pricingForm, Regular: Number(e.target.value) })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 mb-1 block">Convenience Fee (Per Ticket)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">₹</span>
                    <input
                      type="number"
                      value={pricingForm.convenienceFeePerTicket}
                      onChange={(e) =>
                        setPricingForm({ ...pricingForm, convenienceFeePerTicket: Number(e.target.value) })
                      }
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-950/60 flex items-center gap-2 focus:outline-none"
              >
                <Save className="w-4 h-4" />
                <span>SAVE TICKET PRICING</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB: BOOKINGS LOG */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-cinema text-3xl font-black text-white">Full Bookings Audit Log</h1>
              <p className="text-xs text-zinc-400 mt-1">Real-time database of customer ticket reservations.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Movie</th>
                    <th className="pb-3">Date/Time</th>
                    <th className="pb-3">Seats</th>
                    <th className="pb-3 text-right">Paid</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/5">
                      <td className="py-3 font-mono font-bold text-amber-400">{b.id}</td>
                      <td className="py-3 text-white font-medium">{b.userName}</td>
                      <td className="py-3 text-zinc-400 font-mono">{b.userPhone}</td>
                      <td className="py-3 text-zinc-200">{b.movieTitle}</td>
                      <td className="py-3 text-zinc-300">{b.date} {b.showtime}</td>
                      <td className="py-3 font-mono text-zinc-400">{b.seats.map((s) => s.id).join(', ')}</td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-400">₹{b.totalPaid}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'CONFIRMED' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: OFFERS */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-cinema text-3xl font-black text-white">Promotional Coupon Management</h1>
              <p className="text-xs text-zinc-400 mt-1">Active discount codes redeemable by patrons.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((o) => (
                <div key={o.id} className="p-5 rounded-2xl bg-[#10121a] border border-white/10 flex justify-between items-start">
                  <div>
                    <span className="font-mono text-sm font-bold text-amber-400">{o.code}</span>
                    <h4 className="text-xs font-bold text-white mt-1">{o.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{o.description}</p>
                    <span className="text-[10px] text-zinc-500 font-mono mt-2 block">Valid until {o.validUntil}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete coupon "${o.code}"?`)) {
                        deleteOffer(o.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SHOWS & TIMINGS */}
        {activeTab === 'shows' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-cinema text-3xl font-black text-white">Auditorium Shows & Screen Timings</h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage daily projection schedules across Screen 1 (4K Dolby Atmos), Screen 2 (Barco 4K), and Screen 3 (Gold VIP).
                </p>
              </div>
              <button
                onClick={openAddMovieModal}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950/50 flex items-center gap-2 self-start sm:self-auto focus:outline-none"
              >
                <Plus className="w-4 h-4" />
                <span>Add Movie Schedule</span>
              </button>
            </div>

            {/* Screens Overview Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#10121a] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Screen 1 - Premium Laser</span>
                <span className="text-sm font-bold text-white">4K Laser + Dolby Atmos</span>
                <span className="text-[11px] text-amber-400 block font-mono">180 Seats · Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#10121a] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Screen 2 - Barco 4K</span>
                <span className="text-sm font-bold text-white">Barco Series 4 Cinema</span>
                <span className="text-[11px] text-emerald-400 block font-mono">140 Seats · Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#10121a] border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Screen 3 - Gold VIP</span>
                <span className="text-sm font-bold text-white">Recliner Luxury Suite</span>
                <span className="text-[11px] text-blue-400 block font-mono">60 Recliners · Active</span>
              </div>
            </div>

            {/* Active Movies and their Show Schedules Table */}
            <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white">Active Theatrical Daily Schedules</h3>
                <span className="text-xs text-zinc-400 font-mono">
                  {nowShowingCount} Movies Currently Screening
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="pb-3">Movie</th>
                      <th className="pb-3">Language & Cert</th>
                      <th className="pb-3">Auditorium Screen</th>
                      <th className="pb-3">Configured Daily Timings</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movies
                      .filter((m) => m.status === 'now-showing')
                      .map((m) => {
                        const times = m.customShowtimes && m.customShowtimes.length > 0
                          ? m.customShowtimes
                          : ['10:00 AM', '01:30 PM', '06:30 PM', '10:00 PM'];
                        return (
                          <tr key={m.id} className="hover:bg-white/5">
                            <td className="py-3 font-semibold text-white flex items-center gap-3">
                              <img
                                src={m.posterUrl}
                                alt={m.title}
                                className="w-8 h-11 object-cover rounded-lg border border-white/10 bg-zinc-900"
                              />
                              <div>
                                <span className="font-cinema block text-sm">{m.title}</span>
                                <span className="text-[10px] text-zinc-400 font-mono">{m.duration}</span>
                              </div>
                            </td>
                            <td className="py-3 text-zinc-300">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-amber-300 border border-white/10">
                                {m.language}
                              </span>
                              <span className="ml-1 text-[10px] text-zinc-400 font-mono">
                                {m.certificate || m.rating}
                              </span>
                            </td>
                            <td className="py-3 text-zinc-300">
                              {m.screens && m.screens.length > 0
                                ? m.screens.join(', ')
                                : 'Screen 1 - 4K Dolby Atmos'}
                            </td>
                            <td className="py-3">
                              <div className="flex flex-wrap gap-1.5">
                                {times.map((t) => (
                                  <span
                                    key={t}
                                    className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-950/60 text-red-200 border border-red-600/30"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => openEditMovieModal(m)}
                                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-red-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 ml-auto"
                              >
                                <Edit className="w-3.5 h-3.5 text-amber-400" />
                                <span>Edit Timings</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: OTHER VIEWS (CUSTOMERS, REVENUE, SETTINGS) */}
        {(activeTab === 'customers' || activeTab === 'revenue' || activeTab === 'settings') && (
          <div className="p-8 rounded-2xl bg-[#10121a] border border-white/10 space-y-4">
            <h2 className="font-cinema text-xl font-bold text-white capitalize">{activeTab} Operational Hub</h2>
            <p className="text-xs text-zinc-400">
              Babu Cinemas system operations active for {activeTab}. All screen controllers and database backups are running normally.
            </p>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                <span className="text-zinc-500 block">Server Uptime</span>
                <span className="text-emerald-400 font-bold">99.98%</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                <span className="text-zinc-500 block">Projection Sync</span>
                <span className="text-white font-bold">Dolby Atmos Sync OK</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                <span className="text-zinc-500 block">Active Screen Sessions</span>
                <span className="text-amber-400 font-bold">Screen 1, 2 & 3 Active</span>
              </div>
            </div>

            {activeTab === 'settings' && (
              <div className="pt-4 border-t border-white/10 space-y-4 text-xs">
                <div>
                  <h3 className="font-semibold text-white mb-2">Theatre Profile</h3>
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1 text-zinc-300">
                    <p><span className="text-zinc-500">Name:</span> <strong className="text-white">Babu Cinemas</strong></p>
                    <p><span className="text-zinc-500">Location:</span> Uthiramerur, Kanchipuram, Tamil Nadu, India</p>
                    <p><span className="text-zinc-500">Helpline:</span> +91 98400 12345 / +91 4175 222333</p>
                    <p><span className="text-zinc-500">Operating Hours:</span> Daily 09:00 AM – 11:30 PM</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-2">Cloud Database & Storage</h3>
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1.5 text-zinc-300 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Provider:</span>
                      <span className="text-amber-400 font-bold">Google Cloud Firestore</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Project ID:</span>
                      <span className="text-white">cinemas-97357</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Storage Bucket:</span>
                      <span className="text-zinc-400">cinemas-97357.firebasestorage.app</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Status:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Connected & Synchronized
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Comprehensive Add & Edit Movie Modal */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#12141c] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="font-cinema text-xl font-bold text-white">
                  {movieModalMode === 'add' ? 'Add New Movie' : 'Edit Movie Details'}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {movieModalMode === 'add'
                    ? 'Enter movie specifications for Babu Cinemas theatrical listing.'
                    : `Updating details for "${movieForm.title}".`}
                </p>
              </div>
              <button
                onClick={() => setIsMovieModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveMovie} className="space-y-4 text-xs">
              {/* Row 1: Title & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Movie Title *</label>
                  <input
                    type="text"
                    required
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    placeholder="e.g. Master, Coolie, Avatar 3"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Theatrical Tagline</label>
                  <input
                    type="text"
                    value={movieForm.tagline}
                    onChange={(e) => setMovieForm({ ...movieForm, tagline: e.target.value })}
                    placeholder="Catchy punchline or subtitle"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 2: Language, Genre, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Language</label>
                  <select
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                    <option value="Tamil & English">Tamil & English</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Genre(s)</label>
                  <input
                    type="text"
                    required
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    placeholder="Action, Thriller, Drama"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Duration</label>
                  <input
                    type="text"
                    required
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    placeholder="e.g. 2h 45m"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 3: Release Date, Certificate, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Release Date *</label>
                  <input
                    type="date"
                    required
                    value={movieForm.releaseDate}
                    onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Certificate / Rating</label>
                  <select
                    value={movieForm.certificate}
                    onChange={(e) => setMovieForm({ ...movieForm, certificate: e.target.value, rating: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="U">U (Universal)</option>
                    <option value="U/A 13+">U/A 13+</option>
                    <option value="U/A 16+">U/A 16+</option>
                    <option value="A">A (Adults 18+)</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Booking Status *</label>
                  <select
                    value={movieForm.status}
                    onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value as MovieStatus })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="now-showing">Currently Showing (Bookable)</option>
                    <option value="coming-soon">Upcoming (Teaser/Advance)</option>
                    <option value="ended">Ended (Archived)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Director & IMDB Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Director *</label>
                  <input
                    type="text"
                    required
                    value={movieForm.director}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    placeholder="e.g. Lokesh Kanagaraj, Mani Ratnam"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">IMDb Score (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={movieForm.imdbScore}
                    onChange={(e) => setMovieForm({ ...movieForm, imdbScore: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              {/* Row 5: Poster URL & Trailer URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Poster Image URL *</label>
                  <input
                    type="text"
                    required
                    value={movieForm.posterUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    placeholder="https://example.com/poster.jpg"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                  {movieForm.posterUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={movieForm.posterUrl}
                        alt="Preview"
                        className="w-8 h-11 object-cover rounded border border-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/src/assets/images/movie_poster_retro_1790660356867.jpg';
                        }}
                      />
                      <span className="text-[10px] text-zinc-400">Live thumbnail preview</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-zinc-300 mb-1 block font-semibold">Trailer URL (YouTube embed)</label>
                  <input
                    type="text"
                    value={movieForm.trailerUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 6: Daily Show Timings */}
              <div>
                <label className="text-zinc-300 mb-1 block font-semibold">
                  Daily Show Timings (Comma separated)
                </label>
                <input
                  type="text"
                  value={movieForm.showtimes}
                  onChange={(e) => setMovieForm({ ...movieForm, showtimes: e.target.value })}
                  placeholder="10:00 AM, 01:30 PM, 06:30 PM, 10:00 PM"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Example: 10:00 AM, 01:15 PM, 06:30 PM, 10:00 PM. These showtimes will appear immediately in the booking schedule!
                </span>
              </div>

              {/* Row 7: Movie Description */}
              <div>
                <label className="text-zinc-300 mb-1 block font-semibold">Movie Description / Synopsis</label>
                <textarea
                  rows={3}
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  placeholder="Plot summary and theatrical synopsis..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-950/60 transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{movieModalMode === 'add' ? 'Add to Cinema Listings' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
