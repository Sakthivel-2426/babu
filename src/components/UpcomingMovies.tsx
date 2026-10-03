import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { MovieCard } from './MovieCard';

export const UpcomingMovies: React.FC = () => {
  const { movies } = useCinema();

  const comingSoonMovies = movies.filter((m) => m.status === 'coming-soon');

  if (comingSoonMovies.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-[#07080b] border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
              <Calendar className="w-4 h-4" />
              <span>Future Releases</span>
            </div>
            <h2 className="font-cinema text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Coming Soon to Babu Cinemas
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Mark your calendars for the most awaited theatrical spectacles.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>Advance booking opens 3 days prior to release</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {comingSoonMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};
