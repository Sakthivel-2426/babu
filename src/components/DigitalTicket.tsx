import React from 'react';
import {
  CheckCircle,
  Download,
  Home,
  QrCode,
  Ticket,
  Printer,
  Sparkles,
  MapPin,
  Share2,
} from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { Booking } from '../types';

interface DigitalTicketProps {
  booking?: Booking;
}

export const DigitalTicket: React.FC<DigitalTicketProps> = ({ booking: propBooking }) => {
  const { confirmedBooking, setCurrentView } = useCinema();

  const booking = propBooking || confirmedBooking;

  if (!booking) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <p className="text-zinc-400">No confirmed booking found.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handlePrintOrDownload = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Movie Ticket - ${booking.movieTitle} at Babu Theatre`,
        text: `Booked ${booking.movieTitle} at Babu Theatre! Booking ID: ${booking.id}, Seats: ${booking.seats.map((s) => s.id).join(', ')}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Babu Theatre Ticket: ${booking.movieTitle} (${booking.showtime}) - Booking ID: ${booking.id}`);
      alert('Ticket details copied to clipboard!');
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6">
      {/* Success banner */}
      <div className="text-center mb-8 no-print">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-950/40">
          <CheckCircle className="w-9 h-9" />
        </div>
        <h1 className="font-cinema text-3xl sm:text-4xl font-black text-white">
          🎉 BOOKING CONFIRMED
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md mx-auto">
          Your reservation is confirmed at Babu Theatre. Please present this digital ticket or SMS at the entrance.
        </p>
      </div>

      {/* Realistic Cinema Ticket Card */}
      <div
        id="printable-ticket"
        className="relative bg-gradient-to-br from-[#12141c] via-[#0f1017] to-[#0c0d12] rounded-3xl border border-white/20 shadow-2xl overflow-hidden print:border-black print:text-black"
      >
        {/* Ticket Header Ribbon */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 p-4 sm:p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-amber-200" />
            <div>
              <span className="font-cinema text-xl sm:text-2xl font-black tracking-wider block leading-none">
                BABU THEATRE
              </span>
              <span className="text-[10px] tracking-widest text-amber-200/90 font-medium uppercase">
                Official Digital Admission E-Ticket
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider opacity-80 block">
              Booking Ref
            </span>
            <span className="font-mono text-sm sm:text-base font-black text-amber-300">
              {booking.id}
            </span>
          </div>
        </div>

        {/* Ticket Main Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Details (8 cols) */}
          <div className="md:col-span-8 space-y-5">
            {/* Movie Title */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/40">
                {booking.movieFormat}
              </span>
              <h2 className="font-cinema text-2xl sm:text-3xl font-extrabold text-white mt-1.5 leading-tight">
                {booking.movieTitle}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>Babu Theatre, Cinema Boulevard, Tamil Nadu</span>
              </p>
            </div>

            {/* Grid of Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                  Date
                </span>
                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">
                  {booking.date}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                  Time
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono text-amber-400 mt-0.5 block">
                  {booking.showtime}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
                  Auditorium
                </span>
                <span className="text-xs font-semibold text-zinc-300 mt-0.5 block truncate">
                  {booking.screenName}
                </span>
              </div>
            </div>

            {/* Seats Badges */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1.5">
                Reserved Seats ({booking.seats.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-amber-400 text-zinc-950 shadow-md"
                  >
                    Seat {seat.id} ({seat.tier})
                  </span>
                ))}
              </div>
            </div>

            {/* Guest & Total Paid */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs gap-3">
              <div>
                <span className="text-zinc-500 text-[10px] block">Ticket Holder</span>
                <span className="font-semibold text-zinc-200">{booking.userName}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block">Payment Method</span>
                <span className="font-mono text-zinc-300">{booking.paymentMethod}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 text-[10px] block">Total Paid</span>
                <span className="font-mono text-base font-black text-emerald-400">
                  ₹{booking.totalPaid}
                </span>
              </div>
            </div>
          </div>

          {/* Right Ticket Stub with Perforated Line & QR Code (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-zinc-950/80 rounded-2xl border border-white/10 text-center">
            {/* SVG QR Code */}
            <div className="p-3 bg-white rounded-xl shadow-lg inline-block">
              <QrCode className="w-28 h-28 text-black" />
            </div>
            <span className="font-mono text-[10px] font-bold text-zinc-400 mt-2 tracking-wider">
              {booking.id}
            </span>
            <span className="text-[9px] text-zinc-500 mt-0.5">
              Scan at Screen 1 Entrance
            </span>

            {/* Simulated Barcode */}
            <div className="w-full mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-0.5 opacity-70">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 3, 2, 4].map((w, i) => (
                <div
                  key={i}
                  className="bg-white h-7"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Perforated Stub Visual Effect */}
        <div className="relative py-2 bg-zinc-950/60 border-t border-dashed border-white/20 px-6 flex items-center justify-between text-[10px] text-zinc-500">
          <span>Non-transferable · Babu Theatre Policies Apply</span>
          <span>Security Hash: #BT{booking.id.slice(-4)}</span>
        </div>
      </div>

      {/* Action Buttons (Hidden on Print) */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 no-print">
        <button
          onClick={handlePrintOrDownload}
          className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950/60 flex items-center gap-2 transition-all hover:scale-105 focus:outline-none"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>DOWNLOAD / PRINT TICKET</span>
        </button>

        <button
          onClick={handleShare}
          className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/30 flex items-center gap-2 transition-all focus:outline-none"
        >
          <Share2 className="w-4 h-4" />
          <span>SHARE TICKET</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/30 flex items-center gap-2 transition-all focus:outline-none"
        >
          <Home className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </button>
      </div>
    </div>
  );
};
