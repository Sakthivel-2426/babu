import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Tv,
  Film,
  MapPin,
  Info,
} from 'lucide-react';
import { useCinema, getUpcomingDates, generateShowtimesForMovieAndDate } from '../context/CinemaContext';
import { Movie, ScreenFormat, Showtime } from '../types';

export const ShowtimeSelector: React.FC = () => {
  const {
    movies,
    selectedMovie,
    setSelectedMovie,
    selectedDate,
    setSelectedDate,
    proceedToSeats,
    setCurrentView,
  } = useCinema();

  const dates = getUpcomingDates();
  const [selectedFormat, setSelectedFormat] = useState<string>('All');

  // Currently available movies for booking (now-showing)
  const nowShowingMovies = movies.filter((m) => m.status === 'now-showing');

  // Active movie for showtimes
  const currentMovie = selectedMovie && selectedMovie.status === 'now-showing'
    ? selectedMovie
    : nowShowingMovies[0];

  // Generate showtimes for the chosen date and movie
  const showtimes = currentMovie ? generateShowtimesForMovieAndDate(currentMovie, selectedDate) : [];

  // Filter by format if selected
  const filteredShowtimes =
    selectedFormat === 'All'
      ? showtimes
      : showtimes.filter((s) => s.format === selectedFormat);

  // Group by periods
  const morningShows = filteredShowtimes.filter((s) => s.period === 'Morning');
  const afternoonShows = filteredShowtimes.filter((s) => s.period === 'Afternoon');
  const eveningShows = filteredShowtimes.filter((s) => s.period === 'Evening' || s.period === 'Night');

  const handleSelectShowtime = (st: Showtime) => {
    proceedToSeats(st);
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
          <Clock className="w-4 h-4" />
          <span>Screen Schedule</span>
        </div>
        <h1 className="font-cinema text-3xl sm:text-4xl font-extrabold text-white">
          Show Timings & Schedules
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Select your date, movie, and comfortable showtime to book seats.
        </p>
      </div>

      {/* Movie Switcher Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#10121a] border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {currentMovie && (
            <img
              src={currentMovie.posterUrl}
              alt={currentMovie.title}
              className="w-14 h-20 object-cover rounded-xl border border-white/10 shrink-0"
            />
          )}
          <div className="min-w-0">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block">Selected Blockbuster</span>
            <h2 className="text-xl font-bold text-white truncate font-cinema">
              {currentMovie?.title || 'Select a Movie'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span>{currentMovie?.language}</span>
              <span>·</span>
              <span>{currentMovie?.duration}</span>
              <span>·</span>
              <span className="text-red-400 font-semibold">{currentMovie?.rating}</span>
            </div>
          </div>
        </div>

        {/* Change Movie Selector Dropdown */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <label htmlFor="movie-select" className="text-xs text-zinc-400 whitespace-nowrap">
            Switch Movie:
          </label>
          <select
            id="movie-select"
            value={currentMovie?.id || ''}
            onChange={(e) => {
              const found = movies.find((m) => m.id === e.target.value);
              if (found) setSelectedMovie(found);
            }}
            className="w-full md:w-64 bg-zinc-900 border border-white/15 text-white text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-red-500"
          >
            {nowShowingMovies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.language})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 1: Date Selection Horizontal Tabs */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-red-500" />
            1. Select Date
          </span>
          <span className="text-xs text-zinc-500">Dates available for advance reservation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {dates.map((dateObj) => {
            const isSelected = selectedDate === dateObj.iso;
            return (
              <button
                key={dateObj.iso}
                onClick={() => setSelectedDate(dateObj.iso)}
                className={`p-3 rounded-xl border text-center transition-all focus:outline-none flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/60 font-semibold scale-[1.02]'
                    : 'bg-zinc-900/80 border-white/10 text-zinc-300 hover:border-white/25 hover:bg-zinc-800'
                }`}
              >
                <span className="text-[10px] tracking-wider uppercase font-medium">
                  {dateObj.shortDay}
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono my-0.5">
                  {dateObj.dayNumber}
                </span>
                <span className="text-[10px] uppercase text-zinc-400">
                  {dateObj.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Format Filter Segmented Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-3 rounded-xl bg-zinc-900/50 border border-white/5">
        <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
          <Tv className="w-4 h-4 text-amber-400" />
          <span>Screen Format Filter:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', '2D', '3D', '4K Dolby Atmos'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none ${
                selectedFormat === fmt
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-950/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Showtimes Grid by Periods */}
      <div className="space-y-8">
        {/* Morning Shows */}
        {morningShows.length > 0 && (
          <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Morning Shows</h3>
              </div>
              <span className="text-xs text-zinc-500">10:00 AM – 01:00 PM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {morningShows.map((show) => (
                <ShowtimeCard key={show.id} show={show} onSelect={() => handleSelectShowtime(show)} />
              ))}
            </div>
          </div>
        )}

        {/* Afternoon Shows */}
        {afternoonShows.length > 0 && (
          <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Afternoon Shows</h3>
              </div>
              <span className="text-xs text-zinc-500">01:00 PM – 05:00 PM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {afternoonShows.map((show) => (
                <ShowtimeCard key={show.id} show={show} onSelect={() => handleSelectShowtime(show)} />
              ))}
            </div>
          </div>
        )}

        {/* Evening / Night Shows */}
        {eveningShows.length > 0 && (
          <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Evening & Night Shows (Prime)
                </h3>
              </div>
              <span className="text-xs text-amber-400/90 font-medium">Fast Selling</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eveningShows.map((show) => (
                <ShowtimeCard key={show.id} show={show} onSelect={() => handleSelectShowtime(show)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Help Note */}
      <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-zinc-900/60 border border-white/10 text-xs text-zinc-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          Ticket counters open 45 minutes prior to every show. Online booked tickets can be directly verified via the digital ticket QR code at Screen turnstiles.
        </span>
      </div>
    </div>
  );
};

interface ShowtimeCardProps {
  show: Showtime;
  onSelect: () => void;
}

const ShowtimeCard: React.FC<ShowtimeCardProps> = ({ show, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className="group relative p-4 rounded-xl bg-zinc-900 border border-white/10 hover:border-red-500/60 transition-all text-left flex flex-col justify-between hover:bg-zinc-800/80 focus:outline-none hover:scale-[1.02]"
    >
      <div className="flex items-start justify-between w-full">
        <div>
          <span className="font-mono text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
            {show.time}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1 font-medium">{show.screenName}</p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-950/80 text-red-300 border border-red-800/40">
          {show.format}
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between w-full">
        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Available
        </span>
        <span className="text-xs font-semibold text-white group-hover:text-red-400 flex items-center gap-1">
          <span>Select Seats</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
};
