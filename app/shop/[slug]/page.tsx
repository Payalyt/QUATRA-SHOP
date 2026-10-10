'use client';

import React, { use } from 'react';
import { PublicShopPage } from '@/components/Seller/PublicShopPage';
import { TopBar } from '@/components/Navbar/TopBar';
import { Header } from '@/components/Navbar/Header';
import { Footer } from '@/components/Footer/Footer';
import { useRouter } from 'next/navigation';

export default function ShopSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex flex-col">
      <TopBar onOpenMyOrders={() => router.push('/')} />
      <Header onOpenWishlist={() => {}} />
      <main className="flex-1 py-4">
        <PublicShopPage shopSlug={slug} onBack={() => router.push('/')} />
      </main>
      <Footer />
    </div>
  );
}
