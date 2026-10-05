'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { ProductCard } from '../Product/ProductCard';
import { Zap, ChevronRight, Clock } from 'lucide-react';

export const FlashSaleSection: React.FC = () => {
  const { products, t, setSelectedCategory, settings } = useMarketplace();

  // Ticking countdown timer configured by Admin
  const targetHours = settings?.flashSaleHoursLeft ?? 11;
  const targetMinutes = settings?.flashSaleMinutesLeft ?? 45;

  const [timeLeft, setTimeLeft] = useState({
    hours: targetHours,
    minutes: targetMinutes,
    seconds: 30
  });

  useEffect(() => {
    let currentHours = targetHours;
    let currentMinutes = targetMinutes;
    let currentSeconds = 30;

    const timer = setInterval(() => {
      if (currentSeconds > 0) {
        currentSeconds -= 1;
      } else if (currentMinutes > 0) {
        currentMinutes -= 1;
        currentSeconds = 59;
      } else if (currentHours > 0) {
        currentHours -= 1;
        currentMinutes = 59;
        currentSeconds = 59;
      } else {
        currentHours = 12;
        currentMinutes = 0;
        currentSeconds = 0;
      }
      setTimeLeft({ hours: currentHours, minutes: currentMinutes, seconds: currentSeconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetHours, targetMinutes]);

  const flashSaleProducts = products.filter((p) => p.isFlashSale).slice(0, 6);

  if (flashSaleProducts.length === 0) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="bg-white py-5 border-b border-slate-100 transition-colors">
      <div className="max-w-[1240px] mx-auto px-3">
        {/* Flash Sale Header Bar */}
        <div className="bg-linear-to-r from-sky-50 via-blue-50 to-sky-50 p-4 rounded-2xl border border-sky-200 shadow-xs mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0284c7] flex items-center justify-center text-white shadow-xs">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-[#0284c7] uppercase">
                {t('flashSale')}
              </h2>
            </div>

            {/* Live Countdown Timer */}
            <div className="flex items-center gap-1.5 text-[12px] text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-sky-200 shadow-2xs">
              <Clock className="w-4 h-4 text-[#0284c7]" />
              <span className="font-bold text-gray-700 mr-1">{t('endsIn')}:</span>
              <div className="flex items-center gap-1 font-mono font-bold">
                <span className="bg-[#0284c7] text-white px-2 py-0.5 rounded-md text-[11px] tabular-nums">
                  {pad(timeLeft.hours)}
                </span>
                <span className="text-[#0284c7] font-black">:</span>
                <span className="bg-[#0284c7] text-white px-2 py-0.5 rounded-md text-[11px] tabular-nums">
                  {pad(timeLeft.minutes)}
                </span>
                <span className="text-[#0284c7] font-black">:</span>
                <span className="bg-[#0284c7] text-white px-2 py-0.5 rounded-md text-[11px] tabular-nums">
                  {pad(timeLeft.seconds)}
                </span>
              </div>
            </div>
          </div>

          {/* Shop All Link */}
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-extrabold text-white bg-[#0284c7] hover:bg-[#0369a1] px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1 uppercase tracking-wide cursor-pointer"
          >
            <span>{t('shopAll')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Grid with Sold Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {flashSaleProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} showProgress={true} />
          ))}
        </div>
      </div>
    </section>
  );
};
