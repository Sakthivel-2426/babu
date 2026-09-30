import React, { useState, useEffect, useRef } from 'react';
import { Play, Ticket, Star, Sparkles, ChevronRight, ChevronLeft, Volume2, ShieldCheck, Film } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { heroBannerImg } from '../data/mockData';

export const Hero: React.FC = () => {
  const { movies, startBookingForMovie, setActiveTrailerMovie, setSelectedMovie, setCurrentView } = useCinema();

  // Filter now-showing movies for the featured carousel
  const nowShowingMovies = movies.filter((m) => m.status === 'now-showing');
  const featuredList = nowShowingMovies.length > 0 ? nowShowingMovies : movies.slice(0, 4);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Fallback safe active movie
  const activeMovie = featuredList[activeIndex] || featuredList[0] || movies[0];

  // Auto-cycle through featured movies every 7s when not hovered/paused
  useEffect(() => {
    if (isPaused || featuredList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, featuredList.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? featuredList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % featuredList.length);
  };

  // Mobile swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartXRef.current = null;
  };

  if (!activeMovie) return null;

  return (
    <section
      aria-label="Featured Movies"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-[520px] sm:min-h-[580px] md:min-h-[620px] lg:min-h-[680px] flex items-center overflow-hidden border-b border-white/10 select-none"
    >
      {/* Background Image with Dynamic Fade Transitions */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          key={activeMovie.id}
          src={activeMovie.backdropUrl || heroBannerImg}
          alt={`${activeMovie.title} Backdrop`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-subtle-zoom transition-all duration-1000"
        />

        {/* Mobile Scrim: Complete dark overlay for small portrait screens to guarantee readability */}
        <div className="absolute inset-0 bg-[#08090c]/70 md:bg-transparent z-10" />

        {/* Multi-angle cinematic gradient scrims */}
        {/* Bottom to Top (covers mobile & desktop bottoms) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/85 to-[#08090c]/40 md:via-[#08090c]/50 md:to-transparent z-10" />

        {/* Left to Right (desktop cinematic fade, mobile heavy protection) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090c] via-[#08090c]/95 sm:via-[#08090c]/85 to-[#08090c]/60 lg:to-transparent z-10" />

        {/* Top edge darkening for sticky navbar blending */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#08090c] to-transparent z-10" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Movie Info & CTAs (Full width on mobile/tablet, 7 cols on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5 lg:space-y-6">
            
            {/* Top Row Badges: Now Showing & Audio/Screen Specs */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse" />
                NOW SHOWING
              </span>
              <span className="text-[11px] sm:text-xs text-amber-400/90 font-medium tracking-wide flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Screen 1 · 4K Dolby Atmos</span>
              </span>
            </div>

            {/* Movie Title - Fluid typography from mobile to desktop */}
            <h1 className="font-cinema text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] sm:leading-[1.03] drop-shadow-lg">
              {activeMovie.title}
            </h1>

            {/* Tagline */}
            {activeMovie.tagline && (
              <p className="text-xs sm:text-sm md:text-base text-amber-300/85 font-medium italic tracking-wide line-clamp-1 sm:line-clamp-none">
                “{activeMovie.tagline}”
              </p>
            )}

            {/* Metadata Chips: zero orphan dots, wraps gracefully */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-300 font-medium">
              {/* IMDb Rating Badge */}
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-[11px] sm:text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{activeMovie.imdbScore || '8.8'}/10</span>
              </div>

              {/* Age Rating Chip */}
              <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs bg-white/10 text-zinc-200 font-mono border border-white/20">
                {activeMovie.rating}
              </span>

              {/* Language Chip */}
              <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs bg-zinc-800/80 text-zinc-200 border border-white/10">
                {activeMovie.language}
              </span>

              {/* Duration Chip */}
              <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs bg-zinc-800/80 text-zinc-200 border border-white/10">
                {activeMovie.duration}
              </span>

              {/* Genre List */}
              <span className="text-zinc-300 text-[11px] sm:text-xs px-1">
                {activeMovie.genre.join(', ')}
              </span>
            </div>

            {/* Synopsis Description with responsive clamp */}
            <p className="text-xs sm:text-sm md:text-base text-zinc-300 leading-relaxed max-w-2xl text-pretty line-clamp-3 sm:line-clamp-4 lg:line-clamp-3">
              {activeMovie.description}
            </p>

            {/* Action Buttons: Responsive mobile-friendly layout */}
            <div className="pt-2 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2.5 sm:gap-3.5">
              <button
                onClick={() => startBookingForMovie(activeMovie)}
                className="w-full xs:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm md:text-base font-bold tracking-wider text-white bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl shadow-lg shadow-red-950/70 hover:shadow-red-700/40 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
              >
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                <span>BOOK TICKETS</span>
              </button>

              <button
                onClick={() => setActiveTrailerMovie(activeMovie)}
                className="w-full xs:w-auto px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm md:text-base font-semibold tracking-wider text-zinc-100 bg-zinc-900/90 hover:bg-zinc-800/90 border border-white/20 hover:border-white/40 rounded-xl backdrop-blur-md flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <span>WATCH TRAILER</span>
              </button>

              <button
                onClick={() => {
                  setSelectedMovie(activeMovie);
                  setCurrentView('details');
                }}
                className="w-full xs:w-auto text-xs text-zinc-400 hover:text-white flex items-center justify-center xs:justify-start gap-1 py-2 px-2 transition-colors"
              >
                <span>View Cast & Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Experience Trust Badges (Responsive 3-column / compact grid) */}
            <div className="pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
              <div className="p-2 sm:p-0 rounded-lg bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-0 text-center sm:text-left">
                <div className="font-semibold text-white text-[11px] sm:text-xs md:text-sm truncate">Barco 4K Laser</div>
                <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Dual RGB Clarity</div>
              </div>
              <div className="p-2 sm:p-0 rounded-lg bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-0 text-center sm:text-left">
                <div className="font-semibold text-white text-[11px] sm:text-xs md:text-sm truncate">Dolby Atmos</div>
                <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">128 Spatial Audio</div>
              </div>
              <div className="p-2 sm:p-0 rounded-lg bg-white/[0.02] sm:bg-transparent border border-white/5 sm:border-0 text-center sm:text-left">
                <div className="font-semibold text-white text-[11px] sm:text-xs md:text-sm truncate">Pushback Chairs</div>
                <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate">Ultra Comfort</div>
              </div>
            </div>

            {/* Mobile & Tablet Movie Navigation Dots / Thumbnails */}
            {featuredList.length > 1 && (
              <div className="flex lg:hidden items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  {featuredList.map((movie, idx) => (
                    <button
                      key={movie.id}
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Go to movie ${movie.title}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === activeIndex
                          ? 'w-7 bg-red-600'
                          : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous movie"
                    className="p-1.5 rounded-lg bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next movie"
                    className="p-1.5 rounded-lg bg-zinc-900/80 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Desktop Theatrical Card & Featured Selector (Hidden on mobile/tablet, visible on lg+) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col items-end gap-4">
            
            {/* Theatrical Poster Showcase Glass Card */}
            <div className="w-full max-w-[320px] rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-white/15 p-4 shadow-2xl shadow-black/80 space-y-3 transform hover:scale-[1.01] transition-transform">
              
              {/* Poster Image with Screen Badge */}
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-lg border border-white/10 group cursor-pointer"
                onClick={() => {
                  setSelectedMovie(activeMovie);
                  setCurrentView('details');
                }}
              >
                <img
                  src={activeMovie.posterUrl}
                  alt={activeMovie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Badge: Format */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono font-semibold text-amber-400">
                  {activeMovie.availableFormats?.[0] || '4K Dolby Atmos'}
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white drop-shadow">Dir: {activeMovie.director}</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-600/90 text-white font-mono text-[10px] font-bold">
                    {activeMovie.rating}
                  </span>
                </div>
              </div>

              {/* Quick Details & Showtimes status */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Film className="w-3.5 h-3.5 text-red-500" />
                    <span>Auditorium 1</span>
                  </span>
                  <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Booking Open
                  </span>
                </div>

                <button
                  onClick={() => startBookingForMovie(activeMovie)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-red-950"
                >
                  <Ticket className="w-4 h-4 text-amber-300" />
                  <span>Select Seats</span>
                </button>
              </div>
            </div>

            {/* Featured Movie Thumbnail Selector (Allows 1-click switching) */}
            {featuredList.length > 1 && (
              <div className="w-full max-w-[320px] rounded-xl bg-zinc-950/50 backdrop-blur-md border border-white/10 p-2 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
                  {featuredList.map((movie, idx) => {
                    const isSelected = idx === activeIndex;
                    return (
                      <button
                        key={movie.id}
                        onClick={() => setActiveIndex(idx)}
                        title={movie.title}
                        className={`relative w-12 h-14 rounded-lg overflow-hidden border transition-all shrink-0 focus:outline-none ${
                          isSelected
                            ? 'border-red-500 ring-2 ring-red-500/50 scale-105'
                            : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-red-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-1 pl-1 border-l border-white/10">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous movie"
                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next movie"
                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};

