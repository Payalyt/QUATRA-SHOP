'use client';

import React, { use, useState } from 'react';
import { PublicShopPage } from '@/components/Seller/PublicShopPage';
import { TopBar } from '@/components/Navbar/TopBar';
import { Header } from '@/components/Navbar/Header';
import { Footer } from '@/components/Footer/Footer';
import { ProductDetailModal } from '@/components/Product/ProductDetailModal';
import { CartDrawer } from '@/components/Cart/CartDrawer';
import { CheckoutModal } from '@/components/Checkout/CheckoutModal';
import { WishlistModal } from '@/components/Wishlist/WishlistModal';
import { MyOrdersView } from '@/components/Orders/MyOrdersView';
import { useRouter } from 'next/navigation';

export default function ShopSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex flex-col">
      <TopBar onOpenMyOrders={() => setIsMyOrdersOpen(true)} />
      <Header
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
      />
      <main className="flex-1 py-4">
        <PublicShopPage shopSlug={slug} onBack={() => router.push('/')} />
      </main>
      <Footer />
      
      {/* Global Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      {isMyOrdersOpen && <MyOrdersView onClose={() => setIsMyOrdersOpen(false)} />}
    </div>
  );
}
