import React from 'react';
import {
  Film,
  Sparkles,
  Volume2,
  Tv,
  Armchair,
  UtensilsCrossed,
  Wind,
  Car,
  ShieldCheck,
  Award,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Navigation,
} from 'lucide-react';
import { THEATRE_FACILITIES, THEATRE_SCREENS, heroBannerImg } from '../data/mockData';
import { useCinema } from '../context/CinemaContext';

export const AboutTheatre: React.FC = () => {
  const { setCurrentView } = useCinema();

  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Projector':
        return <Tv className="w-5 h-5 text-red-500" />;
      case 'Volume2':
        return <Volume2 className="w-5 h-5 text-amber-400" />;
      case 'Armchair':
        return <Armchair className="w-5 h-5 text-red-400" />;
      case 'Utensils':
        return <UtensilsCrossed className="w-5 h-5 text-amber-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-blue-400" />;
      case 'Car':
        return <Car className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-zinc-950 min-h-[380px] sm:min-h-[440px] flex items-center shadow-2xl">
        <img
          src={heroBannerImg}
          alt="Babu Cinemas Auditorium"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090c] via-[#08090c]/85 to-transparent z-10" />

        <div className="relative z-20 p-8 sm:p-14 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            <span>Legacy of Entertainment</span>
          </div>

          <h1 className="font-cinema text-4xl sm:text-5xl font-black text-white tracking-tight">
            About Babu Cinemas
          </h1>

          <p className="text-amber-400 text-base sm:text-lg font-serif italic">
            “Your Movie. Your Seat. Your Experience.”
          </p>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Established as a benchmark in theatrical excellence, Babu Cinemas is located in Uthiramerur, Kanchipuram, Tamil Nadu, India. Combining cutting-edge 4K Dual RGB Laser digital projection, 128-channel immersive Dolby Atmos acoustics, and unmatched hospitality, we transform every film screening into an unforgettable sensory event.
          </p>
        </div>
      </div>

      {/* Key Numbers Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 text-center">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-400 block">
            3
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mt-1 block">
            Auditorium Screens
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">Dolby Atmos & Barco 4K</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 text-center">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-red-500 block">
            1,250
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mt-1 block">
            Seating Capacity
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">Ergonomic & VIP Recliners</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 text-center">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white block">
            128
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mt-1 block">
            Audio Channels
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">True 3D Spatial Audio</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 text-center">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-400 block">
            100%
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mt-1 block">
            Laser Projection
          </span>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">Zero Lamp Degradation</span>
        </div>
      </div>

      {/* Facilities Grid */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-red-500 block mb-1">
            World-Class Amenities
          </span>
          <h2 className="font-cinema text-3xl font-bold text-white">
            Designed for Pure Cinematic Comfort
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Every corner of Babu Cinemas is curated for seamless enjoyment, safety, and leisure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEATRE_FACILITIES.map((facility, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#10121a] border border-white/10 hover:border-red-600/40 transition-all hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-white/10">
                    {getFacilityIcon(facility.icon)}
                  </div>
                  <span className="text-[10px] uppercase font-mono font-semibold text-zinc-500">
                    {facility.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{facility.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{facility.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auditorium Screen Specifications */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 block mb-1">
              Screen Architecture
            </span>
            <h2 className="font-cinema text-3xl font-bold text-white">
              Our 3 State-of-the-Art Screens
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('showtimes')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors self-start sm:self-auto flex items-center gap-1.5 focus:outline-none"
          >
            <span>View Today's Showtimes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THEATRE_SCREENS.map((screen, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#10121a] border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs font-mono mb-3">
                  0{idx + 1}
                </div>
                <h3 className="font-cinema text-lg font-bold text-white">{screen.name}</h3>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Curved Screen:</span>
                    <span className="text-zinc-200 font-medium">{screen.curvedScreen}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Audio Setup:</span>
                    <span className="text-zinc-200 font-medium">{screen.sound}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Digital Projection:</span>
                    <span className="text-zinc-200 font-medium">{screen.projection}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-zinc-500">Seating Breakdown:</span>
                    <span className="text-zinc-300 font-medium text-right text-[11px]">
                      {screen.seatsBreakdown}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-mono text-amber-400 font-bold block">
                  Capacity: {screen.capacity} Guests
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location & Directions Section */}
      <div className="p-8 rounded-3xl bg-[#10121a] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-500">
            <MapPin className="w-4 h-4" />
            <span>Theatre Location</span>
          </div>
          <h3 className="font-cinema text-2xl font-bold text-white">
            Babu Cinemas, Uthiramerur, Kanchipuram
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Babu Cinemas, Uthiramerur, Kanchipuram, Tamil Nadu, India. Conveniently situated with easy transit access and dedicated multi-level parking.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              window.open(
                'https://maps.google.com/?q=Babu+Cinemas,+Uthiramerur,+Kanchipuram,+Tamil+Nadu',
                '_blank',
                'noopener,noreferrer'
              );
            }}
            className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg shadow-amber-950/40 focus:outline-none"
          >
            <Navigation className="w-4 h-4" />
            <span>GET DIRECTIONS ON GOOGLE MAPS</span>
          </button>
          <button
            onClick={() => {
              setCurrentView('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-white/15 transition-all focus:outline-none"
          >
            <span>CONTACT BOX OFFICE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
