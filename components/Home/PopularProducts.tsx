'use client';

import React, { useRef, useMemo } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { ProductCard } from '../Product/ProductCard';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export const PopularProducts: React.FC = () => {
  const { products, t } = useMarketplace();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort by soldCount descending
  const popular = useMemo(() => {
    return [...products].sort((a, b) => b.soldCount - a.soldCount);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-5 border-b border-gray-100">
      <div className="max-w-[1240px] mx-auto px-3">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0284c7]" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
              {t('popularProducts')}
            </h2>
          </div>

          {/* Navigation Scroll Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#0284c7] hover:text-[#0284c7] flex items-center justify-center text-gray-600 transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#0284c7] hover:text-[#0284c7] flex items-center justify-center text-gray-600 transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {popular.map((item) => (
            <div key={item.id} className="w-[185px] sm:w-[200px] shrink-0">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
