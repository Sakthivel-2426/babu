import React from 'react';
import { Star, Ticket, Info, Play, Calendar, Clock } from 'lucide-react';
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

  const releaseYear =
    movie.releaseYear ||
    (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 2024);

  return (
    <div className="group relative bg-[#10121a] rounded-2xl overflow-hidden border border-white/10 hover:border-red-600/50 shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full">
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback to verified local cinematic poster if external link blocks
            (e.target as HTMLImageElement).src = '/src/assets/images/movie_poster_retro_1790660356867.jpg';
          }}
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

        {/* Content Rating / Certificate */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/85 text-amber-300 border border-white/10">
          {movie.certificate || movie.rating}
        </div>
      </div>

      {/* Movie Details Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div className="space-y-2">
          <h3
            onClick={handleDetails}
            className="font-cinema text-lg sm:text-xl font-bold text-white tracking-wide group-hover:text-red-400 transition-colors cursor-pointer truncate"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Unboxed Metadata with Release Year, Genre, and Duration */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 flex-wrap">
            <span className="font-mono text-amber-400 font-bold">{releaseYear}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="truncate max-w-[130px] text-zinc-300">{movie.genre.join(', ')}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="whitespace-nowrap font-mono text-[11px] text-zinc-400">{movie.duration}</span>
          </div>

          {/* Release Date info */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">
              {isComingSoon ? 'Releasing on ' : 'Release: '}
              <strong className="text-zinc-200 font-medium">
                {movie.releaseDate
                  ? new Date(movie.releaseDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : releaseYear}
              </strong>
            </span>
          </div>

          {/* Brief plot snippet */}
          {movie.description && (
            <p className="text-[11px] text-zinc-400 line-clamp-1 leading-snug">
              {movie.description}
            </p>
          )}

          {/* Show Timings for Now Showing */}
          {!isComingSoon && (
            <div className="pt-2 border-t border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1 font-semibold text-zinc-300">
                  <Clock className="w-3 h-3 text-red-500" />
                  <span>Showtimes</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Babu Cinemas</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(movie.customShowtimes && movie.customShowtimes.length > 0
                  ? movie.customShowtimes
                  : ['10:00 AM', '01:30 PM', '06:30 PM', '10:00 PM']
                ).slice(0, 4).map((time) => (
                  <button
                    key={time}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBook();
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 hover:bg-red-600 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                    title={`Click to book ${time}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Book Now, Details, and Trailer */}
        <div className="pt-2 space-y-2">
          {!isComingSoon ? (
            <>
              <button
                onClick={handleBook}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-md shadow-red-950/50 flex items-center justify-center gap-1.5 focus:outline-none"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>BOOK NOW</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDetails}
                  className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold tracking-wider text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors flex items-center justify-center gap-1 focus:outline-none"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>DETAILS</span>
                </button>
                <button
                  onClick={() => setActiveTrailerMovie(movie)}
                  className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/30 hover:bg-amber-900/50 border border-amber-600/30 transition-colors flex items-center justify-center gap-1 focus:outline-none"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-400" />
                  <span>TRAILER</span>
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDetails}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
              >
                <Info className="w-3.5 h-3.5" />
                <span>DETAILS</span>
              </button>
              <button
                onClick={() => setActiveTrailerMovie(movie)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-amber-400 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/30 transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
              >
                <Play className="w-3.5 h-3.5 fill-amber-400" />
                <span>TRAILER</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
