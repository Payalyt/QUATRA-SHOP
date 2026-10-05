'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Loader2, Smartphone, Lock } from 'lucide-react';

interface BkashModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: () => void;
}

export const BkashModal: React.FC<BkashModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess
}) => {
  const [step, setStep] = useState<'number' | 'otp' | 'pin' | 'processing'>('number');
  const [phone, setPhone] = useState('01712345678');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      setError('Please enter a valid 11-digit bKash account number');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the verification code sent to your phone');
      return;
    }
    setError('');
    setStep('pin');
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setError('Please enter your 5-digit bKash PIN');
      return;
    }
    setError('');
    setStep('processing');

    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-[420px] w-full overflow-hidden border border-pink-200">
        {/* bKash Header */}
        <div className="bg-[#e2136e] text-white p-4 relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-[#e2136e] flex items-center justify-center font-black text-sm">
              ৳
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">bKash Payment</h3>
              <p className="text-[11px] text-pink-100">Merchant: QUATRO Marketplace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-pink-700/50 hover:bg-pink-800 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Summary */}
        <div className="bg-pink-50/70 px-4 py-2.5 border-b border-pink-100 flex items-center justify-between text-xs">
          <span className="text-gray-600 font-medium">Invoice Amount:</span>
          <span className="text-base font-black text-[#e2136e] tabular-nums">
            ৳{amount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {error && (
            <div className="mb-3 p-2 text-xs bg-red-50 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}

          {step === 'number' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Your bKash Account Number:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full text-sm py-2 pl-9 pr-3 rounded border border-gray-300 focus:border-[#e2136e] outline-none font-medium"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  By clicking Confirm, you agree to the Terms &amp; Conditions.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#e2136e] hover:bg-[#c20f5c] rounded shadow-md"
                >
                  Confirm
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Enter 6-digit Verification Code (OTP):
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full text-center tracking-widest text-lg font-bold py-2 rounded border border-gray-300 focus:border-[#e2136e] outline-none"
                  autoFocus
                />
                <p className="text-[11px] text-gray-500 mt-1 text-center">
                  Verification code sent to {phone} (Demo code: 123456)
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('number')}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#e2136e] hover:bg-[#c20f5c] rounded shadow-md"
                >
                  Verify OTP
                </button>
              </div>
            </form>
          )}

          {step === 'pin' && (
            <form onSubmit={handleConfirmPin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Enter 5-digit bKash PIN:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="•••••"
                    maxLength={5}
                    className="w-full text-center tracking-widest text-lg font-bold py-2 rounded border border-gray-300 focus:border-[#e2136e] outline-none"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1 text-center">
                  Never share your bKash PIN with anyone. (Any 5 digits for demo)
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#e2136e] hover:bg-[#c20f5c] rounded shadow-md"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-[#e2136e] mx-auto" />
              <p className="font-bold text-sm text-gray-800">Processing bKash Transaction...</p>
              <p className="text-xs text-gray-500">Please do not refresh or close this window.</p>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 text-center flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit SSL Encrypted Secure bKash Gateway</span>
        </div>
      </div>
    </div>
  );
};
