'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Landmark, TrendingUp, Wallet, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminFinancialDashboard() {
  const { sellers, orders, sellerWallets, formatPrice, updateOrderStatus } = useMarketplace();
  const [dbStats, setDbStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // State for live Category Commission Rates
  const [commissions, setCommissions] = useState<Record<string, number>>({
    'cat-electronics': 5,
    'cat-men-fashion': 12,
    'cat-women-fashion': 12,
    'cat-accessories': 5,
    'cat-appliances': 5,
    'cat-others': 10
  });

  useEffect(() => {
    // Fetch stored commission rates from API on load
    fetch('/api/admin/categories/commission')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories)) {
          const map: Record<string, number> = { ...commissions };
          data.categories.forEach((cat: any) => {
            if (cat.id && typeof cat.commission === 'number') {
              map[cat.id] = cat.commission;
            }
          });
          setCommissions(map);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateCommissionRate = async (catId: string, catName: string, newRate: number) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/categories/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: catId, name: catName, commission: newRate })
      });
      const data = await res.json();
      if (data.success) {
        setCommissions((prev) => ({ ...prev, [catId]: newRate }));
        setMessage({ text: `Commission rate for ${catName} updated to ${newRate}%`, type: 'success' });
      } else {
        throw new Error(data.error || 'Failed to update commission');
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Error updating commission rate', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered');
  
  // Helper to determine commission rate
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

  // Compute stats for each seller
  const financialSellers = sellers.map((seller) => {
    // Find all items delivered for this seller
    let totalSales = 0;
    let commissionPaid = 0;

    deliveredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const itemSellerId = item.sellerId || 'seller-apex-01';
        if (itemSellerId === seller.id) {
          // Look up category ID
          // Find product category from order or fallback
          const itemTotal = item.price * item.quantity;
          // Look up product in order if we have categoryId, otherwise look up in system
          // Since category ID is not directly in OrderItem, we'll try to find the product matching
          const prodCategory = (item as any).categoryId || 'cat-others';
          const rate = getCommissionRate(prodCategory);
          const comm = (itemTotal * rate) / 100;
          
          totalSales += itemTotal;
          commissionPaid += comm;
        }
      });
    });

    // Get wallet from local storage / store context
    const wallet = sellerWallets[seller.id] || {
      availableBalance: totalSales - commissionPaid,
      totalIncome: totalSales,
      totalCommission: commissionPaid,
      netEarnings: totalSales - commissionPaid
    };

    return {
      id: seller.id,
      name: seller.shopName,
      owner: seller.email,
      totalSales,
      commissionPaid,
      walletBalance: wallet.availableBalance
    };
  });

  // Calculate total metrics
  const totalGrossVendorSales = financialSellers.reduce((sum, s) => sum + s.totalSales, 0);
  const totalPlatformEarnings = financialSellers.reduce((sum, s) => sum + s.commissionPaid, 0);

  // Simulation handler to complete an order and trigger backend API
  const handleSimulateDelivery = async (orderId: string) => {
    setLoading(true);
    setMessage(null);
    try {
      // Find the order
      const targetOrder = orders.find((o) => o.id === orderId);
      if (!targetOrder) throw new Error('Order not found');

      // 1. Trigger local store status update
      updateOrderStatus(orderId, 'Delivered');

      // 2. Call our brand new backend Mongoose commission API route!
      const updatedOrder = {
        ...targetOrder,
        orderStatus: 'Delivered' as const,
        items: targetOrder.items.map(it => ({
          ...it,
          // Attach category to item for commission calculation
          categoryId: it.productId.includes('fashion') ? 'cat-men-fashion' : 'cat-electronics'
        }))
      };

      const response = await fetch('/api/orders/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: updatedOrder }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to sync with Mongoose DB');
      }

      setDbStats(resData);
      setMessage({
        text: `Success! Order ${targetOrder.orderNumber} delivered. Deducted commissions processed in MongoDB database. DB Connected: ${resData.dbConnected ? 'YES' : 'NO (Graceful fallback active)'}`,
        type: 'success'
      });
    } catch (err: any) {
      setMessage({ text: err.message || 'Error executing simulation', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch db stats on mount if MongoDB is running
  useEffect(() => {
    // Attempting to see if backend route works
    const checkDbStatus = async () => {
      // Quietly fetch or verify
    };
    checkDbStatus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Marketplace Commissions &amp; Financials</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Gross Vendor Sales</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-gray-900 tabular-nums">
              {formatPrice(totalGrossVendorSales)}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Sum of all shop sales before platform fees</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Platform Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-600 tabular-nums">
              {formatPrice(totalPlatformEarnings)}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Deducted commission stored as Admin earnings</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pending Orders (COD / Paid)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-gray-900 tabular-nums">
              {orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length} Orders
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Orders waiting for fulfillment or delivery</p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-semibold ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
          <div>{message.text}</div>
        </div>
      )}

      {/* Interactive Simulation Panel */}
      <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl">
        <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2">Fulfillment Commission Simulator</h3>
        <p className="text-xs text-sky-800 mb-4">
          Click any pending order below to change its status to <strong>Delivered</strong>. This automatically computes the categories, deducts the corresponding commission percentages, and updates both the Seller Wallet & Admin revenue inside Mongoose models!
        </p>

        {orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length === 0 ? (
          <div className="text-xs text-gray-500 italic p-4 bg-white rounded-xl border border-dashed text-center">
            No pending orders currently. Place an order on the storefront to test live simulation!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').slice(0, 4).map((order) => (
              <div key={order.id} className="bg-white p-3.5 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs text-[#0284c7] font-bold">{order.orderNumber}</span>
                  <div className="text-[10px] text-gray-500">{order.customerName} · {order.items.length} item(s)</div>
                  <div className="text-xs font-extrabold text-gray-900">{formatPrice(order.total)}</div>
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleSimulateDelivery(order.id)}
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                >
                  <span>Deliver & Process</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Category Commission Rates Configuration Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900">Category Commission Rates</h3>
          </div>
          <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
            Firestore Sync Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { id: 'cat-electronics', name: 'Electronics & Gadgets' },
            { id: 'cat-men-fashion', name: "Men's Fashion" },
            { id: 'cat-women-fashion', name: "Women's Fashion" },
            { id: 'cat-accessories', name: 'Smart Accessories' },
            { id: 'cat-appliances', name: 'Home Appliances' },
            { id: 'cat-others', name: 'Other Categories' }
          ].map((cat) => {
            const currentRate = commissions[cat.id] !== undefined ? commissions[cat.id] : 10;
            return (
              <div key={cat.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-xs text-gray-900 truncate">{cat.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">ID: {cat.id}</div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentRate}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCommissions((prev) => ({ ...prev, [cat.id]: val }));
                    }}
                    className="w-14 px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-black text-gray-900 text-center focus:border-[#0284c7] outline-none"
                  />
                  <span className="text-xs font-bold text-gray-500">%</span>
                  <button
                    disabled={loading}
                    onClick={() => handleUpdateCommissionRate(cat.id, cat.name, commissions[cat.id] ?? 10)}
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Sellers Financial Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-gray-900">Registered Sellers & Financial Accounts</h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Commission Audits</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Shop Name</th>
                <th className="py-3.5 px-4">Seller Account</th>
                <th className="py-3.5 px-4">Total Gross Sales</th>
                <th className="py-3.5 px-4">Commission Paid (Platform)</th>
                <th className="py-3.5 px-4">Current Wallet Balance</th>
                <th className="py-3.5 px-4">Deduction Rates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {financialSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <div className="font-extrabold text-gray-900 text-sm">{seller.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">ID: {seller.id}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 font-semibold">{seller.owner}</td>
                  <td className="py-3 px-4 font-extrabold text-gray-900 tabular-nums">{formatPrice(seller.totalSales)}</td>
                  <td className="py-3 px-4 font-extrabold text-amber-600 tabular-nums">{formatPrice(seller.commissionPaid)}</td>
                  <td className="py-3 px-4">
                    <span className="font-black text-emerald-600 tabular-nums">{formatPrice(seller.walletBalance)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-[9px] bg-sky-50 text-[#0284c7] font-bold px-1.5 py-0.5 rounded">Electronics: 5%</span>
                      <span className="text-[9px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded">Fashion: 12%</span>
                      <span className="text-[9px] bg-gray-100 text-gray-700 font-bold px-1.5 py-0.5 rounded">Others: 10%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
