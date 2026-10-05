'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  TrendingUp,
  HelpCircle,
  Landmark,
  CheckCircle2,
  History,
  Percent,
  Clock,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Copy,
  Check,
  Megaphone,
  ShieldCheck
} from 'lucide-react';

export default function SellerWalletDashboard() {
  const {
    currentSeller,
    orders,
    sellerWallets,
    formatPrice,
    adminAdSettings,
    depositRequests,
    submitSellerDeposit,
    showToast,
    language
  } = useMarketplace();

  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'statement' | 'fees'>('statement');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Deposit Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositMethod, setDepositMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer'>('bKash');
  const [depositSenderNumber, setDepositSenderNumber] = useState('');
  const [depositTrxId, setDepositTrxId] = useState('');
  const [depositNotes, setDepositNotes] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(isBn ? `"${text}" ক্লিপবোর্ডে কপি হয়েছে!` : `Copied "${text}" to clipboard!`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositSenderNumber.trim()) {
      showToast(isBn ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন' : 'Please enter sender number', 'error');
      return;
    }
    if (!depositTrxId.trim()) {
      showToast(isBn ? 'Transaction ID (TrxID) লিখুন' : 'Please enter Transaction ID', 'error');
      return;
    }
    submitSellerDeposit({
      sellerId: currentSeller!.id,
      sellerShopName: currentSeller!.shopName,
      sellerPhone: currentSeller!.phone,
      amount: Number(depositAmount) || 500,
      paymentMethod: depositMethod,
      senderNumber: depositSenderNumber.trim(),
      trxId: depositTrxId.trim(),
      notes: depositNotes.trim()
    });
    setIsDepositModalOpen(false);
    setDepositSenderNumber('');
    setDepositTrxId('');
    setDepositNotes('');
    showToast(isBn ? 'ডিপোজিট রিকোয়েস্ট জমা এবং এডমিন প্যানেলে সেভ হয়েছে!' : 'Deposit request submitted to Admin Panel!', 'success');
  };

  const [now, setNow] = useState<number>(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setNow(Date.now());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!currentSeller) {
    return (
      <div className="p-6 text-center text-gray-500 italic font-bold">
        {isBn ? 'ওয়ালেট ও ইনকাম সেটেলমেন্ট দেখতে আপনার সেলার অ্যাকাউন্টে লগইন করুন।' : 'Please select or log into your Seller Account to view wallet & settlements.'}
      </div>
    );
  }

  // Get Delivered Orders belonging to this Seller
  const sellerDeliveredOrders = orders.filter(
    (o) =>
      o.orderStatus === 'Delivered' &&
      o.items.some((item) => (item.sellerId || 'seller-apex-01') === currentSeller.id)
  );

  const getCommissionRate = (categoryId: string | undefined): number => {
    if (!categoryId) return 10;
    const cid = categoryId.toLowerCase();
    if (cid === 'cat-electronics' || cid === 'cat-accessories' || cid === 'cat-appliances' || cid.includes('electronic')) {
      return 5;
    }
    if (cid === 'cat-men-fashion' || cid === 'cat-women-fashion' || cid.includes('fashion') || cid.includes('apparel') || cid.includes('clothing')) {
      return 12;
    }
    return 10;
  };

  const getCategoryName = (categoryId: string | undefined): string => {
    if (!categoryId) return isBn ? 'অন্যান্য (১০%)' : 'Others (10%)';
    if (categoryId.includes('electronic') || categoryId.includes('accessories')) return isBn ? 'ইলেকট্রনিক্স (৫%)' : 'Electronics (5%)';
    if (categoryId.includes('fashion') || categoryId.includes('apparel')) return isBn ? 'ফ্যাশন (১২%)' : 'Fashion (12%)';
    return isBn ? 'অন্যান্য (১০%)' : 'Others (10%)';
  };

  const statements = sellerDeliveredOrders.map((order) => {
    let grossRevenue = 0;
    let commissionDeducted = 0;
    const itemsDetails: any[] = [];

    order.items.forEach((item) => {
      const itemSellerId = item.sellerId || 'seller-apex-01';
      if (itemSellerId === currentSeller.id) {
        const itemTotal = item.price * item.quantity;
        const prodCategory = (item as any).categoryId || (item.productId.includes('fashion') ? 'cat-men-fashion' : 'cat-electronics');
        const rate = getCommissionRate(prodCategory);
        const comm = (itemTotal * rate) / 100;

        grossRevenue += itemTotal;
        commissionDeducted += comm;

        itemsDetails.push({
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          total: itemTotal,
          categoryName: getCategoryName(prodCategory),
          commissionRate: rate,
          commissionAmt: comm,
          netPayout: itemTotal - comm
        });
      }
    });

    const netEarnings = grossRevenue - commissionDeducted;
    const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.createdAt);
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const unlockTime = deliveryDate.getTime() + sevenDaysMs;
    const currentTimestamp = now || deliveryDate.getTime();
    const isLocked = currentTimestamp < unlockTime;
    const daysRemaining = Math.max(0, Math.ceil((unlockTime - currentTimestamp) / (1000 * 60 * 60 * 24)));

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      deliveredAtStr: deliveryDate.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      grossRevenue,
      commissionDeducted,
      netEarnings,
      isLocked,
      daysRemaining,
      itemsDetails
    };
  });

  const totalGrossRevenue = statements.reduce((sum, s) => sum + s.grossRevenue, 0);
  const totalCommissionDeducted = statements.reduce((sum, s) => sum + s.commissionDeducted, 0);

  const totalPendingBalance = statements
    .filter((s) => s.isLocked)
    .reduce((sum, s) => sum + s.netEarnings, 0);

  const totalAvailableEarnings = statements
    .filter((s) => !s.isLocked)
    .reduce((sum, s) => sum + s.netEarnings, 0);

  const wallet = sellerWallets[currentSeller.id] || {
    withdrawnAmount: 0,
    adBalance: 0
  };

  const withdrawableBalance = Math.max(0, totalAvailableEarnings - (wallet.withdrawnAmount || 0));

  return (
    <div className="space-y-5">
      {/* 7-Day Return Lock Info Card */}
      <div className="bg-sky-50/80 border border-sky-200/80 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sky-950 block">
              {isBn ? '৭ দিনের কাস্টমার রিটার্ন লক পলিসি' : '7-Day Customer Return Lock Policy'}
            </span>
            <span className="text-sky-800 text-[11px]">
              {isBn
                ? 'ডেলিভারির ৭ দিন পর কাস্টমার রিটার্ন না থাকলে টাকা আনলক হয়ে উইথড্রয়াল ব্যালেন্সে যোগ হয়।'
                : 'Earnings unlock 7 days after delivery if no customer return is requested.'}
            </span>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 bg-white text-[#0284c7] font-extrabold text-[10px] px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {isBn ? 'ভেরিফাইড রুলস' : 'Daraz Verified Rule'}
        </span>
      </div>

      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Gross Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-bold">{isBn ? 'মোট বিক্রি (Gross)' : 'Gross Sales'}</span>
            <TrendingUp className="w-4 h-4 text-[#0284c7]" />
          </div>
          <div className="text-xl font-black text-gray-900 tabular-nums">
            {formatPrice(totalGrossRevenue)}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">{isBn ? 'ডেলিভারি হওয়া মোট বিক্রি' : 'Delivered total'}</span>
        </div>

        {/* Commission Deducted */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[11px] font-bold">{isBn ? 'কমিশন কর্তন' : 'Commission'}</span>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 tabular-nums">
            -{formatPrice(totalCommissionDeducted)}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">{isBn ? 'অটো কর্তন করা কমিশন' : 'Auto-deducted'}</span>
        </div>

        {/* Pending Locked Balance */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold">{isBn ? 'পেন্ডিং (লক করা)' : 'Pending (Locked)'}</span>
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div className="text-xl font-black text-amber-600 tabular-nums">
            {formatPrice(totalPendingBalance)}
          </div>
          <span className="text-[10px] text-amber-700/80 font-bold">{isBn ? '৭ দিনের হোল্ড মেয়াদ' : '7-day hold period'}</span>
        </div>

        {/* Withdrawable Net Balance */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[11px] font-bold">{isBn ? 'উত্তোলনযোগ্য ব্যালেন্স' : 'Withdrawable'}</span>
            <Landmark className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-600 tabular-nums">
            {formatPrice(withdrawableBalance)}
          </div>
          <span className="text-[10px] text-emerald-700/80 font-bold">{isBn ? 'প্রস্তুত টাকা' : 'Ready for payout'}</span>
        </div>

        {/* Ad Balance & Deposit */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300">{isBn ? 'এড ব্যালেন্স' : 'Ad Balance'}</span>
            <Megaphone className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-1 flex items-end justify-between gap-2">
            <div className="text-xl font-black text-amber-400 tabular-nums">
              {formatPrice(wallet.adBalance || 0)}
            </div>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg cursor-pointer transition-all shadow-xs"
            >
              {isBn ? '+ ডিপোজিট' : '+ Deposit'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 gap-4 pt-1">
        <button
          onClick={() => setActiveTab('statement')}
          className={`pb-2.5 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'statement'
              ? 'border-[#0284c7] text-[#0284c7]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{isBn ? `অর্ডার সেটেলমেন্ট স্টেটমেন্ট (${statements.length})` : `Order Settlements (${statements.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`pb-2.5 text-xs font-bold transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'fees'
              ? 'border-[#0284c7] text-[#0284c7]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{isBn ? 'কমিশন হার নীতি' : 'Commission Rates'}</span>
        </button>
      </div>

      {/* Tab 1: Settlements Statement */}
      {activeTab === 'statement' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900">{isBn ? 'ডেলিভারি হওয়া অর্ডারসমূহের হিসেব' : 'Delivered Orders Breakdown'}</h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              {isBn ? 'লাইভ সেটেলড' : 'Live Settled'}
            </span>
          </div>

          {statements.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-xs italic">
              {isBn ? 'এখনো কোনো ডেলিভারি করা অর্ডার নেই। অর্ডার ডেলিভারি হলে স্বয়ংক্রিয়ভাবে এখানে যোগ হবে।' : 'No delivered orders yet. Delivered sales will automatically appear here with exact payout calculations.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-4 w-10">{isBn ? 'বিস্তারিত' : 'Items'}</th>
                    <th className="py-3 px-4">{isBn ? 'অর্ডার নম্বর' : 'Order Number'}</th>
                    <th className="py-3 px-4">{isBn ? 'তারিখ' : 'Date'}</th>
                    <th className="py-3 px-4">{isBn ? 'মোট বিক্রি' : 'Gross Sales'}</th>
                    <th className="py-3 px-4 text-amber-600">{isBn ? 'কমিশন' : 'Commission'}</th>
                    <th className="py-3 px-4">{isBn ? 'নিট উইথড্রয়াল' : 'Net Payout'}</th>
                    <th className="py-3 px-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {statements.map((s) => (
                    <React.Fragment key={s.id}>
                      <tr className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === s.id ? null : s.id)}
                            className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                            title={isBn ? 'আইটেম বিস্তারিত' : 'Toggle Item Details'}
                          >
                            {expandedOrder === s.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-xs font-bold text-[#0284c7]">{s.orderNumber}</div>
                          <div className="text-[10px] text-gray-400">{s.customerName}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-[11px]">{s.deliveredAtStr}</td>
                        <td className="py-3 px-4 font-bold text-gray-900 tabular-nums">{formatPrice(s.grossRevenue)}</td>
                        <td className="py-3 px-4 font-bold text-amber-600 tabular-nums">-{formatPrice(s.commissionDeducted)}</td>
                        <td className="py-3 px-4 font-black text-gray-900 tabular-nums">{formatPrice(s.netEarnings)}</td>
                        <td className="py-3 px-4">
                          {s.isLocked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span>{s.daysRemaining} {isBn ? 'দিন লক' : 'days locked'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>{isBn ? 'উত্তোলনযোগ্য' : 'Withdrawable'}</span>
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable item details */}
                      {expandedOrder === s.id && (
                        <tr>
                          <td colSpan={7} className="bg-slate-50 p-3.5 border-y border-gray-150">
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                                <Percent className="w-3.5 h-3.5 text-[#0284c7]" />
                                <span>{isBn ? 'প্রোডাক্টভিত্তিক কমিশন ব্রেকডাউন:' : 'Product-wise Commission Breakdown:'}</span>
                              </div>
                              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                                <table className="w-full text-left text-[11px]">
                                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-gray-200">
                                    <tr>
                                      <th className="py-2 px-3">{isBn ? 'প্রোডাক্ট নাম' : 'Product Name'}</th>
                                      <th className="py-2 px-3">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                                      <th className="py-2 px-3">{isBn ? 'পরিমাণ' : 'Qty'}</th>
                                      <th className="py-2 px-3">{isBn ? 'মূল্য' : 'Price'}</th>
                                      <th className="py-2 px-3">{isBn ? 'মোট' : 'Total'}</th>
                                      <th className="py-2 px-3 text-amber-600">{isBn ? 'কমিশন কর্তন' : 'Deduction'}</th>
                                      <th className="py-2 px-3 text-emerald-700">{isBn ? 'নিট ইনকাম' : 'Net'}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                                    {s.itemsDetails.map((it: any, idx: number) => (
                                      <tr key={idx} className="hover:bg-slate-50/50">
                                        <td className="py-2 px-3 text-gray-900 font-bold">{it.title}</td>
                                        <td className="py-2 px-3 text-[#0284c7]">{it.categoryName}</td>
                                        <td className="py-2 px-3 tabular-nums">{it.quantity} Pcs</td>
                                        <td className="py-2 px-3 tabular-nums">{formatPrice(it.price)}</td>
                                        <td className="py-2 px-3 font-bold tabular-nums">{formatPrice(it.total)}</td>
                                        <td className="py-2 px-3 font-bold text-amber-600 tabular-nums">
                                          -{formatPrice(it.commissionAmt)} ({it.commissionRate}%)
                                        </td>
                                        <td className="py-2 px-3 font-extrabold text-emerald-600 tabular-nums">
                                          {formatPrice(it.netPayout)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Commission Rates Policy */}
      {activeTab === 'fees' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900">{isBn ? 'মার্কেটপ্লেস স্ট্যান্ডার্ড কমিশন রেট' : 'Standard Marketplace Commission Rates'}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isBn ? 'সফল ডেলিভারির পর ক্যাটাগরি অনুযায়ী কমিশন কর্তন করা হয়।' : 'Transparent per-category commission fees deducted upon successful delivery.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-sky-50/60 border border-sky-100 p-3.5 rounded-xl space-y-1">
              <div className="text-xl font-black text-[#0284c7]">5%</div>
              <div className="text-xs font-bold text-sky-950">{isBn ? 'ইলেকট্রনিক্স ও গ্যাজেটস' : 'Electronics & Gadgets'}</div>
              <p className="text-[11px] text-sky-800">{isBn ? 'স্মার্টফোন, ওয়াচ, ইয়ারফোন, অ্যাপ্লায়েন্স।' : 'Smartphones, watches, earphones, appliances.'}</p>
            </div>

            <div className="bg-purple-50/60 border border-purple-100 p-3.5 rounded-xl space-y-1">
              <div className="text-xl font-black text-purple-700">12%</div>
              <div className="text-xs font-bold text-purple-950">{isBn ? 'ফ্যাশন ও ক্লথিং' : 'Fashion & Apparel'}</div>
              <p className="text-[11px] text-purple-800">{isBn ? 'পোশাক, জুতা, ব্যাগ ও এক্সেসরিজ।' : 'Clothing, footwear, bags, and accessories.'}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl space-y-1">
              <div className="text-xl font-black text-gray-700">10%</div>
              <div className="text-xs font-bold text-gray-950">{isBn ? 'অন্যান্য সকল ক্যাটাগরি' : 'All Other Categories'}</div>
              <p className="text-[11px] text-gray-600">{isBn ? 'হোম ডেকর, গ্রোসারিজ ও লাইফস্টাইল।' : 'Home decor, daily groceries, kitchen & lifestyle.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-[#0284c7] text-white flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">{isBn ? 'এডস ব্যালেন্স ডিপোজিট করুন' : 'Deposit for Ads Balance'}</h3>
                  <p className="text-[11px] text-gray-400">{isBn ? 'প্রোডাক্ট বুস্টিং ও স্পনসরড এডসের জন্য ব্যালেন্স রিচার্জ' : 'Add funds to boost sponsored product ads'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Merchant Payment Number */}
            <div className="bg-pink-50 p-2.5 rounded-xl border border-pink-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-pink-700 block">bKash (Merchant)</span>
                <span className="font-mono font-black text-gray-900">
                  {adminAdSettings?.bkashNumber || '01712-345678'}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(adminAdSettings?.bkashNumber || '01712-345678', 'dep-bkash')}
                className="p-1.5 bg-white text-pink-700 rounded-lg shadow-2xs hover:bg-pink-100 cursor-pointer text-[10px] font-bold flex items-center gap-1"
              >
                {copiedKey === 'dep-bkash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isBn ? 'কপি' : 'Copy'}</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleDepositSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">{isBn ? 'টাকার পরিমাণ (৳) *' : 'Amount (৳ Taka) *'}</label>
                <input
                  type="number"
                  min="200"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-black text-gray-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">{isBn ? 'পেমেন্ট মেথড *' : 'Payment Method *'}</label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-800 outline-none"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">{isBn ? 'প্রেরক নম্বর (Sender Number) *' : 'Sender Number *'}</label>
                <input
                  type="text"
                  value={depositSenderNumber}
                  onChange={(e) => setDepositSenderNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-900 outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">{isBn ? 'ট্রানজেকশন আইডি (TrxID) *' : 'Transaction ID (TrxID) *'}</label>
                <input
                  type="text"
                  value={depositTrxId}
                  onChange={(e) => setDepositTrxId(e.target.value)}
                  placeholder="9H482K..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-900 outline-none font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold rounded-xl cursor-pointer shadow-xs transition-all"
              >
                {isBn ? '💾 ডিপোজিট রিকোয়েস্ট সেভ করুন' : '💾 Submit Deposit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
