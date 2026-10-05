'use client';

import React, { useState, useMemo } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { ProductCard } from '../Product/ProductCard';
import { Sparkles, Loader2 } from 'lucide-react';

export const JustForYou: React.FC = () => {
  const { products, selectedCategory, searchQuery, t, getRankedProducts } = useMarketplace();
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Apply intelligent marketplace ranking (Sponsored Ads -> High Sales -> High Rating)
  const displayed = useMemo(() => {
    return getRankedProducts(products, searchQuery, selectedCategory || undefined);
  }, [products, searchQuery, selectedCategory, getRankedProducts]);

  const visibleItems = displayed.slice(0, visibleCount);
  const hasMore = visibleCount < displayed.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoadingMore(false);
    }, 600);
  };

  return (
    <section className="bg-[#f5f5f5] py-6">
      <div className="max-w-[1240px] mx-auto px-3">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-md bg-linear-to-tr from-sky-400 to-[#0284c7] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">
            {t('justForYou')}
          </h2>
          <span className="text-[12px] text-gray-500 font-normal">
            ({displayed.length} {t('items')})
          </span>
        </div>

        {/* Dense Grid */}
        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {visibleItems.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-sm">No items found matching your selection.</p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-white hover:bg-sky-50 text-[#0284c7] border-2 border-[#0284c7] font-bold text-xs sm:text-sm px-10 py-3 rounded-md shadow-xs hover:shadow transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading Products...</span>
                </>
              ) : (
                <span>{t('loadMore')}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
