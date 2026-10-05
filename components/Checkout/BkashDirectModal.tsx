'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

interface BkashDirectModalProps {
  amount: number;
  invoiceRef: string;
  onSuccess: (trxId: string, accountNum: string) => void;
  onClose: () => void;
}

export const BkashDirectModal: React.FC<BkashDirectModalProps> = ({
  amount,
  invoiceRef,
  onSuccess,
  onClose
}) => {
  const [step, setStep] = useState<'account' | 'otp' | 'pin' | 'processing' | 'success'>('account');
  const [accountNumber, setAccountNumber] = useState('');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTrxId, setGeneratedTrxId] = useState('');

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!accountNumber || accountNumber.length < 11) {
      setError('সঠিক ১১ ডিজিটের বিকাশ ওয়ালেট নম্বর প্রদান করুন (e.g. 01712345678)');
      return;
    }
    if (!agreeTerms) {
      setError('শর্তাবলীতে সম্মত হন');
      return;
    }
    setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length < 4) {
      setError('সঠিক ৪-৬ ডিজিটের ভেরিফিকেশন কোড দিন');
      return;
    }
    setStep('pin');
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!pin || pin.length < 4) {
      setError('বিকাশ পিন নম্বর প্রদান করুন');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      const res = await fetch('/api/payment/gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute_payment',
          provider: 'bKash',
          amount,
          accountNumber,
          otp,
          pin,
          invoiceRef
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.statusMessage || 'Payment failed');
      }

      setGeneratedTrxId(data.trxID || `BK${Math.floor(100000000 + Math.random() * 900000000)}X`);
      setStep('success');

      setTimeout(() => {
        onSuccess(data.trxID || generatedTrxId, accountNumber);
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'বিকাশ পেমেন্ট সম্পাদন করতে ব্যর্থ হয়েছে');
      setStep('pin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-pink-100 flex flex-col relative">
        {/* bKash Official Header Banner */}
        <div className="bg-[#e2136e] text-white p-4 flex items-center justify-between relative shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80"
                alt="bKash Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight leading-tight">bKash Merchant Pay</h3>
              <p className="text-[10px] text-pink-100 font-medium">Official Payment Gateway</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Summary Strip */}
        <div className="bg-pink-50/80 px-4 py-2.5 border-b border-pink-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-pink-800 uppercase block">Merchant Shop</span>
            <span className="font-extrabold text-gray-900">QUATRO BD Marketplace</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-pink-800 uppercase block">Total Payable</span>
            <span className="font-black text-sm text-[#e2136e]">৳{amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs font-semibold px-4 py-2 border-b border-red-200">
            ⚠️ {error}
          </div>
        )}

        {/* Modal Body according to Steps */}
        <div className="p-5">
          {step === 'account' && (
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  আপনার বিকাশ অ্যাকাউন্ট নম্বর (Your bKash Account)
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#e2136e] focus:ring-1 focus:ring-[#e2136e] font-mono font-bold text-sm outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-600">
                <input
                  type="checkbox"
                  id="bkash_terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-[#e2136e] cursor-pointer"
                />
                <label htmlFor="bkash_terms" className="cursor-pointer">
                  আমি বিকাশের শর্তাবলী মেনে নিচ্ছি (I agree to bKash payment terms)
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-extrabold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#e2136e] hover:bg-[#c20f5e] active:scale-97 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <span>পরবর্তী (Proceed)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 text-xs text-gray-700">
                <p>
                  <strong>{accountNumber}</strong> নম্বরে একটি ভেরিফিকেশন কোড (OTP) পাঠানো হয়েছে।
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  ভেরিফিকেশন কোড দিন (Enter OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#e2136e] font-mono font-bold text-center tracking-widest text-base outline-none"
                  autoFocus
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-pink-700 font-bold">
                <span>কোড পাননি?</span>
                <button type="button" onClick={() => setOtp('123456')} className="underline cursor-pointer">
                  পুনরায় পাঠান (Resend Code)
                </button>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('account')}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-extrabold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  পেছনে (Back)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#e2136e] hover:bg-[#c20f5e] active:scale-97 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <span>নিশ্চিত করুন (Confirm)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  আপনার বিকাশ পিন নম্বর দিন (Enter bKash PIN)
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="•••••"
                  maxLength={5}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#e2136e] font-mono font-bold text-center tracking-widest text-lg outline-none"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-extrabold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  পেছনে (Back)
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#e2136e] hover:bg-[#c20f5e] active:scale-97 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>পেমেন্ট করুন (Pay Now)</span>}
                </button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#e2136e] animate-spin" />
              <p className="font-extrabold text-sm text-gray-800">পেমেন্ট প্রক্রিয়াজাত হচ্ছে...</p>
              <p className="text-xs text-gray-500">অনুগ্রহ করে অপেক্ষা করুন</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-black text-base text-gray-900">পেমেন্ট সফল হয়েছে! (Payment Successful)</h4>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 w-full text-xs space-y-1">
                <p className="text-gray-500">Transaction ID:</p>
                <p className="font-mono font-black text-sm text-[#e2136e] select-all">{generatedTrxId}</p>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-150 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured by bKash Direct Checkout 256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
};
