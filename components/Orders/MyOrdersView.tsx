'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Order } from '@/lib/types/ecommerce';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Copy,
  X,
  Store
} from 'lucide-react';

export const MyOrdersView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { orders, formatPrice, requestReturn, showToast, t, user } = useMarketplace();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Product damaged during courier transit');
  const [additionalComments, setAdditionalComments] = useState('');
  const [currentTime] = useState<number>(() => Date.now());

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalOrder) return;
    const fullReason = `${returnReason}${additionalComments ? ` - ${additionalComments}` : ''}`;
    requestReturn(returnModalOrder.id, fullReason);
    setReturnModalOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-[800px] w-full max-h-[92vh] overflow-y-auto flex flex-col relative border border-gray-100">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0284c7]" />
            <h2 className="font-extrabold text-base text-gray-900">{t('myOrders')}</h2>
            <span className="text-xs bg-sky-100 text-[#0284c7] font-bold px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-medium">You haven&rsquo;t placed any orders yet.</p>
            </div>
          ) : (
            orders.map((ord) => {
              const isExpanded = expandedOrderId === ord.id;

              // 7-day Return rule calculation:
              // Return button shows only within 7 days of deliveredAt
              let canReturn = false;
              let returnWindowExpired = false;
              let daysLeftForReturn = 0;

              if (ord.orderStatus === 'Delivered' && ord.deliveredAt) {
                const deliveryTime = new Date(ord.deliveredAt).getTime();
                const diffMs = currentTime - deliveryTime;
                const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
                if (diffMs <= sevenDaysMs && !ord.returnRequested) {
                  canReturn = true;
                  daysLeftForReturn = Math.ceil((sevenDaysMs - diffMs) / (24 * 3600 * 1000));
                } else if (diffMs > sevenDaysMs) {
                  returnWindowExpired = true;
                }
              }

              return (
                <div
                  key={ord.id}
                  className="rounded-lg border border-gray-200 overflow-hidden shadow-2xs transition-all bg-white"
                >
                  {/* Top Summary Bar */}
                  <div className="bg-gray-50/70 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                          Order Number
                        </span>
                        <div className="flex items-center gap-1 font-mono font-bold text-gray-900">
                          <span>{ord.orderNumber}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(ord.orderNumber);
                              showToast('Order number copied', 'info');
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                          Customer ID
                        </span>
                        <span className="font-mono font-bold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 text-[11px]">
                          {user?.customerId || ord.userId || 'QA-48291048'}
                        </span>
                      </div>

                      <div className="hidden sm:block">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                          Placed On
                        </span>
                        <span className="text-gray-700">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                          Status
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-sky-100 text-blue-800'
                              : ord.orderStatus === 'Returned'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">
                          Total
                        </span>
                        <span className="font-extrabold text-sm text-[#0284c7] tabular-nums">
                          {formatPrice(ord.total)}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleExpand(ord.id)}
                        className="p-1 hover:bg-gray-200 rounded text-gray-600"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Tracking Timeline Stepper */}
                  <div className="px-4 py-3 bg-white border-b border-gray-100">
                    <div className="flex items-center justify-between max-w-[450px] mx-auto text-[11px] relative">
                      {/* Step 1: Confirmed */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <span className="mt-1 font-semibold text-gray-700">Confirmed</span>
                      </div>

                      {/* Connecting Line 1 */}
                      <div
                        className={`flex-1 h-0.5 -mt-3.5 mx-1 ${
                          ord.orderStatus === 'Shipped' || ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-600'
                            : 'bg-gray-200'
                        }`}
                      />

                      {/* Step 2: Shipped */}
                      <div className="flex flex-col items-center z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                            ord.orderStatus === 'Shipped' || ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          <Truck className="w-3 h-3" />
                        </div>
                        <span className="mt-1 font-semibold text-gray-700">Shipped</span>
                      </div>

                      {/* Connecting Line 2 */}
                      <div
                        className={`flex-1 h-0.5 -mt-3.5 mx-1 ${
                          ord.orderStatus === 'Delivered' ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                      />

                      {/* Step 3: Delivered */}
                      <div className="flex flex-col items-center z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="mt-1 font-semibold text-gray-700">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Items List - Grouped by Seller Sub-Order if Multi-Vendor */}
                  {ord.subOrders && ord.subOrders.length > 0 ? (
                    <div className="p-3.5 space-y-3">
                      {ord.subOrders.map((sub) => (
                        <div key={sub.id} className="bg-sky-50/40 p-3 rounded-xl border border-sky-200/80 space-y-2">
                          <div className="flex items-center justify-between border-b border-sky-200/60 pb-1.5 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <Store className="w-3.5 h-3.5 text-[#0284c7]" />
                              <span className="font-extrabold text-gray-900">Sold by {sub.shopName}</span>
                            </div>
                            <span className="bg-sky-100 text-[#0284c7] font-bold px-2 py-0.5 rounded text-[10px]">
                              Status: {sub.orderStatus}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {sub.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 text-xs">
                                <div className="w-10 h-10 rounded bg-white border border-gray-200 shrink-0 overflow-hidden p-0.5">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                                  <p className="text-[11px] text-gray-500">
                                    Qty: {item.quantity} {item.variantValue ? `· ${item.variantValue}` : ''}
                                  </p>
                                </div>
                                <span className="font-bold text-gray-900 tabular-nums">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 space-y-2">
                      {ord.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-xs">
                          <div className="w-12 h-12 rounded bg-gray-50 border border-gray-200 shrink-0 overflow-hidden p-0.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                            <p className="text-[11px] text-gray-500">
                              Qty: {item.quantity} {item.variantValue ? `· ${item.variantValue}` : ''}
                            </p>
                          </div>
                          <span className="font-bold text-gray-900 tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer with Return Action according to 7-day rule */}
                  <div className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-[11px] text-gray-500">
                      Tracking ID: <span className="font-mono text-gray-700">{ord.trackingNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Return Status / Button */}
                      {ord.returnRequested ? (
                        <span className="bg-purple-100 text-purple-800 font-bold px-2 py-1 rounded text-[11px]">
                          ✓ Return Requested ({ord.returnReason || 'Processing'})
                        </span>
                      ) : canReturn ? (
                        <button
                          onClick={() => setReturnModalOrder(ord)}
                          className="bg-white hover:bg-sky-50 text-[#0284c7] border border-[#0284c7] font-bold text-[11px] px-3 py-1.5 rounded transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{t('returnItem')} ({daysLeftForReturn} days left)</span>
                        </button>
                      ) : returnWindowExpired ? (
                        <span className="text-[11px] text-gray-400 italic">
                          {t('returnExpired')}
                        </span>
                      ) : ord.orderStatus !== 'Delivered' ? (
                        <span className="text-[11px] text-gray-400">
                          Return window opens once package is delivered
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Return Request Modal */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-lg p-5 max-w-[440px] w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-[#0284c7]" />
                <span>7-Day Return Request (Order #{returnModalOrder.orderNumber})</span>
              </h3>
              <button
                onClick={() => setReturnModalOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Under our 7-day hassle-free return policy, our courier partner will pick up the item
              from your address at no extra cost.
            </p>

            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Select Reason *</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
                >
                  <option value="Product damaged during courier transit">
                    Product damaged during courier transit
                  </option>
                  <option value="Defective / Stopped working properly">
                    Defective / Stopped working properly
                  </option>
                  <option value="Received wrong item or size">Received wrong item or size</option>
                  <option value="Item not as described on page">Item not as described on page</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Additional Details / Photos note:
                </label>
                <textarea
                  rows={3}
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  placeholder="Describe the issue with the item..."
                  className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnModalOrder(null)}
                  className="flex-1 py-2 font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded shadow-sm"
                >
                  Submit Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
