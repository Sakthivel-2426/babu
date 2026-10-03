import React from 'react';
import {
  ArrowLeft,
  Ticket,
  Star,
  Clock,
  Calendar,
  Globe2,
  Film,
  Play,
  User,
  Sparkles,
} from 'lucide-react';
import { useCinema } from '../context/CinemaContext';

export const MovieDetailsView: React.FC = () => {
  const { selectedMovie, setCurrentView, startBookingForMovie, setActiveTrailerMovie } = useCinema();

  if (!selectedMovie) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <p className="text-zinc-400">No movie selected.</p>
        <button
          onClick={() => setCurrentView('movies')}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
        >
          Browse All Movies
        </button>
      </div>
    );
  }

  const isComingSoon = selectedMovie.status === 'coming-soon';

  return (
    <div className="min-h-screen bg-[#08090c] pb-24">
      {/* Top Banner Backdrop */}
      <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[500px] overflow-hidden">
        <img
          src={selectedMovie.backdropUrl || selectedMovie.posterUrl}
          alt={selectedMovie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter blur-xs scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/70 to-[#08090c]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090c] via-transparent to-[#08090c]" />

        {/* Back Button */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <button
            onClick={() => setCurrentView('movies')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 text-xs sm:text-sm font-medium text-white backdrop-blur-md transition-all hover:scale-105 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </button>
        </div>
      </div>

      {/* Main Content Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-64 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Big Movie Poster */}
          <div className="lg:col-span-4 xl:col-span-4 max-w-sm mx-auto lg:mx-0 w-full">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/90 border-2 border-white/15 bg-zinc-950 group">
              <img
                src={selectedMovie.posterUrl}
                alt={selectedMovie.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveTrailerMovie(selectedMovie)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-red-500 transition-all focus:outline-none"
                aria-label="Play Trailer"
              >
                <Play className="w-6 h-6 fill-white ml-1" />
              </button>
            </div>

            {/* Quick Actions underneath poster */}
            <div className="mt-4 space-y-3">
              {!isComingSoon ? (
                <button
                  onClick={() => startBookingForMovie(selectedMovie)}
                  className="w-full py-4 px-6 text-sm font-bold tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl shadow-xl shadow-red-950/70 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                >
                  <Ticket className="w-5 h-5 text-amber-300" />
                  <span>BOOK TICKETS NOW</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs text-center font-medium">
                  Advance bookings will open soon for this blockbuster!
                </div>
              )}

              <button
                onClick={() => setActiveTrailerMovie(selectedMovie)}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 flex items-center justify-center gap-2 transition-colors focus:outline-none"
              >
                <Play className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Watch Official Trailer</span>
              </button>
            </div>
          </div>

          {/* Right Column: Title, Metadata, Cast, Storyline */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-8 pt-4 lg:pt-16">
            {/* Title & Tagline */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-red-600/30 border border-red-500/50 text-red-400">
                  {selectedMovie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-white/10">
                  {selectedMovie.rating}
                </span>
                {selectedMovie.imdbScore && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-950/60 border border-amber-500/40 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {selectedMovie.imdbScore} / 10 IMDb
                  </span>
                )}
              </div>

              <h1 className="font-cinema text-3xl sm:text-5xl font-black text-white tracking-tight">
                {selectedMovie.title}
              </h1>

              {selectedMovie.tagline && (
                <p className="text-base sm:text-lg text-amber-400/90 italic font-serif mt-2">
                  "{selectedMovie.tagline}"
                </p>
              )}
            </div>

            {/* Quick Spec Pills/Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/60 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-red-500">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500 uppercase font-medium">Genre</div>
                  <div className="text-xs font-semibold text-zinc-200 truncate">{selectedMovie.genre.join(', ')}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500 uppercase font-medium">Duration</div>
                  <div className="text-xs font-semibold text-zinc-200">{selectedMovie.duration}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-blue-400">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500 uppercase font-medium">Language</div>
                  <div className="text-xs font-semibold text-zinc-200">{selectedMovie.language}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-emerald-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500 uppercase font-medium">Release Date</div>
                  <div className="text-xs font-semibold text-zinc-200">
                    {new Date(selectedMovie.releaseDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Available Formats & Screens */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Auditorium Formats at Babu Cinemas</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedMovie.availableFormats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-red-950/40 border border-red-600/40 text-red-200"
                  >
                    {fmt}
                  </span>
                ))}
                {selectedMovie.screens.map((screen) => (
                  <span
                    key={screen}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-white/10 text-zinc-300"
                  >
                    {screen}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-base font-bold text-white mb-2">Movie Synopsis</h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed text-balance">
                {selectedMovie.description}
              </p>
            </div>

            {/* Director & Cast Grid */}
            <div className="border-t border-white/10 pt-6">
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Directed By</span>
                <p className="text-base font-bold text-white">{selectedMovie.director}</p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-3">
                  Lead Cast
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedMovie.cast.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{member.name}</div>
                        <div className="text-[11px] text-zinc-400 truncate">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Showtime Action Callout */}
            {!isComingSoon && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/50 via-zinc-900 to-zinc-900 border border-red-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-cinema text-lg font-bold text-white">Ready to experience this on the big screen?</h4>
                  <p className="text-xs text-zinc-400 mt-1">Select your preferred date, timings, and seats.</p>
                </div>
                <button
                  onClick={() => startBookingForMovie(selectedMovie)}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-950/60 transition-all focus:outline-none whitespace-nowrap"
                >
                  SELECT SHOWTIME
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
