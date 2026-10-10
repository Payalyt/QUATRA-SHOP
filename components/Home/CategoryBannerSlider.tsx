'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const CategoryBannerSlider: React.FC = () => {
  const { banners, selectedCategory } = useMarketplace();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveringBanner, setIsHoveringBanner] = useState(false);

  const sliderBanners = banners.filter((b) => !b.type || b.type === 'slider');

  // Filter banners based on category selection
  // 1. If we have a selected category (and it is not 'all'), look for banners matching that category.
  // 2. If no banners exist for that category, fallback to banners with categoryId 'all' or empty.
  // 3. If selectedCategory is 'all' or null, look for banners with categoryId 'all' or empty.
  let displayedBanners = sliderBanners.filter(
    (b) => b.categoryId === selectedCategory && selectedCategory !== 'all'
  );

  if (displayedBanners.length === 0) {
    // Fallback to "all" category or empty categoryId banners
    displayedBanners = sliderBanners.filter(
      (b) => !b.categoryId || b.categoryId === 'all'
    );
  }

  // If there are still no banners, use all slider banners as safety
  if (displayedBanners.length === 0) {
    displayedBanners = sliderBanners;
  }

  // Reset slide index if it exceeds the length of displayed banners
  const slideIndex = currentSlide >= displayedBanners.length ? 0 : currentSlide;

  // Auto-play sliding banner every 4 seconds if there are multiple banners
  useEffect(() => {
    if (isHoveringBanner || displayedBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayedBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [displayedBanners.length, isHoveringBanner]);

  if (displayedBanners.length === 0) return null;

  return (
    <section className="bg-[#f5f5f5] pb-3 pt-1">
      <div className="max-w-[1240px] mx-auto px-3">
        <div
          className="rounded-lg overflow-hidden relative shadow-xs bg-[#0284c7] min-h-[140px] sm:min-h-[180px] md:min-h-[220px] max-h-[240px] group transition-all duration-300"
          onMouseEnter={() => setIsHoveringBanner(true)}
          onMouseLeave={() => setIsHoveringBanner(false)}
        >
          {displayedBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === slideIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent flex items-center">
                <div className="p-4 sm:p-6 md:p-8 max-w-[500px] text-white">
                  {banner.badge && (
                    <span className="inline-block bg-[#0284c7] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-1.5 shadow-sm">
                      {banner.badge}
                    </span>
                  )}
                  <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-extrabold leading-tight tracking-tight text-white mb-1">
                    {banner.title}
                  </h2>
                  <p className="text-[11px] sm:text-[12px] text-gray-200 line-clamp-1 mb-2.5 font-normal">
                    {banner.subtitle}
                  </p>
                  <span className="inline-block bg-[#0284c7] hover:bg-[#0369a1] text-white text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded transition-all shadow-sm">
                    {banner.ctaText}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Navigation Arrows (only if multiple slides) */}
          {displayedBanners.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === 0 ? displayedBanners.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-[#0284c7] hover:scale-105 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % displayedBanners.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 hover:bg-[#0284c7] hover:scale-105 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Slide Dots Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-full">
                {displayedBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`transition-all rounded-full ${
                      i === slideIndex ? 'w-4 h-1 bg-[#0284c7]' : 'w-1 h-1 bg-white/70 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
