import React from 'react';
import { Film, Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { AppView } from '../types';

export const Footer: React.FC = () => {
  const { setCurrentView } = useCinema();

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#06070a] border-t border-white/10 text-zinc-400 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-950">
                <Film className="w-5 h-5" />
              </div>
              <span className="font-cinema text-2xl font-black text-white tracking-wider">
                BABU THEATRE
              </span>
            </div>

            <p className="text-amber-400/90 font-serif italic text-sm">
              “Your Movie. Your Seat. Your Experience.”
            </p>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Tamil Nadu’s premier luxury cinematic auditorium equipped with Christie 4K RGB Dual Laser projection, 128-channel immersive Dolby Atmos acoustics, and motorized push-back seating.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-[10px] font-mono text-zinc-300">
                Dolby Atmos Certified
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-[10px] font-mono text-zinc-300">
                Barco 4K Laser
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-cinema text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('movies')}
                  className="hover:text-white transition-colors"
                >
                  Now Showing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('showtimes')}
                  className="hover:text-white transition-colors"
                >
                  Show Timings
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('theatre')}
                  className="hover:text-white transition-colors"
                >
                  About Theatre
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('offers')}
                  className="hover:text-white transition-colors"
                >
                  Discounts & Offers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Guest Services */}
          <div className="space-y-3">
            <h4 className="font-cinema text-sm font-bold text-white uppercase tracking-wider">
              Patron Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('my-bookings')}
                  className="hover:text-white transition-colors"
                >
                  My E-Tickets
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('theatre')}
                  className="hover:text-white transition-colors"
                >
                  Food & Concessions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('theatre')}
                  className="hover:text-white transition-colors"
                >
                  Auditorium Facilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Box Office Contact */}
          <div className="space-y-3">
            <h4 className="font-cinema text-sm font-bold text-white uppercase tracking-wider">
              Box Office Desk
            </h4>
            <div className="space-y-2 text-[11px] leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>Babu Theatre, Cinema Boulevard, Tamil Nadu, India — 606601</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono">+91 98400 12345 / 4175 222333</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>support@babutheatre.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Daily 09:00 AM – 11:30 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} BABU THEATRE. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Terms of Reservation</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Canteen Hygiene FSSAI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
