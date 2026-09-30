import React from 'react';
import { X, Ticket, Film, Play, Sparkles } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';

export const TrailerModal: React.FC = () => {
  const { activeTrailerMovie, setActiveTrailerMovie, startBookingForMovie } = useCinema();

  if (!activeTrailerMovie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#10121a] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500">
              <Film className="w-4 h-4" />
            </span>
            <span className="font-cinema text-lg font-bold text-white">
              Official Trailer · {activeTrailerMovie.title}
            </span>
          </div>

          <button
            onClick={() => setActiveTrailerMovie(null)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {/* Visual video player simulator with high resolution poster backdrop */}
          <img
            src={activeTrailerMovie.backdropUrl || activeTrailerMovie.posterUrl}
            alt={activeTrailerMovie.title}
            className="w-full h-full object-cover filter brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Interactive Player Overlay Simulation */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-950 hover:scale-110 transition-transform cursor-pointer group">
              <Play className="w-8 h-8 fill-white ml-1 text-white group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-sm font-semibold text-white mt-4 drop-shadow-md">
              4K Teaser & Theatrical Trailer
            </p>
            <span className="text-xs text-amber-400 font-mono mt-0.5">
              Dolby Atmos 5.1 Preview Audio
            </span>
          </div>
        </div>

        {/* Bottom Bar Details & Booking */}
        <div className="p-4 sm:p-6 bg-zinc-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>{activeTrailerMovie.genre.join(', ')}</span>
              <span>·</span>
              <span>{activeTrailerMovie.duration}</span>
              <span>·</span>
              <span className="text-zinc-300 font-medium">Dir: {activeTrailerMovie.director}</span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 max-w-xl line-clamp-1">
              {activeTrailerMovie.description}
            </p>
          </div>

          {activeTrailerMovie.status === 'now-showing' && (
            <button
              onClick={() => {
                const m = activeTrailerMovie;
                setActiveTrailerMovie(null);
                startBookingForMovie(m);
              }}
              className="px-6 py-3 rounded-xl text-xs font-bold tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950 flex items-center gap-2 whitespace-nowrap focus:outline-none"
            >
              <Ticket className="w-4 h-4 text-amber-300" />
              <span>BOOK TICKETS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
