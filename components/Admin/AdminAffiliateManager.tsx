'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  Affiliate,
  AffiliateCommission,
  AffiliateWithdrawal,
  AffiliateSettings,
  AffiliateFraudAlert,
  AffiliateCommissionStatus,
  AffiliateWithdrawalStatus
} from '@/lib/types/ecommerce';
import {
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  CreditCard,
  ShieldAlert,
  Clock,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  Download,
  Percent,
  Check,
  X,
  ChevronDown
} from 'lucide-react';

export const AdminAffiliateManager: React.FC = () => {
  const {
    affiliates,
    affiliateCommissions,
    affiliateWithdrawals,
    affiliateSettings,
    affiliateFraudAlerts,
    categories,
    formatPrice,
    adminToggleAffiliateStatus,
    adminUpdateAffiliateSettings,
    adminUpdateWithdrawal,
    adminCancelCommission,
    runAffiliateCommissionApprovalCron,
    showToast
  } = useMarketplace();

  const [activeSubTab, setActiveSubTab] = useState<
    'affiliates' | 'commissions' | 'withdrawals' | 'settings' | 'fraud' | 'reports'
  >('affiliates');

  // Search and filters
  const [affiliateSearch, setAffiliateSearch] = useState('');
  const [commissionFilter, setCommissionFilter] = useState<'ALL' | AffiliateCommissionStatus>('ALL');
  const [withdrawalFilter, setWithdrawalFilter] = useState<'ALL' | AffiliateWithdrawalStatus>('ALL');

  // Modal / Action states
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<AffiliateWithdrawal | null>(null);
  const [txnIdInput, setTxnIdInput] = useState('');
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [processAction, setProcessAction] = useState<'APPROVE_PAY' | 'REJECT'>('APPROVE_PAY');

  // Settings form local state
  const [globalPercent, setGlobalPercent] = useState(affiliateSettings.globalCommissionPercent.toString());
  const [holdDays, setHoldDays] = useState(affiliateSettings.holdPeriodDays.toString());
  const [minWithdrawal, setMinWithdrawal] = useState(affiliateSettings.minWithdrawalAmount.toString());
  const [cookieDays, setCookieDays] = useState(affiliateSettings.cookieDurationDays.toString());
  const [categoryRates, setCategoryRates] = useState<Record<string, number>>(affiliateSettings.categoryCommissions || {});

  // Overall statistics
  const totalAffiliates = affiliates.length;
  const activeAffiliatesCount = affiliates.filter((a) => a.status === 'Active').length;
  const totalCommissionPaid = affiliates.reduce((sum, a) => sum + (a.totalWithdrawn || 0), 0);
  const totalAvailableHeld = affiliates.reduce((sum, a) => sum + (a.availableBalance || 0), 0);
  const totalPendingBalance = affiliates.reduce((sum, a) => sum + (a.pendingBalance || 0), 0);
  const pendingWithdrawalsCount = affiliateWithdrawals.filter((w) => w.status === 'Pending').length;
  const activeFraudCount = affiliateFraudAlerts.filter((f) => !f.resolved).length;

  const filteredAffiliates = affiliates.filter((a) => {
    const q = affiliateSearch.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.phone.includes(q)
    );
  });

  const filteredCommissions = affiliateCommissions.filter((c) => {
    if (commissionFilter === 'ALL') return true;
    return c.status === commissionFilter;
  });

  const filteredWithdrawals = affiliateWithdrawals.filter((w) => {
    if (withdrawalFilter === 'ALL') return true;
    return w.status === withdrawalFilter;
  });

  // Handle Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateAffiliateSettings({
      globalCommissionPercent: Number(globalPercent) || 10,
      holdPeriodDays: Number(holdDays) || 15,
      minWithdrawalAmount: Number(minWithdrawal) || 500,
      cookieDurationDays: Number(cookieDays) || 30,
      categoryCommissions: categoryRates
    });
  };

  // Open Withdrawal Process Modal
  const openProcessModal = (w: AffiliateWithdrawal, action: 'APPROVE_PAY' | 'REJECT') => {
    setSelectedWithdrawal(w);
    setProcessAction(action);
    setTxnIdInput(`TXN-${Date.now().toString().slice(-6)}`);
    setRejectReasonInput('');
    setIsProcessModalOpen(true);
  };

  const handleConfirmWithdrawal = () => {
    if (!selectedWithdrawal) return;
    if (processAction === 'APPROVE_PAY') {
      adminUpdateWithdrawal(selectedWithdrawal.id, 'Paid', txnIdInput.trim() || undefined);
    } else {
      if (!rejectReasonInput.trim()) {
        showToast('Please provide a reason for rejecting withdrawal.', 'error');
        return;
      }
      adminUpdateWithdrawal(selectedWithdrawal.id, 'Rejected', undefined, rejectReasonInput.trim());
    }
    setIsProcessModalOpen(false);
    setSelectedWithdrawal(null);
  };

  // Trigger simulated cron job
  const handleRunCron = () => {
    const count = runAffiliateCommissionApprovalCron();
    showToast(`Cron Job Executed: Verified and approved ${count} pending commission(s) past 15-day hold period!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-gradient-to-r from-[#f85606] via-orange-600 to-amber-600 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Daraz-Style Affiliate Engine
              </span>
              <span className="bg-emerald-400 text-gray-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Active (10% Base)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Affiliate Partner & Referral Management</h2>
            <p className="text-orange-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Track affiliate partners, commissions lifecycle (Pending 15-day hold → Approved), payout requests via bKash/Nagad/Bank, and fraud detection.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunCron}
              className="bg-white text-[#f85606] hover:bg-orange-50 font-black text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Runs automatic 15-day hold period verification"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#f85606]" />
              <span>Run Approval Cron</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-orange-100 font-semibold block">Total Partners</span>
            <span className="text-lg sm:text-xl font-black tracking-tight mt-0.5 block">{totalAffiliates}</span>
            <span className="text-[10px] text-orange-200 font-medium">{activeAffiliatesCount} Active</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-orange-100 font-semibold block">Available Balances</span>
            <span className="text-lg sm:text-xl font-black tracking-tight mt-0.5 block">{formatPrice(totalAvailableHeld)}</span>
            <span className="text-[10px] text-orange-200 font-medium">Ready for Payout</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-orange-100 font-semibold block">Pending Commissions</span>
            <span className="text-lg sm:text-xl font-black tracking-tight mt-0.5 block">{formatPrice(totalPendingBalance)}</span>
            <span className="text-[10px] text-orange-200 font-medium">15-day hold period</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-orange-100 font-semibold block">Total Paid Out</span>
            <span className="text-lg sm:text-xl font-black tracking-tight mt-0.5 block">{formatPrice(totalCommissionPaid)}</span>
            <span className="text-[10px] text-emerald-300 font-semibold">Processed</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-orange-100 font-semibold block">Payout Requests</span>
            <span className="text-lg sm:text-xl font-black tracking-tight mt-0.5 block">{pendingWithdrawalsCount}</span>
            <span className="text-[10px] text-amber-200 font-bold">{pendingWithdrawalsCount > 0 ? 'Action Needed' : 'All Clear'}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
            <span className="text-[11px] text-orange-100 font-semibold block">Fraud Alerts</span>
            <span className="text-lg sm:text-xl font-black tracking-tight mt-0.5 block">{activeFraudCount}</span>
            <span className="text-[10px] text-rose-200 font-bold">{activeFraudCount > 0 ? 'Investigate' : '0 Flagged'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-200 scrollbar-thin">
        {[
          { id: 'affiliates', label: `Affiliates (${affiliates.length})`, icon: Users },
          { id: 'commissions', label: `Commissions (${affiliateCommissions.length})`, icon: DollarSign },
          { id: 'withdrawals', label: `Withdrawal Queue (${pendingWithdrawalsCount})`, icon: CreditCard, badge: pendingWithdrawalsCount },
          { id: 'settings', label: 'Commission Settings', icon: Settings },
          { id: 'fraud', label: `Fraud Monitoring (${activeFraudCount})`, icon: ShieldAlert, badge: activeFraudCount },
          { id: 'reports', label: 'Top Performers & Reports', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#f85606] text-white shadow-xs'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 && !isActive ? (
                <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: AFFILIATES LIST */}
      {activeSubTab === 'affiliates' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={affiliateSearch}
                onChange={(e) => setAffiliateSearch(e.target.value)}
                placeholder="Search by name, email, code or phone..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#f85606]"
              />
            </div>
            <div className="text-xs text-gray-500 font-bold self-end sm:self-center">
              Showing {filteredAffiliates.length} of {affiliates.length} Partners
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-extrabold uppercase border-b border-gray-200 text-[10.5px]">
                  <tr>
                    <th className="p-3.5">Affiliate Partner</th>
                    <th className="p-3.5">Ref Code</th>
                    <th className="p-3.5">Payout Method</th>
                    <th className="p-3.5">Available Balance</th>
                    <th className="p-3.5">Pending Hold</th>
                    <th className="p-3.5">Lifetime Earned</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredAffiliates.map((aff) => (
                    <tr key={aff.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900">{aff.name}</div>
                        <div className="text-[11px] text-gray-500">{aff.email}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{aff.phone}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-black text-[#f85606] bg-orange-50 px-2 py-1 rounded border border-orange-200">
                          {aff.code}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-gray-800">{aff.payoutMethod}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{aff.payoutAccount}</div>
                      </td>
                      <td className="p-3.5 font-black text-emerald-700">
                        {formatPrice(aff.availableBalance)}
                      </td>
                      <td className="p-3.5 font-bold text-amber-700">
                        {formatPrice(aff.pendingBalance)}
                      </td>
                      <td className="p-3.5 font-black text-gray-900">
                        {formatPrice(aff.totalEarned)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            aff.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {aff.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => adminToggleAffiliateStatus(aff.id)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                            aff.status === 'Active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {aff.status === 'Active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COMMISSIONS TABLE */}
      {activeSubTab === 'commissions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-1.5">
              {(['ALL', 'Pending', 'Approved', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setCommissionFilter(st)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    commissionFilter === st
                      ? 'bg-[#f85606] text-white shadow-2xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500 font-bold">
              Showing {filteredCommissions.length} commissions
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-extrabold uppercase border-b border-gray-200 text-[10.5px]">
                  <tr>
                    <th className="p-3.5">Order / Date</th>
                    <th className="p-3.5">Affiliate</th>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Qty / Order Amt</th>
                    <th className="p-3.5">Rate / Commission</th>
                    <th className="p-3.5">Status & Countdown</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredCommissions.map((comm) => (
                    <tr key={comm.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-gray-900">{comm.orderNumber}</div>
                        <div className="text-[10.5px] text-gray-400">
                          {new Date(comm.orderDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-black text-[#f85606] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-[11px]">
                          {comm.affiliateCode}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2 max-w-[240px]">
                          {comm.productImage && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={comm.productImage}
                              alt={comm.productTitle}
                              className="w-8 h-8 rounded object-cover border border-gray-200 shrink-0"
                            />
                          )}
                          <span className="truncate font-semibold text-gray-800 text-[11.5px]">
                            {comm.productTitle}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900">Qty: {comm.quantity}</div>
                        <div className="text-gray-500">{formatPrice(comm.orderAmount)}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-black text-emerald-700 text-sm">{formatPrice(comm.commissionAmount)}</div>
                        <div className="text-[10px] text-gray-400 font-bold">{comm.commissionRate}% rate</div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              comm.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : comm.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {comm.status}
                          </span>
                        </div>
                        {comm.status === 'Pending' && comm.daysLeft !== undefined && comm.daysLeft > 0 && (
                          <div className="text-[10px] text-amber-700 font-bold mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{comm.daysLeft} days left (Hold)</span>
                          </div>
                        )}
                        {comm.status === 'Approved' && (
                          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                            Available in Balance
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {comm.status !== 'Cancelled' ? (
                          <button
                            onClick={() => {
                              if (confirm(`Cancel commission for order ${comm.orderNumber}? (Used for returns or fraud)`)) {
                                adminCancelCommission(comm.id, 'Cancelled due to administrative review / returned goods.');
                              }
                            }}
                            className="text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
                          >
                            Cancel Commission
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Cancelled</span>
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

      {/* SUB-TAB 3: WITHDRAWALS QUEUE */}
      {activeSubTab === 'withdrawals' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
            <div className="flex items-center gap-1.5">
              {(['ALL', 'Pending', 'Paid', 'Rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setWithdrawalFilter(st)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    withdrawalFilter === st
                      ? 'bg-[#f85606] text-white shadow-2xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500 font-bold">
              {pendingWithdrawalsCount} pending requests awaiting payout
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 font-extrabold uppercase border-b border-gray-200 text-[10.5px]">
                  <tr>
                    <th className="p-3.5">Affiliate</th>
                    <th className="p-3.5">Payout Method & Details</th>
                    <th className="p-3.5">Requested Amount</th>
                    <th className="p-3.5">Requested At</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Txn ID / Note</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredWithdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900">{w.affiliateName}</div>
                        <div className="font-mono text-[#f85606] text-[11px] font-bold">{w.affiliateCode}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-extrabold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                          {w.payoutMethod}
                        </span>
                        <div className="font-mono text-gray-600 font-semibold mt-1">{w.payoutAccount}</div>
                      </td>
                      <td className="p-3.5 font-black text-emerald-700 text-sm">
                        {formatPrice(w.amount)}
                      </td>
                      <td className="p-3.5 text-gray-500">
                        {new Date(w.requestedAt).toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            w.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : w.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {w.txnId ? (
                          <div className="font-mono font-bold text-emerald-700 text-[11px]">{w.txnId}</div>
                        ) : w.rejectReason ? (
                          <div className="text-rose-600 text-[11px]">{w.rejectReason}</div>
                        ) : (
                          <span className="text-gray-400 italic">None</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {w.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openProcessModal(w, 'APPROVE_PAY')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Mark as Paid</span>
                            </button>
                            <button
                              onClick={() => openProcessModal(w, 'REJECT')}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-semibold text-[11px]">Processed</span>
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

      {/* SUB-TAB 4: COMMISSION SETTINGS */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
          <div>
            <h3 className="text-base font-black text-gray-900">Global Affiliate & Commission Rules</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure baseline rates, return holding periods, and monthly payout constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Global Commission Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={globalPercent}
                  onChange={(e) => setGlobalPercent(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:border-[#f85606] outline-none"
                />
                <Percent className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">Default percentage applied to all products</span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Pending Hold Period (Days)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={holdDays}
                onChange={(e) => setHoldDays(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:border-[#f85606] outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Default 15 days to protect against buyer returns</span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Minimum Withdrawal Amount (BDT)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={minWithdrawal}
                onChange={(e) => setMinWithdrawal(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:border-[#f85606] outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Minimum balance required to request payout (e.g. 500 BDT)</span>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Referral Cookie Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={cookieDays}
                onChange={(e) => setCookieDays(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-bold focus:border-[#f85606] outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Cookie lifetime (last click wins attribution)</span>
            </div>
          </div>

          {/* Category-Wise Commission Override */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-black text-gray-900 mb-2">Category-Specific Commission Rates</h4>
            <p className="text-xs text-gray-500 mb-3">
              Override global rate with custom commission % per category.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const currentRate = categoryRates[cat.id] ?? affiliateSettings.globalCommissionPercent;
                return (
                  <div key={cat.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50/70 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-gray-800 block truncate max-w-[150px]">{cat.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{cat.slug}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={currentRate}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setCategoryRates((prev) => ({ ...prev, [cat.id]: val }));
                        }}
                        className="w-16 p-1.5 text-center text-xs font-bold bg-white border border-gray-300 rounded outline-none focus:border-[#f85606]"
                      />
                      <span className="text-xs font-bold text-gray-500">%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="bg-[#f85606] hover:bg-orange-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Affiliate Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 5: FRAUD MONITORING */}
      {activeSubTab === 'fraud' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold block mb-0.5">Automated Fraud Detection Rules:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                <li><strong>Self-Purchase Blocking:</strong> Affiliates cannot earn commission on orders placed from matching phone or account.</li>
                <li><strong>Click Burst Detection:</strong> Multiple clicks from the same IP within minutes without conversion trigger high-risk alerts.</li>
                <li><strong>Return &amp; Cancel Sync:</strong> Orders returned within 15 days automatically void pending commissions.</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-3.5 border-b border-gray-200 font-black text-xs text-gray-800">
              Active Security &amp; Fraud Alerts ({affiliateFraudAlerts.length})
            </div>
            <div className="divide-y divide-gray-100">
              {affiliateFraudAlerts.map((alert) => (
                <div key={alert.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        alert.severity === 'HIGH'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-gray-900">{alert.type.replace(/_/g, ' ')}</span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                            alert.severity === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                      <span className="text-[11px] text-[#f85606] font-bold mt-1 block">
                        Affiliate Partner: {alert.affiliateName}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    {alert.resolved ? (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          adminToggleAffiliateStatus(alert.affiliateId);
                        }}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Suspend Affiliate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: REPORTS & TOP PERFORMERS */}
      {activeSubTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Top Affiliates by Earnings */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <h4 className="font-black text-xs uppercase tracking-wider text-gray-600 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#f85606]" />
              <span>Top Affiliate Earners</span>
            </h4>
            <div className="space-y-3">
              {[...affiliates]
                .sort((a, b) => b.totalEarned - a.totalEarned)
                .slice(0, 5)
                .map((a, i) => (
                  <div key={a.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#f85606] text-white flex items-center justify-center font-black text-xs shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">{a.name}</span>
                        <span className="font-mono text-[10px] text-gray-400">{a.code}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-xs text-emerald-700 block">{formatPrice(a.totalEarned)}</span>
                      <span className="text-[10px] text-gray-400">Paid: {formatPrice(a.totalWithdrawn)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Commissioned Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <h4 className="font-black text-xs uppercase tracking-wider text-gray-600 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Highest Commission Generating Orders</span>
            </h4>
            <div className="space-y-3">
              {[...affiliateCommissions]
                .sort((a, b) => b.commissionAmount - a.commissionAmount)
                .slice(0, 5)
                .map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      {c.productImage && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={c.productImage} alt={c.productTitle} className="w-8 h-8 rounded object-cover border border-gray-200 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-gray-900 truncate block">{c.productTitle}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{c.orderNumber}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-xs text-emerald-700 block">+{formatPrice(c.commissionAmount)}</span>
                      <span className="text-[10px] text-gray-400 font-bold">{c.status}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAWAL PROCESS MODAL */}
      {isProcessModalOpen && selectedWithdrawal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-[460px] w-full p-5 space-y-4 border border-gray-200 text-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-sm text-gray-900">
                {processAction === 'APPROVE_PAY' ? 'Approve & Mark Payout as Paid' : 'Reject Withdrawal Request'}
              </h3>
              <button
                onClick={() => setIsProcessModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Partner:</span>
                <span className="font-bold text-gray-900">{selectedWithdrawal.affiliateName} ({selectedWithdrawal.affiliateCode})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Requested Amount:</span>
                <span className="font-black text-emerald-700 text-sm">{formatPrice(selectedWithdrawal.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payout Channel:</span>
                <span className="font-bold text-gray-900">{selectedWithdrawal.payoutMethod}: {selectedWithdrawal.payoutAccount}</span>
              </div>
            </div>

            {processAction === 'APPROVE_PAY' ? (
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Bank / MFS Transaction ID (TrxID)
                </label>
                <input
                  type="text"
                  value={txnIdInput}
                  onChange={(e) => setTxnIdInput(e.target.value)}
                  placeholder="e.g. BK92L0P1X"
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-mono font-bold focus:border-[#f85606] outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Amount will be permanently deducted from affiliate balance.
                </span>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectReasonInput}
                  onChange={(e) => setRejectReasonInput(e.target.value)}
                  placeholder="e.g. Account number invalid or suspicious activity detected..."
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-medium focus:border-rose-500 outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Locked amount will be returned to the affiliate available balance.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsProcessModalOpen(false)}
                className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdrawal}
                className={`px-4 py-2 text-xs font-black rounded-lg text-white shadow-xs transition-all ${
                  processAction === 'APPROVE_PAY'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {processAction === 'APPROVE_PAY' ? 'Confirm Payment' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
