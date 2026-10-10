'use client';

import React from 'react';
import { MarketplaceProvider } from '@/lib/store/marketplace-store';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return <MarketplaceProvider>{children}</MarketplaceProvider>;
}
