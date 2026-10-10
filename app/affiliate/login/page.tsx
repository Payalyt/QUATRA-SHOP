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
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Zap,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';

export default function AffiliateLoginPage() {
  const router = useRouter();
  const {
    currentAffiliate,
    loginAffiliate,
    showToast,
    affiliates
  } = useMarketplace();

  const [emailOrCode, setEmailOrCode] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrCode.trim()) {
      showToast('অনুগ্রহ করে আপনার ইমেইল বা অ্যাফিলিয়েট কোড দিন', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await loginAffiliate(emailOrCode.trim(), password);
      showToast('অ্যাফিলিয়েট ড্যাশবোর্ডে স্বাগতম!', 'success');
      router.push('/affiliate/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginAffiliate('affiliate.demo@gmail.com', 'demo123');
      showToast('লগইন সফল হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...', 'success');
      router.push('/affiliate/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Demo login failed', 'error');
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
            <Link
              href="/affiliate"
              className="text-xs text-blue-200 hover:text-white transition-colors"
            >
              Program Details
            </Link>
            <Link
              href="/affiliate/signup"
              className="bg-blue-500 hover:bg-blue-400 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-2xl overflow-hidden text-gray-900 border border-blue-100 animate-in fade-in zoom-in-95 duration-200">
          {/* Blue Branded Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl mb-3 shadow-inner">
              <Coins className="w-6 h-6 text-yellow-300" />
            </div>
            <h1 className="text-xl font-black tracking-tight">Affiliate Partner Login</h1>
            <p className="text-xs text-blue-100 mt-1">
              অ্যাফিলিয়েট ড্যাশবোর্ডে লগইন করে আপনার কমিশন ও লিংক চেক করুন
            </p>
          </div>

          <div className="p-6 sm:p-7 space-y-5">
            {/* 1-Click Demo Login Banner */}
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-blue-950">দ্রুত টেস্ট লগইন (Demo)</span>
                </div>
                <p className="text-[11px] text-blue-700 mt-0.5">১-ক্লিকে তানভীর আহমেদের একাউন্টে ঢুকুন</p>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-3 py-2 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
              >
                1-Click Demo
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>ইমেইল বা অ্যাফিলিয়েট কোড (Email / Code)</span>
                </label>
                <input
                  type="text"
                  required
                  value={emailOrCode}
                  onChange={(e) => setEmailOrCode(e.target.value)}
                  placeholder="e.g. affiliate.demo@gmail.com বা AFF-DEMO2026"
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>পাসওয়ার্ড (Password)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-900 bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
                  <span>মনে রাখুন</span>
                </label>
                <span className="text-blue-600 hover:underline cursor-pointer">পাসওয়ার্ড ভুলে গেছেন?</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন (Log In)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 text-center border-t border-gray-100">
              <p className="text-xs text-gray-600">
                নতুন অ্যাফিলিয়েট পার্টনার হতে চান?{' '}
                <Link
                  href="/affiliate/signup"
                  className="font-black text-blue-600 hover:text-blue-800 transition-colors"
                >
                  এখনই ফ্রি সাইন আপ করুন
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Blue theme feature strip */}
      <footer className="py-4 text-center text-xs text-blue-200/80 border-t border-blue-800/40">
        <p>© 2026 QUATRO Marketplace Ltd · Official Affiliate Partner Program</p>
      </footer>
    </div>
  );
}
