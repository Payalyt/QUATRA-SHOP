'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { BrandLogo } from '@/components/Common/BrandLogo';
import {
  Coins,
  Lock,
  Mail,
  User,
  Phone,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Zap,
  TrendingUp,
  Gift
} from 'lucide-react';

export default function AffiliateSignupPage() {
  const router = useRouter();
  const {
    registerAffiliate,
    showToast
  } = useMarketplace();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !password || !payoutAccount.trim()) {
      showToast('অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await registerAffiliate({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
        payoutMethod,
        payoutAccount: payoutAccount.trim()
      });
      showToast('অভিনন্দন! আপনার অ্যাফিলিয়েট অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
      router.push('/affiliate/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 flex flex-col text-white">
      {/* Top Bar */}
      <header className="border-b border-blue-700/60 bg-blue-950/40 backdrop-blur-md px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo />
            <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Affiliate Program
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-blue-200 hidden sm:inline">ইতিমধ্যেই অ্যাকাউন্ট আছে?</span>
            <Link
              href="/affiliate/login"
              className="bg-blue-500/30 hover:bg-blue-500/50 border border-blue-400/40 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
            >
              Login Here
            </Link>
          </div>
        </div>
      </header>

      {/* Main Registration Box */}
      <main className="flex-1 flex items-center justify-center p-4 py-10">
        <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden text-gray-900 border border-blue-100 animate-in fade-in zoom-in-95 duration-200">
          {/* Blue Theme Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-7 text-white text-center relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl mb-3 shadow-inner">
              <Gift className="w-6 h-6 text-yellow-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Create Affiliate Account</h1>
            <p className="text-xs text-blue-100 mt-1">
              প্রোডাক্ট শেয়ার করুন এবং প্রতিটি সফল ডেলিভারিতে অর্জন করুন <span className="font-bold text-yellow-300">১০% পর্যন্ত কমিশন</span>
            </p>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/15 text-[11px]">
              <div className="bg-white/10 rounded-xl p-1.5">
                <span className="font-extrabold block text-yellow-300">১০% কমিশন</span>
                <span className="text-[9.5px] text-blue-100">প্রতিটি সেলসে</span>
              </div>
              <div className="bg-white/10 rounded-xl p-1.5">
                <span className="font-extrabold block text-yellow-300">১৫ দিন পর পর</span>
                <span className="text-[9.5px] text-blue-100">উইথড্র সুবিধা</span>
              </div>
              <div className="bg-white/10 rounded-xl p-1.5">
                <span className="font-extrabold block text-yellow-300">bKash / Nagad</span>
                <span className="text-[9.5px] text-blue-100">সরাসরি পেমেন্ট</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>আপনার পুরো নাম (Full Name) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>মোবাইল নম্বর (Phone) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 bg-gray-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>ইমেইল (Email) *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 bg-gray-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>পাসওয়ার্ড (Password) *</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-2xl space-y-3">
                <span className="font-black text-blue-950 text-xs flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>পেমেন্ট উইথড্রয়াল সেটআপ (১৫ দিন পর পর উইথড্র)</span>
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1 text-[11px]">পেমেন্ট মাধ্যম</label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value as any)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 bg-white font-bold text-gray-800"
                    >
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="Bank">Bank Transfer (ব্যাংক)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1 text-[11px]">একাউন্ট বা ওয়ালেট নম্বর *</label>
                    <input
                      type="text"
                      required
                      value={payoutAccount}
                      onChange={(e) => setPayoutAccount(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 font-bold text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাফিলিয়েট রেজিস্ট্রেশন সম্পন্ন করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="pt-2 text-center border-t border-gray-100">
              <p className="text-xs text-gray-600">
                ইতিমধ্যেই অ্যাকাউন্ট তৈরি করেছেন?{' '}
                <Link
                  href="/affiliate/login"
                  className="font-black text-blue-600 hover:text-blue-800 transition-colors"
                >
                  লগইন করুন
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-blue-200/80 border-t border-blue-800/40">
        <p>© 2026 QUATRO Marketplace Ltd · Official Affiliate Partner Program</p>
      </footer>
    </div>
  );
}
