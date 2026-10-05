'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface NagadDirectModalProps {
  amount: number;
  invoiceRef: string;
  onSuccess: (trxId: string, accountNum: string) => void;
  onClose: () => void;
}

export const NagadDirectModal: React.FC<NagadDirectModalProps> = ({
  amount,
  invoiceRef,
  onSuccess,
  onClose
}) => {
  const [step, setStep] = useState<'account' | 'otp' | 'pin' | 'processing' | 'success'>('account');
  const [accountNumber, setAccountNumber] = useState('');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTrxId, setGeneratedTrxId] = useState('');

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!accountNumber || accountNumber.length < 11) {
      setError('সঠিক ১১ ডিজিটের নগদ অ্যাকাউন্ট নম্বর দিন (e.g. 01912345678)');
      return;
    }
    setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length < 4) {
      setError('সঠিক ৪-৬ ডিজিটের নগদ ভেরিফিকেশন কোড দিন');
      return;
    }
    setStep('pin');
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!pin || pin.length < 4) {
      setError('নগদ পিন নম্বর দিন');
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
          provider: 'Nagad',
          amount,
          accountNumber,
          otp,
          pin,
          invoiceRef
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.statusMessage || 'Nagad Payment failed');
      }

      setGeneratedTrxId(data.trxID || `NG${Math.floor(100000000 + Math.random() * 900000000)}N`);
      setStep('success');

      setTimeout(() => {
        onSuccess(data.trxID || generatedTrxId, accountNumber);
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'নগদ পেমেন্ট সম্পন্ন করতে ব্যর্থ হয়েছে');
      setStep('pin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-orange-100 flex flex-col relative">
        {/* Nagad Official Header Banner */}
        <div className="bg-linear-to-r from-orange-600 to-red-600 text-white p-4 flex items-center justify-between relative shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80"
                alt="Nagad Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight leading-tight">Nagad Merchant Payment</h3>
              <p className="text-[10px] text-orange-100 font-medium">ডাক বিভাগের ডিজিটাল লেনদেন</p>
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
        <div className="bg-orange-50/80 px-4 py-2.5 border-b border-orange-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-orange-800 uppercase block">Merchant Shop</span>
            <span className="font-extrabold text-gray-900">QUATRO BD Marketplace</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-orange-800 uppercase block">Total Payable</span>
            <span className="font-black text-sm text-orange-600">৳{amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs font-semibold px-4 py-2 border-b border-red-200">
            ⚠️ {error}
          </div>
        )}

        {/* Body */}
        <div className="p-5">
          {step === 'account' && (
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  আপনার নগদ ওয়ালেট নম্বর (Nagad Account Number)
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 019XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono font-bold text-sm outline-none"
                  autoFocus
                />
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
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-97 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <span>পরবর্তী (Proceed)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 text-xs text-gray-700">
                <p>
                  <strong>{accountNumber}</strong> ওয়ালেটে একটি নগদ ভেরিফিকেশন কোড পাঠানো হয়েছে।
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  ভেরিফিকেশন কোড (OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 font-mono font-bold text-center tracking-widest text-base outline-none"
                  autoFocus
                />
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
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-97 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
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
                  আপনার নগদ পিন নম্বর (Enter Nagad PIN)
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 font-mono font-bold text-center tracking-widest text-lg outline-none"
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
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-97 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>পেমেন্ট করুন (Pay Now)</span>}
                </button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
              <p className="font-extrabold text-sm text-gray-800">নগদ পেমেন্ট প্রক্রিয়াজাত হচ্ছে...</p>
              <p className="text-xs text-gray-500">অনুগ্রহ করে অপেক্ষা করুন</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-black text-base text-gray-900">নগদ পেমেন্ট সফল হয়েছে!</h4>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 w-full text-xs space-y-1">
                <p className="text-gray-500">Nagad TrxID:</p>
                <p className="font-mono font-black text-sm text-orange-600 select-all">{generatedTrxId}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-150 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured by Nagad Merchant Payment Gateway</span>
        </div>
      </div>
    </div>
  );
};
