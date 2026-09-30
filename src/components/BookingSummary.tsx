import React, { useState } from 'react';
import {
  ArrowLeft,
  Ticket,
  Film,
  Calendar,
  Clock,
  Sparkles,
  Tag,
  CheckCircle2,
  XCircle,
  CreditCard,
  ShieldCheck,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { useCinema } from '../context/CinemaContext';

export const BookingSummary: React.FC = () => {
  const {
    selectedMovie,
    selectedDate,
    selectedShowtime,
    selectedSeats,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    getPricingSummary,
    setCurrentView,
    currentUser,
  } = useCinema();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Customer contact state for the ticket
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Valued Guest');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'guest@babutheatre.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+91 98400 12345');

  const pricing = getPricingSummary();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCouponCode(couponInput);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Your seat selection is empty. Please select seats.');
      setCurrentView('seats');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number for the digital ticket confirmation.');
      return;
    }
    setCurrentView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('seats')}
        className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 transition-colors focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Modify Seat Selection</span>
      </button>

      <div className="mb-8">
        <h1 className="font-cinema text-3xl sm:text-4xl font-extrabold text-white">
          Booking Summary
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Review your theatre ticket details and promotional discounts before payment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Theatre & Movie Details Card */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 shadow-xl space-y-6">
            {/* Movie Header */}
            <div className="flex gap-4">
              <img
                src={selectedMovie?.posterUrl}
                alt={selectedMovie?.title}
                className="w-20 h-28 object-cover rounded-xl border border-white/10 shadow-md shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/50">
                  {selectedShowtime?.format || '4K Dolby Atmos'}
                </span>
                <h2 className="font-cinema text-2xl font-bold text-white mt-1 truncate">
                  {selectedMovie?.title || 'Retro'}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {selectedMovie?.language} · {selectedMovie?.duration} · {selectedMovie?.rating}
                </p>
                <div className="mt-2 text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>BABU THEATRE</span>
                </div>
              </div>
            </div>

            {/* Timings & Screen info */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-900/80 border border-white/5 text-xs">
              <div>
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-medium block">
                  Date
                </span>
                <span className="font-semibold text-zinc-200 mt-0.5 block">
                  {selectedDate}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-medium block">
                  Showtime
                </span>
                <span className="font-mono font-bold text-amber-400 mt-0.5 block">
                  {selectedShowtime?.time || '06:30 PM'}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-white/5">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-medium block">
                  Auditorium
                </span>
                <span className="font-medium text-zinc-300 mt-0.5 block">
                  {selectedShowtime?.screenName || 'Screen 1 - 4K Dolby Atmos'}
                </span>
              </div>
            </div>

            {/* Selected Seats detail */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                Selected Seats ({selectedSeats.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-amber-400 text-zinc-950 flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{seat.id}</span>
                    <span className="text-[10px] font-sans font-normal text-zinc-800">
                      ({seat.tier} · ₹{seat.price})
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Customer Details Form for E-Ticket */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                E-Ticket Contact Details
              </span>
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-red-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="Enter customer name"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-red-500" /> Email
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      placeholder="customer@email.com"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-red-500" /> Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      placeholder="+91 98400 12345"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing Breakdown & Promo Code */}
        <div className="md:col-span-5 space-y-6">
          {/* Promo code box */}
          <div className="p-5 rounded-2xl bg-[#10121a] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                Apply Offer Coupon
              </span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{appliedCoupon.code}</span>
                  </div>
                  <p className="text-[11px] text-emerald-400/80 mt-0.5">
                    {appliedCoupon.title}
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold underline focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. STUDENT50, WEEKEND15"
                  className="flex-grow bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono uppercase text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl transition-all focus:outline-none shadow-md shadow-amber-950/40"
                >
                  APPLY
                </button>
              </form>
            )}

            {couponFeedback.message && (
              <p
                className={`text-xs ${
                  couponFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {couponFeedback.message}
              </p>
            )}

            {/* Quick coupon suggestions */}
            {!appliedCoupon && (
              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] text-zinc-400 block mb-1">Available Promo Codes:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['STUDENT50', 'WEEKEND15', 'CINEBITES', 'FAMILYPACK'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCouponInput(c)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-white/10 text-amber-300 hover:border-amber-400"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Itemized Pricing Card */}
          <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 shadow-xl space-y-4">
            <h3 className="font-cinema text-lg font-bold text-white border-b border-white/10 pb-3">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>
                  Ticket Price ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'})
                </span>
                <span className="font-mono text-white font-semibold">
                  ₹{pricing.ticketTotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Convenience Fee</span>
                <span className="font-mono text-zinc-300">
                  ₹{pricing.convenienceFee}
                </span>
              </div>

              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">- ₹{pricing.discountAmount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-white block">Total Amount</span>
                  <span className="text-[10px] text-zinc-500">Includes all applicable entertainment taxes</span>
                </div>
                <span className="font-mono text-2xl font-black text-white">
                  ₹{pricing.grandTotal}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={handleProceedToPayment}
                className="w-full py-4 rounded-xl text-sm font-bold tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950/70 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none"
              >
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>PROCEED TO PAYMENT</span>
              </button>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Safe & Secure Demo Payment Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
