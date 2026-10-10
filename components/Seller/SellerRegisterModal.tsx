'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { PayoutMethod } from '@/lib/types/ecommerce';
import {
  X,
  Store,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles
} from 'lucide-react';

export const SellerRegisterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { sellerRegister, showToast } = useMarketplace();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [shopName, setShopName] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [nidTradeLicense, setNidTradeLicense] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('bKash');
  const [payoutAccount, setPayoutAccount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shopName || !name || !phone || !email || !password || !shopAddress) {
      setError('অনুগ্রহ করে সব প্রয়োজনীয় ঘর পূরণ করুন (Please fill in all required fields).');
      return;
    }

    if (password.trim().length < 6) {
      setError('পাসওয়ার্ড অত্যন্ত ছোট! নিরাপত্তাজনিত কারণে কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন (Password must be at least 6 characters).');
      return;
    }

    setLoading(true);
    try {
      const registered = await sellerRegister({
        name,
        shopName,
        phone,
        email,
        password,
        shopAddress,
        nidTradeLicense,
        payoutMethod,
        payoutAccount: payoutAccount || phone
      });

      const sId = registered?.sellerIdNumber || 'QA-SL-XXXXXXXX';
      showToast(`🎉 Seller Registration submitted! Your Seller ID is: ${sId}`, 'success');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0284c7] via-sky-600 to-[#0369a1] text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white font-black border border-white/30 shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">Start Selling on QUATRO</h3>
              <p className="text-xs text-sky-100 font-medium">Join 15,000+ top Bangladeshi merchants today</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="bg-sky-50/70 border-b border-sky-100 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-gray-700 shrink-0">
          <div className="flex items-center gap-2 text-[#0284c7]">
            <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-extrabold">1</span>
            <span>Shop & Owner Information</span>
          </div>
          <div className="h-0.5 bg-sky-200 flex-1 mx-3 rounded" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#0284c7]' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${step === 2 ? 'bg-[#0284c7] text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
            <span>Payout & Document Verification</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Shop / Store Name *</label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Apex Electronics & Fashion"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Owner Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Md. Rayhan Hossain"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone Number (WhatsApp) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seller@yourdomain.com"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Account Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password (6+ chars)"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Shop / Warehouse Address *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    required
                    rows={2}
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    placeholder="Shop #, Level, Market Name, Thana, District"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!shopName || !name || !phone || !email || !password || !shopAddress) {
                    setError('Please fill in all step 1 fields before proceeding.');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
                className="w-full py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                <span>Continue to Step 2 (Payout & Verification)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Preferred Weekly Payout Method *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Bank'] as PayoutMethod[]).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPayoutMethod(m)}
                      className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        payoutMethod === m
                          ? 'border-[#0284c7] bg-sky-50 text-[#0284c7] shadow-2xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {payoutMethod === 'Bank' ? 'Bank Account Number & Branch Details *' : `${payoutMethod} Personal / Agent Number *`}
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    placeholder={payoutMethod === 'Bank' ? 'Dutch-Bangla Bank, Dhanmondi Branch, A/C: 104.120.3948' : '017XXXXXXXX'}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">NID Number / Trade License (Optional)</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nidTradeLicense}
                    onChange={(e) => setNidTradeLicense(e.target.value)}
                    placeholder="National ID (10/13/17 digits) or Trade License #"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none transition-all font-medium"
                  />
                </div>
                <p className="text-[10.5px] text-gray-400 mt-1">Providing document info speeds up your Admin approval time!</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Merchant Agreement & Status:</span>
                </p>
                <p>New sellers are created in <strong>PENDING</strong> status. Our admin team verifies credentials within 2-6 hours. You can log into your seller center immediately to preview your store setup.</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] disabled:bg-gray-300 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {loading ? (
                    <span>Creating Seller Account...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Seller Registration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
