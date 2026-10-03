/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CinemaProvider, useCinema } from './context/CinemaContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NowShowing } from './components/NowShowing';
import { UpcomingMovies } from './components/UpcomingMovies';
import { MovieDetailsView } from './components/MovieDetailsView';
import { ShowtimeSelector } from './components/ShowtimeSelector';
import { SeatLayout } from './components/SeatLayout';
import { BookingSummary } from './components/BookingSummary';
import { PaymentModal } from './components/PaymentModal';
import { DigitalTicket } from './components/DigitalTicket';
import { AboutTheatre } from './components/AboutTheatre';
import { OffersView } from './components/OffersView';
import { ContactView } from './components/ContactView';
import { MyBookingsView } from './components/MyBookingsView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SearchModal } from './components/SearchModal';
import { TrailerModal } from './components/TrailerModal';
import { Sparkles, Tv, Volume2, Armchair, ChevronRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useCinema();

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#08090c] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            <Hero />
            
            {/* Theatrical Highlights Ribbon */}
            <section className="bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-amber-950/30 border-b border-white/10 py-5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-600/20 text-red-400">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Barco 4K Laser</h4>
                    <p className="text-[11px] text-zinc-400">Dual RGB High Contrast</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-400/20 text-amber-400">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dolby Atmos</h4>
                    <p className="text-[11px] text-zinc-400">128 Channels Spatial Sound</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-400/20 text-blue-400">
                    <Armchair className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gold Recliners</h4>
                    <p className="text-[11px] text-zinc-400">Motorized Pushback Comfort</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-400/20 text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gourmet Canteen</h4>
                    <p className="text-[11px] text-zinc-400">FSSAI Certified CineBites</p>
                  </div>
                </div>
              </div>
            </section>

            <NowShowing />
            <UpcomingMovies />

            {/* Theatre Story Callout on Home */}
            <section className="py-16 bg-[#0b0c12] border-t border-white/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                    The Babu Cinemas Benchmark
                  </span>
                  <h3 className="font-cinema text-3xl font-extrabold text-white">
                    “Your Movie. Your Seat. Your Experience.”
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    Located in Uthiramerur, Kanchipuram, Tamil Nadu, India, Babu Cinemas delivers crystal-clear 4K laser projection, immersive 3D surround sound, and hygienic concession dining for movie lovers across the region.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentView('theatre');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-white/15 transition-colors focus:outline-none flex items-center gap-2"
                  >
                    <span>EXPLORE AUDITORIUMS</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('showtimes');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950 transition-all focus:outline-none"
                  >
                    <span>CHECK SHOWTIMES</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'movies' && (
          <div>
            <NowShowing />
            <UpcomingMovies />
          </div>
        )}

        {currentView === 'details' && <MovieDetailsView />}
        {currentView === 'showtimes' && <ShowtimeSelector />}
        {currentView === 'seats' && <SeatLayout />}
        {currentView === 'summary' && <BookingSummary />}
        {currentView === 'payment' && <PaymentModal />}
        {currentView === 'confirmation' && <DigitalTicket />}
        {currentView === 'theatre' && <AboutTheatre />}
        {currentView === 'offers' && <OffersView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'my-bookings' && <MyBookingsView />}
      </main>

      <Footer />

      {/* Global Overlays */}
      <AuthModal />
      <SearchModal />
      <TrailerModal />
    </div>
  );
};

export default function App() {
  return (
    <CinemaProvider>
      <AppContent />
    </CinemaProvider>
  );
}
