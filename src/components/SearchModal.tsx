import React, { useEffect, useRef } from 'react';
import { Search, X, Film, Star, Ticket, ArrowRight } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    movies,
    setSelectedMovie,
    setCurrentView,
    startBookingForMovie,
  } = useCinema();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredMovies = movies.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.title.toLowerCase().includes(q) ||
      m.language.toLowerCase().includes(q) ||
      m.genre.some((g) => g.toLowerCase().includes(q)) ||
      m.cast.some((c) => c.name.toLowerCase().includes(q))
    );
  });

  const handleSelectMovie = (movie: any) => {
    setSelectedMovie(movie);
    setIsSearchOpen(false);
    setCurrentView('details');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#10121a] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-red-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies by title, genre, language, or actor..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider px-2">
            {searchQuery ? `Search Results (${filteredMovies.length})` : 'All Feature Movies'}
          </div>

          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleSelectMovie(movie)}
                className="group p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-red-600/30 transition-all flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-cinema text-base font-bold text-white group-hover:text-red-400 transition-colors truncate">
                        {movie.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                        {movie.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span>{movie.genre.join(', ')}</span>
                      <span>·</span>
                      <span>{movie.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {movie.status === 'now-showing' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchOpen(false);
                        startBookingForMovie(movie);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950 flex items-center gap-1.5 focus:outline-none"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Book</span>
                    </button>
                  )}
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No matching movies found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
