'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  Smartphone,
  Headphones,
  Tv,
  Shirt,
  Sparkles,
  ShoppingBag,
  HeartHandshake,
  Activity,
  ChevronLeft,
  ChevronRight
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

export const RoundCategories: React.FC = () => {
  const { categories, language, selectedCategory, setSelectedCategory } = useMarketplace();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.6 : clientWidth * 0.6;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#0284c7] via-sky-600 to-[#0369a1] py-3 border-y border-sky-700 shadow-sm relative group transition-colors text-white">
      <div className="max-w-[1240px] mx-auto px-4 relative">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[12.5px] sm:text-[13.5px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 drop-shadow-xs">
            <span className="w-1.5 h-4 bg-white rounded-full shadow-xs" />
            {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Explore Categories'}
          </h2>
          <div className="flex items-center gap-1.5">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs transition-all active:scale-90 ${!showLeftArrow ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              aria-label="Scroll Left"
              disabled={!showLeftArrow}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs transition-all active:scale-90 ${!showRightArrow ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              aria-label="Scroll Right"
              disabled={!showRightArrow}
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 scroll-smooth"
        >
          {/* "All" button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className="flex flex-col items-center gap-1 group shrink-0 min-w-[64px] sm:min-w-[80px] text-center p-1 rounded-xl transition-all"
          >
            <div
              className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-200 border ${
                selectedCategory === 'all'
                  ? 'border-white bg-white text-[#0284c7] shadow-md scale-105 font-black ring-4 ring-white/30'
                  : 'border-white/40 bg-white/15 text-white backdrop-blur-xs group-hover:border-white group-hover:bg-white group-hover:text-[#0284c7] group-hover:scale-105'
              }`}
            >
              <span className="font-black text-[11px] sm:text-[12px] tracking-wide">ALL</span>
            </div>
            <span
              className={`text-[10px] sm:text-[11px] leading-tight max-w-[75px] truncate ${
                selectedCategory === 'all' ? 'font-black text-white underline underline-offset-4 decoration-2' : 'font-semibold text-white/90 group-hover:text-white'
              }`}
            >
              {language === 'bn' ? 'সকল পণ্য' : 'All Items'}
            </span>
          </button>

          {/* Categories */}
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Smartphone;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center gap-1 group shrink-0 min-w-[64px] sm:min-w-[80px] text-center p-1 rounded-xl transition-all"
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-200 border overflow-hidden relative ${
                    isSelected
                      ? 'border-white bg-white text-[#0284c7] scale-105 shadow-md ring-4 ring-white/30 font-bold'
                      : 'border-white/40 bg-white/15 text-white backdrop-blur-xs group-hover:border-white group-hover:bg-white group-hover:text-[#0284c7] group-hover:scale-105 shadow-2xs'
                  }`}
                >
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200 bg-white"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isSelected ? 'text-[#0284c7]' : 'text-white'}`} />
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] leading-tight max-w-[75px] line-clamp-1 ${
                    isSelected ? 'font-black text-white underline underline-offset-4 decoration-2' : 'font-semibold text-white/90 group-hover:text-white'
                  }`}
                >
                  {language === 'bn' ? cat.nameBn : cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
