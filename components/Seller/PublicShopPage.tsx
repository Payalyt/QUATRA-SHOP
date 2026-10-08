'use client';

import React, { useState, useMemo } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  Store,
  Star,
  UserCheck,
  UserPlus,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  Heart,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  ArrowLeft
} from 'lucide-react';

export const PublicShopPage: React.FC<{
  shopSlug: string;
  onBack?: () => void;
}> = ({ shopSlug, onBack }) => {
  const {
    sellers,
    products,
    categories,
    toggleFollowShop,
    isFollowingShop,
    setActiveProductModal,
    addToCart,
    formatPrice,
    t
  } = useMarketplace();

  const [shopSearch, setShopSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  // Find shop by slug or ID
  const shop = useMemo(() => {
    const decodedSlug = decodeURIComponent(shopSlug || '').toLowerCase();
    const found = sellers.find(
      (s) =>
        (s.slug && s.slug.toLowerCase() === decodedSlug) ||
        (s.id && s.id.toLowerCase() === decodedSlug) ||
        (s.shopName && s.shopName.toLowerCase() === decodedSlug)
    );

    if (found) return found;

    // Clean real dynamic merchant representation
    const formattedTitle = decodedSlug
      .split(/[-_]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      id: shopSlug || 'official-store',
      shopName: formattedTitle || 'Official Store',
      slug: shopSlug || 'official-store',
      logo: '',
      banner: '',
      description: 'Official Verified Merchant Store on QUATRO.',
      phone: '',
      email: '',
      shopAddress: 'Dhaka, Bangladesh',
      status: 'Approved' as const,
      rating: 5.0,
      followerCount: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
  }, [sellers, shopSlug]);

  const isFollowing = isFollowingShop(shop.id);

  // Filter shop products
  const shopProducts = useMemo(() => {
    return products.filter((p) => {
      const isOwner = !p.sellerId || p.sellerId === shop.id;
      const matchesSearch =
        p.title.toLowerCase().includes(shopSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(shopSearch.toLowerCase());
      const matchesCat = !selectedCat || p.categoryId === selectedCat;
      return isOwner && matchesSearch && matchesCat;
    });
  }, [products, shop.id, shopSearch, selectedCat]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans pb-16">
      {/* Back to Marketplace */}
      {onBack && (
        <div className="bg-[#0284c7] text-white px-4 py-2 border-b border-sky-700 text-xs font-bold">
          <div className="max-w-[1240px] mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 hover:text-sky-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to QUATRO Marketplace</span>
            </button>
            <span className="text-[11px] text-sky-100">
              Official Merchant Shop: {shop.shopName}
            </span>
          </div>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="relative bg-[#0284c7] overflow-hidden">
        {/* Banner image */}
        <div className="h-48 sm:h-64 w-full relative">
          <img
            src={shop.banner || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80'}
            alt={shop.shopName}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0284c7] via-sky-600/50 to-transparent" />
        </div>

        {/* Shop Info Card Overlay */}
        <div className="max-w-[1240px] mx-auto px-4 relative -mt-20 pb-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={shop.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'}
                alt={shop.shopName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-200 shadow-md shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
                    {shop.shopName}
                  </h1>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Merchant
                  </span>
                </div>
                <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
                  {shop.description}
                </p>
                <div className="flex items-center gap-4 text-xs font-extrabold text-gray-700 pt-1">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-gray-900">{shop.rating}</span> / 5.0 Rating
                  </span>
                  <span>•</span>
                  <span>{shop.followerCount.toLocaleString()} Followers</span>
                  <span>•</span>
                  <span className="text-gray-400 font-normal">Member since {shop.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleFollowShop(shop.id)}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98 ${
                  isFollowing
                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                    : 'bg-[#0284c7] text-white hover:bg-[#0369a1]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following Shop</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>+ Follow Shop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Shop Catalog */}
      <div className="max-w-[1240px] mx-auto px-4 mt-6 space-y-5">
        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              placeholder={`Search products inside ${shop.shopName}...`}
              className="w-full py-2.5 pl-10 pr-4 text-xs rounded-xl border border-gray-200 focus:border-[#0284c7] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCat(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                !selectedCat ? 'bg-[#0284c7] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Items ({shopProducts.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCat === c.id ? 'bg-[#0284c7] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {shopProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-sky-300 transition-all shadow-2xs hover:shadow-md overflow-hidden flex flex-col group cursor-pointer"
              onClick={() => setActiveProductModal(p)}
            >
              {/* Product Media Thumbnail */}
              <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                <img
                  src={p.media[0]?.url}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.discountPercent > 0 && (
                  <span className="absolute top-2 left-2 bg-[#0284c7] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    -{p.discountPercent}%
                  </span>
                )}
              </div>

              {/* Product Content */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block mb-0.5">{p.brand}</span>
                  <h3 className="font-extrabold text-xs text-gray-900 line-clamp-2 leading-snug group-hover:text-[#0284c7] transition-colors">
                    {p.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-sm font-black text-[#0284c7] tabular-nums">
                      {formatPrice(p.price)}
                    </span>
                    {p.originalPrice > p.price && (
                      <span className="text-[10px] text-gray-400 line-through block font-medium tabular-nums">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="p-2 rounded-xl bg-sky-50 hover:bg-[#0284c7] text-[#0284c7] hover:text-white transition-colors cursor-pointer"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
