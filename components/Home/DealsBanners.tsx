'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { ArrowRight, Sparkles, Tag, ShieldCheck, Store, Rocket } from 'lucide-react';

export const DealsBanners: React.FC = () => {
  const { setSelectedCategory, selectedCategory, banners: storeBanners } = useMarketplace();

  // Define static fallback banners
  const defaultBanners = [
    {
      id: 'cat-groceries',
      title: 'Pantry Essentials & Fresh Bazar',
      desc: 'Pure Mustard Oil, Spices & Tea with Same-Day Delivery',
      bgClass: 'bg-emerald-900 border-emerald-800',
      img: '/images/promo_grocery_daily_1790874494950.jpg',
      label: 'Bazaar Mart',
      gradient: 'from-emerald-950 via-emerald-900/80',
      icon: Tag
    },
    {
      id: 'cat-women-fashion',
      title: 'Authentic Dhakai Jamdani & Panjabi',
      desc: 'Handloom Sarees, Jacquard Kurtas & Leather Shoes',
      bgClass: 'bg-rose-950 border-rose-900',
      img: '/images/hero_fashion_lifestyle_1790874464596.jpg',
      label: 'Fashion',
      gradient: 'from-rose-950 via-rose-900/80',
      icon: Sparkles
    },
    {
      id: 'cat-accessories',
      title: 'Smart Audio, TWS & GaN Chargers',
      desc: 'Anker, Baseus & Kieslect with official warranty',
      bgClass: 'bg-[#0284c7] border-sky-600',
      img: '/images/hero_gadgets_electronics_1790874480335.jpg',
      label: 'Official Tech',
      gradient: 'from-[#0284c7] via-sky-600/80',
      icon: ShieldCheck
    }
  ];

  // Filter only bottom banners from store
  const bottomBannersFromStore = (storeBanners || []).filter((b) => b.type === 'bottom');

  // Convert storeBanners from admin settings if they exist, otherwise use static fallbacks
  const dynamicBanners = bottomBannersFromStore.map((b) => ({
    id: b.id,
    title: b.title,
    desc: b.subtitle || 'Exclusive dynamic deals & products.',
    bgClass: b.categoryId === 'cat-groceries' ? 'bg-emerald-900 border-emerald-800' : b.categoryId === 'cat-women-fashion' ? 'bg-rose-950 border-rose-900' : 'bg-[#0284c7] border-sky-600',
    img: b.imageUrl,
    label: b.badge || 'MEGA DEAL',
    gradient: b.categoryId === 'cat-groceries' ? 'from-emerald-950 via-emerald-900/80' : b.categoryId === 'cat-women-fashion' ? 'from-rose-950 via-rose-900/80' : 'from-[#0284c7] via-sky-900/80',
    icon: b.categoryId === 'cat-groceries' ? Tag : b.categoryId === 'cat-women-fashion' ? Sparkles : ShieldCheck
  }));

  const activeBanners = dynamicBanners.length > 0 ? dynamicBanners : defaultBanners;

  const filteredBanners = selectedCategory && selectedCategory !== 'all' 
    ? activeBanners.filter(b => b.id === selectedCategory) 
    : activeBanners;

  if (filteredBanners.length === 0) return null;

  return (
    <section className="bg-[#f5f5f5] py-5">
      <div className="max-w-[1240px] mx-auto px-3">
        <div className={`grid grid-cols-1 gap-4 ${filteredBanners.length > 1 ? 'md:grid-cols-3' : ''}`}>
          {filteredBanners.map((banner) => {
            const Icon = banner.icon;
            return (
              <div
                key={banner.id}
                onClick={() => setSelectedCategory(banner.id)}
                className={`group relative rounded-lg overflow-hidden ${banner.bgClass} cursor-pointer shadow-xs min-h-[160px] flex items-center p-5 border`}
              >
                <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-500"
                     style={{ backgroundImage: `url('${banner.img}')` }} />
                <div className={`absolute inset-0 bg-linear-to-r ${banner.gradient} to-transparent`} />

                <div className="relative z-10 text-white max-w-[240px]">
                  <span className="inline-flex items-center gap-1 bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-white/20 mb-2">
                    <Icon className="w-3 h-3" />
                    {banner.label}
                  </span>
                  <h3 className="font-extrabold text-lg leading-snug">
                    {banner.title}
                  </h3>
                  <p className="text-[11.5px] text-gray-200 mt-1">
                    {banner.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-white mt-3 group-hover:translate-x-1 transition-transform">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Start Selling Today Homepage Banner */}
        <div className="mt-4">
          <Link
            href="/sell"
            className="group relative rounded-xl overflow-hidden bg-gradient-to-r from-[#0284c7] via-sky-600 to-[#0369a1] p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-sky-400/40 hover:shadow-lg transition-all cursor-pointer block"
          >
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/30 shadow-xs">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white text-[#0284c7] px-2 py-0.5 rounded-full shadow-2xs">
                  Merchant Partnership
                </span>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight mt-1 text-white">
                  Have Products to Sell? Start Selling Today on QUATRO!
                </h3>
                <p className="text-[11px] text-white/90">
                  Reach 10 Million+ customers across 64 districts with 0% listing fee &amp; weekly bKash / Bank payouts.
                </p>
              </div>
            </div>

            <div className="shrink-0 bg-white text-[#0284c7] group-hover:bg-sky-50 px-4 py-2 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all z-10">
              <Rocket className="w-4 h-4 text-[#0284c7]" />
              <span>Register Shop Now →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
