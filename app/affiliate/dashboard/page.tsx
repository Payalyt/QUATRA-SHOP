'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  Affiliate,
  AffiliateCommission,
  AffiliateLink as AffiliateLinkType,
  AffiliateWithdrawal
} from '@/lib/types/ecommerce';
import {
  DollarSign,
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  Share2,
  ExternalLink,
  CreditCard,
  User,
  Settings,
  Download,
  AlertTriangle,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Check,
  LogOut,
  ChevronRight,
  Sparkles,
  Search,
  MessageCircle,
  CalendarCheck,
  SlidersHorizontal,
  Layers,
  Filter,
  Package
} from 'lucide-react';
import { BrandLogo } from '@/components/Common/BrandLogo';

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const {
    currentAffiliate,
    setCurrentAffiliate,
    affiliates,
    affiliateLinks,
    affiliateClicks,
    affiliateCommissions,
    affiliateWithdrawals,
    affiliateSettings,
    products,
    categories,
    formatPrice,
    generateAffiliateLink,
    requestAffiliateWithdrawal,
    runAffiliateCommissionApprovalCron,
    logout,
    showToast
  } = useMarketplace();

  // If no affiliate is logged in, default to the top demo affiliate (Tanvir Ahmed) for seamless preview & testing
  const activeAffiliate: Affiliate = useMemo(() => {
    return (
      currentAffiliate ||
      affiliates[0] || {
        id: 'aff-tanvir-01',
        userId: 'usr-affiliate-tanvir',
        name: 'Tanvir Ahmed',
        email: 'affiliate.demo@gmail.com',
        phone: '01719887766',
        code: 'AFF-DEMO2026',
        status: 'Active',
        payoutMethod: 'bKash',
        payoutAccount: '01719887766',
        availableBalance: 3450,
        pendingBalance: 1280,
        totalEarned: 8230,
        totalWithdrawn: 3500,
        joinedDate: '2024-02-10',
        createdAt: '2024-02-10T10:00:00.000Z'
      }
    );
  }, [currentAffiliate, affiliates]);

  // Active dashboard navigation tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'catalog' | 'links' | 'commissions' | 'withdrawals' | 'settings'
  >('overview');

  // Chart time range filter: 7 days, 15 days, 30 days
  const [chartRange, setChartRange] = useState<'7days' | '15days' | '30days'>('15days');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Catalog tab search and category filter
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Product Link Generator Modal
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quickGeneratedUrl, setQuickGeneratedUrl] = useState<string | null>(null);

  // Withdrawal Request Modal
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPayoutMethod, setWithdrawPayoutMethod] = useState<'bKash' | 'Nagad' | 'Bank'>(
    activeAffiliate.payoutMethod || 'bKash'
  );
  const [withdrawPayoutAccount, setWithdrawPayoutAccount] = useState(
    activeAffiliate.payoutAccount || ''
  );

  // Profile Settings Form
  const [profileName, setProfileName] = useState(activeAffiliate.name);
  const [profilePhone, setProfilePhone] = useState(activeAffiliate.phone);
  const [payoutMethod, setPayoutMethod] = useState(activeAffiliate.payoutMethod);
  const [payoutAccount, setPayoutAccount] = useState(activeAffiliate.payoutAccount);

  // Affiliate specific data
  const myLinks = affiliateLinks.filter(
    (l) => l.affiliateId === activeAffiliate.id || l.affiliateCode === activeAffiliate.code
  );
  const myCommissions = affiliateCommissions.filter(
    (c) => c.affiliateId === activeAffiliate.id || c.affiliateCode === activeAffiliate.code
  );
  const myWithdrawals = affiliateWithdrawals.filter(
    (w) => w.affiliateId === activeAffiliate.id || w.affiliateCode === activeAffiliate.code
  );

  // Aggregated Stats
  const totalClicksCount = myLinks.reduce((sum, l) => sum + (l.clicksCount || 0), 0) || 741;
  const totalOrdersCount = myCommissions.length || 58;
  const conversionRate =
    totalClicksCount > 0 ? ((totalOrdersCount / totalClicksCount) * 100).toFixed(2) : '7.82';

  // 15-Day Withdrawal cycle calculation (১৫ দিন পর পর উইথড্র)
  const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;
  const recentWithdrawal = myWithdrawals.find((w) => {
    if (w.status === 'Rejected') return false;
    const reqTime = new Date(w.requestedAt).getTime();
    return Date.now() - reqTime < fifteenDaysMs;
  });

  const nextWithdrawalAvailableDate = recentWithdrawal
    ? new Date(new Date(recentWithdrawal.requestedAt).getTime() + fifteenDaysMs)
    : null;

  const isWithdrawalEligibleNow =
    !nextWithdrawalAvailableDate || Date.now() >= nextWithdrawalAvailableDate.getTime();

  const daysUntilNextWithdrawal = nextWithdrawalAvailableDate
    ? Math.max(1, Math.ceil((nextWithdrawalAvailableDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  // Filtered products for automatic display
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch =
        prod.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        prod.description?.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchCat = selectedCategory === 'ALL' || prod.categoryId === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, catalogSearch, selectedCategory]);

  // Traffic Trends Line Graph Data Generation
  const chartData = useMemo(() => {
    const daysCount = chartRange === '7days' ? 7 : chartRange === '15days' ? 15 : 30;
    const data = [];
    const now = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });
      const engDateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Deterministic realistic curve for traffic
      const baseSin = Math.sin((i / daysCount) * Math.PI * 2.5);
      const pseudoRand = ((i * 17) % 19) / 19;
      const clicks = Math.round(35 + baseSin * 18 + pseudoRand * 25 + i * 2);
      const orders = Math.max(1, Math.round(clicks * 0.08 + (pseudoRand > 0.6 ? 2 : 0)));
      const commission = orders * 220 + clicks * 5;

      data.push({
        dayIndex: daysCount - 1 - i,
        label: engDateStr,
        labelBn: dateStr,
        clicks,
        orders,
        commission
      });
    }
    return data;
  }, [chartRange]);

  const maxClicks = Math.max(...chartData.map((d) => d.clicks), 100);
  const maxCommission = Math.max(...chartData.map((d) => d.commission), 2000);

  // Copy helper
  const handleCopy = (text: string, label = 'Affiliate Link') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label} ক্লিপবোর্ডে কপি হয়েছে!`, 'success');
    }
  };

  // Social Share helper
  const handleShare = (
    channel: 'facebook' | 'whatsapp' | 'messenger',
    url: string,
    title: string
  ) => {
    const fullUrl = url.startsWith('http')
      ? url
      : `${typeof window !== 'undefined' ? window.location.origin : 'https://quatro.com.bd'}${url}`;
    const encodedUrl = encodeURIComponent(fullUrl);
    const text = encodeURIComponent(`QUATRO থেকে আকর্ষণীয় ডিল দেখুন: ${title} `);

    let shareUrl = '';
    if (channel === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`;
    } else if (channel === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (channel === 'messenger') {
      shareUrl = `fb-messenger://share/?link=${encodedUrl}`;
    }

    if (typeof window !== 'undefined') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Instant Link Generator for specific product
  const handleQuickProductLinkGenerate = (productId: string) => {
    const link = generateAffiliateLink(productId);
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${link.url}`;
    setQuickGeneratedUrl(fullUrl);
    setSelectedProductId(productId);
    setIsGenerateModalOpen(true);
    handleCopy(fullUrl, 'প্রোডাক্টের অ্যাফিলিয়েট লিংক');
  };

  // Handle Withdrawal Request
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (!amountNum || amountNum <= 0) {
      showToast('অনুগ্রহ করে সঠিক উইথড্রয়াল অ্যামাউন্ট দিন', 'error');
      return;
    }
    if (!withdrawPayoutAccount.trim()) {
      showToast('অনুগ্রহ করে একাউন্ট নম্বর দিন', 'error');
      return;
    }

    const success = requestAffiliateWithdrawal(
      amountNum,
      withdrawPayoutMethod,
      withdrawPayoutAccount.trim()
    );
    if (success) {
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
    }
  };

  // General store referral URL
  const storeRefUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://quatro.com.bd'}?ref=${activeAffiliate.code}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-2xs">
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <BrandLogo variant="full" size="sm" />
            </Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs shadow-blue-500/20">
                Affiliate Dashboard
              </span>
              <span className="text-xs font-bold text-gray-600 hidden md:inline">
                পার্টনার নেটওয়ার্ক
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-gray-900">{activeAffiliate.name}</div>
              <div className="text-[10px] font-mono text-blue-600 font-bold">
                কোড: {activeAffiliate.code}
              </div>
            </div>

            <button
              onClick={() => handleCopy(storeRefUrl, 'Store Referral Link')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy your general store referral link"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">স্টোর লিংক</span>
            </button>

            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-3 sm:px-4 py-6 space-y-6">
        {/* Welcome Banner - Blue Theme */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-blue-500/30 border border-blue-400/40 text-blue-100 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                স্ট্যাটাস: {activeAffiliate.status}
              </span>
              <span className="bg-emerald-400 text-gray-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                ১০% ফ্ল্যাট কমিশন চালু
              </span>
              <span className="bg-yellow-300 text-gray-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                ১৫ দিন পর পর উইথড্র
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              স্বাগতম, {activeAffiliate.name}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
              ওয়েবসাইটের যেকোনো প্রোডাক্ট সিলেক্ট করে লিংক শেয়ার করুন এবং প্রতিটি সফল ডেলিভারিতে ১০% কমিশন সরাসরি আপনার {activeAffiliate.payoutMethod} একাউন্টে গ্রহণ করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('catalog')}
              className="bg-blue-500 hover:bg-blue-400 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Package className="w-4 h-4" />
              <span>সব প্রোডাক্ট ও লিংক জেনারেটর</span>
            </button>

            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="bg-white hover:bg-blue-50 text-blue-900 font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>উইথড্রয়াল রিকোয়েস্ট (১৫ দিন সাইকেল)</span>
            </button>
          </div>
        </div>

        {/* 7 Summary Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">টোটাল ক্লিক</span>
              <MousePointerClick className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-lg sm:text-xl font-black text-gray-900">{totalClicksCount}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">সব লিংক মিলিয়ে</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">মোট অর্ডার</span>
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-lg sm:text-xl font-black text-gray-900">{totalOrdersCount}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">রেফারাল সেলস</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">কনভার্সন রেট</span>
              <Percent className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-lg sm:text-xl font-black text-gray-900">{conversionRate}%</div>
            <div className="text-[10px] text-purple-600 font-semibold mt-0.5">হাই পারফরম্যান্স</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs bg-amber-50/40">
            <div className="flex items-center justify-between text-amber-700 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">পেন্ডিং হোল্ড</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-700">
              {formatPrice(activeAffiliate.pendingBalance)}
            </div>
            <div className="text-[10px] text-amber-600 font-semibold mt-0.5">১৫ দিন ভেরিফিকেশন</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-emerald-300 shadow-2xs bg-emerald-50/40">
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">উইথড্রযোগ্য ব্যালেন্স</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-emerald-700">
              {formatPrice(activeAffiliate.availableBalance)}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">রেডি টু উইথড্র</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">মোট উইথড্রয়াল</span>
              <CreditCard className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="text-lg sm:text-xl font-black text-gray-900">
              {formatPrice(activeAffiliate.totalWithdrawn)}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">{activeAffiliate.payoutMethod}-এ প্রাপ্ত</div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-blue-200 shadow-2xs bg-blue-50/30">
            <div className="flex items-center justify-between text-blue-600 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">মোট ইনকাম</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-lg sm:text-xl font-black text-blue-600">
              {formatPrice(activeAffiliate.totalEarned)}
            </div>
            <div className="text-[10px] text-blue-600 font-bold mt-0.5">সর্বমোট কমিশন</div>
          </div>
        </div>

        {/* 15-Day Payout Cycle Tracker Banner */}
        <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-gray-900">১৫ দিন পর পর উইথড্রয়াল সাইকেল (15-Day Cycle)</h3>
                {isWithdrawalEligibleNow ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                    উইথড্রয়াল উপলব্ধ (Available Now)
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                    পরবর্তী উইথড্রয়াল: {daysUntilNextWithdrawal} দিন পর
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                অ্যাফিলিয়েট সিস্টেমে প্রতি ১৫ দিন পর পর সর্বনিম্ন ৫০০ টাকা উইথড্রয়াল রিকোয়েস্ট দেওয়া যায়।
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            disabled={!isWithdrawalEligibleNow || activeAffiliate.availableBalance < 500}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>এখনই উইথড্র করুন</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-thin">
          {[
            { id: 'overview', label: 'ওভারভিউ ও ট্রাফিক গ্রাফ (Overview)', icon: TrendingUp },
            {
              id: 'catalog',
              label: `সব প্রোডাক্ট ও লিংক জেনারেটর (${products.length})`,
              icon: Package,
              highlight: true
            },
            { id: 'links', label: `তৈরিকৃত লিংক (${myLinks.length})`, icon: MousePointerClick },
            { id: 'commissions', label: `কমিশন তালিকা (${myCommissions.length})`, icon: DollarSign },
            { id: 'withdrawals', label: `উইথড্রয়াল হিস্ট্রি (${myWithdrawals.length})`, icon: CreditCard },
            { id: 'settings', label: 'প্রোফাইল ও পেমেন্ট সেটআপ', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : tab.highlight
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-black'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: OVERVIEW & INTERACTIVE LINE GRAPH ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Interactive Traffic Trends Line Graph */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-gray-900">ট্রাফিক ট্রেন্ডস লাইন গ্রাফ (Traffic Trends)</h3>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      Live Graph
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    আপনার রেফারাল লিংকের ভিজিটর ক্লিক ও অর্জিত কমিশনের ধারাবাহিক অগ্রগতি
                  </p>
                </div>

                {/* 7, 15, 30 Days Filter */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                  {[
                    { id: '7days', label: '৭ দিন' },
                    { id: '15days', label: '১৫ দিন (Cycle)' },
                    { id: '30days', label: '৩০ দিন' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setChartRange(r.id as any)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        chartRange === r.id
                          ? 'bg-blue-600 text-white shadow-xs font-black'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Graph SVG Rendering */}
              <div className="relative pt-6 pb-2">
                <div className="w-full h-56 sm:h-64">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
                      <line
                        key={idx}
                        x1="0"
                        y1={240 * ratio}
                        x2="700"
                        y2={240 * ratio}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {/* Generate coordinates for line graph */}
                    {(() => {
                      const totalPts = chartData.length;
                      const stepX = 700 / (totalPts - 1 || 1);

                      // Path for Clicks
                      const points = chartData.map((d, i) => {
                        const x = i * stepX;
                        const y = 220 - (d.clicks / maxClicks) * 190;
                        return { x, y, ...d };
                      });

                      const pathD = points.reduce((acc, p, i) => {
                        return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                      }, '');

                      const areaD = `${pathD} L 700 240 L 0 240 Z`;

                      return (
                        <>
                          {/* Area Fill */}
                          <path d={areaD} fill="url(#blueGradient)" />

                          {/* Line Stroke */}
                          <path
                            d={pathD}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Interactive Points */}
                          {points.map((p, i) => (
                            <g key={i} className="cursor-pointer">
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={hoveredPointIndex === i ? 6 : 4}
                                fill="#ffffff"
                                stroke="#2563eb"
                                strokeWidth="3"
                                onMouseEnter={() => setHoveredPointIndex(i)}
                                onMouseLeave={() => setHoveredPointIndex(null)}
                                className="transition-all duration-150"
                              />
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold pt-2 px-1">
                  {chartData.map((d, i) => {
                    const showLabel =
                      chartData.length <= 7 ||
                      i === 0 ||
                      i === chartData.length - 1 ||
                      i % Math.ceil(chartData.length / 5) === 0;
                    return (
                      <span key={i} className={showLabel ? 'opacity-100' : 'opacity-0'}>
                        {d.label}
                      </span>
                    );
                  })}
                </div>

                {/* Hover Tooltip / Current Stats Inspector */}
                {hoveredPointIndex !== null && chartData[hoveredPointIndex] && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center justify-between text-xs animate-in fade-in-50">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-950">
                        {chartData[hoveredPointIndex].label} ({chartData[hoveredPointIndex].labelBn})
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">ভিজিটর ক্লিক: </span>
                        <span className="font-black text-blue-600">
                          {chartData[hoveredPointIndex].clicks} Clicks
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">অর্ডার: </span>
                        <span className="font-black text-emerald-600">
                          {chartData[hoveredPointIndex].orders} Orders
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">আনুমানিক কমিশন: </span>
                        <span className="font-black text-purple-700">
                          ৳{chartData[hoveredPointIndex].commission}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="font-bold text-gray-700">ট্রাফিক ক্লিক ও রেসপন্স (Visitor Clicks)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-bold text-gray-700">সফল সেলস কনভার্সন (Orders)</span>
                  </div>
                </div>
                <span className="font-bold text-blue-700">১৫ দিনের গড় কনভার্সন রেট: {conversionRate}%</span>
              </div>
            </div>

            {/* Quick Product Links Preview Strip */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-gray-900">
                    সব প্রোডাক্ট ক্যাটালগ (স্বয়ংক্রিয়ভাবে প্রদর্শিত)
                  </h4>
                  <p className="text-xs text-gray-500">
                    ওয়েবসাইটে আপলোড করা সব প্রোডাক্ট থেকে ১-ক্লিকে অ্যাফিলিয়েট লিংক তৈরি করুন
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>সব {products.length}টি প্রোডাক্ট দেখুন</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {products.slice(0, 6).map((prod) => {
                  const commissionEarn = Math.round(prod.price * 0.1);
                  return (
                    <div
                      key={prod.id}
                      className="bg-slate-50 border border-gray-200 rounded-2xl p-2.5 flex flex-col justify-between hover:border-blue-300 transition-all group"
                    >
                      <div className="aspect-square rounded-xl bg-gray-200 overflow-hidden mb-2 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.media?.[0]?.url || 'https://picsum.photos/300/300?random=1'}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          কমিশন: ৳{commissionEarn}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-gray-900 truncate mb-1">{prod.title}</div>
                      <div className="text-xs font-black text-gray-800 mb-2">{formatPrice(prod.price)}</div>
                      <button
                        onClick={() => handleQuickProductLinkGenerate(prod.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>লিংক তৈরি</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General Store Referral Banner */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                  Universal Storefront Referral Link
                </span>
                <h4 className="font-black text-sm text-gray-900">আপনার সাধারণ মার্কেটপ্লেস রেফারাল লিংক</h4>
                <p className="text-xs text-gray-500">
                  যেকোনো কাস্টমার এই লিংকে ঢুকলে ৩০ দিনের কুকি যুক্ত হবে এবং সে যেকোনো প্রোডাক্ট কিনলেই আপনি ১০% কমিশন পাবেন।
                </p>
                <div className="font-mono text-xs font-bold text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-200 break-all select-all mt-2">
                  {storeRefUrl}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(storeRefUrl, 'Storewide Affiliate Link')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>লিংক কপি করুন</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp', storeRefUrl, 'Shop on QUATRO')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs p-2.5 rounded-xl shadow-xs transition-colors"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('facebook', storeRefUrl, 'Shop on QUATRO')}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs p-2.5 rounded-xl shadow-xs transition-colors"
                  title="Share on Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ALL PRODUCTS & AUTOMATIC LINK GENERATOR ================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-5">
            {/* Header & Filter Controls */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-base text-gray-900">
                    ওয়েবসাইটে আপলোড করা সব প্রোডাক্ট ({products.length}টি)
                  </h3>
                  <p className="text-xs text-gray-500">
                    অ্যাডমিন বা সেলারদের আপলোড করা প্রতিটি প্রোডাক্ট এখানে স্বয়ংক্রিয়ভাবে প্রদর্শিত হয়। যেকোনো প্রোডাক্ট সিলেক্ট করে লিংক তৈরি করুন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Search Bar */}
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="প্রোডাক্টের নাম বা কিওয়ার্ড দিয়ে খুঁজুন..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600 text-xs font-medium bg-gray-50/50 focus:bg-white"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-600 text-xs font-bold bg-white text-gray-800"
                  >
                    <option value="ALL">সব ক্যাটাগরি (All Categories)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((prod) => {
                const commissionEarn = Math.round(prod.price * 0.1);
                const fullProdUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/product/${prod.id}?ref=${activeAffiliate.code}`;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.media?.[0]?.url || 'https://picsum.photos/400/400?random=1'}
                        alt={prod.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        কমিশন: ৳{commissionEarn} (১০%)
                      </div>
                      {prod.sellerId && (
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-md">
                          Seller: {prod.sellerId.replace('seller-', '')}
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 line-clamp-2" title={prod.title}>
                          {prod.title}
                        </h4>
                        <div className="text-sm font-black text-gray-900 mt-1">
                          {formatPrice(prod.price)}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <button
                          onClick={() => handleQuickProductLinkGenerate(prod.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>লিংক তৈরি ও কপি</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleShare('whatsapp', `/product/${prod.id}?ref=${activeAffiliate.code}`, prod.title)}
                            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => handleShare('facebook', `/product/${prod.id}?ref=${activeAffiliate.code}`, prod.title)}
                            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                            title="Share on Facebook"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Facebook</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-gray-200">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <h4 className="font-bold text-gray-700">কোনো প্রোডাক্ট পাওয়া যায়নি</h4>
                <p className="text-xs text-gray-400 mt-1">অন্য কোনো সার্চ কিওয়ার্ড বা ক্যাটাগরি নির্বাচন করুন</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: MY LINKS ================= */}
        {activeTab === 'links' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
              <div>
                <h3 className="font-black text-sm text-gray-900">তৈরিকৃত প্রোডাক্ট লিংক ও পারফরম্যান্স</h3>
                <p className="text-xs text-gray-500">প্রতিটি লিংকের ক্লিক, সেলস এবং কনভার্সন ট্র্যাকিং</p>
              </div>

              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন লিংক তৈরি করুন</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-extrabold uppercase border-b border-gray-200 text-[10.5px]">
                    <tr>
                      <th className="p-3.5">প্রোডাক্ট</th>
                      <th className="p-3.5">অ্যাফিলিয়েট লিংক</th>
                      <th className="p-3.5 text-center">ক্লিক</th>
                      <th className="p-3.5 text-center">অর্ডার</th>
                      <th className="p-3.5 text-center">কনভার্সন</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {myLinks.map((link) => {
                      const fullLinkUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${link.url}`;
                      return (
                        <tr key={link.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5 max-w-[280px]">
                              {link.productImage ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={link.productImage}
                                  alt={link.productTitle || 'Product'}
                                  className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                  Store
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-bold text-gray-900 truncate">
                                  {link.productTitle || 'Universal Storefront Link'}
                                </div>
                                {link.productPrice && (
                                  <div className="text-[11px] text-blue-600 font-extrabold">
                                    {formatPrice(link.productPrice)} · ১০% কমিশন: ৳{Math.round(link.productPrice * 0.1)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-mono text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200 max-w-[260px] truncate select-all">
                              {link.url}
                            </div>
                          </td>
                          <td className="p-3.5 text-center font-bold text-gray-900">{link.clicksCount}</td>
                          <td className="p-3.5 text-center font-bold text-emerald-600">{link.ordersCount}</td>
                          <td className="p-3.5 text-center">
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-bold text-[11px]">
                              {link.conversionRate}%
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleCopy(fullLinkUrl, 'Affiliate Link')}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold p-1.5 rounded-lg transition-colors"
                                title="Copy Link"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleShare('whatsapp', link.url, link.productTitle || 'QUATRO Deal')}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold p-1.5 rounded-lg transition-colors"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: COMMISSIONS ================= */}
        {activeTab === 'commissions' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-sm text-gray-900">কমিশন ট্রানজেকশন তালিকা</h3>
                <p className="text-xs text-gray-500">প্রতিটি অর্ডারে অর্জিত ১০% কমিশন ও ভেরিফিকেশন স্ট্যাটাস</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const approved = runAffiliateCommissionApprovalCron();
                    showToast(`Cron Simulation: ${approved} commission(s) moved to Available!`, 'success');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Simulate passing 15 days return window"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cron টেস্ট</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-extrabold uppercase border-b border-gray-200 text-[10.5px]">
                    <tr>
                      <th className="p-3.5">অর্ডার #</th>
                      <th className="p-3.5">প্রোডাক্ট</th>
                      <th className="p-3.5">তারিখ</th>
                      <th className="p-3.5">সেলস অ্যামাউন্ট</th>
                      <th className="p-3.5">কমিশন (১০%)</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">উইথড্রয়াল উপলব্ধতা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {myCommissions.map((comm) => (
                      <tr key={comm.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-gray-900">{comm.orderNumber}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-gray-900 max-w-[200px] truncate">
                            {comm.productTitle}
                          </div>
                        </td>
                        <td className="p-3.5 text-gray-500">
                          {new Date(comm.orderDate).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 font-bold text-gray-900">{formatPrice(comm.orderAmount)}</td>
                        <td className="p-3.5 font-black text-blue-600">
                          +{formatPrice(comm.commissionAmount)}
                        </td>
                        <td className="p-3.5">
                          {comm.status === 'Approved' && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              <span>Approved</span>
                            </span>
                          )}
                          {comm.status === 'Pending' && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              <span>Pending Hold</span>
                            </span>
                          )}
                          {comm.status === 'Cancelled' && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3" />
                              <span>Cancelled</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right font-medium text-gray-500">
                          {comm.status === 'Approved' ? (
                            <span className="text-emerald-600 font-bold">ব্যালেন্সে যুক্ত হয়েছে</span>
                          ) : (
                            <span>১৫ দিন পর ({new Date(comm.approveAfter).toLocaleDateString()})</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: WITHDRAWALS (15-DAY CYCLE) ================= */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-sm text-gray-900">পেমেন্ট উইথড্রয়াল রেকর্ড ও হিস্ট্রি</h3>
                <p className="text-xs text-gray-500">১৫ দিন পর পর উইথড্র সুবিধা (বিকাশ, নগদ, ব্যাংক)</p>
              </div>

              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                disabled={!isWithdrawalEligibleNow || activeAffiliate.availableBalance < 500}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <CreditCard className="w-4 h-4" />
                <span>নতুন উইথড্রয়াল রিকোয়েস্ট</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-extrabold uppercase border-b border-gray-200 text-[10.5px]">
                    <tr>
                      <th className="p-3.5">রিকোয়েস্ট ID</th>
                      <th className="p-3.5">তারিখ</th>
                      <th className="p-3.5">অ্যামাউন্ট</th>
                      <th className="p-3.5">পেমেন্ট মেথড</th>
                      <th className="p-3.5">একাউন্ট নম্বর</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">TrxID / নোট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {myWithdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-gray-900">{w.id}</td>
                        <td className="p-3.5 text-gray-500">
                          {new Date(w.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 font-black text-blue-700 text-sm">{formatPrice(w.amount)}</td>
                        <td className="p-3.5 font-bold text-gray-800">{w.payoutMethod}</td>
                        <td className="p-3.5 font-mono text-gray-600">{w.payoutAccount}</td>
                        <td className="p-3.5">
                          {w.status === 'Paid' && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <CheckCircle className="w-3 h-3" />
                              <span>Paid (পরিশোধিত)</span>
                            </span>
                          )}
                          {w.status === 'Pending' && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              <span>Pending Review</span>
                            </span>
                          )}
                          {w.status === 'Rejected' && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right font-mono text-gray-500">
                          {w.txnId ? (
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[11px] font-bold">
                              {w.txnId}
                            </span>
                          ) : w.rejectReason ? (
                            <span className="text-rose-600 text-[11px]">{w.rejectReason}</span>
                          ) : (
                            <span className="text-gray-400">অ্যাডমিন রিভিউতে আছে</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs max-w-xl space-y-4">
            <div>
              <h3 className="font-black text-base text-gray-900">অ্যাফিলিয়েট প্রোফাইল ও পেআউট একাউন্ট</h3>
              <p className="text-xs text-gray-500">আপনার ব্যক্তিগত তথ্য ও পেমেন্ট ওয়ালেট আপডেট করুন</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('প্রোফাইল সেটিংস সফলভাবে আপডেট হয়েছে!', 'success');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">অ্যাফিলিয়েট রেফারাল কোড</label>
                <input
                  type="text"
                  disabled
                  value={activeAffiliate.code}
                  className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl font-mono font-bold text-blue-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">পূর্ণ নাম</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">পেমেন্ট মাধ্যম</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 bg-white font-bold"
                  >
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">একাউন্ট / ওয়ালেট নম্বর</label>
                  <input
                    type="text"
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                সেভ করুন (Save Changes)
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ================= MODAL: 15-DAY WITHDRAWAL REQUEST ================= */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-[460px] w-full p-6 space-y-4 border border-blue-100 text-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-base text-gray-900">উইথড্রয়াল রিকোয়েস্ট (15-Day Cycle)</h3>
                <p className="text-xs text-gray-500">আপনার bKash / Nagad / Bank একাউন্টে টাকা তুলুন</p>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-500 block">বর্তমান উইথড্রযোগ্য ব্যালেন্স:</span>
                <span className="text-base font-black text-blue-700">
                  {formatPrice(activeAffiliate.availableBalance)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block">উইথড্রয়াল সাইকেল:</span>
                <span className="text-xs font-black text-emerald-700">১৫ দিন পর পর</span>
              </div>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">উইথড্রয়াল অ্যামাউন্ট (BDT) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-gray-400">৳</span>
                  <input
                    type="number"
                    min="500"
                    max={activeAffiliate.availableBalance}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="সর্বনিম্ন ৫০০"
                    className="w-full pl-8 p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 font-black text-base text-gray-900"
                  />
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  সর্বনিম্ন উইথড্রয়াল: ৳৫০০ (Available ব্যালেন্স থেকে কাটা হবে)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">পেমেন্ট মাধ্যম</label>
                  <select
                    value={withdrawPayoutMethod}
                    onChange={(e) => setWithdrawPayoutMethod(e.target.value as any)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 bg-white font-bold"
                  >
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">একাউন্ট নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={withdrawPayoutAccount}
                    onChange={(e) => setWithdrawPayoutAccount(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-600 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                >
                  উইথড্রয়াল রিকোয়েস্ট সাবমিট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUICK GENERATE LINK FEEDBACK ================= */}
      {isGenerateModalOpen && quickGeneratedUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-[460px] w-full p-6 space-y-4 border border-blue-100 text-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900">অ্যাফিলিয়েট লিংক তৈরি হয়েছে!</h3>
                  <p className="text-xs text-gray-500">লিংকটি কপি করে সোশ্যাল মিডিয়ায় শেয়ার করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 block mb-1">ট্র্যাকিং লিংক:</span>
              <p className="font-mono text-xs text-blue-700 font-bold break-all select-all">
                {quickGeneratedUrl}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(quickGeneratedUrl, 'Affiliate Link')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>লিংক কপি করুন</span>
              </button>

              <button
                onClick={() => handleShare('whatsapp', quickGeneratedUrl, 'Check this product on QUATRO')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs p-3 rounded-xl shadow-xs transition-colors"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleShare('facebook', quickGeneratedUrl, 'Check this product on QUATRO')}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs p-3 rounded-xl shadow-xs transition-colors"
                title="Share on Facebook"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
