import React from 'react';
import { Star, Ticket, Info, Play } from 'lucide-react';
import { Movie } from '../types';
import { useCinema } from '../context/CinemaContext';

interface MovieCardProps {
  movie: Movie;
  onViewDetails?: (movie: Movie) => void;
  onBookNow?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onViewDetails, onBookNow }) => {
  const { startBookingForMovie, setSelectedMovie, setCurrentView, setActiveTrailerMovie } = useCinema();

  const handleBook = () => {
    if (onBookNow) {
      onBookNow(movie);
    } else {
      startBookingForMovie(movie);
    }
  };

  const handleDetails = () => {
    if (onViewDetails) {
      onViewDetails(movie);
    } else {
      setSelectedMovie(movie);
      setCurrentView('details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isComingSoon = movie.status === 'coming-soon';

  return (
    <div className="group relative bg-[#10121a] rounded-2xl overflow-hidden border border-white/10 hover:border-red-600/50 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full">
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10121a] via-transparent to-black/30 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges (Language / Formats) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-black/70 backdrop-blur-md text-amber-300 border border-white/10">
            {movie.language}
          </span>
          <div className="flex items-center gap-1.5">
            {movie.availableFormats.slice(0, 2).map((fmt) => (
              <span
                key={fmt}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-red-950/80 text-red-200 border border-red-600/30 backdrop-blur-md"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Trailer Trigger Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTrailerMovie(movie);
          }}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-red-950/80 focus:outline-none hover:bg-red-500 hover:scale-110"
          aria-label={`Play trailer for ${movie.title}`}
        >
          <Play className="w-5 h-5 fill-white ml-0.5" />
        </button>

        {/* Rating Floating Tag */}
        {movie.imdbScore && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md text-amber-400 text-xs font-semibold border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.imdbScore}</span>
          </div>
        )}

        {/* Content Rating (U/A, etc.) */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-zinc-300 border border-white/10">
          {movie.rating}
        </div>
      </div>

      {/* Movie Details Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <h3
            onClick={handleDetails}
            className="font-cinema text-lg sm:text-xl font-bold text-white tracking-wide group-hover:text-red-400 transition-colors cursor-pointer truncate"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Unboxed Metadata per Zero-Pill discipline */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1.5">
            <span className="truncate max-w-[140px] text-zinc-300">{movie.genre.join(', ')}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="whitespace-nowrap">{movie.duration}</span>
          </div>

          {isComingSoon && (
            <div className="mt-2 text-xs font-medium text-amber-400/90">
              Releasing on {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2">
          {!isComingSoon ? (
            <>
              <button
                onClick={handleBook}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-md shadow-red-950/50 flex items-center justify-center gap-1.5 focus:outline-none"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>BOOK NOW</span>
              </button>
              <button
                onClick={handleDetails}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wider text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
              >
                <Info className="w-3.5 h-3.5" />
                <span>DETAILS</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDetails}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5 focus:outline-none col-span-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>DETAILS</span>
              </button>
              <button
                onClick={() => setActiveTrailerMovie(movie)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-amber-400 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/30 transition-colors flex items-center justify-center gap-1.5 focus:outline-none col-span-1"
              >
                <Play className="w-3.5 h-3.5 fill-amber-400" />
                <span>TRAILER</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
