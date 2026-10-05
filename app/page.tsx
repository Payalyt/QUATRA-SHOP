'use client';

import React, { useState } from 'react';
import { MarketplaceProvider, useMarketplace } from '@/lib/store/marketplace-store';
import { TopBar } from '@/components/Navbar/TopBar';
import { Header } from '@/components/Navbar/Header';
import { CategoryMegaMenu } from '@/components/Navbar/CategoryMegaMenu';
import { RoundCategories } from '@/components/Home/RoundCategories';
import { FlashSaleSection } from '@/components/Home/FlashSaleSection';
import { PopularProducts } from '@/components/Home/PopularProducts';
import { DealsBanners } from '@/components/Home/DealsBanners';
import { CategoryBannerSlider } from '@/components/Home/CategoryBannerSlider';
import { CategoryShowcase } from '@/components/Home/CategoryShowcase';
import { JustForYou } from '@/components/Home/JustForYou';
import { SearchListingView } from '@/components/Search/SearchListingView';
import { ProductDetailModal } from '@/components/Product/ProductDetailModal';
import { ProductVideoModal } from '@/components/Product/ProductVideoModal';
import { CartDrawer } from '@/components/Cart/CartDrawer';
import { CheckoutModal } from '@/components/Checkout/CheckoutModal';
import { OrderSuccessModal } from '@/components/Orders/OrderSuccessModal';
import { MyOrdersView } from '@/components/Orders/MyOrdersView';
import { AuthModal } from '@/components/Auth/AuthModal';
import { WishlistModal } from '@/components/Wishlist/WishlistModal';
import { TrackOrderModal } from '@/components/Orders/TrackOrderModal';
import { UserProfileModal } from '@/components/Profile/UserProfileModal';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';
import { Footer } from '@/components/Footer/Footer';
import { WhatsAppButton } from '@/components/WhatsApp/WhatsAppButton';
import { AppDownloadModal } from '@/components/AppDownload/AppDownloadModal';
import { CheckCircle2, AlertCircle, Info, X, Home as HomeIcon, LayoutGrid, Heart, ShoppingCart, User as UserIcon } from 'lucide-react';

function MarketplaceApp() {
  const {
    isAdminView,
    searchQuery,
    selectedCategory,
    toast,
    setSearchQuery,
    setSelectedCategory,
    setIsCartOpen,
    setIsProfileModalOpen,
    setIsAuthModalOpen,
    setIsAdminView,
    wishlist,
    cartCount,
    user
  } = useMarketplace();

  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // If viewing admin portal
  if (isAdminView) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
        <AdminDashboard />
      </div>
    );
  }

  // Check if search or specific category filter is active
  const isSearchOrFilterActive = Boolean(searchQuery.trim() || selectedCategory);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans text-gray-900 selection:bg-[#0284c7] selection:text-white">
      {/* 1. Top Mini Bar */}
      <TopBar onOpenMyOrders={() => setIsMyOrdersOpen(true)} />

      {/* 2. Sticky Header */}
      <Header
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 lg:pb-0">
        {isSearchOrFilterActive ? (
          /* Search & Listing View with dynamic sliding banners at top */
          <>
            <CategoryBannerSlider />
            <SearchListingView />
          </>
        ) : (
          /* Full Marketplace Home Experience */
          <>
            {/* Mega Category Menu & Auto-playing Hero Slider */}
            <CategoryMegaMenu />

            {/* Circular Category Row */}
            <RoundCategories />

            {/* Flash Sale Section with Countdown & Sold Meter */}
            <FlashSaleSection />

            {/* Popular Products with Horizontal Scroll */}
            <PopularProducts />

            {/* Promotional Deal Banners */}
            <DealsBanners />

            {/* Top Categories Showcase */}
            <CategoryShowcase />

            {/* Just For You Dense Infinite Grid */}
            <JustForYou />
          </>
        )}
      </main>

      {/* 3. Rich Marketplace Footer */}
      <Footer />

      {/* Sticky Mobile & Tablet Bottom Navigation Menu */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 py-2 px-4 shadow-lg flex lg:hidden items-center justify-between pb-safe">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSearchQuery('');
            setIsAdminView(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-bold ${
            !selectedCategory && !searchQuery && !isAdminView ? 'text-[#0284c7]' : 'text-gray-500 hover:text-[#0284c7]'
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
            setIsAdminView(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-bold ${
            selectedCategory === 'all' ? 'text-[#0284c7]' : 'text-gray-500 hover:text-[#0284c7]'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-bold text-gray-500 hover:text-[#0284c7] relative"
        >
          <Heart className="w-5 h-5" />
          <span>Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-5 w-3.5 h-3.5 rounded-full bg-[#0284c7] text-white text-[8px] font-bold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-bold text-gray-500 hover:text-[#0284c7] relative"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-5 w-3.5 h-3.5 rounded-full bg-[#0284c7] text-white text-[8px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            if (user) {
              setIsProfileModalOpen(true);
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className="flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-bold text-gray-500 hover:text-[#0284c7]"
        >
          <UserIcon className="w-5 h-5" />
          <span>Account</span>
        </button>
      </div>

      {/* Floating Direct WhatsApp Customer Support Button */}
      <WhatsAppButton />

      {/* Interactive Global Modals */}
      <ProductDetailModal />
      <ProductVideoModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal onOpenMyOrders={() => setIsMyOrdersOpen(true)} />
      {isMyOrdersOpen && <MyOrdersView onClose={() => setIsMyOrdersOpen(false)} />}
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <AuthModal />
      <TrackOrderModal />
      <UserProfileModal onOpenMyOrders={() => setIsMyOrdersOpen(true)} />
      <AppDownloadModal />

      {/* Floating Interactive Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-60 animate-in fade-in-50 slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold text-white ${
              toast.type === 'error'
                ? 'bg-red-600'
                : toast.type === 'info'
                ? 'bg-gray-800'
                : 'bg-emerald-600'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return <MarketplaceApp />;
}
