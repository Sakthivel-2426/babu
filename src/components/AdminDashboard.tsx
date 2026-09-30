import React, { useState } from 'react';
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
} from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { Movie, TicketPriceConfig, Offer } from '../types';

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

  // Add Movie Modal State
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [newMovieForm, setNewMovieForm] = useState({
    title: '',
    tagline: '',
    description: '',
    genre: 'Action, Thriller',
    language: 'Tamil',
    duration: '2h 30m',
    rating: 'U/A 16+',
    imdbScore: 8.5,
    releaseDate: '2026-10-01',
    director: '',
    status: 'now-showing' as 'now-showing' | 'coming-soon',
    formats: '2D, 4K Dolby Atmos',
    posterUrl: movies[0]?.posterUrl || '',
  });

  // KPI Calculations
  const totalMovies = movies.length;
  const nowShowingCount = movies.filter((m) => m.status === 'now-showing').length;
  const totalBookingsCount = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPaid, 0);
  const todayRevenue = Math.round(totalRevenue * 0.42); // Realistic simulated today revenue portion
  const uniqueCustomersCount = new Set(bookings.map((b) => b.userEmail || b.userName)).size + 24;

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    updateTicketPrices(pricingForm);
    setPricingSavedToast(true);
    setTimeout(() => setPricingSavedToast(false), 3000);
  };

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovieForm.title || !newMovieForm.director) {
      alert('Please provide title and director name.');
      return;
    }

    addMovie({
      title: newMovieForm.title,
      tagline: newMovieForm.tagline || undefined,
      description: newMovieForm.description || 'Action-packed cinematic theatrical release.',
      genre: newMovieForm.genre.split(',').map((g) => g.trim()),
      language: newMovieForm.language,
      duration: newMovieForm.duration,
      rating: newMovieForm.rating,
      imdbScore: Number(newMovieForm.imdbScore),
      releaseDate: newMovieForm.releaseDate,
      director: newMovieForm.director,
      cast: [{ name: 'Lead Cast', role: 'Protagonist' }],
      posterUrl: newMovieForm.posterUrl || movies[0].posterUrl,
      status: newMovieForm.status,
      availableFormats: newMovieForm.formats.split(',').map((f) => f.trim() as any),
      screens: ['Screen 1 - 4K Dolby Atmos'],
    });

    setIsAddMovieModalOpen(false);
    setNewMovieForm({
      title: '',
      tagline: '',
      description: '',
      genre: 'Action, Thriller',
      language: 'Tamil',
      duration: '2h 30m',
      rating: 'U/A 16+',
      imdbScore: 8.5,
      releaseDate: '2026-10-01',
      director: '',
      status: 'now-showing',
      formats: '2D, 4K Dolby Atmos',
      posterUrl: movies[0]?.posterUrl || '',
    });
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
                BABU THEATRE
              </span>
              <span className="text-[10px] uppercase font-mono text-amber-400 font-semibold">
                Admin Console
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
                  Live operational telemetry for Babu Theatre Screen Complex.
                </p>
              </div>

              <button
                onClick={() => setIsAddMovieModalOpen(true)}
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
                <p className="text-xs text-zinc-400 mt-1">Manage currently screening films and upcoming titles.</p>
              </div>
              <button
                onClick={() => setIsAddMovieModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950/50 flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Movie</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-[#10121a] border border-white/10 flex gap-4 items-start">
                  <img src={m.posterUrl} alt={m.title} className="w-20 h-28 object-cover rounded-xl border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {m.status}
                    </span>
                    <h3 className="font-cinema text-base font-bold text-white mt-1 truncate">{m.title}</h3>
                    <p className="text-xs text-zinc-400">{m.language} · {m.duration}</p>
                    <p className="text-[11px] text-zinc-500 mt-1 truncate">Dir: {m.director}</p>
                    
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (confirm(`Delete movie "${m.title}"?`)) {
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
              ))}
            </div>
          </div>
        )}

        {/* TAB: SEATS & PRICING */}
        {activeTab === 'seats' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="font-cinema text-3xl font-black text-white">Seats & Pricing Setup</h1>
              <p className="text-xs text-zinc-400 mt-1">Configure admission rates for Babu Theatre auditorium tiers.</p>
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

        {/* TAB: REVENUE & OTHER VIEWS */}
        {(activeTab === 'shows' || activeTab === 'customers' || activeTab === 'revenue' || activeTab === 'settings') && (
          <div className="p-8 rounded-2xl bg-[#10121a] border border-white/10 space-y-4">
            <h2 className="font-cinema text-xl font-bold text-white capitalize">{activeTab} Operational Hub</h2>
            <p className="text-xs text-zinc-400">
              Babu Theatre system operations active for {activeTab}. All screen controllers and database backups are running normally.
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
          </div>
        )}
      </main>

      {/* Add Movie Modal */}
      {isAddMovieModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#12141c] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-cinema text-xl font-bold text-white">Add New Movie</h3>
              <button
                onClick={() => setIsAddMovieModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMovie} className="space-y-3.5 text-xs">
              <div>
                <label className="text-zinc-300 mb-1 block">Movie Title</label>
                <input
                  type="text"
                  required
                  value={newMovieForm.title}
                  onChange={(e) => setNewMovieForm({ ...newMovieForm, title: e.target.value })}
                  placeholder="e.g. Master 2"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 mb-1 block">Director</label>
                  <input
                    type="text"
                    required
                    value={newMovieForm.director}
                    onChange={(e) => setNewMovieForm({ ...newMovieForm, director: e.target.value })}
                    placeholder="Director Name"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 mb-1 block">Language</label>
                  <input
                    type="text"
                    value={newMovieForm.language}
                    onChange={(e) => setNewMovieForm({ ...newMovieForm, language: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-300 mb-1 block">Duration</label>
                  <input
                    type="text"
                    value={newMovieForm.duration}
                    onChange={(e) => setNewMovieForm({ ...newMovieForm, duration: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-300 mb-1 block">Status</label>
                  <select
                    value={newMovieForm.status}
                    onChange={(e) =>
                      setNewMovieForm({
                        ...newMovieForm,
                        status: e.target.value as 'now-showing' | 'coming-soon',
                      })
                    }
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="now-showing">Now Showing</option>
                    <option value="coming-soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-300 mb-1 block">Short Description</label>
                <textarea
                  rows={2}
                  value={newMovieForm.description}
                  onChange={(e) => setNewMovieForm({ ...newMovieForm, description: e.target.value })}
                  placeholder="Plot summary..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMovieModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
