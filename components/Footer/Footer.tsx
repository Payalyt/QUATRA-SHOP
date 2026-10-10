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
  Send,
  PhoneCall,
  MapPin,
  Clock,
  CheckCircle2,
  Lock,
  Headphones,
  Award,
  Sparkles
} from 'lucide-react';

const FOOTER_ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  Headphones,
  Award
};

export const Footer: React.FC = () => {
  const {
    language,
    showToast,
    settings,
    setIsTrackOrderModalOpen,
    setIsAdminView,
    setIsAppDownloadModalOpen,
    addLead,
    setIsAuthModalOpen,
    setAuthModalTab,
    gateways
  } = useMarketplace();
  const [newsletterContact, setNewsletterContact] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterContact.trim()) {
      const isPhone = /^[0-9+ \-]+$/.test(newsletterContact.trim());
      addLead(
        isPhone ? undefined : newsletterContact.trim(),
        isPhone ? newsletterContact.trim() : undefined,
        'Footer Deals Newsletter'
      );
      setIsSubscribed(true);
      showToast(
        language === 'bn'
          ? 'ধন্যবাদ! নিউজলেটার সাবস্ক্রিপশন সম্পন্ন হয়েছে।'
          : 'Thank you! You have subscribed to exclusive deal alerts.',
        'success'
      );
      setNewsletterContact('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 text-xs">
      {/* 1. Value Props / Trust Feature Strip */}
      <div className="border-b border-gray-200/80 bg-linear-to-b from-sky-50/40 via-white to-gray-50/50">
        <div className="max-w-[1240px] mx-auto px-4 py-7 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {(settings.footerFeatures && settings.footerFeatures.length > 0
            ? settings.footerFeatures
            : [
                {
                  id: 'f1',
                  iconName: 'Truck',
                  title: 'Fastest Delivery in BD',
                  description: '24-48h in Dhaka, 3-5 days nationwide'
                },
                {
                  id: 'f2',
                  iconName: 'RotateCcw',
                  title: '7-Day Easy Return',
                  description: 'Hassle-free 100% money-back guarantee'
                },
                {
                  id: 'f3',
                  iconName: 'ShieldCheck',
                  title: '100% Authentic Products',
                  description: 'Directly sourced from trusted brands'
                },
                {
                  id: 'f4',
                  iconName: 'CreditCard',
                  title: 'Secure COD & Online Pay',
                  description: 'bKash, Nagad, Rocket, Cards & COD'
                }
              ]
          ).map((feature) => {
            const Icon = FOOTER_ICON_MAP[feature.iconName] || ShieldCheck;
            const iconBg =
              feature.iconName === 'ShieldCheck'
                ? 'bg-sky-100 text-[#0284c7]'
                : feature.iconName === 'Truck'
                ? 'bg-blue-100 text-blue-600'
                : feature.iconName === 'RotateCcw'
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-amber-100 text-amber-700';

            return (
              <div
                key={feature.id}
                className="flex items-center gap-3.5 p-3 rounded-xl bg-white/80 border border-gray-100/90 shadow-3xs hover:shadow-2xs hover:border-sky-200 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg} shadow-3xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-xs sm:text-[13px] leading-tight mb-0.5">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-snug">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-[1240px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: Brand & Contact (Takes 2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo variant="full" size="md" />
            </Link>
            <p className="text-gray-600 text-[12px] leading-relaxed max-w-sm">
              {language === 'bn'
                ? 'কোয়াট্রো (QUATRO) - বাংলাদেশের নির্ভরযোগ্য স্মার্ট অনলাইন মাল্টি-ভেন্ডর মার্কেটপ্লেস। দেশজুড়ে বিশ্বস্ত ক্যাশ অন ডেলিভারি এবং জেনুইন পণ্য।'
                : 'QUATRO - The modern multi-vendor marketplace in Bangladesh. Safe cash on delivery, verified merchant stores, and fast nationwide delivery.'}
            </p>

            {/* Quick Direct Support Cards */}
            <div className="space-y-2 pt-1 max-w-sm">
              <a
                href={`https://wa.me/${(settings.whatsappNumber || '01712345678').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsappGreeting || 'Hello QUATRO!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs transition-colors group cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="flex-1">WhatsApp Live Support: <strong>{settings.whatsappNumber || '+880 1712-345678'}</strong></span>
              </a>

              <div className="flex items-center gap-2 text-[11.5px] text-gray-700 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                <PhoneCall className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                <span>Helpline: <strong className="text-gray-900">{settings.supportPhone || '+880 9610-000000'}</strong> (9am - 10pm)</span>
              </div>

              <div className="flex items-center gap-2 text-[11.5px] text-gray-700 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                <Mail className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                <span>Email: <strong className="text-gray-900">{settings.supportEmail || 'support@quatro.com.bd'}</strong></span>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{settings.officeAddress || 'Level 6, Navana Tower, Gulshan-1, Dhaka-1212, Bangladesh'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>Customer Care</span>
            </h4>
            <ul className="space-y-2.5 text-gray-600 text-[12px]">
              <li>
                <button
                  onClick={() => setIsTrackOrderModalOpen(true)}
                  className="hover:text-[#0284c7] font-semibold text-[#0284c7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>📦 Track My Order</span>
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-[#0284c7] transition-colors font-medium">
                  Help Center &amp; FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0284c7] transition-colors font-medium">
                  Returns &amp; Refunds Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0284c7] transition-colors font-medium">
                  Shipping &amp; Delivery Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0284c7] transition-colors font-medium">
                  Privacy Policy &amp; Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0284c7] transition-colors font-medium">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Seller Zone & About */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm uppercase tracking-wider">
              Seller Zone &amp; Info
            </h4>
            <ul className="space-y-2.5 text-gray-600 text-[12px]">
              <li>
                <Link
                  href="/sell"
                  className="bg-sky-50 hover:bg-sky-100 text-[#0284c7] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 border border-sky-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Become a Seller</span>
                </Link>
              </li>
              {settings.footerLinks?.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className="hover:text-[#0284c7] transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#" className="hover:text-[#0284c7] transition-colors font-medium">
                  Wholesale &amp; Corporate Bulk
                </a>
              </li>
              <li>
                <Link href="/affiliate" className="text-[#f85606] hover:underline font-bold flex items-center gap-1.5 transition-colors">
                  <span>💰 Affiliate Partner Program (Earn 10%)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Payments, Delivery & Newsletter */}
          <div className="space-y-4">
            <div>
              <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-2.5">
                Payment Methods
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(gateways && gateways.length > 0 ? gateways.filter((g) => g.isActive) : []).map((gw) => (
                  <span
                    key={gw.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-bold text-[10.5px]"
                  >
                    <CreditCard className="w-3 h-3 text-[#0284c7]" />
                    <span>{gw.name}</span>
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10.5px]">
                  💵 Cash on Delivery
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-2.5">
                Delivery Couriers
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(settings.deliveryPartners && settings.deliveryPartners.length > 0
                  ? settings.deliveryPartners
                  : [
                      { id: 'dp1', name: 'Steadfast' },
                      { id: 'dp2', name: 'RedX' },
                      { id: 'dp3', name: 'Paperfly' },
                      { id: 'dp4', name: 'Pathao Courier' }
                    ]
                ).map((partner) => (
                  <span
                    key={partner.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-600 font-medium text-[10.5px]"
                  >
                    <Truck className="w-2.5 h-2.5 text-gray-400" />
                    <span>{partner.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2 border-t border-gray-100">
              <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-1.5">
                Special Offers &amp; Alerts
              </h4>
              <p className="text-[11px] text-gray-500 mb-2">
                Get weekly voucher codes &amp; flash sale updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-1.5">
                <input
                  type="text"
                  value={newsletterContact}
                  onChange={(e) => setNewsletterContact(e.target.value)}
                  placeholder="017... or email"
                  className="flex-1 text-xs px-2.5 py-2 rounded-lg border border-gray-300 focus:border-[#0284c7] outline-none font-medium text-gray-800 bg-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {isSubscribed && (
                <span className="text-emerald-600 text-[10.5px] font-bold block mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Subscribed successfully!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Trust & Compliance Strip */}
      <div className="border-t border-gray-200 bg-gray-50/70 py-3.5">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500">
          <div className="flex items-center gap-2 flex-wrap font-medium">
            <span className="flex items-center gap-1 text-gray-700 font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="text-gray-600">DBID: DBID-892410-BD</span>
            <span>•</span>
            <span className="text-gray-600">e-CAB Member ID: 19482</span>
            <span>•</span>
            <span className="text-gray-600">BSTI Verified Standards</span>
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <span>Follow Us:</span>
            <a href="#" className="hover:text-[#0284c7] transition-colors" title="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-pink-600 transition-colors" title="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-red-600 transition-colors" title="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. Bottom Copyright */}
      <div className="border-t border-gray-200 bg-gray-100 py-3.5">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500 font-medium">
          <p>© 2026 QUATRO Marketplace Ltd. All rights reserved. Crafted for Bangladesh 🇧🇩</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-[#0284c7]">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-[#0284c7]">Terms</a>
            <span>·</span>
            <a href="#" className="hover:text-[#0284c7]">Security</a>
            <span>·</span>
            <a href="#" className="hover:text-[#0284c7]">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

