'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Smartphone, HelpCircle, Store, Truck, ShieldCheck, User as UserIcon, Globe, ChevronDown, LogOut } from 'lucide-react';

export const TopBar: React.FC<{ onOpenMyOrders: () => void }> = ({ onOpenMyOrders }) => {
  const {
    language,
    setLanguage,
    t,
    user,
    logout,
    switchRole,
    setIsAuthModalOpen,
    setAuthModalTab,
    isAdminView,
    setIsAdminView,
    settings,
    setIsTrackOrderModalOpen,
    setIsProfileModalOpen,
    setIsAppDownloadModalOpen,
    showToast
  } = useMarketplace();

  return (
    <div className="bg-[#f5f5f5] border-b border-gray-200 text-[12px] text-gray-600 hidden lg:block">
      <div className="max-w-[1240px] mx-auto px-3 py-1 flex items-center justify-between">
        {/* Left Links */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAppDownloadModalOpen(true)}
            className="flex items-center gap-1 text-[#0284c7] hover:text-[#0369a1] font-semibold transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>{t('downloadApp')} (v2.4.1 APK)</span>
          </button>
          <span className="text-gray-300">|</span>
          <a
            href={`https://wa.me/${(settings.whatsappNumber || '01712345678').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsappGreeting || 'Hello QUATRO!')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-emerald-600 transition-colors text-emerald-700 font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WhatsApp: {settings.whatsappNumber || '+8801712345678'}</span>
          </a>
          <span className="text-gray-300 hidden md:inline">|</span>
          <Link
            href="/sell"
            className="flex items-center gap-1 hover:text-[#0284c7] transition-colors hidden md:flex font-medium text-emerald-700"
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t('sellOnUs')} (Sell on QUATRO)</span>
          </Link>
        </div>

        {/* Right Links & Account */}
        <div className="flex items-center gap-4">
          {/* My Orders & Order Tracking */}
          <button
            onClick={onOpenMyOrders}
            className="flex items-center gap-1 text-gray-700 hover:text-[#0284c7] font-semibold transition-colors cursor-pointer"
          >
            <span>{t('myOrders')}</span>
          </button>

          <span className="text-gray-300">|</span>

          <button
            onClick={() => setIsTrackOrderModalOpen(true)}
            className="flex items-center gap-1 text-[#0284c7] font-semibold hover:text-[#0369a1] transition-colors cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>{t('trackMyOrder')}</span>
          </button>

          <span className="text-gray-300">|</span>

          {/* Language Toggle */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-[#0284c7]" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-1 py-0.5 rounded text-[11px] font-medium transition-colors ${
                language === 'en' ? 'bg-[#0284c7] text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-1 py-0.5 rounded text-[11px] font-medium transition-colors ${
                language === 'bn' ? 'bg-[#0284c7] text-white' : 'text-gray-600 dark:text-gray-300 hover:text-black'
              }`}
            >
              বাংলা
            </button>
          </div>

          <span className="text-gray-300">|</span>

          {/* User Account / Admin Switch */}
          {user ? (
            <div className="relative group">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 font-medium hover:text-[#0284c7] transition-colors py-0.5"
                title="Manage Profile & Settings"
              >
                <div className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] uppercase font-bold overflow-hidden border border-sky-200 shrink-0">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                {user.role === 'ADMIN' && (
                  <span className="bg-sky-100 text-sky-800 text-[9px] px-1 rounded font-semibold uppercase">
                    Admin
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
                <div
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-3 py-2 border-b border-gray-100 hover:bg-sky-50/60 cursor-pointer transition-colors"
                >
                  <p className="text-[11px] font-bold text-gray-900">{user.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono font-bold bg-sky-50 text-[#0284c7] px-1.5 py-0.5 rounded border border-sky-200">
                      {user.customerId ? `ID: ${user.customerId}` : (user.role === 'ADMIN' ? 'Admin' : 'QA Account')}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</p>
                  <span className="text-[9px] text-[#0284c7] font-semibold mt-0.5 block">
                    Manage Profile &amp; Logo →
                  </span>
                </div>

                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="w-full text-left px-3 py-1.5 hover:bg-sky-50 hover:text-[#0284c7] flex items-center gap-2 text-gray-700 font-semibold"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>{user.name} ({t('myAccount') || 'Account Settings'})</span>
                </button>

                <button
                  onClick={onOpenMyOrders}
                  className="w-full text-left px-3 py-1.5 hover:bg-sky-50 hover:text-[#0284c7] flex items-center gap-2 text-gray-700"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t('myOrders')}</span>
                </button>

                <button
                  onClick={() => setIsAdminView(!isAdminView)}
                  className="w-full text-left px-3 py-1.5 hover:bg-sky-50 hover:text-[#0284c7] flex items-center gap-2 font-medium text-sky-600"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAdminView ? 'View Marketplace Store' : t('adminDashboard')}</span>
                </button>

                <button
                  onClick={() => switchRole(user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                  className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-600 border-t border-gray-100"
                >
                  <Store className="w-3.5 h-3.5 text-gray-400" />
                  <span>Switch to {user.role === 'ADMIN' ? 'Customer' : 'Admin'}</span>
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-gray-100 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="hover:text-[#0284c7] font-medium"
              >
                {t('login')}
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  setAuthModalTab('signup');
                  setIsAuthModalOpen(true);
                }}
                className="hover:text-[#0284c7] font-medium"
              >
                {t('signup')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
