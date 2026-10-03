import React, { useState, useRef } from 'react';
import { Film, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { MovieCard } from './MovieCard';
import {
  sortMoviesLatestFirst,
  getCurrentlyShowingMovies,
  getNewlyReleasedMovies,
  getUpcomingMovies,
} from '../data/moviesRegistry';

export type MovieSectionFilter = 'all' | 'now-showing' | 'latest' | 'popular' | 'upcoming';

export const NowShowing: React.FC = () => {
  const { movies } = useCinema();
  const [activeSection, setActiveSection] = useState<MovieSectionFilter>('now-showing');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Popular movies for the featured horizontal carousel (Blockbusters & Classics)
  const popularCarouselMovies = movies.filter(
    (m) => (m.category === 'popular' || (m.imdbScore && m.imdbScore >= 8.5)) && m.status !== 'ended'
  );

  // Filter movies based on the selected section tab
  const getSectionMovies = () => {
    switch (activeSection) {
      case 'now-showing':
        return getCurrentlyShowingMovies(movies);
      case 'latest':
        return getNewlyReleasedMovies(movies);
      case 'upcoming':
        return getUpcomingMovies(movies);
      case 'popular':
        return sortMoviesLatestFirst(
          movies.filter((m) => m.category === 'popular' || (m.imdbScore && m.imdbScore >= 8.5))
        );
      case 'all':
      default:
        return sortMoviesLatestFirst(movies.filter((m) => m.status !== 'ended'));
    }
  };

  const sectionMovies = getSectionMovies();

  // Extract unique genres for current section
  const availableGenres = [
    'All',
    ...Array.from(new Set(sectionMovies.flatMap((m) => m.genre))).sort(),
  ];

  // Apply genre filter
  const displayedMovies =
    selectedGenre === 'All'
      ? sectionMovies
      : sectionMovies.filter((m) => m.genre.includes(selectedGenre));

  // Counts for each section tab
  const counts = {
    all: movies.filter((m) => m.status !== 'ended').length,
    'now-showing': getCurrentlyShowingMovies(movies).length,
    latest: getNewlyReleasedMovies(movies).length,
    popular: movies.filter((m) => m.category === 'popular' || (m.imdbScore && m.imdbScore >= 8.5)).length,
    upcoming: getUpcomingMovies(movies).length,
  };

  // Scroll horizontal carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div id="now-showing" className="space-y-16 py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ==================================================================== */}
      {/* SECTION 1: POPULAR & TRENDING TAMIL MOVIES HORIZONTAL CAROUSEL       */}
      {/* ==================================================================== */}
      <section aria-label="Popular Tamil Blockbusters Carousel" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1.5">
              <Flame className="w-4 h-4 fill-amber-400/20 text-amber-400" />
              <span>Trending & All-Time Hits</span>
            </div>
            <h2 className="font-cinema text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Popular Tamil Blockbusters
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Audiences' most-celebrated Tamil cinema milestones and remastered fan favorites.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-red-600/40 transition-all focus:outline-none"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-red-600/40 transition-all focus:outline-none"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Scroll Track */}
        <div
          ref={carouselRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent scroll-smooth focus:outline-none"
          tabIndex={0}
          aria-label="Popular Tamil Movies List"
        >
          {popularCarouselMovies.map((movie) => (
            <div
              key={`carousel-${movie.id}`}
              className="w-[260px] sm:w-[280px] shrink-0 snap-start flex flex-col"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: TAMIL CINEMA EXPLORER (NOW SHOWING, LATEST, POPULAR, ALL) */}
      {/* ==================================================================== */}
      <section aria-label="Tamil Movies Collection" className="space-y-8">
        {/* Header & Section Segmented Tabs */}
        <div className="space-y-6 border-b border-white/10 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-500 mb-1.5">
                <Film className="w-4 h-4" />
                <span>Exclusively Tamil Cinema</span>
              </div>
              <h2 className="font-cinema text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Now Showing at Babu Cinemas
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Experience high-octane mass moments, timeless blockbusters, and new releases in 4K Laser & Dolby Atmos.
              </p>
            </div>

            {/* Section Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-900/90 border border-white/10 rounded-2xl self-start md:self-auto">
              <button
                onClick={() => {
                  setActiveSection('now-showing');
                  setSelectedGenre('All');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap focus:outline-none ${
                  activeSection === 'now-showing'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Now Showing ({counts['now-showing']})
              </button>

              <button
                onClick={() => {
                  setActiveSection('latest');
                  setSelectedGenre('All');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap focus:outline-none ${
                  activeSection === 'latest'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Newly Released ({counts.latest})
              </button>

              <button
                onClick={() => {
                  setActiveSection('popular');
                  setSelectedGenre('All');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap focus:outline-none ${
                  activeSection === 'popular'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Popular Blockbusters ({counts.popular})
              </button>

              <button
                onClick={() => {
                  setActiveSection('all');
                  setSelectedGenre('All');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap focus:outline-none ${
                  activeSection === 'all'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                All Movies ({counts.all})
              </button>

              <button
                onClick={() => {
                  setActiveSection('upcoming');
                  setSelectedGenre('All');
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap focus:outline-none ${
                  activeSection === 'upcoming'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Upcoming ({counts.upcoming})
              </button>
            </div>
          </div>

          {/* Genre Filters Bar & Active Movie Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              <span className="text-xs text-zinc-500 font-medium mr-1 uppercase tracking-wider shrink-0">
                Genre:
              </span>
              {availableGenres.map((genre) => {
                const isActive = selectedGenre === genre;
                return (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 focus:outline-none ${
                      isActive
                        ? 'bg-zinc-100 text-black font-bold shadow-sm'
                        : 'bg-zinc-900/80 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-mono text-zinc-400 shrink-0">
              Showing <span className="text-red-400 font-bold">{displayedMovies.length}</span> Tamil {displayedMovies.length === 1 ? 'Movie' : 'Movies'}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {displayedMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {displayedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-zinc-400 bg-zinc-950/50 rounded-2xl border border-white/5 p-8">
            <p className="text-base font-medium">
              No Tamil movies found under genre "{selectedGenre}" in this section.
            </p>
            <button
              onClick={() => setSelectedGenre('All')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300 underline"
            >
              Show all movies in this section
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
