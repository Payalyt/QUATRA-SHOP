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
  Phone,
  Globe,
  Navigation
} from 'lucide-react';
import { ALL_COURIERS, getCourierByName, getCourierTrackingUrl } from '@/lib/couriers/courier-registry';

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
  const [selectedCourierId, setSelectedCourierId] = useState<string>('all');

  if (!isTrackOrderModalOpen) return null;

  const effectiveSearchId =
    searchedId.trim() ||
    trackOrderNumberQuery.trim() ||
    orders[0]?.orderNumber ||
    'BZ-2026-89412';

  // Find order by orderNumber, phone, order ID, Customer ID, or Tracking Number
  const matchedOrder = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === effectiveSearchId.toLowerCase() ||
      o.customerPhone.includes(effectiveSearchId) ||
      o.id === effectiveSearchId ||
      o.userId?.toLowerCase() === effectiveSearchId.toLowerCase() ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === effectiveSearchId.toLowerCase())
  );

  // Check if search query matches a direct courier consignment prefix or name
  const detectedCourier =
    (matchedOrder?.courierPartner ? getCourierByName(matchedOrder.courierPartner) : undefined) ||
    (selectedCourierId !== 'all' ? ALL_COURIERS.find((c) => c.id === selectedCourierId) : undefined) ||
    getCourierByName(effectiveSearchId) ||
    ALL_COURIERS.find((c) => effectiveSearchId.toUpperCase().startsWith(c.prefix));

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
  const currentStatus = matchedOrder ? matchedOrder.orderStatus : 'Shipped';
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-[700px] w-full max-h-[92vh] overflow-y-auto flex flex-col relative border border-gray-100">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shadow-xs">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-gray-900">
                Live Order &amp; Multi-Courier Delivery Tracking
              </h2>
              <p className="text-[11px] text-gray-500">
                Track across 25+ Domestic &amp; International Courier Networks in Bangladesh
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTrackOrderModalOpen(false)}
            className="w-7 h-7 rounded-full bg-white hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & Courier Selector */}
        <div className="p-4 bg-sky-50/50 border-b border-sky-100 space-y-2.5">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal !== '' ? inputVal : effectiveSearchId}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Order # (e.g. BZ-2026-89412), Tracking Code (e.g. STDF-8819204), Phone, or Customer ID"
                className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium shadow-2xs"
              />
            </div>

            <select
              value={selectedCourierId}
              onChange={(e) => setSelectedCourierId(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-gray-300 bg-white font-semibold text-gray-700 outline-none focus:border-[#0284c7] shadow-2xs shrink-0 cursor-pointer"
            >
              <option value="all">All Couriers (Auto Detect)</option>
              <optgroup label="🇧🇩 Bangladesh Domestic (19)">
                {ALL_COURIERS.filter((c) => c.category === 'domestic').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.prefix})
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌐 International (6)">
                {ALL_COURIERS.filter((c) => c.category === 'international').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.prefix})
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              type="submit"
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Track Now</span>
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600">
            <span className="font-bold text-gray-700">Quick Orders:</span>
            {orders.slice(0, 4).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setInputVal(o.orderNumber);
                  setSearchedId(o.orderNumber);
                }}
                className={`border px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs transition-colors cursor-pointer ${
                  matchedOrder?.id === o.id
                    ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-2xs'
                    : 'bg-white hover:bg-sky-50 border-sky-200 text-[#0284c7]'
                }`}
              >
                #{o.orderNumber} ({o.courierPartner || 'Steadfast'})
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6">
          {matchedOrder ? (
            <>
              {/* Order Overview Header - Clean, Spacious & Well-Organized */}
              <div className="bg-gradient-to-br from-gray-50 to-sky-50/40 rounded-2xl p-5 border border-sky-100 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Order Number:</span>
                    <span className="font-mono font-black text-base text-gray-900 bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-2xs">
                      #{matchedOrder.orderNumber}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(matchedOrder.orderNumber);
                        showToast('Order number copied!', 'info');
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-gray-500 hover:text-[#0284c7] cursor-pointer border border-gray-200 transition-colors"
                      title="Copy Order Number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span
                    className={`font-black px-3 py-1.5 rounded-xl text-xs uppercase border tracking-wider self-start sm:self-auto ${
                      matchedOrder.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : matchedOrder.orderStatus === 'Shipped'
                        ? 'bg-sky-100 text-blue-800 border-sky-300'
                        : matchedOrder.orderStatus === 'Returned'
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    ● {matchedOrder.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs space-y-1">
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Customer Details</p>
                    <p className="font-extrabold text-gray-900 text-sm">{matchedOrder.customerName}</p>
                    <p className="text-gray-600 font-medium flex items-center gap-1">
                      <span>📞</span>
                      <span>{matchedOrder.customerPhone}</span>
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs space-y-1">
                    <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Account &amp; Courier</p>
                    <p className="font-mono font-bold text-[#0284c7] text-xs">
                      ID: {matchedOrder.userId || 'usr-customer-1'}
                    </p>
                    <p className="text-gray-700 font-bold flex items-center gap-1.5 mt-1">
                      <Truck className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>{matchedOrder.courierPartner || 'Steadfast Courier Express'}</span>
                    </p>
                  </div>
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
              <div className="bg-[#fafafa] rounded-xl p-4 border border-gray-200 text-xs space-y-3">
                {/* Courier Partner & Consignment Details */}
                <div className="bg-gradient-to-r from-sky-50 to-emerald-50/60 p-3.5 rounded-xl border border-sky-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-gray-900">
                      <Truck className="w-4 h-4 text-[#0284c7]" />
                      <span>{matchedOrder.courierPartner || 'Steadfast Courier'}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                        Live API Linked
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 font-semibold">Consignment Code:</span>
                      <span className="font-mono font-black text-sky-900 text-xs bg-white px-2 py-0.5 rounded-lg border border-sky-200 shadow-2xs">
                        {matchedOrder.trackingNumber || 'STDF-8819204'}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(matchedOrder.trackingNumber || 'STDF-8819204');
                          showToast('Tracking code copied!', 'info');
                        }}
                        className="text-gray-400 hover:text-[#0284c7] cursor-pointer"
                        title="Copy tracking code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Direct Official Courier Website Live Tracking Link */}
                  {matchedOrder.trackingNumber && (
                    <a
                      href={getCourierTrackingUrl(matchedOrder.trackingNumber, matchedOrder.courierPartner)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <span>Track on {matchedOrder.courierPartner || 'Courier'} Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                    <MapPin className="w-4 h-4 text-[#0284c7]" />
                    <span>Destination: {matchedOrder.shippingAddress?.district || 'Dhaka'}, {matchedOrder.shippingAddress?.division || 'Dhaka Division'}</span>
                  </div>
                  <span className="font-mono text-gray-500 font-semibold">
                    AWB: {matchedOrder.trackingNumber || 'N/A'}
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
                            {log.timestamp} · {log.location || 'Dhaka Central Hub'}
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
                          Package is processed and dispatched via {matchedOrder.courierPartner || 'Steadfast Courier'}.
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
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs flex flex-wrap items-center justify-between gap-2">
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
                      className="bg-white hover:bg-sky-50 text-[#0284c7] border border-[#0284c7] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
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
                    <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 text-xs border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0 p-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 truncate">{item.title}</p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          Qty: {item.quantity} {item.variantValue ? `· ${item.variantValue}` : ''}
                        </p>
                      </div>
                      <span className="font-extrabold text-gray-900 tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : detectedCourier ? (
            /* DIRECT COURIER AWB TRACKING VIEW FOR ALL 25 COURIERS */
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-sky-50 to-blue-50/70 p-4 rounded-xl border border-sky-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-black shadow-xs">
                      {detectedCourier.category === 'international' ? <Globe className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-gray-900">{detectedCourier.name}</h4>
                        <span className="font-mono text-[10px] bg-white border border-sky-200 text-sky-800 font-extrabold px-2 py-0.5 rounded">
                          Prefix: {detectedCourier.prefix}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">{detectedCourier.bnName}</p>
                    </div>
                  </div>

                  <a
                    href={detectedCourier.trackingUrl(effectiveSearchId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Track on Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-3 bg-white rounded-lg border border-sky-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 font-semibold block text-[11px]">Consignment / Tracking Number:</span>
                    <span className="font-mono font-black text-sm text-gray-900">{effectiveSearchId}</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                    Live Transit
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 bg-white/70 p-2.5 rounded-lg border border-sky-100/60">
                  <span className="font-bold text-gray-700">কভারেজ নেটওয়ার্ক: </span>
                  <span>{detectedCourier.coverage}</span>
                </div>
              </div>

              {/* Simulated Live Hub Transit for direct courier AWB */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs space-y-3">
                <h5 className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                  {detectedCourier.name} Live Gateway Status
                </h5>
                <div className="space-y-3">
                  <div className="flex gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#0284c7] mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900">In Transit with Courier Hub</p>
                      <p className="text-[11px] text-gray-600">
                        Consignment #{effectiveSearchId} is active in {detectedCourier.name} central sorting gateway.
                      </p>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date().toLocaleString()} · Central Logistics Hub
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-800">No order or courier found matching &ldquo;{searchedId}&rdquo;</p>
              <p className="text-xs text-gray-500">
                Please verify your order number (e.g. BZ-2026-89412), customer phone number, or select a courier from the dropdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

