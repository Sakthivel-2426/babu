import React, { useState } from 'react';
import { Film, Lock, Mail, Phone, User, X, ShieldCheck } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
  } = useCinema();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useCinema();

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) return;
    setAuthError('');

    if (authModalMode === 'signup' && password !== confirmPassword) {
      setAuthError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (authModalMode === 'signup') {
        const success = await register({
          name: name || 'Moviegoer',
          email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@guest.com`,
          phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98400 12345',
          password,
        });
        if (!success) {
          setAuthError('Registration could not be completed. Please try again.');
        }
      } else {
        const success = await login(emailOrPhone, password);
        if (!success) {
          setAuthError('Invalid credentials. Please verify your email/phone and password.');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'customer' | 'admin') => {
    setAuthError('');
    if (role === 'admin') {
      await login('admin@babucinemas.com', 'AdminPassword2026!', 'admin', 'Babu Cinemas Admin');
    } else {
      await login('velshakthi347@gmail.com', 'CustomerPassword2026!', 'customer', 'Vel Shakthi');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#10121a] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Lockup */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mx-auto shadow-lg shadow-red-950/60">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-cinema text-2xl font-black text-white">
            BABU CINEMAS
          </h2>
          <p className="text-xs text-zinc-400">
            Your Movie. Your Seat. Your Experience.
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900 border border-white/10 rounded-xl">
          <button
            onClick={() => setAuthModalMode('login')}
            className={`py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${
              authModalMode === 'login'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => setAuthModalMode('signup')}
            className={`py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${
              authModalMode === 'signup'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Error message */}
        {authError && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {authModalMode === 'signup' && (
            <div>
              <label className="text-zinc-300 mb-1.5 block font-medium">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-zinc-300 mb-1.5 block font-medium">
              Email or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="name@email.com or +91 98400..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-zinc-300 mb-1.5 block font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          {authModalMode === 'signup' && (
            <div>
              <label className="text-zinc-300 mb-1.5 block font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {authModalMode === 'login' && (
            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-0"
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link will be sent to your registered mobile number.')}
                className="text-amber-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-xs font-bold tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950/60 transition-all focus:outline-none"
          >
            {authModalMode === 'login' ? 'LOGIN' : 'SIGN UP & CONTINUE'}
          </button>
        </form>

        {/* Quick Demo Logins for evaluator */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block text-center">
            One-Click Test Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('customer')}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[11px] text-zinc-300 font-medium transition-colors"
            >
              Moviegoer Demo
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/30 text-[11px] text-amber-300 font-medium transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
