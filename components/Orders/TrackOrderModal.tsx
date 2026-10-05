'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  X,
  Copy,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  Phone
} from 'lucide-react';

export const TrackOrderModal: React.FC = () => {
  const {
    isTrackOrderModalOpen,
    setIsTrackOrderModalOpen,
    trackOrderNumberQuery,
    setTrackOrderNumberQuery,
    orders,
    formatPrice,
    showToast,
    setActiveReturnOrderModal
  } = useMarketplace();

  const [currentTime] = useState<number>(() => Date.now());
  const [inputVal, setInputVal] = useState<string>('');
  const [searchedId, setSearchedId] = useState<string>('');

  if (!isTrackOrderModalOpen) return null;

  const effectiveSearchId =
    searchedId.trim() ||
    trackOrderNumberQuery.trim() ||
    orders[0]?.orderNumber ||
    'BZ-2026-89412';

  // Find order by orderNumber, phone, order ID, or Customer ID
  const matchedOrder = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === effectiveSearchId.toLowerCase() ||
      o.customerPhone.includes(effectiveSearchId) ||
      o.id === effectiveSearchId ||
      o.userId?.toLowerCase() === effectiveSearchId.toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = (inputVal || effectiveSearchId).trim();
    if (query) {
      setSearchedId(query);
      setTrackOrderNumberQuery(query);
    }
  };

  // Determine active step index
  const statusSteps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStatus = matchedOrder ? matchedOrder.orderStatus : 'Pending';
  const currentStepIdx = Math.max(0, statusSteps.indexOf(currentStatus));

  // 7-day return eligibility
  let canReturn = false;
  let daysLeft = 0;
  if (matchedOrder?.orderStatus === 'Delivered' && matchedOrder.deliveredAt) {
    const deliveryTime = new Date(matchedOrder.deliveredAt).getTime();
    const diffMs = currentTime - deliveryTime;
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    if (diffMs <= sevenDaysMs && !matchedOrder.returnRequested) {
      canReturn = true;
      daysLeft = Math.ceil((sevenDaysMs - diffMs) / (24 * 3600 * 1000));
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-[680px] w-full max-h-[92vh] overflow-y-auto flex flex-col relative border border-gray-100">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#0284c7]" />
            <h2 className="font-extrabold text-base text-gray-900">
              Live Order &amp; Delivery Tracking
            </h2>
          </div>
          <button
            onClick={() => setIsTrackOrderModalOpen(false)}
            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-sky-50/60 border-b border-sky-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal !== '' ? inputVal : effectiveSearchId}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Order # (e.g. BZ-2026-89412), Phone, or Customer ID"
                className="w-full text-xs py-2 pl-9 pr-3 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold px-4 py-2 rounded transition-colors flex items-center gap-1 shrink-0"
            >
              <span>Track Now</span>
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-gray-600">
            <span className="font-semibold text-gray-700">Quick Track:</span>
            {orders.slice(0, 4).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setInputVal(o.orderNumber);
                  setSearchedId(o.orderNumber);
                }}
                className={`border px-2 py-0.5 rounded font-mono font-semibold text-xs transition-colors ${
                  matchedOrder?.id === o.id
                    ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-xs'
                    : 'bg-white hover:bg-sky-50 border-sky-200 text-[#0284c7]'
                }`}
              >
                #{o.orderNumber} ({o.orderStatus})
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6">
          {matchedOrder ? (
            <>
              {/* Order Overview Header */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-semibold">Order Number:</span>
                    <span className="font-mono font-extrabold text-sm text-gray-900">
                      {matchedOrder.orderNumber}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(matchedOrder.orderNumber);
                        showToast('Order number copied!', 'info');
                      }}
                      className="text-gray-400 hover:text-[#0284c7]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-gray-500 mt-0.5">
                    Customer: <strong>{matchedOrder.customerName}</strong> ({matchedOrder.customerPhone}) ·{' '}
                    <span className="font-mono text-sky-800 font-bold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                      ID: {matchedOrder.userId || 'QA-48291048'}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black px-2.5 py-1 rounded text-xs uppercase ${
                      matchedOrder.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : matchedOrder.orderStatus === 'Shipped'
                        ? 'bg-sky-100 text-blue-800'
                        : matchedOrder.orderStatus === 'Returned'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {matchedOrder.orderStatus}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">
                    Courier: {matchedOrder.courierPartner || 'Pathao Express'}
                  </p>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              <div>
                <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-3">
                  Delivery Timeline
                </h4>
                <div className="flex items-center justify-between relative text-xs">
                  {statusSteps.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step} className="flex-1 flex flex-col items-center relative z-10 text-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCurrent
                              ? 'bg-[#0284c7] text-white ring-4 ring-sky-100 shadow-sm'
                              : isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`mt-1.5 text-[11px] ${
                            isCurrent
                              ? 'font-bold text-[#0284c7]'
                              : isDone
                              ? 'font-semibold text-gray-800'
                              : 'text-gray-400'
                          }`}
                        >
                          {step}
                        </span>

                        {/* Connector line */}
                        {idx < statusSteps.length - 1 && (
                          <div
                            className={`absolute top-3.5 left-1/2 w-full h-0.5 -z-10 ${
                              idx < currentStepIdx ? 'bg-emerald-600' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier & Live Logs */}
              <div className="bg-[#fafafa] rounded-lg p-4 border border-gray-200 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                    <MapPin className="w-4 h-4 text-[#0284c7]" />
                    <span>Destination: {matchedOrder.shippingAddress.district}, {matchedOrder.shippingAddress.division}</span>
                  </div>
                  <span className="font-mono text-gray-500">
                    AWB: {matchedOrder.trackingNumber}
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {matchedOrder.trackingLogs && matchedOrder.trackingLogs.length > 0 ? (
                    matchedOrder.trackingLogs.map((log, i) => (
                      <div key={i} className="flex gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[#0284c7] mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{log.title}</p>
                          <p className="text-[11px] text-gray-600">{log.description}</p>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {log.timestamp} · {log.location || 'Dhaka Hub'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900">Order Placed &amp; Dispatched</p>
                        <p className="text-[11px] text-gray-600">
                          Order is verified and dispatched via {matchedOrder.courierPartner || 'Pathao Express'}.
                        </p>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(matchedOrder.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 7-Day Return Status */}
              {matchedOrder.orderStatus === 'Delivered' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-900">Package Delivered</span>
                      <p className="text-[11px] text-emerald-700">
                        {canReturn
                          ? `Eligible for 7-Day Doorstep Return until ${new Date(matchedOrder.returnWindowEndsAt || '').toLocaleDateString()} (${daysLeft} days remaining).`
                          : matchedOrder.returnRequested
                          ? `Return Request Submitted (${matchedOrder.returnReason})`
                          : '7-day return period has ended.'}
                      </p>
                    </div>
                  </div>

                  {canReturn && (
                    <button
                      onClick={() => {
                        setIsTrackOrderModalOpen(false);
                        setActiveReturnOrderModal(matchedOrder);
                      }}
                      className="bg-white hover:bg-sky-50 text-[#0284c7] border border-[#0284c7] font-bold text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request 7-Day Return</span>
                    </button>
                  )}
                </div>
              )}

              {/* Items in this order */}
              <div>
                <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-2">
                  Items in this Order ({matchedOrder.items.length})
                </h4>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {matchedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5 p-2 rounded bg-gray-50 text-xs">
                      <div className="w-10 h-10 rounded bg-white border border-gray-200 overflow-hidden shrink-0 p-0.5">
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
                        <p className="text-[10px] text-gray-500">
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
            </>
          ) : (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-800">No order found matching &ldquo;{searchedId}&rdquo;</p>
              <p className="text-xs text-gray-500">
                Please verify your order number (e.g. BZ-2026-89412) or the phone number used at checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
