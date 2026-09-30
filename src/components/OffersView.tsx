import React, { useState } from 'react';
import {
  Tag,
  Sparkles,
  GraduationCap,
  Users,
  UtensilsCrossed,
  Clock,
  Check,
  Copy,
  ChevronRight,
  Ticket,
} from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { Offer } from '../types';

export const OffersView: React.FC = () => {
  const { offers, applyCouponCode, setCurrentView } = useCinema();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Student':
        return <GraduationCap className="w-5 h-5 text-amber-400" />;
      case 'Weekend':
        return <Sparkles className="w-5 h-5 text-red-400" />;
      case 'Food':
        return <UtensilsCrossed className="w-5 h-5 text-amber-300" />;
      case 'Family':
        return <Users className="w-5 h-5 text-emerald-400" />;
      default:
        return <Tag className="w-5 h-5 text-red-500" />;
    }
  };

  const handleClaim = (offer: Offer) => {
    applyCouponCode(offer.code);
    navigator.clipboard.writeText(offer.code);
    setCopiedCode(offer.code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleClaimAndBook = (offer: Offer) => {
    applyCouponCode(offer.code);
    setCurrentView('movies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
          <Tag className="w-4 h-4" />
          <span>Exclusive Cinema Privileges</span>
        </div>
        <h1 className="font-cinema text-3xl sm:text-4xl font-extrabold text-white">
          Offers & Deals at Babu Theatre
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Enjoy special discounts on ticket reservations, gourmet food combos, and family packages.
        </p>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => {
          const isCopied = copiedCode === offer.code;

          return (
            <div
              key={offer.id}
              className="relative p-6 sm:p-7 rounded-3xl bg-[#10121a] border border-white/10 hover:border-amber-500/40 shadow-xl transition-all flex flex-col justify-between space-y-6"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 shadow-inner">
                      {getCategoryIcon(offer.category)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold block">
                        {offer.category} Offer
                      </span>
                      <h2 className="font-cinema text-xl font-bold text-white">
                        {offer.title}
                      </h2>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {offer.discountType === 'percentage'
                      ? `${offer.discountValue}% OFF`
                      : `₹${offer.discountValue} OFF`}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {offer.description}
                </p>

                {/* Terms bullets */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                  {offer.terms.map((term, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Claim Row */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Valid until {offer.validUntil}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleClaim(offer)}
                    className="px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-200 flex items-center gap-1.5 transition-colors focus:outline-none"
                    title="Copy Promo Code"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>{offer.code}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleClaimAndBook(offer)}
                    className="px-4 py-2 rounded-xl text-xs font-bold tracking-wide text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-md shadow-red-950/50 flex items-center gap-1.5 transition-all focus:outline-none"
                  >
                    <span>CLAIM & BOOK</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Canteen Combos Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-red-950/60 via-zinc-900 to-amber-950/40 border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Gourmet CineBites
          </div>
          <h3 className="font-cinema text-2xl font-bold text-white">
            Pre-book Popcorn & Drinks Online
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300">
            Skip the concession counter queue during intermission! Pre-ordered food items are served piping hot directly to your seat or ready at the fast-track express pick-up aisle.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('showtimes')}
          className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider text-white bg-amber-500 hover:bg-amber-400 text-zinc-950 font-sans shadow-lg shadow-amber-950/60 transition-all focus:outline-none whitespace-nowrap"
        >
          EXPLORE COMBOS WITH TICKETS
        </button>
      </div>
    </div>
  );
};
