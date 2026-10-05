'use client';

import React, { useState } from 'react';
import { X, Truck, Printer, CheckCircle2, ShieldCheck, Loader2, Barcode, MapPin, Package, Phone, User } from 'lucide-react';
import { Order } from '@/lib/types/ecommerce';

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
  const [partner, setPartner] = useState<'Steadfast Express' | 'Pathao Express' | 'RedX' | 'Paperfly'>('Steadfast Express');
  const [weightKg, setWeightKg] = useState('1');
  const [notes, setNotes] = useState('Handle with care (Fragile E-Commerce Package)');
  const [codAmount, setCodAmount] = useState(order.paymentMethod === 'COD' ? order.total.toString() : '0');
  const [loading, setLoading] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{
    trackingCode: string;
    courier: string;
    deliveryFee: number;
  } | null>(null);

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
          weightKg: parseFloat(weightKg) || 1
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Courier dispatch failed');
      }

      setDispatchResult({
        trackingCode: data.trackingCode,
        courier: data.courier,
        deliveryFee: data.deliveryFee
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
              <p className="text-[10px] text-slate-400">Steadfast / Pathao Live Booking Gateway</p>
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
              <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200 space-y-1.5 text-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sky-900 text-xs">Order #{order.orderNumber}</span>
                  <span className="font-mono text-[10px] bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded font-bold">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid Order'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-bold pt-0.5">
                  <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{order.customerName}</span>
                  <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0 ml-2" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 text-[11px] pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    {order.shippingAddress.addressLine}, {order.shippingAddress.thanaCity}, {order.shippingAddress.district}
                  </span>
                </div>
              </div>

              {/* Partner Selection */}
              <div className="space-y-1.5">
                <label className="block font-extrabold text-slate-800">
                  Select Courier Partner (কুরিয়ার পার্টনার নির্বাচন করুন)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Steadfast Express', badge: 'Fastest 24h' },
                    { id: 'Pathao Express', badge: 'Nationwide' },
                    { id: 'RedX', badge: 'Standard' },
                    { id: 'Paperfly', badge: 'Bulk Logistics' }
                  ].map((p) => {
                    const isSelected = partner === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPartner(p.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'border-[#0284c7] bg-sky-50 text-[#0284c7] font-extrabold ring-1 ring-[#0284c7]'
                            : 'border-slate-200 bg-white text-slate-700 font-bold hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs">{p.id}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {p.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
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
                    COD Amount Collection (৳)
                  </label>
                  <input
                    type="number"
                    value={codAmount}
                    onChange={(e) => setCodAmount(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#0284c7] outline-none font-black text-slate-900 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Special Delivery Instruction</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Handle with care"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-[#0284c7] outline-none font-medium text-slate-800 bg-white"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-extrabold hover:bg-slate-50 cursor-pointer"
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
                      <span>Book Consignment Now</span>
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
                  Track Code: <span className="font-mono text-sm font-black select-all">{dispatchResult.trackingCode}</span>
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

              <div className="flex gap-2 pt-2">
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
          )}
        </div>
      </div>
    </div>
  );
};
