import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Navigation,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Ticket Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    try {
      await api.submitContactMessage(formData);
    } catch (err) {
      console.warn('Backend message submission error:', err);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Ticket Inquiry',
        message: '',
      });
    }, 4000);
  };

  const handleGetDirections = () => {
    window.open(
      'https://maps.google.com/?q=Babu+Cinemas,+Uthiramerur,+Kanchipuram,+Tamil+Nadu',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
          <MapPin className="w-4 h-4" />
          <span>Connect with Babu Cinemas</span>
        </div>
        <h1 className="font-cinema text-3xl sm:text-4xl font-extrabold text-white">
          Contact Us & Location
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Have questions about group bookings, corporate shows, or cinema facilities? We’re always here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#10121a] border border-white/10 shadow-xl space-y-6">
          <h2 className="font-cinema text-xl font-bold text-white">
            Send a Direct Message
          </h2>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Message Received!</h3>
              <p className="text-xs text-zinc-300">
                Thank you for contacting Babu Cinemas. Our customer desk will respond within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-300 mb-1.5 block font-medium">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-300 mb-1.5 block font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-300 mb-1.5 block font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98400 12345"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-300 mb-1.5 block font-medium">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Ticket Inquiry">Ticket Inquiry & Reservation</option>
                  <option value="Bulk Booking">Bulk / School / Corporate Booking</option>
                  <option value="Food & Beverages">Concession & Canteen Feedback</option>
                  <option value="Technical Experience">Sound & Projection Experience</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-300 mb-1.5 block font-medium">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our theatre staff assist you today?"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950/60 transition-all flex items-center justify-center gap-2 focus:outline-none"
              >
                <Send className="w-4 h-4" />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          )}
        </div>

        {/* Theatre Information & Directions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#10121a] border border-white/10 shadow-xl space-y-6">
            <h2 className="font-cinema text-xl font-bold text-white border-b border-white/10 pb-3">
              Theatre Information
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block text-sm">BABU CINEMAS</span>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Babu Cinemas, Uthiramerur, Kanchipuram, Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Box Office Helpline</span>
                  <p className="text-zinc-400 mt-0.5 font-mono">+91 98400 12345 / +91 4175 222333</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-400/20 text-blue-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Email Desk</span>
                  <p className="text-zinc-400 mt-0.5">support@babucinemas.com · bookings@babucinemas.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-400/20 text-emerald-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white block">Operating Hours</span>
                  <p className="text-zinc-400 mt-0.5">
                    Box Office: 09:00 AM – 11:00 PM Daily<br />
                    Shows run 10:00 AM through 01:00 AM (Midnight shows on release days)
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Visual Representation & Embedded Map */}
            <div className="pt-2 space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group shadow-lg">
                <iframe
                  title="Babu Cinemas Location Map - Uthiramerur, Kanchipuram"
                  src="https://maps.google.com/maps?q=Babu+Cinemas+Uthiramerur+Kanchipuram+Tamil+Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter contrast-125 opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <button
                onClick={handleGetDirections}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wider text-zinc-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all focus:outline-none"
              >
                <Navigation className="w-4 h-4" />
                <span>OPEN DIRECTIONS IN GOOGLE MAPS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
