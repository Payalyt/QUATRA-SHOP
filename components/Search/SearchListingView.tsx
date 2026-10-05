'use client';

import React, { useState, useMemo } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { ProductCard } from '../Product/ProductCard';
import { RoundCategories } from '../Home/RoundCategories';
import {
  Filter,
  Star,
  Check,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Layers,
  Home as HomeIcon
} from 'lucide-react';

export const SearchListingView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    formatPrice,
    language,
    sponsoredCampaigns
  } = useMarketplace();

  // Filters state
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Extract all unique brands
  const allBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand));
    return Array.from(brandsSet);
  }, [products]);

  // Current category data
  const currentCategory = categories.find((c) => c.id === selectedCategory);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.titleBn.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          sponsoredCampaigns?.some(
            (c) =>
              c.status === 'ACTIVE' &&
              c.productId === p.id &&
              c.targetKeywords?.some((kw) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()))
          )
      );
    }

    // Price
    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Brand
    if (selectedBrand !== 'all') {
      result = result.filter((p) => p.brand === selectedBrand);
    }

    // In Stock
    if (onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: High-intent Sponsored Ads first, then highest sales, then rating!
      result.sort((a, b) => {
        const isASponsored = a.isSponsored || sponsoredCampaigns?.some((c) => c.status === 'ACTIVE' && c.productId === a.id);
        const isBSponsored = b.isSponsored || sponsoredCampaigns?.some((c) => c.status === 'ACTIVE' && c.productId === b.id);
        const aScore = (isASponsored ? 10000 : 0) + (a.soldCount || 0) * 2 + (a.rating || 0) * 100;
        const bScore = (isBSponsored ? 10000 : 0) + (b.soldCount || 0) * 2 + (b.rating || 0) * 100;
        return bScore - aScore;
      });
    }

    return result;
  }, [
    products,
    selectedCategory,
    searchQuery,
    minPrice,
    maxPrice,
    minRating,
    selectedBrand,
    onlyInStock,
    sortBy,
    sponsoredCampaigns
  ]);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(100000);
    setMinRating(0);
    setSelectedBrand('all');
    setOnlyInStock(false);
    setSortBy('popular');
  };

  const activeFilterCount =
    (minPrice > 0 ? 1 : 0) +
    (maxPrice < 100000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  return (
    <div className="bg-[#f5f5f5] pb-8">
      {/* 1. Round Category Icons Row at the top so user can ALWAYS see & click round filters */}
      <RoundCategories />

      <div className="max-w-[1240px] mx-auto px-3 pt-3">
        {/* Breadcrumb / Title & Quick Controls Bar */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 shadow-2xs mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                {currentCategory
                  ? language === 'bn'
                    ? currentCategory.nameBn
                    : currentCategory.name
                  : searchQuery
                  ? `Search: "${searchQuery}"`
                  : language === 'bn'
                  ? 'সকল পণ্য'
                  : 'All Marketplace Items'}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing <strong>{filteredProducts.length}</strong> items in Bangladesh
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-2 text-xs">
            {/* Back to Home Button */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-[#0284c7] font-semibold px-3 py-1.5 rounded-md border border-gray-200 transition-colors"
              title="Return to Main Homepage"
            >
              <HomeIcon className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>{language === 'bn' ? 'হোম পেইজ' : 'Homepage'}</span>
            </button>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-md border border-gray-300"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0284c7] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'popular' | 'price_asc' | 'price_desc' | 'rating'
                  )
                }
                className="py-1.5 px-2.5 rounded-md border border-gray-300 font-semibold bg-white text-gray-800 outline-none focus:border-[#0284c7] cursor-pointer text-xs"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Badges Row on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 lg:hidden text-xs">
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-3 py-1 rounded-full border text-[11px] font-semibold shrink-0 transition-colors ${
              onlyInStock
                ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            In Stock Only
          </button>
          <button
            onClick={() => {
              setMinPrice(0);
              setMaxPrice(2000);
            }}
            className={`px-3 py-1 rounded-full border text-[11px] font-semibold shrink-0 transition-colors ${
              minPrice === 0 && maxPrice === 2000
                ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            Under ৳2,000
          </button>
          <button
            onClick={() => {
              setMinPrice(2000);
              setMaxPrice(10000);
            }}
            className={`px-3 py-1 rounded-full border text-[11px] font-semibold shrink-0 transition-colors ${
              minPrice === 2000 && maxPrice === 10000
                ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            ৳2k - ৳10k
          </button>
          <button
            onClick={() => {
              setMinPrice(10000);
              setMaxPrice(100000);
            }}
            className={`px-3 py-1 rounded-full border text-[11px] font-semibold shrink-0 transition-colors ${
              minPrice === 10000 && maxPrice === 100000
                ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            ৳10k+
          </button>
          {(activeFilterCount > 0 || selectedCategory) && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-[11px] shrink-0"
            >
              Reset All
            </button>
          )}
        </div>

        {/* Layout: Sidebar (desktop only or mobile expanded) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Detailed Sidebar Filter (hidden on mobile unless isMobileFilterOpen is true) */}
          <div
            className={`lg:col-span-3 space-y-4 ${
              isMobileFilterOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-2xs text-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-[#0284c7]" />
                  Refine Results
                </span>
                {(activeFilterCount > 0 || selectedCategory) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[#0284c7] hover:underline font-bold text-[11px]"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Categories</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left py-1 px-1.5 rounded transition-colors text-[12px] flex items-center justify-between ${
                      selectedCategory === null
                        ? 'bg-sky-50 text-[#0284c7] font-bold'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] text-gray-400">{products.length}</span>
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`w-full text-left py-1 px-1.5 rounded transition-colors text-[12px] flex items-center justify-between ${
                        selectedCategory === c.id
                          ? 'bg-sky-50 text-[#0284c7] font-bold'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      <span className="truncate">{language === 'bn' ? c.nameBn : c.name}</span>
                      <span className="text-[10px] text-gray-400">
                        {products.filter((p) => p.categoryId === c.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Price Range */}
              <div className="pt-3 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2">Price Range (BDT)</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice || ''}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full p-1.5 rounded border border-gray-300 text-xs outline-none focus:border-[#0284c7]"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice === 100000 ? '' : maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value) || 100000)}
                      className="w-full p-1.5 rounded border border-gray-300 text-xs outline-none focus:border-[#0284c7]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Brand Filter */}
              <div className="pt-3 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2">Brand</h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 text-xs bg-white font-medium outline-none"
                >
                  <option value="all">All Brands</option>
                  {allBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Minimum Rating */}
              <div className="pt-3 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2">Customer Rating</h4>
                <div className="space-y-1.5">
                  {[4, 3, 2].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                      className={`w-full text-left py-1 px-1.5 rounded flex items-center gap-1.5 transition-colors ${
                        minRating === stars ? 'bg-sky-50 text-[#0284c7] font-bold' : 'text-gray-600'
                      }`}
                    >
                      <div className="flex text-amber-400">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px]">& Up</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. In Stock Only */}
              <div className="pt-3 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-[#0284c7] w-4 h-4 rounded"
                  />
                  <span>In Stock Items Only</span>
                </label>
              </div>

              {isMobileFilterOpen && (
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-[#0284c7] text-white py-2 rounded font-bold text-xs mt-2"
                >
                  Apply & View Products ({filteredProducts.length})
                </button>
              )}
            </div>
          </div>

          {/* Right Product Grid (Immediately visible below round categories!) */}
          <div className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-10 text-center border border-gray-200">
                <p className="text-gray-700 font-semibold mb-1">
                  No products found for the selected category.
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Try clicking &ldquo;ALL&rdquo; or another round category icon above.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#0284c7] text-white font-bold text-xs py-2 px-5 rounded shadow-xs"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
