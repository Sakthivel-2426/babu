import React, { useState } from 'react';
import { Film, Sparkles } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { MovieCard } from './MovieCard';

export const NowShowing: React.FC = () => {
  const { movies } = useCinema();
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  // Filter only now-showing
  const nowShowingMovies = movies.filter((m) => m.status === 'now-showing');

  // Extract unique genres
  const genres = ['All', ...Array.from(new Set(nowShowingMovies.flatMap((m) => m.genre)))];

  const filteredMovies =
    selectedGenre === 'All'
      ? nowShowingMovies
      : nowShowingMovies.filter((m) => m.genre.includes(selectedGenre));

  return (
    <section id="now-showing" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
            <Film className="w-4 h-4" />
            <span>Currently in Theatres</span>
          </div>
          <h2 className="font-cinema text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Now Showing at Babu Theatre
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Experience the latest blockbusters in pristine 4K RGB Laser and Dolby Atmos sound.
          </p>
        </div>

        {/* Functional Genre Filter segmented control */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900/90 border border-white/10 rounded-xl self-start md:self-auto">
          {genres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap focus:outline-none ${
                  isActive
                    ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-zinc-400 bg-zinc-950/50 rounded-2xl border border-white/5 p-8">
          <p className="text-base font-medium">No movies found under genre "{selectedGenre}".</p>
          <button
            onClick={() => setSelectedGenre('All')}
            className="mt-4 px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300 underline"
          >
            Show all movies
          </button>
        </div>
      )}
    </section>
  );
};
