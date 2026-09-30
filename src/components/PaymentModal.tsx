import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  CheckCircle2,
  Clock,
  Lock,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { useCinema } from '../context/CinemaContext';

type PaymentTab = 'upi' | 'credit' | 'debit' | 'netbanking' | 'wallet';

export const PaymentModal: React.FC = () => {
  const {
    selectedMovie,
    selectedDate,
    selectedShowtime,
    selectedSeats,
    getPricingSummary,
    completeBooking,
    setCurrentView,
    currentUser,
  } = useCinema();

  const pricing = getPricingSummary();

  const [activeTab, setActiveTab] = useState<PaymentTab>('upi');
  const [upiOption, setUpiOption] = useState<'qr' | 'id'>('qr');
  const [upiId, setUpiId] = useState('');
  
  // Card Details state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Vel Shakthi');

  // Net Banking & Wallet state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  // Processing state simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');

  // 10-minute hold timer
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePay = () => {
    setIsProcessing(true);
    setProcessStep('Connecting to secure banking gateway...');

    setTimeout(() => {
      setProcessStep('Verifying payment credentials & authorization...');
    }, 1000);

    setTimeout(() => {
      setProcessStep('Securing your theatre seat reservation...');
    }, 2000);

    setTimeout(() => {
      let methodLabel = 'UPI (Instant)';
      if (activeTab === 'credit') methodLabel = 'Credit Card (•••• 8892)';
      else if (activeTab === 'debit') methodLabel = 'Debit Card (•••• 8892)';
      else if (activeTab === 'netbanking') methodLabel = `Net Banking (${selectedBank})`;
      else if (activeTab === 'wallet') methodLabel = `Wallet (${selectedWallet})`;
      else if (activeTab === 'upi') methodLabel = upiOption === 'qr' ? 'UPI (QR Code)' : `UPI (${upiId || 'babu@upi'})`;

      completeBooking(methodLabel, {
        name: cardHolder || currentUser?.name || 'Valued Cinema Guest',
        email: currentUser?.email || 'guest@babutheatre.com',
        phone: currentUser?.phone || '+91 98400 12345',
      });
      setIsProcessing(false);
    }, 3200);
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('summary')}
        disabled={isProcessing}
        className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-6 transition-colors focus:outline-none disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Summary</span>
      </button>

      {/* Header and Countdown timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-cinema text-3xl font-extrabold text-white">
            Secure Demo Checkout
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Payment for Babu Theatre · {selectedMovie?.title} ({selectedSeats.length} seats)
          </p>
        </div>

        {/* Seat Hold Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs">
          <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>Seats held for: </span>
          <span className="font-mono font-bold text-amber-200">{formatTimer(timeLeft)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Payment Methods (Left 8 cols) */}
        <div className="md:col-span-8 space-y-6">
          {/* Method selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              onClick={() => setActiveTab('upi')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 focus:outline-none ${
                activeTab === 'upi'
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>UPI / QR</span>
            </button>

            <button
              onClick={() => setActiveTab('credit')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 focus:outline-none ${
                activeTab === 'credit'
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Credit Card</span>
            </button>

            <button
              onClick={() => setActiveTab('debit')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 focus:outline-none ${
                activeTab === 'debit'
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Debit Card</span>
            </button>

            <button
              onClick={() => setActiveTab('netbanking')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 focus:outline-none ${
                activeTab === 'netbanking'
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Net Banking</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 focus:outline-none ${
                activeTab === 'wallet'
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/60'
                  : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Wallets</span>
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="p-6 rounded-2xl bg-[#10121a] border border-white/10 shadow-xl min-h-[300px]">
            {/* UPI Tab */}
            {activeTab === 'upi' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <button
                    onClick={() => setUpiOption('qr')}
                    className={`text-xs font-semibold pb-1 border-b-2 transition-colors focus:outline-none ${
                      upiOption === 'qr'
                        ? 'border-amber-400 text-amber-400'
                        : 'border-transparent text-zinc-400 hover:text-white'
                    }`}
                  >
                    Scan QR Code (GPay, PhonePe, Paytm)
                  </button>
                  <button
                    onClick={() => setUpiOption('id')}
                    className={`text-xs font-semibold pb-1 border-b-2 transition-colors focus:outline-none ${
                      upiOption === 'id'
                        ? 'border-amber-400 text-amber-400'
                        : 'border-transparent text-zinc-400 hover:text-white'
                    }`}
                  >
                    Enter UPI ID / VPA
                  </button>
                </div>

                {upiOption === 'qr' ? (
                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-center text-center sm:text-left py-2">
                    {/* Simulated Authentic Cinema QR Code */}
                    <div className="p-4 bg-white rounded-2xl shadow-xl border-4 border-amber-400/80 inline-block">
                      <div className="w-36 h-36 relative flex items-center justify-center bg-zinc-950 p-2 rounded-lg">
                        <QrCode className="w-full h-full text-white" />
                        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-cinema text-[10px] font-black shadow-md">
                          BT
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-800 font-bold block mt-1.5 text-center">
                        BABU THEATRE UPI
                      </span>
                    </div>

                    <div className="space-y-2 max-w-xs">
                      <h4 className="text-sm font-bold text-white">Scan and Pay ₹{pricing.grandTotal}</h4>
                      <p className="text-xs text-zinc-400">
                        Open Google Pay, PhonePe, Paytm, or any BHIM UPI app on your smartphone to scan this QR code.
                      </p>
                      <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300">
                          Google Pay
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300">
                          PhonePe
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300">
                          Paytm
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-sm py-4">
                    <div>
                      <label className="text-xs text-zinc-300 mb-1 block">Your UPI ID / VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. yourname@okhdfcbank"
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      A payment request of ₹{pricing.grandTotal} will be sent to your UPI app.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Credit / Debit Card Tabs */}
            {(activeTab === 'credit' || activeTab === 'debit') && (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs text-zinc-300 mb-1 block">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 0000 0000 8892"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                    />
                    <CreditCard className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-300 mb-1 block">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-300 mb-1 block">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-300 mb-1 block">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Name as printed on card"
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            )}

            {/* Net Banking Tab */}
            {activeTab === 'netbanking' && (
              <div className="space-y-4">
                <span className="text-xs text-zinc-300 block mb-2 font-medium">Select Your Bank:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Canara Bank'].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                          selectedBank === bank
                            ? 'bg-red-950/60 border-red-500 text-white'
                            : 'bg-zinc-900 border-white/10 text-zinc-300 hover:border-white/30'
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <div className="space-y-4">
                <span className="text-xs text-zinc-300 block mb-2 font-medium">Choose Digital Wallet:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet', 'Mobikwik'].map((wallet) => (
                    <button
                      key={wallet}
                      type="button"
                      onClick={() => setSelectedWallet(wallet)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                        selectedWallet === wallet
                          ? 'bg-red-950/60 border-red-500 text-white'
                          : 'bg-zinc-900 border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      <span>{wallet}</span>
                      {selectedWallet === wallet && <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pay Button & Simulator */}
          <div className="pt-2">
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl text-base font-bold tracking-wider text-white bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-xl shadow-red-950/80 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 focus:outline-none disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{processStep || 'Processing Demo Payment...'}</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>PAY NOW · ₹{pricing.grandTotal}</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-zinc-500 mt-2">
              Demo Transaction Simulator · No real funds will be charged
            </p>
          </div>
        </div>

        {/* Mini Order Summary (Right 4 cols) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-[#10121a] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">
            Order Review
          </h3>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-white">{selectedMovie?.title}</div>
            <div className="text-zinc-400">{selectedShowtime?.screenName}</div>
            <div className="text-zinc-400">
              {selectedDate} · {selectedShowtime?.time}
            </div>
            <div className="text-amber-400 font-mono font-medium">
              Seats: {selectedSeats.map((s) => s.id).join(', ')}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Tickets ({selectedSeats.length})</span>
              <span className="font-mono text-zinc-300">₹{pricing.ticketTotal}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Convenience Fee</span>
              <span className="font-mono text-zinc-300">₹{pricing.convenienceFee}</span>
            </div>
            {pricing.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span className="font-mono">- ₹{pricing.discountAmount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="font-mono text-amber-400">₹{pricing.grandTotal}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 text-[11px] text-zinc-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Digital E-ticket with verified entry QR will be issued immediately upon payment.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
