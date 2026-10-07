'use client';

import React, { useState } from 'react';
import { X, Truck, Printer, CheckCircle2, Loader2, Barcode, ExternalLink, Globe } from 'lucide-react';
import { Order } from '@/lib/types/ecommerce';
import { ALL_COURIERS, getCourierByName, getCourierTrackingUrl } from '@/lib/couriers/courier-registry';

interface CourierDispatchModalProps {
  order: Order;
  onDispatchSuccess: (trackingCode: string, partner: string) => void;
  onClose: () => void;
}

export const CourierDispatchModal: React.FC<CourierDispatchModalProps> = ({
  order,
  onDispatchSuccess,
  onClose
}) => {
  const [partner, setPartner] = useState<string>(order.courierPartner || 'Steadfast Courier');
  const [weightKg, setWeightKg] = useState('1');
  const [notes, setNotes] = useState('Handle with care (Fragile E-Commerce Package)');
  const [codAmount, setCodAmount] = useState(order.paymentMethod === 'COD' ? order.total.toString() : '0');
  const [loading, setLoading] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{
    trackingCode: string;
    courier: string;
    deliveryFee: number;
    trackingUrl: string;
  } | null>(null);

  const selectedCourier = getCourierByName(partner);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/courier/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_consignment',
          courierPartner: partner,
          orderId: order.orderNumber,
          recipientName: order.customerName,
          recipientPhone: order.customerPhone,
          recipientAddress: `${order.shippingAddress.addressLine}, ${order.shippingAddress.thanaCity}, ${order.shippingAddress.district}`,
          codAmount: parseFloat(codAmount) || 0,
          weightKg: parseFloat(weightKg) || 1,
          notes
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Courier dispatch failed');
      }

      const trackingUrl = data.trackingUrl || getCourierTrackingUrl(data.trackingCode, data.courier);

      setDispatchResult({
        trackingCode: data.trackingCode,
        courier: data.courier,
        deliveryFee: data.deliveryFee,
        trackingUrl
      });

      onDispatchSuccess(data.trackingCode, data.courier);
    } catch (err: any) {
      alert(err?.message || 'কুরিয়ার বুকিং করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintMemo = () => {
    window.print();
  };

  const domesticCouriers = ALL_COURIERS.filter((c) => c.category === 'domestic');
  const internationalCouriers = ALL_COURIERS.filter((c) => c.category === 'international');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-sky-100 flex flex-col relative max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0284c7] text-white flex items-center justify-center font-black">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Express Courier Consignment Dispatch</h3>
              <p className="text-[10px] text-slate-400">২৫টি দেশীয় ও আন্তর্জাতিক কুরিয়ারে সরাসরি বুকিং ও লাইভ ট্র্যাকিং</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {!dispatchResult ? (
            <form onSubmit={handleDispatch} className="space-y-4 text-xs">
              {/* Recipient Summary Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-800">অর্ডার নম্বর: {order.orderNumber}</span>
                  <span className="font-mono bg-white px-1.5 py-0.5 rounded border text-slate-600 font-bold">
                    পেমেন্ট: {order.paymentMethod}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">{order.customerName}</span> ({order.customerPhone})
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {order.shippingAddress.addressLine}, {order.shippingAddress.thanaCity}, {order.shippingAddress.district}
                </div>
              </div>

              {/* Partner Selection */}
              <div className="space-y-2">
                <label className="block font-extrabold text-slate-800">
                  Select Courier Partner (কুরিয়ার নির্বাচন করুন - মোট ২৫টি পার্টনার)
                </label>

                {/* Quick Select Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    'Steadfast Courier',
                    'Pathao Courier',
                    'Sundarban Courier Service',
                    'RedX',
                    'Paperfly',
                    'eCourier',
                    'DHL Express',
                    'FedEx'
                  ].map((pName) => {
                    const isSelected = partner === pName;
                    const cDef = getCourierByName(pName);
                    return (
                      <button
                        key={pName}
                        type="button"
                        onClick={() => setPartner(pName)}
                        className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'border-[#0284c7] bg-sky-50 text-[#0284c7] font-black ring-1 ring-[#0284c7]'
                            : 'border-slate-200 bg-white text-slate-700 font-bold hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[11px] truncate w-full">{cDef?.name.split(' ')[0] || pName}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{cDef?.prefix || 'EXP'}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Complete Dropdown of all 25 couriers */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    অথবা সম্পূর্ণ তালিকা থেকে বেছে নিন:
                  </label>
                  <select
                    value={partner}
                    onChange={(e) => setPartner(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-xs bg-white text-slate-900 focus:border-[#0284c7] outline-none"
                  >
                    <optgroup label="🇧🇩 বাংলাদেশ লোকাল কুরিয়ার (১৯টি)">
                      {domesticCouriers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} — {c.bnName} ({c.prefix})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🌍 আন্তর্জাতিক গ্লোবাল কুরিয়ার (৬টি)">
                      {internationalCouriers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} — {c.bnName} ({c.prefix})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Selected Courier Info Badge */}
                {selectedCourier && (
                  <div className="bg-sky-50 border border-sky-100 p-2 rounded-lg flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-sky-900">
                      {selectedCourier.category === 'international' ? (
                        <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      ) : (
                        <Truck className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                      )}
                      <span className="font-bold">{selectedCourier.coverage}</span>
                    </div>
                    <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded font-black text-sky-800 border border-sky-200">
                      Prefix: {selectedCourier.prefix}-XXXX
                    </span>
                  </div>
                )}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Package Weight (KG)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#0284c7] outline-none font-bold text-slate-900 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Collect COD Amount (৳ ক্যাশ অন ডেলিভারি)
                  </label>
                  <input
                    type="number"
                    value={codAmount}
                    onChange={(e) => setCodAmount(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#0284c7] outline-none font-bold text-slate-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Handling Instructions / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Fragile glass item, handle with care"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#0284c7] outline-none text-slate-900 bg-white"
                />
              </div>

              {/* Dispatch Action Button */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#0284c7] hover:bg-sky-700 active:scale-97 text-white font-extrabold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Book Consignment & Send SMS</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success & Printable Waybill Memo */
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-black text-slate-900 text-sm">Consignment Booked Successfully!</h4>
                <p className="text-xs text-emerald-800 font-bold">
                  কুরিয়ার: <span className="font-extrabold">{dispatchResult.courier}</span>
                </p>
                <p className="text-xs text-emerald-800 font-bold">
                  ট্র্যাকিং কোড: <span className="font-mono text-sm font-black select-all bg-white px-2 py-0.5 rounded border border-emerald-300">{dispatchResult.trackingCode}</span>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  কাস্টমারের ফোনে ({order.customerPhone}) সরাসরি ট্র্যাকিং লিঙ্কসহ SMS পাঠানো হয়েছে।
                </p>
              </div>

              {/* Printable Memo Ticket View */}
              <div className="p-4 bg-white rounded-xl border-2 border-dashed border-slate-300 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-black text-sm text-slate-900 block">QUATRO LOGISTICS MEMO</span>
                    <span className="text-[10px] text-slate-500">{dispatchResult.courier} Dispatch Ticket</span>
                  </div>
                  <Barcode className="w-12 h-8 text-slate-800" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Recipient:</span>
                    <span className="font-bold text-slate-900">{order.customerName}</span>
                    <span className="block text-slate-600">{order.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Tracking ID:</span>
                    <span className="font-bold text-sky-800">{dispatchResult.trackingCode}</span>
                    <span className="block text-slate-600">COD: ৳{codAmount}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-600 pt-1 border-t border-slate-100">
                  <span className="font-bold block">Delivery Address:</span>
                  <span>{order.shippingAddress.addressLine}, {order.shippingAddress.thanaCity}, {order.shippingAddress.district}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {dispatchResult.trackingUrl && (
                  <a
                    href={dispatchResult.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284c7] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-sky-200"
                  >
                    <span>কুরিয়ারের অফিশিয়াল পোর্টালে লাইভ ট্র্যাক করুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrintMemo}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Waybill Memo (ইনভয়েস প্রিন্ট)</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-extrabold text-xs cursor-pointer hover:bg-slate-50"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
