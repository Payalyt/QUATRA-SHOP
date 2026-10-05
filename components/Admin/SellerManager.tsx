'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { SellerStatus } from '@/lib/types/ecommerce';
import {
  Store,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Eye,
  Target,
  Pause,
  Play,
  Trash2,
  Edit,
  Plus,
  ArrowUpDown,
  CreditCard,
  Phone,
  Mail,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Zap,
  Clock,
  Layers,
  ShoppingBag,
  PackageCheck,
  Video,
  Image as ImageIcon
} from 'lucide-react';

export const SellerManager: React.FC = () => {
  const {
    sellers,
    currentSeller,
    sellerWallets,
    sponsoredCampaigns,
    products,
    depositRequests,
    adminAdSettings,
    updateAdminAdSettings,
    approveSellerDeposit,
    rejectSellerDeposit,
    adjustSellerBalance,
    approveSeller,
    rejectSeller,
    suspendSeller,
    approveProduct,
    rejectProduct,
    toggleCampaignStatus,
    deleteSponsoredCampaign,
    formatPrice,
    showToast
  } = useMarketplace();

  // Sub-tabs
  const [subTab, setSubTab] = useState<'sellers' | 'deposits' | 'product_approvals' | 'ad_settings' | 'campaigns'>('sellers');

  // Search & Filter for sellers
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SellerStatus>('ALL');

  // Product Approvals Filter
  const [productApprovalFilter, setProductApprovalFilter] = useState<'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'ALL'>('PENDING_REVIEW');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Balance Adjustment Modal State
  const [adjustTargetSellerId, setAdjustTargetSellerId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(500);
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustReason, setAdjustReason] = useState('Admin Deposit Credit');

  // Reject Deposit Modal State
  const [rejectDepositId, setRejectDepositId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Invalid TrxID or payment not received');

  // View Seller Products Modal
  const [viewSellerProductsId, setViewSellerProductsId] = useState<string | null>(null);

  // Form for Ad Settings & Deposit Numbers
  const [cpmRate, setCpmRate] = useState<number>(adminAdSettings?.cpmRate || 200);
  const [bkashNumber, setBkashNumber] = useState(adminAdSettings?.bkashNumber || '01712-345678');
  const [bkashType, setBkashType] = useState<'Personal' | 'Merchant'>(adminAdSettings?.bkashType || 'Merchant');
  const [nagadNumber, setNagadNumber] = useState(adminAdSettings?.nagadNumber || '01812-987654');
  const [nagadType, setNagadType] = useState<'Personal' | 'Merchant'>(adminAdSettings?.nagadType || 'Personal');
  const [rocketNumber, setRocketNumber] = useState(adminAdSettings?.rocketNumber || '01912-456789-2');
  const [bankDetails, setBankDetails] = useState(adminAdSettings?.bankDetails || 'BRAC Bank Ltd, Gulshan-1 Branch, A/C: 1501204892001, Name: BazaarBD Marketplace Ltd.');
  const [depositNotice, setDepositNotice] = useState(adminAdSettings?.depositNotice || 'টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) ও নম্বর দিয়ে ডিপোজিট সাবমিট করুন।');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied "${text}" to clipboard!`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveAdSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminAdSettings({
      cpmRate: Number(cpmRate) || 200,
      bkashNumber,
      bkashType,
      nagadNumber,
      nagadType,
      rocketNumber,
      bankDetails,
      depositNotice
    });
  };

  // Filtered sellers list
  const filteredSellers = sellers.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.shopName.toLowerCase().includes(q) ||
      s.phone.includes(searchQuery) ||
      s.email.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.sellerIdNumber?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingDeposits = depositRequests.filter((d) => d.status === 'PENDING');
  const pendingSellers = sellers.filter((s) => s.status === 'Pending');
  const pendingProducts = products.filter((p) => p.status === 'PENDING_REVIEW');
  const activeApprovedProducts = products.filter((p) => !p.status || p.status === 'ACTIVE');
  const rejectedProducts = products.filter((p) => p.status === 'REJECTED');

  const filteredApprovalProducts = products.filter((p) => {
    const q = productSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.titleBn?.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q);

    const matchesStatus =
      productApprovalFilter === 'ALL' ||
      (productApprovalFilter === 'ACTIVE' && (!p.status || p.status === 'ACTIVE')) ||
      p.status === productApprovalFilter;

    return matchesSearch && matchesStatus;
  });

  const targetSellerForAdjustment = sellers.find((s) => s.id === adjustTargetSellerId);
  const targetSellerProducts = products.filter((p) => p.sellerId === viewSellerProductsId);
  const selectedSeller = sellers.find((s) => s.id === viewSellerProductsId);

  return (
    <div className="space-y-6">
      {/* Top Banner & Platform Stats */}
      <div className="bg-gradient-to-r from-sky-600 via-amber-600 to-[#0284c7] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/20 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              Admin Seller Control Panel
            </span>
            {pendingProducts.length > 0 && (
              <span className="bg-amber-400 text-gray-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                📦 {pendingProducts.length} Pending Product Reviews
              </span>
            )}
            {pendingDeposits.length > 0 && (
              <span className="bg-[#0284c7] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                💰 {pendingDeposits.length} Pending Deposits
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Seller Accounts, Product Approvals &amp; Sponsored Ads
          </h2>
          <p className="text-xs text-sky-100 max-w-2xl">
            Review new seller product uploads, approve live listings, manage seller accounts &amp; approve deposit balances.
          </p>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTab('sellers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            subTab === 'sellers'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 bg-white border border-gray-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Seller Accounts ({sellers.length})</span>
          {pendingSellers.length > 0 && (
            <span className="bg-white/30 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {pendingSellers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('product_approvals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            subTab === 'product_approvals'
              ? 'bg-amber-500 text-white shadow-xs font-extrabold'
              : 'text-amber-800 hover:bg-amber-50 bg-amber-50/60 border border-amber-200'
          }`}
        >
          <PackageCheck className="w-4 h-4 text-amber-600" />
          <span>Product Approvals Queue</span>
          {pendingProducts.length > 0 && (
            <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
              {pendingProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('deposits')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            subTab === 'deposits'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 bg-white border border-gray-200'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>Deposit Requests Queue</span>
          {pendingDeposits.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
              {pendingDeposits.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('ad_settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            subTab === 'ad_settings'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 bg-white border border-gray-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-500" />
          <span>Deposit Numbers &amp; CPM Rates (৳200/1k)</span>
        </button>

        <button
          onClick={() => setSubTab('campaigns')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            subTab === 'campaigns'
              ? 'bg-[#0284c7] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100 bg-white border border-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Platform Sponsored Boosts ({sponsoredCampaigns.length})</span>
        </button>
      </div>

      {/* ===================== TAB 1: SELLERS LIST ===================== */}
      {subTab === 'sellers' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-gray-900">
                All Registered Sellers (সেলার একাউন্ট ও পারমিশন)
              </h3>
              <p className="text-xs text-gray-500">
                সেলার একাউন্ট অনুমোদন, সাসপেন্ড, ব্যালেন্স অ্যাড ও প্রোডাক্ট ম্যানেজ করুন।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shop, phone, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none w-52 font-medium"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 outline-none font-bold text-gray-700"
              >
                <option value="ALL">All Status</option>
                <option value="Approved">Approved Only</option>
                <option value="Pending">Pending Approvals</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-y border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Shop &amp; Owner</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Products</th>
                  <th className="py-2.5 px-3">Wallet &amp; Ad Balance</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Admin Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {filteredSellers.map((seller) => {
                  const wallet = sellerWallets[seller.id];
                  const sellerProds = products.filter((p) => p.sellerId === seller.id);
                  const activeSellerAds = sponsoredCampaigns.filter((c) => c.sellerId === seller.id && c.status === 'ACTIVE');

                  return (
                    <tr key={seller.id} className="hover:bg-sky-50/20 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={seller.logo || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <p className="font-extrabold text-gray-900 flex items-center gap-1">
                              {seller.shopName}
                              {seller.status === 'Approved' && (
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                              )}
                            </p>
                            <span className="text-[10px] font-mono text-sky-800 font-bold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 inline-block mt-0.5">
                              Seller ID: {seller.sellerIdNumber || seller.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 space-y-0.5">
                        <p className="text-[11px] flex items-center gap-1 text-gray-700">
                          <Phone className="w-3 h-3 text-gray-400" /> {seller.phone}
                        </p>
                        <p className="text-[11px] flex items-center gap-1 text-gray-400">
                          <Mail className="w-3 h-3 text-gray-400" /> {seller.email}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => setViewSellerProductsId(seller.id)}
                          className="bg-gray-100 hover:bg-sky-100 text-gray-700 hover:text-[#0284c7] px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>{sellerProds.length} Products</span>
                        </button>
                        {activeSellerAds.length > 0 && (
                          <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
                            ⚡ {activeSellerAds.length} Active Ads
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-900 tabular-nums">
                            Available: {formatPrice(wallet?.availableBalance || 0)}
                          </p>
                          <p className="text-[11px] text-emerald-600 font-bold tabular-nums">
                            Ad Balance: {formatPrice(wallet?.adBalance || 0)}
                          </p>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            seller.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : seller.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {seller.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {seller.status === 'Pending' && (
                            <button
                              onClick={() => approveSeller(seller.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Approve Seller Account"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                          )}

                          {seller.status === 'Approved' ? (
                            <button
                              onClick={() => suspendSeller(seller.id)}
                              className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                              title="Suspend Seller Account"
                            >
                              Suspend
                            </button>
                          ) : seller.status === 'Suspended' ? (
                            <button
                              onClick={() => approveSeller(seller.id)}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                              title="Reactivate Seller Account"
                            >
                              Activate
                            </button>
                          ) : null}

                          <button
                            onClick={() => {
                              setAdjustTargetSellerId(seller.id);
                              setAdjustAmount(500);
                              setAdjustType('CREDIT');
                              setAdjustReason('Admin Ad Balance Credit');
                            }}
                            className="bg-sky-50 hover:bg-sky-100 text-[#0284c7] text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                            title="Adjust Seller Wallet / Ad Balance"
                          >
                            <DollarSign className="w-3 h-3" /> +/- Balance
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
      )}

      {/* ===================== TAB 2: PRODUCT APPROVALS QUEUE ===================== */}
      {subTab === 'product_approvals' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                <span>Seller Product Review &amp; Approval Queue (প্রোডাক্ট অনুমোদন সেকশন)</span>
                {pendingProducts.length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                    {pendingProducts.length} Pending Review
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500">
                সেলারদের আপলোড করা নতুন প্রোডাক্ট রিভিউ করুন। অ্যাপ্রুভ (Approved) করলে ওয়েবসাইটে দেখাবে।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search product, brand..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0284c7] outline-none w-52 font-medium"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setProductApprovalFilter('PENDING_REVIEW')}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                    productApprovalFilter === 'PENDING_REVIEW' ? 'bg-amber-500 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pending ({pendingProducts.length})
                </button>
                <button
                  onClick={() => setProductApprovalFilter('ACTIVE')}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                    productApprovalFilter === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Approved ({activeApprovedProducts.length})
                </button>
                <button
                  onClick={() => setProductApprovalFilter('REJECTED')}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                    productApprovalFilter === 'REJECTED' ? 'bg-rose-600 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rejected ({rejectedProducts.length})
                </button>
                <button
                  onClick={() => setProductApprovalFilter('ALL')}
                  className={`px-3 py-1 rounded-lg cursor-pointer transition-all ${
                    productApprovalFilter === 'ALL' ? 'bg-gray-800 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({products.length})
                </button>
              </div>
            </div>
          </div>

          {/* Pending Alert Banner */}
          {pendingProducts.length > 0 && productApprovalFilter === 'PENDING_REVIEW' && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                <span>
                  <strong>{pendingProducts.length} New Products</strong> uploaded by sellers are waiting for Admin Review. Click <strong>"✅ Approve &amp; Publish"</strong> to display them live on the marketplace storefront.
                </span>
              </div>
            </div>
          )}

          {/* Products List Cards */}
          <div className="space-y-3">
            {filteredApprovalProducts.length === 0 ? (
              <div className="p-10 text-center text-gray-400 italic text-xs">
                No products found matching this filter status.
              </div>
            ) : (
              filteredApprovalProducts.map((p) => {
                const sellerObj = sellers.find((s) => s.id === p.sellerId);
                const images = (p.media || []).filter((m) => m.type === 'IMAGE');
                const hasVideo = Boolean(p.videoUrl || (p.media || []).some((m) => m.type === 'VIDEO'));

                return (
                  <div
                    key={p.id}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sky-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Thumbnail */}
                      <img
                        src={p.media[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                        alt={p.title}
                        className="w-20 h-20 rounded-xl object-cover border border-gray-200 shrink-0 bg-white"
                      />

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-gray-900 truncate max-w-md">{p.title}</h4>
                          {p.status === 'PENDING_REVIEW' ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending Review
                            </span>
                          ) : p.status === 'REJECTED' ? (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-300 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Approved &amp; Live
                            </span>
                          )}
                        </div>

                        {p.titleBn && (
                          <p className="text-xs font-semibold text-gray-700 truncate">{p.titleBn}</p>
                        )}

                        <div className="flex items-center gap-3 text-xs flex-wrap pt-0.5">
                          <span className="font-black text-[#0284c7] tabular-nums">{formatPrice(p.price)}</span>
                          <span className="text-gray-400 line-through tabular-nums">{formatPrice(p.originalPrice)}</span>
                          <span className="font-bold text-gray-700">Stock: {p.stock} Pcs</span>
                          <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            Brand: {p.brand || 'Generic'}
                          </span>
                          <span className="bg-sky-100 text-[#0284c7] px-2 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            {sellerObj?.shopName || 'Apex Tech'}
                          </span>
                        </div>

                        {/* Media Badges & Specs */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap text-[10.5px]">
                          <span className="bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-sky-600" />
                            {images.length} Images Uploaded
                          </span>
                          {hasVideo && (
                            <a
                              href={p.videoUrl || p.media.find((m) => m.type === 'VIDEO')?.url}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-purple-100 border border-purple-200 text-purple-800 px-2 py-0.5 rounded-md font-extrabold flex items-center gap-1 hover:bg-purple-200 cursor-pointer"
                            >
                              <Video className="w-3 h-3 text-purple-700" />
                              Video Preview
                            </a>
                          )}
                          {p.tags && p.tags.length > 0 && (
                            <span className="text-gray-500 font-medium">Tags: {p.tags.join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                      {p.status !== 'ACTIVE' && (
                        <button
                          onClick={() => approveProduct(p.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve &amp; Publish</span>
                        </button>
                      )}

                      {p.status !== 'REJECTED' && (
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason for seller:', 'Product details incomplete or guidelines violated');
                            if (reason !== null) {
                              rejectProduct(p.id, reason);
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: DEPOSIT REQUESTS QUEUE ===================== */}
      {subTab === 'deposits' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                <span>Ad Balance Deposit Requests Queue (ডিপোজিট রিচার্জ লাইন)</span>
                {pendingDeposits.length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                    {pendingDeposits.length} Pending
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500">
                সেলারদের দেওয়া বিকাশ/নগদ ডিপোজিট তথ্য যাচাই করে ওয়ালেটে টাকা যোগ করুন।
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-y border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Seller Shop</th>
                  <th className="py-2.5 px-3">Method &amp; Sender</th>
                  <th className="py-2.5 px-3">TrxID</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {depositRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3 text-gray-400 text-[11px]">{req.createdAt}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">{req.sellerShopName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-pink-700">
                      {req.paymentMethod} ({req.senderNumber})
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-gray-900">{req.trxId}</td>
                    <td className="py-3 px-3 font-black text-emerald-600 text-sm tabular-nums">
                      {formatPrice(req.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveSellerDeposit(req.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() => setRejectDepositId(req.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: DEPOSIT NUMBERS & AD SETTINGS ===================== */}
      {subTab === 'ad_settings' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-base text-gray-900">
              Merchant Deposit Accounts &amp; Platform CPM Rates
            </h3>
            <p className="text-xs text-gray-500">
              সেলারদের টাকা পাঠানোর জন্য বিকাশ, নগদ, রকেট নম্বর ও প্রতি ১০০০ ইমপ্রেশনের এড প্রাইস সেট করুন।
            </p>
          </div>

          <form onSubmit={handleSaveAdSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-800 block mb-1">bKash Payment Number *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    className="flex-1 p-2.5 border border-gray-300 rounded-xl font-mono font-bold"
                  />
                  <select
                    value={bkashType}
                    onChange={(e) => setBkashType(e.target.value as any)}
                    className="p-2.5 border border-gray-300 rounded-xl font-bold bg-white"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Merchant">Merchant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Nagad Payment Number *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nagadNumber}
                    onChange={(e) => setNagadNumber(e.target.value)}
                    className="flex-1 p-2.5 border border-gray-300 rounded-xl font-mono font-bold"
                  />
                  <select
                    value={nagadType}
                    onChange={(e) => setNagadType(e.target.value as any)}
                    className="p-2.5 border border-gray-300 rounded-xl font-bold bg-white"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Merchant">Merchant</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Ad CPM Rate (৳ Taka per 1,000 Impressions)</label>
              <input
                type="number"
                value={cpmRate}
                onChange={(e) => setCpmRate(Number(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-xl font-black text-gray-900"
              />
            </div>

            <button
              type="submit"
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold px-6 py-2.5 rounded-xl shadow-xs cursor-pointer"
            >
              💾 Save Deposit Numbers &amp; CPM Rates
            </button>
          </form>
        </div>
      )}

      {/* ===================== TAB 5: SPONSORED CAMPAIGNS ===================== */}
      {subTab === 'campaigns' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5 space-y-4">
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Platform Sponsored Ad Boosts</h3>
              <p className="text-xs text-gray-500">All live campaigns boosted by shop sellers.</p>
            </div>
            <span className="bg-purple-100 text-purple-800 font-black text-xs px-3 py-1 rounded-full">
              {sponsoredCampaigns.length} Active Campaigns
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-y border-gray-100">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Impressions</th>
                  <th className="py-2.5 px-3">Clicks</th>
                  <th className="py-2.5 px-3">Spend</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {sponsoredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img src={camp.productImage} alt="" className="w-8 h-8 rounded-lg object-cover border" />
                        <span className="font-bold text-gray-900 truncate max-w-xs">{camp.productTitle}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-gray-900 tabular-nums">{camp.impressions.toLocaleString()}</td>
                    <td className="py-3 px-3 font-extrabold text-sky-600 tabular-nums">{camp.clicks.toLocaleString()}</td>
                    <td className="py-3 px-3 font-extrabold text-amber-600 tabular-nums">{formatPrice(camp.spend)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${camp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => toggleCampaignStatus(camp.id)}
                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      >
                        {camp.status === 'ACTIVE' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: VIEW SELLER PRODUCTS */}
      {viewSellerProductsId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="font-extrabold text-base text-gray-900">
                  Products by: {selectedSeller?.shopName}
                </h4>
                <p className="text-xs text-gray-400">Total {targetSellerProducts.length} items cataloged</p>
              </div>
              <button
                onClick={() => setViewSellerProductsId(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {targetSellerProducts.map((p) => {
                const isSponsored = sponsoredCampaigns.some((c) => c.status === 'ACTIVE' && c.productId === p.id);
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-sky-50/30 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.media[0]?.url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isSponsored && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                              Sponsored Ad
                            </span>
                          )}
                          <p className="font-bold text-xs text-gray-900 truncate max-w-xs">{p.title}</p>
                          {p.status === 'PENDING_REVIEW' && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                              Pending Review
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                          <span className="font-bold text-[#0284c7]">{formatPrice(p.price)}</span>
                          <span>Stock: {p.stock}</span>
                          <span>Sold: {p.soldCount}</span>
                          <span>⭐ {p.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {p.status === 'PENDING_REVIEW' && (
                        <button
                          onClick={() => approveProduct(p.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewSellerProductsId(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManager;
