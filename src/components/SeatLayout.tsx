import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Tv,
  CheckCircle2,
  Circle,
  AlertCircle,
  Ticket,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { Seat, SeatTier } from '../types';

export const SeatLayout: React.FC = () => {
  const {
    selectedMovie,
    selectedDate,
    selectedShowtime,
    selectedSeats,
    toggleSeat,
    clearSeats,
    ticketPrices,
    setCurrentView,
    getPricingSummary,
  } = useCinema();

  // Define rows and their tier assignments
  // Rows A, B: VIP Recliner (₹250)
  // Rows C, D, E: Premium (₹200)
  // Rows F, G, H: Regular / Executive (₹150)
  const rowsConfig: { row: string; tier: SeatTier; price: number }[] = [
    { row: 'A', tier: 'VIP', price: ticketPrices.VIP },
    { row: 'B', tier: 'VIP', price: ticketPrices.VIP },
    { row: 'C', tier: 'Premium', price: ticketPrices.Premium },
    { row: 'D', tier: 'Premium', price: ticketPrices.Premium },
    { row: 'E', tier: 'Premium', price: ticketPrices.Premium },
    { row: 'F', tier: 'Regular', price: ticketPrices.Regular },
    { row: 'G', tier: 'Regular', price: ticketPrices.Regular },
    { row: 'H', tier: 'Regular', price: ticketPrices.Regular },
  ];

  const seatsPerRow = 10; // Seats 1 to 5, aisle, 6 to 10

  const occupiedIds = useMemo(() => {
    return new Set(selectedShowtime?.occupiedSeatIds || ['A3', 'A4', 'C6', 'C7', 'E2']);
  }, [selectedShowtime]);

  const selectedIds = useMemo(() => {
    return new Set(selectedSeats.map((s) => s.id));
  }, [selectedSeats]);

  const pricing = getPricingSummary();

  const handleSeatClick = (row: string, num: number, tier: SeatTier, price: number) => {
    const seatId = `${row}${num}`;
    if (occupiedIds.has(seatId)) return;

    const seat: Seat = {
      id: seatId,
      row,
      number: num,
      tier,
      price,
      status: selectedIds.has(seatId) ? 'selected' : 'available',
    };
    toggleSeat(seat);
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }
    setCurrentView('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <button
            onClick={() => setCurrentView('showtimes')}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-2 transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Showtimes</span>
          </button>
          <h1 className="font-cinema text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>{selectedMovie?.title || 'Retro'}</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
              {selectedShowtime?.format || '4K Dolby Atmos'}
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Babu Theatre · {selectedShowtime?.screenName || 'Screen 1'} · {selectedDate} ·{' '}
            <span className="text-amber-400 font-semibold">{selectedShowtime?.time || '06:30 PM'}</span>
          </p>
        </div>

        {/* Pricing Category Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300">
            <span className="font-bold">VIP Recliner:</span> ₹{ticketPrices.VIP}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300">
            <span className="font-bold">Premium:</span> ₹{ticketPrices.Premium}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300">
            <span className="font-bold">Regular:</span> ₹{ticketPrices.Regular}
          </div>
        </div>
      </div>

      {/* Screen Visualization */}
      <div className="mb-12 max-w-3xl mx-auto text-center">
        <div className="relative mb-3">
          {/* Curved Screen Curve */}
          <div className="w-full h-8 border-t-4 border-amber-400/80 rounded-t-[120px] shadow-[0_-12px_30px_rgba(251,191,36,0.25)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400/20 to-transparent" />
          </div>
          <div className="text-[11px] font-mono tracking-[0.3em] font-bold text-amber-300 uppercase">
            SCREEN THIS WAY
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">All eyes towards the silver projection</div>
        </div>
      </div>

      {/* Seating Grid with Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-6">
        <div className="min-w-[640px] max-w-3xl mx-auto space-y-4">
          {rowsConfig.map((rowItem, rowIndex) => {
            const isFirstOfTier =
              rowIndex === 0 || rowsConfig[rowIndex - 1].tier !== rowItem.tier;

            return (
              <React.Fragment key={rowItem.row}>
                {/* Tier Divider Label */}
                {isFirstOfTier && (
                  <div className="pt-4 pb-1 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-zinc-400">
                    <span className="tracking-wider uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {rowItem.tier === 'VIP'
                        ? 'VIP Luxury Recliners (Rows A-B)'
                        : rowItem.tier === 'Premium'
                        ? 'Premium Pushback (Rows C-E)'
                        : 'Regular Executive (Rows F-H)'}
                    </span>
                    <span className="text-zinc-500 font-mono">₹{rowItem.price} / ticket</span>
                  </div>
                )}

                {/* Seat Row */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {/* Left Row Letter */}
                  <span className="w-6 text-center text-xs font-mono font-bold text-zinc-400">
                    {rowItem.row}
                  </span>

                  {/* Left Block (Seats 1 to 5) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const seatId = `${rowItem.row}${num}`;
                      const isOccupied = occupiedIds.has(seatId);
                      const isSelected = selectedIds.has(seatId);

                      return (
                        <SeatButton
                          key={seatId}
                          seatId={seatId}
                          num={num}
                          isOccupied={isOccupied}
                          isSelected={isSelected}
                          tier={rowItem.tier}
                          onClick={() =>
                            handleSeatClick(rowItem.row, num, rowItem.tier, rowItem.price)
                          }
                        />
                      );
                    })}
                  </div>

                  {/* Aisle */}
                  <div className="w-6 sm:w-10 text-center text-[10px] text-zinc-700 font-mono">
                    ||
                  </div>

                  {/* Right Block (Seats 6 to 10) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[6, 7, 8, 9, 10].map((num) => {
                      const seatId = `${rowItem.row}${num}`;
                      const isOccupied = occupiedIds.has(seatId);
                      const isSelected = selectedIds.has(seatId);

                      return (
                        <SeatButton
                          key={seatId}
                          seatId={seatId}
                          num={num}
                          isOccupied={isOccupied}
                          isSelected={isSelected}
                          tier={rowItem.tier}
                          onClick={() =>
                            handleSeatClick(rowItem.row, num, rowItem.tier, rowItem.price)
                          }
                        />
                      );
                    })}
                  </div>

                  {/* Right Row Letter */}
                  <span className="w-6 text-center text-xs font-mono font-bold text-zinc-400">
                    {rowItem.row}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-zinc-800 border border-emerald-500/60 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-400">
            🟢
          </div>
          <span>Available</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500 border border-amber-300 text-zinc-950 flex items-center justify-center text-[10px] font-mono font-black shadow-md shadow-amber-500/40">
            🟡
          </div>
          <span>Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-zinc-900 border border-red-900/60 opacity-60 cursor-not-allowed flex items-center justify-center text-[10px] font-mono text-zinc-500">
            🔴
          </div>
          <span>Occupied</span>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="mt-10 sticky bottom-4 z-30 p-4 sm:p-5 rounded-2xl bg-[#12141c]/95 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Selected Seats ({selectedSeats.length}):</span>
            {selectedSeats.length > 0 && (
              <button
                onClick={clearSeats}
                className="text-[11px] text-red-400 hover:text-red-300 underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {selectedSeats.length > 0 ? (
              selectedSeats.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-400 text-zinc-950"
                >
                  {s.id} ({s.tier})
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-500 italic">No seats selected yet. Click any available seat.</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Estimated Total</span>
            <span className="font-mono text-xl sm:text-2xl font-black text-white">
              ₹{pricing.grandTotal}
            </span>
          </div>

          <button
            onClick={handleProceed}
            disabled={selectedSeats.length === 0}
            className={`px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider flex items-center gap-2 transition-all focus:outline-none whitespace-nowrap ${
              selectedSeats.length > 0
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-950/70 hover:scale-105 active:scale-95'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <span>PROCEED TO SUMMARY</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface SeatButtonProps {
  seatId: string;
  num: number;
  isOccupied: boolean;
  isSelected: boolean;
  tier: SeatTier;
  onClick: () => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({
  seatId,
  num,
  isOccupied,
  isSelected,
  tier,
  onClick,
}) => {
  if (isOccupied) {
    return (
      <button
        disabled
        title={`${seatId} (Occupied)`}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-zinc-900/90 border border-red-950 text-zinc-600 text-[10px] font-mono flex items-center justify-center cursor-not-allowed select-none"
      >
        ✕
      </button>
    );
  }

  if (isSelected) {
    return (
      <button
        onClick={onClick}
        title={`${seatId} - Selected (${tier})`}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-amber-400 border border-amber-300 text-zinc-950 font-mono font-bold text-xs flex items-center justify-center shadow-lg shadow-amber-400/40 transform scale-105 transition-transform"
      >
        {num}
      </button>
    );
  }

  // Available
  return (
    <button
      onClick={onClick}
      title={`${seatId} - ${tier}`}
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-[11px] font-mono font-medium transition-all flex items-center justify-center border hover:scale-110 active:scale-95 focus:outline-none ${
        tier === 'VIP'
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-200 hover:bg-amber-900/60 hover:border-amber-400'
          : tier === 'Premium'
          ? 'bg-zinc-900 border-red-500/40 text-red-200 hover:bg-red-950/70 hover:border-red-400'
          : 'bg-zinc-900/80 border-white/20 text-zinc-300 hover:bg-zinc-800 hover:border-white/40'
      }`}
    >
      {num}
    </button>
  );
};
