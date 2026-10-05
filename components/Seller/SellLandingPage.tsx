'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { TopBar } from '@/components/Navbar/TopBar';
import { Header } from '@/components/Navbar/Header';
import { Footer } from '@/components/Footer/Footer';
import { SellerRegisterModal } from '@/components/Seller/SellerRegisterModal';
import { useRouter } from 'next/navigation';
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
  Globe
} from 'lucide-react';

export function SellLandingPage() {
  const { formatPrice, user, setIsAuthModalOpen, setAuthModalTab } = useMarketplace();
  const router = useRouter();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
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
      a: 'QUATRO integrates with top nationwide courier partners (Pathao, RedX, Steadfast, eCourier). When an order comes in, pack the parcel, print the shipping label from your dashboard, and hand it over to the courier pickup agent!'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex flex-col text-gray-800">
      <TopBar onOpenMyOrders={() => router.push('/')} />
      <Header onOpenWishlist={() => {}} />

      <main className="flex-1">
        {/* Hero Banner Section */}
        <section className="bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#111827] text-white py-12 lg:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0284c7]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1240px] mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#0284c7]/20 border border-[#0284c7]/40 text-[#0284c7] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#0284c7]" />
                <span>QUATRO Seller Center (Multi-Vendor Marketplace)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Grow Your Business Across All <span className="text-[#0284c7]">64 Districts</span> of Bangladesh
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Join over 15,000 successful Bangladeshi merchants selling electronics, fashion, beauty & home items. Enjoy 0% listing fees, instant weekly payouts to bKash / Nagad / Bank, and dedicated account support.
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

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">10M+</h4>
                  <p className="text-[11px] text-gray-400">Monthly Active Buyers</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-emerald-400">৳0 Fee</h4>
                  <p className="text-[11px] text-gray-400">Upfront Registration</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-sky-400">7 Days</h4>
                  <p className="text-[11px] text-gray-400">Guaranteed Payout Cycle</p>
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

        {/* 3 Steps How It Works */}
        <section className="py-12 max-w-[1240px] mx-auto px-4">
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
              <h3 className="text-lg font-bold text-gray-900">1. Register Your Shop</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Provide your shop name, owner contact details, address, and payout account (bKash, Nagad, or Bank). Your request is verified within hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-sky-300 transition-all">
              <span className="text-5xl font-black text-sky-100 group-hover:text-sky-200 transition-colors absolute top-2 right-4 pointer-events-none">02</span>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
                📦
              </div>
              <h3 className="text-lg font-bold text-gray-900">2. Upload Products</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Add titles, multiple images, video preview, prices, discount offers, stock quantities, and variants using our compact Seller Center dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 relative overflow-hidden group hover:border-sky-300 transition-all">
              <span className="text-5xl font-black text-sky-100 group-hover:text-sky-200 transition-colors absolute top-2 right-4 pointer-events-none">03</span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg">
                💰
              </div>
              <h3 className="text-lg font-bold text-gray-900">3. Start Earning & Payouts</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Receive orders from buyers nationwide. Pack items, hand over to courier agents, and withdraw net earnings directly to your mobile bank account!
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-12 bg-white border-y border-gray-200">
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
                <h4 className="font-bold text-sm text-gray-900">Guaranteed Weekly Payouts</h4>
                <p className="text-xs text-gray-500">Withdraw your earnings hassle-free directly to bKash, Nagad, or any Bangladeshi bank.</p>
              </div>

              <div className="p-5 bg-[#F4F5F7] rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">64 District Delivery Network</h4>
                <p className="text-xs text-gray-500">Integrated courier pickup agents collect parcels directly from your shop or warehouse.</p>
              </div>

              <div className="p-5 bg-[#F4F5F7] rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Powerful Seller Analytics</h4>
                <p className="text-xs text-gray-500">Track total pieces sold, net income, top products, low stock alerts, and CSV sales reports.</p>
              </div>

              <div className="p-5 bg-[#F4F5F7] rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">24/7 Merchant Support</h4>
                <p className="text-xs text-gray-500">Dedicated key account managers and WhatsApp hotline to assist you with sales growth.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Commission Table Section */}
        <section className="py-12 max-w-[1240px] mx-auto px-4">
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
                  <tr className="hover:bg-sky-50/40">
                    <td className="py-3 px-4 font-bold text-gray-900">Electronics & Gadgets</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">FREE (৳0)</td>
                    <td className="py-3 px-4 font-bold text-[#0284c7]">5.0%</td>
                    <td className="py-3 px-4 text-gray-500">Weekly (Every Monday)</td>
                  </tr>
                  <tr className="hover:bg-sky-50/40">
                    <td className="py-3 px-4 font-bold text-gray-900">Fashion & Apparel</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">FREE (৳0)</td>
                    <td className="py-3 px-4 font-bold text-[#0284c7]">8.0%</td>
                    <td className="py-3 px-4 text-gray-500">Weekly (Every Monday)</td>
                  </tr>
                  <tr className="hover:bg-sky-50/40">
                    <td className="py-3 px-4 font-bold text-gray-900">Health & Beauty</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">FREE (৳0)</td>
                    <td className="py-3 px-4 font-bold text-[#0284c7]">6.0%</td>
                    <td className="py-3 px-4 text-gray-500">Weekly (Every Monday)</td>
                  </tr>
                  <tr className="hover:bg-sky-50/40">
                    <td className="py-3 px-4 font-bold text-gray-900">Home & Kitchen Essentials</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">FREE (৳0)</td>
                    <td className="py-3 px-4 font-bold text-[#0284c7]">7.0%</td>
                    <td className="py-3 px-4 text-gray-500">Weekly (Every Monday)</td>
                  </tr>
                  <tr className="hover:bg-sky-50/40">
                    <td className="py-3 px-4 font-bold text-gray-900">Groceries & Daily Mart</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">FREE (৳0)</td>
                    <td className="py-3 px-4 font-bold text-[#0284c7]">4.0%</td>
                    <td className="py-3 px-4 text-gray-500">Weekly (Every Monday)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 max-w-[1240px] mx-auto px-4">
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

      <Footer />

      {/* Seller Register Modal */}
      <SellerRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => router.push('/seller')}
      />
    </div>
  );
}
