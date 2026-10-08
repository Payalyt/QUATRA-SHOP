'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { BrandLogo } from '@/components/Common/BrandLogo';
import {
  Coins,
  TrendingUp,
  Share2,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Zap,
  MousePointerClick,
  ShoppingBag,
  CreditCard,
  Percent,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Users,
  Clock,
  Lock,
  Phone,
  Mail,
  User,
  Check,
  MessageCircle,
  CalendarCheck
} from 'lucide-react';

export default function AffiliateLandingPage() {
  const router = useRouter();
  const {
    user,
    currentAffiliate,
    setCurrentAffiliate,
    affiliates,
    registerAffiliate,
    loginAffiliate,
    upgradeCustomerToAffiliate,
    products,
    generateAffiliateLink,
    formatPrice,
    showToast
  } = useMarketplace();

  // Auth Modal State (Blue Color Theme)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');

  // Signup fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login fields
  const [loginEmailOrCode, setLoginEmailOrCode] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Commission Calculator State
  const [monthlySalesEst, setMonthlySalesEst] = useState(50000); // 50,000 BDT
  const estEarnings = Math.round(monthlySalesEst * 0.10); // 10%

  // Handle Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !password || !payoutAccount.trim()) {
      showToast('অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerAffiliate({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
        payoutMethod,
        payoutAccount: payoutAccount.trim()
      });
      setIsAuthModalOpen(false);
      showToast('অ্যাফিলিয়েট রেজিস্ট্রেশন সম্পন্ন হয়েছে!', 'success');
      router.push('/affiliate/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrCode.trim()) {
      showToast('অনুগ্রহ করে আপনার ইমেইল বা অ্যাফিলিয়েট কোড দিন', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginAffiliate(loginEmailOrCode.trim(), loginPassword);
      setIsAuthModalOpen(false);
      showToast('লগইন সফল হয়েছে!', 'success');
      router.push('/affiliate/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click Demo Login as Tanvir Ahmed
  const handleDemoLogin = () => {
    const demo = affiliates[0];
    if (demo) {
      setCurrentAffiliate(demo);
      showToast(`টপ অ্যাফিলিয়েট হিসেবে লগইন করা হয়েছে: ${demo.name} (${demo.code})`, 'success');
      router.push('/affiliate/dashboard');
    }
  };

  // 1-Click Upgrade customer to affiliate
  const handleUpgradeAccount = async () => {
    if (!user) {
      setAuthTab('signup');
      setIsAuthModalOpen(true);
      return;
    }

    try {
      await upgradeCustomerToAffiliate('bKash', user.phone || '01712345678');
      showToast('আপনার অ্যাকাউন্ট অ্যাফিলিয়েট পার্টনারে আপগ্রেড করা হয়েছে!', 'success');
      router.push('/affiliate/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Upgrade failed', 'error');
    }
  };

  // Quick link copy
  const handleQuickCopyLink = (productId: string) => {
    const link = generateAffiliateLink(productId);
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${link.url}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      showToast(`অ্যাফিলিয়েট লিংক কপি হয়েছে! (${link.affiliateCode})`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header - Blue Theme */}
      <header className="sticky top-0 z-40 bg-white border-b border-blue-100 shadow-xs">
        <div className="max-w-[1240px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo variant="full" size="sm" />
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs shadow-blue-500/20">
                Affiliate Partner Program
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {currentAffiliate ? (
              <Link
                href="/affiliate/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Dashboard ({currentAffiliate.code})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleDemoLogin}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  title="Test dashboard immediately with demo data"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Demo Login</span>
                </button>

                <button
                  onClick={() => {
                    setAuthTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-gray-700 hover:text-blue-600 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setAuthTab('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                >
                  Join Affiliate
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Blue Theme */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-12 md:py-16 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-blue-100 border border-white/20">
              <Coins className="w-3.5 h-3.5 text-yellow-300" />
              <span>ওয়েবসাইটে আপলোড করা সব প্রোডাক্ট থেকে ১০% কমিশন ও ১৫ দিন পর পর উইথড্র</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              অ্যাফিলিয়েট পার্টনার প্রোগ্রাম
            </h1>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              QUATRO-র অফিশিয়াল অ্যাফিলিয়েট নেটওয়ার্কে যুক্ত হয়ে যেকোনো প্রোডাক্ট শেয়ার করুন। আপনার রেফারাল লিংকের মাধ্যমে অর্ডারে পাবেন <span className="font-bold text-yellow-300">১০% নিশ্চিত কমিশন</span> এবং প্রতি <span className="font-bold text-yellow-300">১৫ দিন পর পর</span> বিকাশ, নগদ বা ব্যাংক একাউন্টে পেমেন্ট নেওয়ার পূর্ণ সুবিধা!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setAuthTab('signup');
                  setIsAuthModalOpen(true);
                }}
                className="bg-blue-500 hover:bg-blue-400 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>ফ্রি সাইন আপ করুন (Sign Up)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleDemoLogin}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-white/30 backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>১-ক্লিক ডেমো ড্যাশবোর্ড</span>
              </button>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20 max-w-lg">
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-yellow-300">১০%</div>
                <div className="text-[11px] text-blue-100">ফ্ল্যাট কমিশন</div>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-yellow-300">১৫ দিন</div>
                <div className="text-[11px] text-blue-100">উইথড্র সাইকেল</div>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-yellow-300">bKash/Nagad</div>
                <div className="text-[11px] text-blue-100">সরাসরি পেআউট</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 py-10 space-y-12">
        {/* SECTION 1: HOW IT WORKS */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[11px] font-black uppercase text-blue-600 tracking-wider">
              সহজ ৪টি ধাপ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              অ্যাফিলিয়েট প্রোগ্রাম যেভাবে কাজ করে
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              কোনো টেকনিক্যাল জ্ঞান দরকার নেই। ১ মিনিটে সাইন আপ করুন ও প্রোডাক্ট শেয়ার করে ইনকাম শুরু করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '০১',
                title: 'সাইন আপ ও একাউন্ট তৈরি',
                desc: 'ব্লু থিম সাইন আপ ফর্মের মাধ্যমে আপনার নাম, মোবাইল ও বিকাশ/নগদ একাউন্ট দিয়ে একাউন্ট তৈরি করুন।',
                icon: User,
                color: 'text-blue-600 bg-blue-50 border-blue-200'
              },
              {
                step: '০২',
                title: 'প্রোডাক্ট নির্বাচন ও লিংক জেনারেশন',
                desc: 'ড্যাশবোর্ডে সব প্রোডাক্ট স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে। যেকোনো প্রোডাক্ট সিলেক্ট করে ১-ক্লিকে অ্যাফিলিয়েট লিংক বানান।',
                icon: MousePointerClick,
                color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
              },
              {
                step: '০৩',
                title: 'সোশ্যাল মিডিয়ায় শেয়ার',
                desc: 'ফেসবুক, হোয়াটসঅ্যাপ, ইউটিউব বা ব্লগে লিংক শেয়ার করুন। ৩০ দিন পর্যন্ত কুকি ট্র্যাক করে সেলস কাউন্ট হবে।',
                icon: Share2,
                color: 'text-purple-600 bg-purple-50 border-purple-200'
              },
              {
                step: '০৪',
                title: '১০% কমিশন ও ১৫ দিন পর পর উইথড্র',
                desc: 'প্রতিটি সফল ডেলিভারিতে ১০% কমিশন পাবেন। ১৫ দিন পর পর আপনার বিকাশ বা নগদে উইথড্র রিকোয়েস্ট দিন।',
                icon: CalendarCheck,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black text-gray-300">{card.step}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-gray-900">{card.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE COMMISSION CALCULATOR */}
        <section className="bg-white rounded-2xl border border-blue-100 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-[11px] font-black uppercase text-blue-600 tracking-wider">
                কমিশন ক্যালকুলেটর (Earnings Estimator)
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                আপনার সম্ভাব্য মাসিক ইনকাম হিসাব করুন
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                আপনার অডিয়েন্স বা ফলোয়ারদের কাছে প্রোডাক্ট পৌঁছে দিয়ে প্রতি মাসে আকর্ষণীয় উপার্জন করুন।
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>মাসিক আনুমানিক সেলস ভলিউম (BDT):</span>
                  <span className="font-mono text-blue-600 text-base font-black">
                    {formatPrice(monthlySalesEst)}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={monthlySalesEst}
                  onChange={(e) => setMonthlySalesEst(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>৳১০,০০০</span>
                  <span>৳২,৫০,০০০</span>
                  <span>৳৫,০০,০০০</span>
                </div>
              </div>
            </div>

            {/* Estimated Output Card */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-2xl p-6 border border-blue-200/80 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-600 block">আপনার আনুমানিক মাসিক কমিশন:</span>
                <div className="text-4xl sm:text-5xl font-black text-blue-600">
                  {formatPrice(estEarnings)}
                </div>
                <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>১০% নিশ্চিত কমিশন ও ১৫ দিন পর পর উইথড্র সুবিধা</span>
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-blue-100 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>কমিশন রেট:</span>
                  <span className="font-bold text-gray-900">১০% (ফ্ল্যাট রেট)</span>
                </div>
                <div className="flex justify-between">
                  <span>উইথড্রয়াল সাইকেল:</span>
                  <span className="font-bold text-blue-700">১৫ দিন পর পর</span>
                </div>
                <div className="flex justify-between">
                  <span>পেমেন্ট মাধ্যম:</span>
                  <span className="font-bold text-gray-900">bKash / Nagad / Bank</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURED PRODUCTS WITH 1-CLICK LINK GENERATOR */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-black uppercase text-blue-600 tracking-wider">
                স্বয়ংক্রিয় প্রোডাক্ট ক্যাটালগ
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                ট্রেন্ডিং প্রোডাক্ট সিলেক্ট করুন ও লিংক শেয়ার করুন
              </h2>
            </div>

            <Link
              href="/affiliate/dashboard"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>ড্যাশবোর্ডে সব প্রোডাক্ট দেখুন</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {products.slice(0, 6).map((prod) => {
              const commissionEarn = Math.round(prod.price * 0.10);
              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prod.media?.[0]?.url || 'https://picsum.photos/300/300?random=1'}
                      alt={prod.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      কমিশন: ৳{commissionEarn}
                    </div>
                  </div>

                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-2">{prod.title}</h4>
                      <div className="text-sm font-black text-gray-900 mt-1">{formatPrice(prod.price)}</div>
                    </div>

                    <button
                      onClick={() => handleQuickCopyLink(prod.id)}
                      className="w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>লিংক কপি</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: UPGRADE BANNER (IF CUSTOMER LOGGED IN) */}
        {user && !currentAffiliate && (
          <section className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                ইনস্ট্যান্ট অ্যাকাউন্ট আপগ্রেড
              </span>
              <h3 className="text-xl font-black">আপনি {user.name} হিসেবে লগইন আছেন</h3>
              <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
                কোনো নতুন রেজিস্ট্রেশন ছাড়া ১-ক্লিকে আপনার কাস্টমার অ্যাকাউন্টকে অফিশিয়াল অ্যাফিলিয়েট অ্যাকাউন্টে রূপান্তর করুন!
              </p>
            </div>

            <button
              onClick={handleUpgradeAccount}
              className="bg-white text-blue-800 hover:bg-blue-50 font-black text-xs px-6 py-3 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              এখনই অ্যাফিলিয়েটে আপগ্রেড করুন
            </button>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <p>© 2026 QUATRO Marketplace Ltd · All rights reserved · Affiliate Partner Network</p>
      </footer>

      {/* ================= BLUE THEME AUTHENTICATION MODAL ================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-[460px] w-full p-5 sm:p-6 space-y-4 border border-blue-100 text-gray-900 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-base text-gray-900">
                  {authTab === 'signup' ? 'অ্যাফিলিয়েট সাইন আপ (Sign Up)' : 'অ্যাফিলিয়েট লগইন (Login)'}
                </h3>
                <p className="text-xs text-gray-500">
                  {authTab === 'signup' ? '১০% কমিশন ও ১৫ দিন পর পর উইথড্র সুবিধা' : 'আপনার ড্যাশবোর্ডে প্রবেশ করুন'}
                </p>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Tab switch - Blue Theme */}
            <div className="grid grid-cols-2 gap-1 bg-blue-50/70 p-1 rounded-xl text-xs font-bold border border-blue-100">
              <button
                onClick={() => setAuthTab('signup')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authTab === 'signup' ? 'bg-blue-600 text-white shadow-xs font-black' : 'text-blue-900 hover:text-blue-700'
                }`}
              >
                সাইন আপ (Sign Up)
              </button>
              <button
                onClick={() => setAuthTab('login')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authTab === 'login' ? 'bg-blue-600 text-white shadow-xs font-black' : 'text-blue-900 hover:text-blue-700'
                }`}
              >
                লগইন (Login)
              </button>
            </div>

            {/* Quick Demo Login Option */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-xs">
              <div className="text-blue-950">
                <span className="font-bold block">১-ক্লিক ডেমো লগইন?</span>
                <span className="text-[11px] text-blue-800">টপ অ্যাফিলিয়েট তানভীর আহমেদের ড্যাশবোর্ড দেখুন</span>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
              >
                1-Click Demo
              </button>
            </div>

            {/* SIGNUP FORM - BLUE THEME */}
            {authTab === 'signup' ? (
              <form onSubmit={handleSignup} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">আপনার পুরো নাম (Full Name) *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">ইমেইল এড্রেস *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">পাসওয়ার্ড *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-2">
                  <span className="font-bold text-blue-950 block text-[11px]">পেমেন্ট মাধ্যম (১৫ দিন পর পর উইথড্র)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <select
                        value={payoutMethod}
                        onChange={(e) => setPayoutMethod(e.target.value as any)}
                        className="w-full p-2 border border-gray-300 rounded-xl outline-none focus:border-blue-600 bg-white font-bold text-gray-800"
                      >
                        <option value="bKash">bKash (বিকাশ)</option>
                        <option value="Nagad">Nagad (নগদ)</option>
                        <option value="Bank">Bank Transfer</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        value={payoutAccount}
                        onChange={(e) => setPayoutAccount(e.target.value)}
                        placeholder="একাউন্ট / ওয়ালেট নম্বর"
                        className="w-full p-2 border border-gray-300 rounded-xl outline-none focus:border-blue-600 bg-white font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'অ্যাফিলিয়েট রেজিস্ট্রেশন সম্পন্ন করুন'}
                  </button>
                </div>
              </form>
            ) : (
              /* LOGIN FORM - BLUE THEME */
              <form onSubmit={handleLogin} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">ইমেইল বা অ্যাফিলিয়েট কোড</label>
                  <input
                    type="text"
                    required
                    value={loginEmailOrCode}
                    onChange={(e) => setLoginEmailOrCode(e.target.value)}
                    placeholder="you@gmail.com বা আপনার রেফারেল কোড"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">অ্যাফিলিয়েট পাসওয়ার্ড *</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="আপনার অ্যাফিলিয়েট পাসওয়ার্ড লিখুন"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'লগইন হচ্ছে...' : 'লগইন করুন (Log In)'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
