import React, { useState } from 'react';
import { Film, Search, User, Menu, X, Ticket, ShieldCheck, LogOut, MapPin } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';
import { AppView } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsSearchOpen,
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    bookings,
  } = useCinema();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { label: string; view: AppView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Movies', view: 'movies' },
    { label: 'Show Timings', view: 'showtimes' },
    { label: 'Theatre', view: 'theatre' },
    { label: 'Offers', view: 'offers' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090c]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform duration-200">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-cinema text-xl sm:text-2xl font-black tracking-wider text-white group-hover:text-red-500 transition-colors">
              BABU CINEMAS
            </span>
            <span className="hidden sm:block text-[10px] tracking-widest text-amber-400/80 font-medium uppercase">
              Uthiramerur, Kanchipuram · 4K Laser & Dolby Atmos
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`text-sm font-medium tracking-wide transition-all relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-red-500 font-semibold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Search, My Bookings, User Auth, Admin) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search movies"
            className="p-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* My Bookings link */}
          <button
            onClick={() => handleNavClick('my-bookings')}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              currentView === 'my-bookings'
                ? 'bg-red-950/60 border-red-600/60 text-red-300'
                : 'bg-zinc-900/80 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span>My Bookings</span>
            {activeBookingsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-mono">
                {activeBookingsCount}
              </span>
            )}
          </button>

          {/* User Account / Login */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/25 transition-colors focus:outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-zinc-200 hidden md:inline-block max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{currentUser.email}</p>
                    {currentUser.role === 'admin' && (
                      <span className="mt-1 inline-block text-[10px] font-mono text-amber-400 font-semibold">
                        Role: Cinema Administrator
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleNavClick('my-bookings')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-white/5 flex items-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span>My Bookings ({activeBookingsCount})</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-amber-950/30 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Dashboard</span>
                  </button>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg shadow-md shadow-red-900/30 transition-all focus:outline-none whitespace-nowrap"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="lg:hidden p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0c0d12]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          <div className="px-3 py-1.5 mb-2 rounded-lg bg-zinc-900 border border-white/5 flex items-center gap-2 text-[11px] text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>Uthiramerur, Kanchipuram, Tamil Nadu</span>
          </div>
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white font-semibold'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={() => handleNavClick('my-bookings')}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-white/5 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Ticket className="w-4 h-4" /> My Bookings
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-800 text-zinc-200">
                {activeBookingsCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-amber-300 hover:bg-amber-950/30 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Dashboard
            </button>

            {!currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full text-center mt-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
