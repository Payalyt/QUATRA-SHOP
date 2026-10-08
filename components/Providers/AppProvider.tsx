'use client';

import React, { useEffect, useState } from 'react';
import { MarketplaceProvider } from '@/lib/store/marketplace-store';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <MarketplaceProvider>
      <div className="min-h-screen flex flex-col font-sans antialiased text-gray-900 bg-[#f5f5f5]">
        {children}
      </div>
    </MarketplaceProvider>
  );
}
