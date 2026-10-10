'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { ProductCard } from '../Product/ProductCard';
import { ChevronRight, Layers } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const { products, categories, language, setSelectedCategory } = useMarketplace();

  // Pick top 3 categories that have products
  const topCategories = categories.slice(0, 3);

  return (
    <div className="bg-[#f5f5f5] py-4 space-y-6">
      {topCategories.map((cat) => {
        const catProducts = products.filter((p) => p.categoryId === cat.id).slice(0, 6);
        if (catProducts.length === 0) return null;

        return (
          <section key={cat.id} className="max-w-[1240px] mx-auto px-3">
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-5 bg-[#0284c7] rounded-xs" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {language === 'bn' ? cat.nameBn : cat.name}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className="text-[12px] font-bold text-[#0284c7] hover:text-[#0369a1] flex items-center gap-1 group"
                >
                  <span>{language === 'bn' ? 'আরও দেখুন' : 'View More'}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Products Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {catProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
