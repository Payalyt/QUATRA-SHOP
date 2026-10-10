'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Headphones,
  Tv,
  Shirt,
  Sparkles,
  ShoppingBag,
  HeartHandshake,
  Activity,
  Zap,
  CreditCard,
  Truck,
  ShieldCheck
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Smartphone,
  Headphones,
  Tv,
  Shirt,
  Sparkles,
  ShoppingBag,
  HeartHandshake,
  Activity
};

export const CategoryMegaMenu: React.FC = () => {
  const { categories, banners, language, setSelectedCategory } = useMarketplace();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveringBanner, setIsHoveringBanner] = useState(false);

  // Auto-play hero slider every 4.5 seconds
  useEffect(() => {
    if (isHoveringBanner) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length, isHoveringBanner]);

  const activeCategoryData = categories.find((c) => c.id === activeCategory);

  return (
    <div className="bg-[#f5f5f5] pb-4">
      <div className="max-w-[1240px] mx-auto px-3 pt-3">
        <div className="flex gap-3 relative">
          {/* Left Category Sidebar (Mega Menu) */}
          <div
            className="w-56 shrink-0 bg-white rounded-md shadow-xs border border-gray-100 hidden lg:block relative z-30"
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="py-1 divide-y divide-gray-50">
              {categories.map((cat) => {
                const Icon = ICON_MAP[cat.iconName] || Smartphone;
                const isHovered = activeCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setActiveCategory(cat.id)}
                    className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors text-[12.5px] ${
                      isHovered ? 'bg-sky-50 text-[#0284c7] font-semibold' : 'text-gray-700 hover:text-[#0284c7]'
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isHovered ? 'text-[#0284c7]' : 'text-gray-400'}`} />
                      <span className="truncate">{language === 'bn' ? cat.nameBn : cat.name}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                  </div>
                );
              })}
            </div>

            {/* Hover Subcategories Flyout */}
            {activeCategoryData && activeCategoryData.subcategories && (
              <div className="absolute left-full top-0 ml-1 w-72 bg-white rounded-md shadow-xl border border-gray-100 p-4 z-40 min-h-[360px] animate-in fade-in-50 duration-150">
                <div className="border-b border-gray-100 pb-2 mb-3">
                  <h4 className="font-bold text-[14px] text-gray-900">
                    {language === 'bn' ? activeCategoryData.nameBn : activeCategoryData.name}
                  </h4>
                  <p className="text-[11px] text-gray-400">Shop top verified brands</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {activeCategoryData.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedCategory(activeCategoryData.id);
                        setActiveCategory(null);
                      }}
                      className="text-left text-[12px] text-gray-600 hover:text-[#0284c7] hover:bg-sky-50/50 px-2 py-1.5 rounded transition-colors flex items-center justify-between group"
                    >
                      <span>{language === 'bn' ? sub.nameBn : sub.name}</span>
                      <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#0284c7] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100 bg-sky-50/60 p-2.5 rounded">
                  <span className="text-[10px] uppercase font-bold text-[#0284c7] tracking-wider block">
                    QUATRO Promise
                  </span>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    100% Authentic Quality, Cash on Delivery, and 7-day hassle-free returns.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Center: Hero Banner Carousel */}
          <div
            className="flex-1 rounded-md overflow-hidden relative shadow-xs bg-slate-900 min-h-[260px] sm:min-h-[340px] max-h-[380px] group"
            onMouseEnter={() => setIsHoveringBanner(true)}
            onMouseLeave={() => setIsHoveringBanner(false)}
          >
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Gradient Scrim for Readability */}
                <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/40 to-transparent flex items-center">
                  <div className="p-6 sm:p-8 max-w-[480px] text-white">
                    {banner.badge && (
                      <span className="inline-block bg-[#0284c7] text-white text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-2">
                        {banner.badge}
                      </span>
                    )}
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight text-white mb-2">
                      {banner.title}
                    </h2>
                    <p className="text-[12px] sm:text-[13px] text-gray-200 line-clamp-2 mb-4 font-normal">
                      {banner.subtitle}
                    </p>
                    <button
                      onClick={() => alert(`Exploring: ${banner.title}`)}
                      className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-[12px] font-bold px-4 py-2 rounded shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                    >
                      <span>{banner.ctaText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Slide Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`transition-all rounded-full ${
                    i === currentSlide ? 'w-5 h-1.5 bg-[#0284c7]' : 'w-1.5 h-1.5 bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Promo Feature Cards (Desktop Only) */}
          <div className="w-52 shrink-0 hidden xl:flex flex-col gap-2.5">
            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[#0284c7] font-bold text-[12px] mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span>bKash Cashback</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Get instant 10% cashback on online bKash payments up to ৳200.
                </p>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded w-max mt-2">
                Active Offer
              </span>
            </div>

            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[12px] mb-1">
                  <Truck className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Enjoy free nationwide shipping on orders over ৳1,999 across BD.
                </p>
              </div>
              <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded w-max mt-2">
                All 64 Districts
              </span>
            </div>

            <div className="bg-white p-3 rounded-md border border-gray-100 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[12px] mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>7-Day Return</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Hassle-free return policy if damaged, defective or mismatched.
                </p>
              </div>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded w-max mt-2">
                Money-back Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
