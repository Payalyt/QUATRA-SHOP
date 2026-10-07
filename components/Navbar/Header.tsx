'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { BrandLogo } from '@/components/Common/BrandLogo';
import {
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronUp,
  X,
  ShieldAlert,
  Menu,
  Home,
  Package,
  Smartphone,
  Headphones,
  Tv,
  Shirt,
  Sparkles,
  ShoppingBag,
  HeartHandshake,
  Activity,
  User as UserIcon,
  Download,
  Headset,
  Truck,
  MessageCircle,
  LogOut,
  ChevronRight,
  Coins
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

export const Header: React.FC<{
  onOpenWishlist: () => void;
  onOpenMyOrders?: () => void;
}> = ({ onOpenWishlist, onOpenMyOrders }) => {
  const {
    t,
    products,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cartCount,
    setIsCartOpen,
    wishlist,
    setActiveProductModal,
    isAdminView,
    setIsAdminView,
    formatPrice,
    user,
    logout,
    setIsProfileModalOpen,
    setIsAuthModalOpen,
    setAuthModalTab,
    setIsTrackOrderModalOpen,
    language,
    setLanguage,
    showToast,
    settings,
    setIsAppDownloadModalOpen,
    orders,
    sponsoredCampaigns,
    sellers,
    recordProductClick
  } = useMarketplace();

  const mounted = useIsMounted();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter live suggestions with rich product fields and Sponsored Ad ranking
  const q = searchQuery.trim().toLowerCase();
  const suggestions = q
    ? products
        .filter((p) => {
          const seller = sellers.find((s) => s.id === p.sellerId);
          const activeAd = sponsoredCampaigns.find((c) => c.status === 'ACTIVE' && c.productId === p.id);
          const hasKeyword = activeAd?.targetKeywords?.some((kw) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()));
          return (
            p.title.toLowerCase().includes(q) ||
            p.titleBn?.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q)) ||
            seller?.shopName.toLowerCase().includes(q) ||
            hasKeyword
          );
        })
        .sort((a, b) => {
          const aIsSponsored = a.isSponsored || sponsoredCampaigns.some((c) => c.status === 'ACTIVE' && c.productId === a.id);
          const bIsSponsored = b.isSponsored || sponsoredCampaigns.some((c) => c.status === 'ACTIVE' && c.productId === b.id);
          if (aIsSponsored && !bIsSponsored) return -1;
          if (!aIsSponsored && bIsSponsored) return 1;
          return (b.soldCount || 0) - (a.soldCount || 0);
        })
        .slice(0, 6)
    : [];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs w-full overflow-hidden">
        {/* Desktop View Header */}
        <div className="hidden lg:flex max-w-[1240px] mx-auto px-3 py-3 items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setIsAdminView(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 group text-left cursor-pointer"
              title="QUATRO - Home"
            >
              <BrandLogo variant="full" size="md" />
            </button>
          </div>

          {/* Wide Search Bar with Category Dropdown and Suggestions */}
          <div ref={searchContainerRef} className="flex-1 max-w-[760px] relative">
            <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 focus-within:border-[#0284c7] focus-within:bg-white focus-within:shadow-md transition-all overflow-hidden ring-1 ring-transparent focus-within:ring-[#0284c7]/20 h-10">
              {/* Category Select */}
              <div className="relative border-r border-gray-200 hidden sm:block shrink-0 h-full flex items-center">
                <select
                  value={selectedCategory || 'all'}
                  onChange={(e) => setSelectedCategory(e.target.value === 'all' ? null : e.target.value)}
                  className="text-[12.5px] bg-transparent text-gray-700 h-full pl-4 pr-8 outline-none font-bold cursor-pointer hover:text-[#0284c7] transition-colors"
                >
                  <option value="all">{t('allCategories')}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Input field */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 h-full px-4 text-[13px] bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-400"
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Blue Search Action Button */}
              <button
                onClick={() => setIsSearchFocused(false)}
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-5 h-full flex items-center justify-center transition-colors shrink-0"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-xl py-2 z-50 animate-in fade-in-50 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between border-b border-gray-100">
                  <span>Matching Marketplace Products</span>
                  <span className="text-[10px] text-gray-400">{suggestions.length} found</span>
                </div>

                {suggestions.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {suggestions.map((item) => {
                      const isItemSponsored = item.isSponsored || sponsoredCampaigns.some((c) => c.status === 'ACTIVE' && c.productId === item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (isItemSponsored) recordProductClick(item.id);
                            setActiveProductModal(item);
                            setIsSearchFocused(false);
                          }}
                          className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                            isItemSponsored ? 'bg-amber-50/40 hover:bg-amber-100/60' : 'hover:bg-sky-50/70'
                          }`}
                        >
                          <div className="w-10 h-10 rounded bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.media[0]?.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {isItemSponsored && (
                                <span className="bg-gradient-to-r from-sky-500 to-[#0284c7] text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs shrink-0">
                                  Ad
                                </span>
                              )}
                              <p className="text-[13px] font-medium text-gray-900 truncate">{item.title}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[12px] font-bold text-[#0284c7] tabular-nums">
                                {formatPrice(item.price)}
                              </span>
                              <span className="text-[11px] text-gray-400 line-through tabular-nums">
                                {formatPrice(item.originalPrice)}
                              </span>
                              <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded font-semibold">
                                -{item.discountPercent}%
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center text-[12px] text-gray-500">
                    No products matched &ldquo;{searchQuery}&rdquo;. Try another term.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Wishlist, Cart & Admin Switch */}
          <div className="flex items-center gap-3 shrink-0">
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => setIsAdminView(!isAdminView)}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                  isAdminView
                    ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-sky-300'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isAdminView ? 'Storefront' : 'Admin Panel'}</span>
              </button>
            )}

            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-gray-700 hover:text-[#0284c7] transition-colors rounded-full hover:bg-sky-50 cursor-pointer"
              title={t('wishlist')}
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlist.length > 0 ? (
                <span
                  suppressHydrationWarning
                  className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#0284c7] text-white text-[10px] font-bold flex items-center justify-center pointer-events-none"
                >
                  {wishlist.length}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg group transition-colors cursor-pointer border border-transparent hover:border-orange-200"
              title={t('cart')}
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-[#f85606] group-hover:scale-105 transition-all" />
                {mounted && cartCount > 0 ? (
                  <span
                    suppressHydrationWarning
                    className="absolute -top-1.5 -right-2 bg-[#f85606] text-white text-[11px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white shadow-xs pointer-events-none"
                  >
                    {cartCount}
                  </span>
                ) : null}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[11px] text-[#f85606] font-bold">{t('cart')}</span>
                <span suppressHydrationWarning className="text-[12px] font-black text-gray-900 tabular-nums">
                  {mounted ? cartCount : 0} {t('items')}
                </span>
              </div>
            </button>

            {/* Desktop User Display / Login & Signup (Directly visible, not hidden) */}
            {user ? (
              <div className="hidden lg:flex items-center gap-2 border-l border-gray-200 pl-3">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-xl hover:bg-sky-50/70 border border-gray-200 hover:border-sky-300 transition-all text-left cursor-pointer group"
                  title="Account Settings"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-xs font-black overflow-hidden border border-sky-200 shrink-0 shadow-2xs">
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-extrabold text-gray-900 group-hover:text-[#0284c7] leading-tight max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-sky-700 leading-none mt-0.5">
                      {user.customerId ? `ID: ${user.customerId}` : (user.role === 'ADMIN' ? 'Admin' : 'Customer')}
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 border-l border-gray-200 pl-3">
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:text-[#0284c7] hover:bg-sky-50 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>{t('login')}</span>
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    setAuthModalTab('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-2xs transition-all cursor-pointer"
                >
                  <span>{t('signup')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile & Tablet View Header - Stacked layout to prevent overflows */}
        <div className="flex lg:hidden flex-col gap-1.5 px-2 py-2 w-full">
          {/* Mobile Row 1: Hamburg Menu, Logo, Actions */}
          <div className="flex items-center justify-between gap-1.5 w-full">
            {/* Hamburger Side Menu Trigger & Logo */}
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg shadow-xs transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0"
                title="Toggle Navigation Menu"
              >
                <Menu className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setIsAdminView(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1 text-left min-w-0 overflow-hidden shrink"
                title="QUATRO - Home"
              >
                <BrandLogo variant="full" size="sm" />
              </button>
            </div>

            {/* Mobile Actions: Login/Signup, User display, Wishlist, Cart */}
            <div className="flex items-center gap-1 shrink-0">
              {mounted && (
                <>
                  {!user ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setAuthModalTab('login');
                          setIsAuthModalOpen(true);
                        }}
                        className="flex items-center gap-0.5 px-1.5 py-1 rounded-md bg-[#0284c7] hover:bg-[#0369a1] text-white text-[10px] font-bold shadow-2xs transition-all cursor-pointer"
                      >
                        <UserIcon className="w-3 h-3" />
                        <span>{t('login')}</span>
                      </button>
                      <button
                        onClick={() => {
                          setAuthModalTab('signup');
                          setIsAuthModalOpen(true);
                        }}
                        className="flex items-center gap-0.5 px-1.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-[#0284c7] text-[10px] font-bold transition-all cursor-pointer"
                      >
                        <span>{t('signup')}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="flex items-center gap-1 px-1.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100/80 border border-sky-200 text-gray-900 text-[10px] font-bold transition-all cursor-pointer"
                      title={user.name}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[8px] font-black shrink-0 overflow-hidden border border-sky-200">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span>{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="max-w-[60px] truncate font-extrabold text-[#0284c7]">{user.name}</span>
                    </button>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={onOpenWishlist}
                    className="relative p-2 text-gray-700 hover:text-[#0284c7] transition-colors rounded-lg hover:bg-sky-50"
                    title="Wishlist"
                  >
                    <Heart className="w-5 h-5" />
                    {wishlist.length > 0 && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#0284c7] text-white text-[8px] font-bold flex items-center justify-center pointer-events-none">
                        {wishlist.length}
                      </span>
                    )}
                  </button>

                  {/* Cart */}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-[#f85606] hover:bg-orange-50 transition-colors rounded-lg cursor-pointer"
                    title="Cart"
                  >
                    <ShoppingCart className="w-5 h-5 text-[#f85606]" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#f85606] text-white text-[8px] font-black flex items-center justify-center pointer-events-none shadow-xs">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Row 2: Search Bar */}
          <div ref={mobileSearchRef} className="relative w-full">
            <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 focus-within:border-[#0284c7] focus-within:bg-white focus-within:shadow-md transition-all overflow-hidden w-full ring-1 ring-transparent focus-within:ring-[#0284c7]/20">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 py-2.5 px-4 text-[13px] bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full shrink-0 mr-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => setIsSearchFocused(false)}
                className="bg-[#0284c7] text-white px-4 py-2 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile search suggestions */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-xl py-1 z-50 animate-in fade-in-50 duration-150 max-h-[300px] overflow-y-auto">
                {suggestions.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {suggestions.map((item) => {
                      const isItemSponsored = item.isSponsored || sponsoredCampaigns.some((c) => c.status === 'ACTIVE' && c.productId === item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (isItemSponsored) recordProductClick(item.id);
                            setActiveProductModal(item);
                            setIsSearchFocused(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 flex items-center gap-2 transition-colors ${
                            isItemSponsored ? 'bg-amber-50/50 hover:bg-amber-100/70' : 'hover:bg-sky-50/70'
                          }`}
                        >
                          <div className="w-8 h-8 rounded bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                            <img
                              src={item.media[0]?.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              {isItemSponsored && (
                                <span className="bg-sky-600 text-white text-[8px] font-black px-1 py-0.2 rounded shrink-0">
                                  Ad
                                </span>
                              )}
                              <p className="text-[11.5px] font-medium text-gray-900 truncate">{item.title}</p>
                            </div>
                            <p className="text-[11px] font-bold text-[#0284c7] tabular-nums mt-0.5">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-3 text-center text-[11px] text-gray-500">
                    No products matched.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Slide-out Hamburger Side Drawer Navigation Menu for Mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative w-80 max-w-[85%] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            {/* Eye-catching Header of Drawer */}
            <div className="p-4 bg-gradient-to-r from-[#0284c7] via-sky-600 to-[#0369a1] text-white flex items-center justify-between shadow-md">
              <BrandLogo variant="full" size="md" theme="white" />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-7 h-7 rounded-full bg-black/15 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content list (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3.5">
              {/* User Account Card */}
              {user ? (
                <div
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="bg-gradient-to-br from-sky-50 via-cyan-50/50 to-sky-50/30 p-3 rounded-2xl border border-sky-200/80 flex items-center justify-between shadow-2xs cursor-pointer hover:border-sky-300 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0 overflow-hidden border border-sky-200">
                      {user.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span>{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-xs text-gray-900 group-hover:text-[#0284c7] truncate transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 truncate">
                        {user.email || user.phone}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#0284c7] font-extrabold shrink-0 bg-white px-2 py-1 rounded-lg border border-sky-100 shadow-2xs">
                    {user.role === 'ADMIN' ? 'Admin 👑' : 'Verified ✓'}
                  </span>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-sky-50 via-cyan-50/50 to-sky-50/30 p-3 rounded-2xl border border-sky-100 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-xs text-gray-900 truncate uppercase">
                        Welcome to QUATRO
                      </h4>
                      <p className="text-[10px] text-gray-500 truncate">
                        Sign in for fast checkout &amp; orders
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setAuthModalTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="shrink-0 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    {t('login')}
                  </button>
                </div>
              )}

              {/* Navigation Buttons: Home & Orders (Styled exactly like Category buttons) */}
              <div className="space-y-1">
                {/* Home Button */}
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                    setIsAdminView(false);
                    setIsMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all active:scale-97 active:translate-y-[1px] active:shadow-xs cursor-pointer ${
                    !selectedCategory && !searchQuery && !isAdminView
                      ? 'bg-sky-50 text-[#0284c7] font-bold border-sky-200 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 shadow-2xs active:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        !selectedCategory && !searchQuery && !isAdminView
                          ? 'bg-[#0284c7] text-white shadow-2xs'
                          : 'bg-sky-100/70 text-[#0284c7]'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Orders Button (Click directly opens the Order Page Modal) */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenMyOrders) {
                      onOpenMyOrders();
                    } else {
                      setIsTrackOrderModalOpen(true);
                    }
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all active:scale-97 active:translate-y-[1px] active:shadow-xs cursor-pointer bg-white text-gray-700 border-gray-100 hover:border-gray-200 shadow-2xs active:bg-gray-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-sky-100/70 text-[#0284c7] flex items-center justify-center transition-colors">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{language === 'bn' ? 'অর্ডারসমূহ' : 'Orders'}</span>
                      {orders.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-sky-100 text-[#0284c7]">
                          {orders.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Affiliate Partner Program Mobile Entry */}
                <Link
                  href="/affiliate"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all active:scale-97 cursor-pointer bg-orange-50/90 text-[#f85606] border-orange-200 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#f85606] text-white flex items-center justify-center shadow-2xs">
                      <Coins className="w-3.5 h-3.5" />
                    </div>
                    <span>{language === 'bn' ? 'অ্যাফিলিয়েট আর্নিং (১০%)' : 'Earn Money / Affiliate (10%)'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
                </Link>
              </div>

              {/* Shopping Categories List */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1 mb-1">
                  <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Categories
                  </h5>
                  <span className="text-[10px] text-[#0284c7] font-semibold">
                    {categories.length + 1}
                  </span>
                </div>

                {/* All items link */}
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all active:scale-97 active:translate-y-[1px] active:shadow-xs cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-sky-50 text-[#0284c7] font-bold border-sky-200 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 shadow-2xs active:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-sky-100/70 text-[#0284c7] flex items-center justify-center text-[10px] font-black">
                      ALL
                    </div>
                    <span>{language === 'bn' ? 'সকল পণ্য' : 'All Products'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {categories.map((cat) => {
                  const Icon = ICON_MAP[cat.iconName] || ShoppingBag;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all active:scale-97 active:translate-y-[1px] active:shadow-xs cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50 text-[#0284c7] font-bold border-sky-200 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 shadow-2xs active:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#0284c7] text-white shadow-2xs'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  );
                })}
              </div>

              {/* Customer Center (Services) */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-3 space-y-1">
                <h5 className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-400 tracking-wider mb-1 px-1">
                  Services
                </h5>

                {/* Direct WhatsApp Contact Button */}
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '01712345678').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsappGreeting || 'Hello QUATRO!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-3.5 py-3 text-xs font-extrabold text-white bg-[#0284c7] hover:bg-[#0369a1] border-2 border-[#0284c7] rounded-xl flex items-center justify-between transition-all active:scale-97 cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center shadow-xs shrink-0">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-xs tracking-tight">Chat on WhatsApp</span>
                  </div>
                  <span className="text-[10px] font-black bg-white text-[#0284c7] px-2 py-0.5 rounded-full shadow-2xs">
                    24/7 Live
                  </span>
                </a>

                {/* Track Order Button */}
                <button
                  onClick={() => {
                    setIsTrackOrderModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-3 text-xs font-extrabold text-white bg-[#0284c7] hover:bg-[#0369a1] border-2 border-[#0284c7] rounded-xl flex items-center justify-between transition-all active:scale-97 cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-xs tracking-tight uppercase">Track My Order</span>
                  </div>
                  <span className="text-[10px] font-black bg-white text-[#0284c7] px-2 py-0.5 rounded-full shadow-2xs">
                    Status →
                  </span>
                </button>

                {/* Mobile Language Switcher */}
                <div className="pt-2 px-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-600">Language / ভাষা</span>
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                        language === 'en'
                          ? 'bg-[#0284c7] text-white shadow-xs'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('bn')}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                        language === 'bn'
                          ? 'bg-[#0284c7] text-white shadow-xs'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      বাংলা
                    </button>
                  </div>
                </div>

                {/* Prominent Bottom Action (Logout under 3 lines menu if logged in, or Login/Signup) */}
                {user ? (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-xl border border-red-200 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{language === 'bn' ? 'লগআউট করুন' : 'Log Out Account'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setAuthModalTab('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full py-2 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>{t('login')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setAuthModalTab('signup');
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full py-2 px-3 bg-white hover:bg-sky-50 text-[#0284c7] font-bold text-xs rounded-xl border border-[#0284c7] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{t('signup')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer of Drawer */}
            <div className="p-3 border-t border-gray-100 bg-[#fafafa] text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              © 2026 QUATRO Marketplace Ltd.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
