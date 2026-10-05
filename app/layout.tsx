import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AppProvider } from '@/components/Providers/AppProvider';

export const metadata: Metadata = {
  title: 'QUATRO - Bangladesh Online Shopping Marketplace',
  description: "Bangladesh's premier online marketplace with authentic products, flash sales, fast nationwide delivery, 7-day returns, and bKash / COD payments.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QUATRO',
  },
  openGraph: {
    title: 'QUATRO - Bangladesh Online Shopping Marketplace',
    description: "Bangladesh's premier online marketplace with authentic products, flash sales, fast nationwide delivery, 7-day returns, and bKash / COD payments.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QUATRO - Bangladesh Online Shopping Marketplace',
    description: "Bangladesh's premier online marketplace with authentic products, flash sales, fast nationwide delivery, 7-day returns, and bKash / COD payments.",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
