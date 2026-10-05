'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { BrandLogo } from '@/components/Common/BrandLogo';
import {
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  Mail,
  Smartphone,
  Facebook,
  Instagram,
  Youtube,
  Send
} from 'lucide-react';

const FOOTER_ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard
};

export const Footer: React.FC = () => {
  const { language, showToast, settings, setIsTrackOrderModalOpen, setIsAdminView, setIsAppDownloadModalOpen, addLead, setIsAuthModalOpen, setAuthModalTab, gateways } = useMarketplace();
  const [newsletterContact, setNewsletterContact] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterContact.trim()) {
      const isPhone = /^[0-9+ \-]+$/.test(newsletterContact.trim());
      addLead(
        isPhone ? undefined : newsletterContact.trim(),
        isPhone ? newsletterContact.trim() : undefined,
        'Footer Deals Newsletter'
      );
      setNewsletterContact('');
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 text-xs">
      {/* Dynamic Feature Value Props */}
      <div className="border-b border-gray-100 bg-[#fafafa]">
        <div className="max-w-[1240px] mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {(settings.footerFeatures || []).map((feature) => {
            const Icon = FOOTER_ICON_MAP[feature.iconName] || ShieldCheck;
            const iconBg = 
              feature.iconName === 'ShieldCheck' ? 'bg-sky-100 text-[#0284c7]' :
              feature.iconName === 'Truck' ? 'bg-blue-100 text-blue-600' :
              feature.iconName === 'RotateCcw' ? 'bg-emerald-100 text-emerald-600' :
              'bg-pink-100 text-pink-600';

            return (
              <div key={feature.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{feature.title}</h4>
                  <p className="text-[11px] text-gray-500">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1240px] mx-auto px-4 py-10">
        {/* Brand Logo in Footer */}
        <div className="mb-8 border-b border-gray-100 pb-8">
          <Link href="/" className="inline-block">
            <BrandLogo variant="full" size="md" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Customer Care */}
          <div>
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-gray-600 text-[12px]">
              <li>
                <button
                  onClick={() => setIsTrackOrderModalOpen(true)}
                  className="hover:text-[#0284c7] font-medium text-gray-700 cursor-pointer"
                >
                  Track My Order Status
                </button>
              </li>
              <li><a href="#" className="hover:text-[#0284c7] text-gray-600 font-medium">Help Center &amp; FAQs</a></li>
              <li><a href="#" className="hover:text-[#0284c7] text-gray-600 font-medium">Returns &amp; Refunds (7-Day Policy)</a></li>
              <li>
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '01712345678').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsappGreeting || 'Hello QUATRO!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 font-bold text-emerald-700 flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>WhatsApp: {settings.whatsappNumber || '+8801712345678'}</span>
                </a>
              </li>
              <li>
                <span className="text-gray-600 font-medium">Helpline: <strong className="text-gray-900">{settings.supportPhone}</strong></span>
              </li>
              <li>
                <span className="text-gray-600 font-medium">Email: <strong className="text-gray-900">{settings.supportEmail}</strong></span>
              </li>
              <li className="text-[11px] text-gray-500 font-medium">
                {settings.officeAddress}
              </li>
            </ul>
          </div>

          {/* Col 2: About QUATRO */}
          <div>
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-3">
              About QUATRO
            </h4>
            <ul className="space-y-2 text-gray-600 text-[12px]">
              {settings.footerLinks?.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className="hover:text-[#0284c7] text-gray-600 font-medium">{link.label}</Link>
                </li>
              ))}
              <li className="pt-2 border-t border-gray-100 font-bold text-[#0284c7]">
                <Link href="/sell" className="hover:underline flex items-center gap-1">
                  <span>🛍️ Sell on QUATRO (Start Selling Today)</span>
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-[#0284c7] font-bold text-gray-800">
                  <span>🏪 Seller Center Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment & Delivery Partners */}
          <div>
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-4">
              PAYMENT METHODS
            </h4>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {gateways.filter(g => g.isActive).map((gw) => (
                <div 
                  key={gw.id} 
                  className="bg-white p-2 rounded-xl border border-gray-200 shadow-3xs flex items-center gap-2.5 group hover:border-[#0284c7] transition-all cursor-default"
                  title={gw.name}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                    {gw.logoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={gw.logoUrl} 
                        alt={gw.name} 
                        className="max-w-full max-h-full object-contain" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <CreditCard className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 whitespace-nowrap group-hover:text-[#0284c7] transition-colors">{gw.name}</span>
                </div>
              ))}
            </div>

            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-4">
              DELIVERY PARTNERS
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {(settings.deliveryPartners || []).map((partner) => (
                <div 
                  key={partner.id} 
                  className="bg-white p-2 rounded-xl border border-gray-200 shadow-3xs flex items-center gap-2.5 group hover:border-[#0284c7] transition-all cursor-default"
                  title={partner.name}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                    {partner.logoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.name} 
                        className="max-w-full max-h-full object-contain" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Truck className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 whitespace-nowrap group-hover:text-[#0284c7] transition-colors">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 5: Newsletter */}
          <div>
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-3">
              Deals Newsletter
            </h4>
            <p className="text-[11px] text-gray-600 font-medium mb-3">
              Subscribe to receive exclusive flash vouchers and discount alerts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="text"
                value={newsletterContact}
                onChange={(e) => setNewsletterContact(e.target.value)}
                placeholder="Your email or phone (017...)"
                className="w-full text-xs p-2 rounded-xl border border-gray-300 focus:border-[#0284c7] outline-none font-medium text-gray-800"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span>Subscribe Now</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-100 bg-[#f5f5f5] py-4">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <p>© 2026 QUATRO Marketplace Ltd. All Rights Reserved. Built for Bangladesh 🇧🇩</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-[#0284c7]">BSTI Verified</a>
            <span>·</span>
            <a href="#" className="hover:text-[#0284c7]">e-CAB Member</a>
            <span>·</span>
            <a href="#" className="hover:text-[#0284c7]">DBID Registered</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
