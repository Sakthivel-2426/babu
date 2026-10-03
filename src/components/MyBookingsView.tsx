import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { Booking } from '../types';
import { DigitalTicket } from './DigitalTicket';

export const MyBookingsView: React.FC = () => {
  const { bookings, cancelBooking, setCurrentView, setConfirmedBooking } = useCinema();
  const [selectedTicketForView, setSelectedTicketForView] = useState<Booking | null>(null);

  if (selectedTicketForView) {
    return (
      <div>
        <div className="max-w-3xl mx-auto px-4 pt-6">
          <button
            onClick={() => setSelectedTicketForView(null)}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 focus:outline-none"
          >
            ← Back to All Bookings
          </button>
        </div>
        <DigitalTicket booking={selectedTicketForView} />
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            <Ticket className="w-4 h-4" />
            <span>Ticket Vault</span>
          </div>
          <h1 className="font-cinema text-3xl sm:text-4xl font-extrabold text-white">
            My Movie Bookings
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Access your admission passes, print digital tickets, or manage reservations.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('movies')}
          className="px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-md shadow-red-950/40 flex items-center gap-2 self-start sm:self-auto focus:outline-none"
        >
          <span>BOOK NEW TICKETS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED';

            return (
              <div
                key={booking.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#10121a] border border-white/10 hover:border-white/25 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Poster + Movie Details */}
                <div className="flex items-start gap-4">
                  {booking.moviePoster && (
                    <img
                      src={booking.moviePoster}
                      alt={booking.movieTitle}
                      className="w-16 h-24 object-cover rounded-xl border border-white/10 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {booking.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isConfirmed
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                            : 'bg-red-950/80 text-red-300 border border-red-800/40'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h2 className="font-cinema text-xl font-bold text-white">
                      {booking.movieTitle}
                    </h2>

                    <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>Babu Cinemas – Uthiramerur, Kanchipuram</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {booking.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-white font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {booking.showtime}
                      </span>
                      <span>·</span>
                      <span>{booking.screenName}</span>
                    </div>

                    <div className="pt-2 text-xs">
                      <span className="text-zinc-500">Seats: </span>
                      <span className="font-mono font-bold text-amber-300">
                        {booking.seats.map((s) => s.id).join(', ')}
                      </span>
                      <span className="text-zinc-500 ml-2">({booking.seats.length} Tickets)</span>
                    </div>
                  </div>
                </div>

                {/* Right: Payment & Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                      Total Paid
                    </span>
                    <span className="font-mono text-xl font-black text-white">
                      ₹{booking.totalPaid}
                    </span>
                    <span className="text-[10px] text-zinc-400 block font-mono">
                      {booking.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTicketForView(booking)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center gap-1.5 focus:outline-none"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>VIEW TICKET</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTicketForView(booking);
                        setTimeout(() => window.print(), 300);
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-1.5 focus:outline-none"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DOWNLOAD</span>
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to cancel ticket booking ${booking.id}?`)) {
                            cancelBooking(booking.id);
                          }
                        }}
                        className="px-2.5 py-2 text-[11px] text-zinc-400 hover:text-red-400 transition-colors"
                        title="Cancel Booking"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center p-8 rounded-3xl bg-[#10121a] border border-white/10 space-y-4">
          <Ticket className="w-12 h-12 text-zinc-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">No Bookings Yet</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            You haven't reserved any movie tickets yet. Explore our current blockbusters and book your seats!
          </p>
          <button
            onClick={() => setCurrentView('movies')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors focus:outline-none"
          >
            Explore Now Showing
          </button>
        </div>
      )}
    </div>
  );
};
