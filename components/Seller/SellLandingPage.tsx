'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { SellerRegisterModal } from '@/components/Seller/SellerRegisterModal';
import { BrandLogo } from '@/components/Common/BrandLogo';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Wallet,
  Truck,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BarChart3,
  Building,
  Smartphone,
  Globe,
  PhoneCall,
  Mail,
  ExternalLink,
  Lock,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

export function SellLandingPage() {
  const { formatPrice, user, language, setLanguage, t, settings } = useMarketplace();
  const router = useRouter();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const isBn = language === 'bn';

  const sellerHotline = settings.sellerPortalHotline || '+880 9612-444888';
  const sellerEmail = settings.sellerPortalEmail || 'seller-support@quatro.com.bd';
  const sellerTitle = settings.sellerPortalName || (isBn ? 'কোয়াট্রো সেলার সেন্টার' : 'QUATRO Seller Center');
  const sellerBanner = settings.sellerPortalBannerText || (isBn ? 'সারা বাংলাদেশের ৬৪ জেলায় আপনার শপের পণ্য পৌঁছে দিন' : 'Grow Your Business Across All 64 Districts of Bangladesh');
  const sellerLogo = settings.sellerPortalLogoUrl || settings.siteLogoUrl;

  const faqs = settings.sellerFaqs && settings.sellerFaqs.length > 0 ? settings.sellerFaqs : [
    {
      q: 'How long does the seller approval process take?',
      a: 'After submitting your registration form with shop name, owner details, and payout method, our merchant verification team reviews it within 2 to 6 hours. You will receive an immediate notification once approved.'
    },
    {
      q: 'What documents or credentials do I need to register?',
      a: 'You only need a valid Bangladeshi phone number, email address, shop location, and a bKash, Nagad, or Bank account for payouts. NID or Trade License is optional but speeds up verification.'
    },
    {
      q: 'When and how do I receive payments for sold items?',
      a: 'Funds become available 7 days after the customer receives the item (matching our 7-day return policy). You can request withdrawals anytime via bKash, Nagad, or direct Bank transfer with minimum payout threshold of ৳500.'
    },
    {
      q: 'Are there any upfront listing fees or hidden charges?',
      a: 'No! Listing products on QUATRO is 100% free with 0 upfront cost. Platform commission is deducted only when you make a successful sale.'
    },
    {
      q: 'How are orders delivered to customers across Bangladesh?',
      a: 'QUATRO integrates directly with Steadfast Courier Express API (as well as Pathao & RedX). When an order is placed, you confirm it in the seller dashboard, get an instant Steadfast Consignment Tracking Code, print the dispatch memo, and the rider picks it up from your shop!'
    }
  ];

  const commissions = settings.sellerCategoryCommissions && settings.sellerCategoryCommissions.length > 0
    ? settings.sellerCategoryCommissions
    : [
        { categoryName: 'Consumer Electronics & Gadgets', listingFee: 'FREE (৳0)', commissionPercent: 5.0, payoutCycle: 'Weekly (Every Monday)' },
        { categoryName: 'Fashion & Apparel', listingFee: 'FREE (৳0)', commissionPercent: 8.0, payoutCycle: 'Weekly (Every Monday)' },
        { categoryName: 'Health & Beauty', listingFee: 'FREE (৳0)', commissionPercent: 6.0, payoutCycle: 'Weekly (Every Monday)' },
        { categoryName: 'Home & Kitchen Essentials', listingFee: 'FREE (৳0)', commissionPercent: 7.0, payoutCycle: 'Weekly (Every Monday)' },
        { categoryName: 'Groceries & Daily Mart', listingFee: 'FREE (৳0)', commissionPercent: 4.0, payoutCycle: 'Weekly (Every Monday)' }
      ];

  const logisticsList = settings.sellerLogisticsPartners && settings.sellerLogisticsPartners.length > 0
    ? settings.sellerLogisticsPartners
    : ['Steadfast Express API (Integrated 24h)', 'Pathao Express Nationwide', 'RedX & Paperfly Doorstep Pickup', 'Automatic Consignment Tracking Codes'];

  const paymentList = settings.sellerPaymentChannels && settings.sellerPaymentChannels.length > 0
    ? settings.sellerPaymentChannels
    : ['Weekly Automated Settlements', 'Direct bKash Merchant / Personal Payouts', 'Nagad & Rocket Instant Transfer', 'BEFTN / NPSB Direct Bank Transfer'];

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex flex-col text-gray-800">
      {/* 1. Dedicated Seller Portal Top Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11.5px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <PhoneCall className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Merchant Hotline: <strong className="text-white">{sellerHotline}</strong></span>
            </span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>{sellerEmail}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11.5px]">
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>{isBn ? 'English' : 'বাংলা'}</span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Back to Customer Storefront */}
            <Link
              href="/"
              className="flex items-center gap-1 text-[#0284c7] hover:text-sky-300 font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isBn ? 'গ্রাহক স্টোরে ফিরুন' : 'Back to Storefront'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Dedicated Seller Center Main Navbar with Compact 3-Line Dropdown */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Logo + Seller Center Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/sell" className="flex items-center gap-2">
              {sellerLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sellerLogo} alt={sellerTitle} className="h-8 max-w-[140px] object-contain" referrerPolicy="no-referrer" />
              ) : (
                <BrandLogo variant="full" size="md" />
              )}
            </Link>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>{sellerTitle}</span>
            </span>
          </div>

          {/* Center Compact 3-Line Navigation Menu (Desktop & Mobile) */}
          <div className="relative">
            <button
              onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-sky-50 border border-gray-200 hover:border-sky-300 text-gray-800 hover:text-[#0284c7] font-bold text-xs transition-all shadow-2xs cursor-pointer"
              title="Seller Portal Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#0284c7]" />
              <span className="hidden xs:inline">{isBn ? 'নেভিগেশন মেনু' : 'Portal Menu'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isNavMenuOpen ? 'rotate-180 text-[#0284c7]' : ''}`} />
            </button>

            {/* 3-Line Dropdown Popover */}
            {isNavMenuOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl py-3 z-50 text-xs text-gray-800 divide-y divide-gray-100 animate-in fade-in-50 zoom-in-95 duration-150"
              >
                <div className="px-4 pb-2">
                  <p className="text-[10.5px] font-black text-gray-400 uppercase tracking-wider">
                    {isBn ? 'সেলার পোর্টাল বিভাগসমূহ' : 'Seller Portal Sections'}
                  </p>
                </div>

                <div className="py-1.5 space-y-0.5">
                  <a
                    href="#why-sell"
                    onClick={() => setIsNavMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-sky-50 hover:text-[#0284c7] font-bold text-gray-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#0284c7]" />
                    <span>{isBn ? 'কেন কোয়াট্রোতে সেল করবেন?' : 'Why Sell on QUATRO'}</span>
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={() => setIsNavMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-sky-50 hover:text-[#0284c7] font-bold text-gray-700 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-[#0284c7]" />
                    <span>{isBn ? 'অনবোর্ডিং ৩টি সহজ ধাপ' : 'How It Works (3 Steps)'}</span>
                  </a>
                  <a
                    href="#features"
                    onClick={() => setIsNavMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-sky-50 hover:text-[#0284c7] font-bold text-gray-700 transition-colors"
                  >
                    <Truck className="w-4 h-4 text-[#0284c7]" />
                    <span>{isBn ? 'লজিস্টিক ও কুরিয়ার নেটওয়ার্ক' : 'Logistics & Courier'}</span>
                  </a>
                  <a
                    href="#pricing"
                    onClick={() => setIsNavMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-sky-50 hover:text-[#0284c7] font-bold text-gray-700 transition-colors"
                  >
                    <Wallet className="w-4 h-4 text-[#0284c7]" />
                    <span>{isBn ? 'কমিশন ও পে-আউট রেট' : 'Commission & Payout Rates'}</span>
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setIsNavMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-sky-50 hover:text-[#0284c7] font-bold text-gray-700 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-[#0284c7]" />
                    <span>{isBn ? 'সাধারণ প্রশ্নোত্তর (FAQ)' : 'Frequently Asked Questions'}</span>
                  </a>
                </div>

                <div className="pt-2 px-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>{sellerHotline}</span>
                    </span>
                    <button
                      onClick={() => {
                        setLanguage(language === 'bn' ? 'en' : 'bn');
                        setIsNavMenuOpen(false);
                      }}
                      className="text-[#0284c7] font-bold hover:underline cursor-pointer"
                    >
                      {isBn ? 'EN' : 'বাংলা'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Login & Register */}
          <div className="flex items-center gap-2">
            <Link
              href="/seller/login"
              className="px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-[#0284c7] hover:bg-sky-50 rounded-xl transition-all border border-gray-200 flex items-center gap-1.5 shrink-0"
            >
              <Lock className="w-3.5 h-3.5 text-[#0284c7]" />
              <span className="hidden xs:inline">{isBn ? 'সেলার লগইন' : 'Seller Login'}</span>
            </Link>

            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-extrabold rounded-xl shadow-xs hover:shadow-sky-500/25 transition-all cursor-pointer flex items-center gap-1.5 active:scale-97 shrink-0"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{isBn ? 'ফ্রি রেজিস্ট্রেশন' : 'Register Shop'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Banner Section */}
        <section className="bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#111827] text-white py-12 lg:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0284c7]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1240px] mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#0284c7]/20 border border-[#0284c7]/40 text-[#0284c7] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#0284c7]" />
                <span>{sellerTitle} (Multi-Vendor Marketplace)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {sellerBanner}
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                {settings?.sellerEmpoweringStatement || 'Join over 15,000 successful Bangladeshi merchants selling electronics, fashion, beauty & home items. Enjoy 0% listing fees, instant weekly payouts to bKash / Nagad / Bank, and dedicated account support.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-6 py-3.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-sm rounded-xl shadow-lg hover:shadow-sky-500/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Store className="w-5 h-5" />
                  <span>Start Selling Today - Free Registration</span>
                </button>

                <button
                  onClick={() => router.push('/seller/login')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Seller Center Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Highlights (Dynamically Managed from Admin Settings) */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">
                    {settings?.sellerStatBuyers ? settings.sellerStatBuyers.split(' ')[0] : '10M+'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {settings?.sellerStatBuyers ? settings.sellerStatBuyers.split(' ').slice(1).join(' ') || 'Monthly Active Buyers' : 'Monthly Active Buyers'}
                  </p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-emerald-400">
                    {settings?.sellerStatFee ? settings.sellerStatFee.split(' ')[0] : '৳0 Fee'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {settings?.sellerStatFee ? settings.sellerStatFee.split(' ').slice(1).join(' ') || 'Upfront Registration' : 'Upfront Registration'}
                  </p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-sky-400">
                    {settings?.sellerStatPayout ? settings.sellerStatPayout.split(' ')[0] : '7 Days'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {settings?.sellerStatPayout ? settings.sellerStatPayout.split(' ').slice(1).join(' ') || 'Guaranteed Payout Cycle' : 'Guaranteed Payout Cycle'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl text-white max-w-sm w-full space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-black">
                      S
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Apex Tech & Gadgets</h4>
                      <p className="text-[11px] text-emerald-400 font-semibold">✓ Verified Merchant</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Active Seller
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-gray-400">Total Net Income</p>
                    <p className="text-base font-black text-white mt-0.5">৳1,41,075</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-gray-400">Total Pieces Sold</p>
                    <p className="text-base font-black text-sky-400 mt-0.5">1,280 Pcs</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Register Your Shop Now</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Steps How It Works (Dynamic from Settings) */}
        <section id="how-it-works" className="py-12 max-w-[1240px] mx-auto px-4">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-[#0284c7] font-extrabold text-xs tracking-wider uppercase">Simple & Fast Onboarding</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">How to Become a Seller in 3 Easy Steps</h2>
            <p className="text-xs text-gray-500">From shop registration to receiving your first order payout</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-sky-300 transition-all">
              <span className="text-5xl font-black text-sky-100 group-hover:text-sky-200 transition-colors absolute top-2 right-4 pointer-events-none">01</span>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#0284c7] flex items-center justify-center font-black text-lg">
                📝
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {settings.sellerOnboardingStep1Title || '1. Register Your Shop'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {settings.sellerOnboardingStep1Desc || 'Provide your shop name, owner contact details, address, and payout account (bKash, Nagad, or Bank). Your request is verified within hours.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-sky-300 transition-all">
              <span className="text-5xl font-black text-sky-100 group-hover:text-sky-200 transition-colors absolute top-2 right-4 pointer-events-none">02</span>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                📦
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {settings.sellerOnboardingStep2Title || '2. Upload Products'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {settings.sellerOnboardingStep2Desc || 'Add titles, multiple images, video preview, prices, discount offers, stock quantities, and variants using our compact Seller Center dashboard.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-sky-300 transition-all">
              <span className="text-5xl font-black text-sky-100 group-hover:text-sky-200 transition-colors absolute top-2 right-4 pointer-events-none">03</span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg">
                💰
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {settings.sellerOnboardingStep3Title || '3. Start Earning & Payouts'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {settings.sellerOnboardingStep3Desc || 'Receive orders from buyers nationwide. Pack items, hand over to courier agents, and withdraw net earnings directly to your mobile bank account!'}
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Grid (Dynamic from Settings) */}
        <section id="why-sell" className="py-12 bg-white border-y border-gray-200">
          <div className="max-w-[1240px] mx-auto px-4 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#0284c7] font-extrabold text-xs tracking-wider uppercase">Why Merchants Choose QUATRO</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Empowering Merchants Across Bangladesh</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 bg-[#F4F5F7] rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-black">
                  <Wallet className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">
                  {settings.sellerValueProp1Title || 'Guaranteed Weekly Payouts'}
                </h4>
                <p className="text-xs text-gray-500">
                  {settings.sellerValueProp1Desc || 'Withdraw your earnings hassle-free directly to bKash, Nagad, or any Bangladeshi bank.'}
                </p>
              </div>

              <div className="p-5 bg-[#F4F5F7] rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">
                  {settings.sellerValueProp2Title || '64 District Delivery Network'}
                </h4>
                <p className="text-xs text-gray-500">
                  {settings.sellerValueProp2Desc || 'Integrated courier pickup agents collect parcels directly from your shop or warehouse.'}
                </p>
              </div>

              <div className="p-5 bg-[#F4F5F7] rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">
                  {settings.sellerValueProp3Title || 'Powerful Seller Analytics'}
                </h4>
                <p className="text-xs text-gray-500">
                  {settings.sellerValueProp3Desc || 'Track total pieces sold, net income, top products, low stock alerts, and CSV sales reports.'}
                </p>
              </div>

              <div className="p-5 bg-[#F4F5F7] rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">
                  {settings.sellerValueProp4Title || '24/7 Merchant Support'}
                </h4>
                <p className="text-xs text-gray-500">
                  {settings.sellerValueProp4Desc || 'Dedicated key account managers and WhatsApp hotline to assist you with sales growth.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Commission Table Section (Dynamic from Settings) */}
        <section id="pricing" className="py-12 max-w-[1240px] mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-gray-900">Standard Category Commission Rates</h3>
                <p className="text-xs text-gray-500">Transparent commission rates per product category. No hidden listing fees!</p>
              </div>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                Register Shop Now
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-[10.5px] font-extrabold border-b border-gray-200">
                    <th className="py-3 px-4">Product Category</th>
                    <th className="py-3 px-4">Listing Fee</th>
                    <th className="py-3 px-4">Platform Commission Rate</th>
                    <th className="py-3 px-4">Payout Cycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {commissions.map((comm, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/40">
                      <td className="py-3 px-4 font-bold text-gray-900">{comm.categoryName}</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">{comm.listingFee}</td>
                      <td className="py-3 px-4 font-bold text-[#0284c7]">{comm.commissionPercent}%</td>
                      <td className="py-3 px-4 text-gray-500">{comm.payoutCycle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Logistics & Courier Features Section */}
        <section id="features" className="py-12 bg-slate-900 text-white">
          <div className="max-w-[1240px] mx-auto px-4 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[#0284c7] font-extrabold text-xs tracking-wider uppercase">Logistics & Integrations</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Automated Delivery Handshake</h2>
              <p className="text-xs text-gray-400">Integrated Steadfast, Pathao & RedX express courier pickup</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {logisticsList.map((partner, idx) => (
                <div key={idx} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs text-slate-200">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section (Dynamic from Settings) */}
        <section id="faq" className="py-12 max-w-[1240px] mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[#0284c7] font-extrabold text-xs tracking-wider uppercase">Got Questions?</span>
              <h2 className="text-2xl font-black text-gray-900">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all shadow-2xs">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 font-extrabold text-xs sm:text-sm text-gray-900 flex items-center justify-between gap-3 hover:bg-sky-50/50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-[#0284c7]' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Call to Action Banner */}
        <section className="bg-gradient-to-r from-[#0284c7] via-sky-600 to-[#0369a1] text-white py-12">
          <div className="max-w-[1240px] mx-auto px-4 text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black">Ready to Start Selling Today?</h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto font-medium">
              Create your seller shop in less than 2 minutes and reach millions of online shoppers across Bangladesh.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-8 py-3.5 bg-white text-[#0284c7] hover:bg-sky-50 font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Store className="w-5 h-5" />
                <span>Register as Seller Now</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Dedicated Seller Portal Footer (Dynamic from Settings) */}
      <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 pt-10 pb-6">
        <div className="max-w-[1240px] mx-auto px-4 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BrandLogo variant="full" size="sm" />
                <span className="text-[10px] bg-slate-800 text-sky-400 font-bold px-2 py-0.5 rounded border border-slate-700">
                  Seller Center
                </span>
              </div>
              <p className="text-[11.5px] text-slate-400 leading-relaxed">
                {settings.sellerEmpoweringStatement || 'Empowering 15,000+ local sellers, MSMEs and brands across all 64 districts in Bangladesh with cutting-edge technology, instant payouts and national logistics.'}
              </p>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>e-CAB &amp; DBID Registered Platform</span>
              </div>
            </div>

            <div>
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">Merchant Support</h5>
              <ul className="space-y-2 text-slate-400 text-[11.5px]">
                <li>Hotline: <strong className="text-white">{sellerHotline}</strong> (9 AM - 10 PM)</li>
                <li>WhatsApp Support: <strong className="text-white">{settings.whatsappNumber || '+880 1712-345678'}</strong></li>
                <li>Email: {sellerEmail}</li>
                <li>Fulfillment Center: {settings.officeAddress || 'Tejgaon I/A, Dhaka-1208'}</li>
              </ul>
            </div>

            <div>
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">Logistics &amp; Courier</h5>
              <ul className="space-y-2 text-slate-400 text-[11.5px]">
                {logisticsList.map((partner, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{partner}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider mb-3">Payout &amp; Finance</h5>
              <ul className="space-y-2 text-slate-400 text-[11.5px]">
                {paymentList.map((chan, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>{chan}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} {settings.storeName || 'QUATRO'} Merchant Portal. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-slate-300">Customer Storefront</Link>
              <span>·</span>
              <a href="#" className="hover:text-slate-300">Merchant Agreement</a>
              <span>·</span>
              <a href="#" className="hover:text-slate-300">Seller Code of Conduct</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Seller Register Modal */}
      <SellerRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => router.push('/seller')}
      />
    </div>
  );
}
