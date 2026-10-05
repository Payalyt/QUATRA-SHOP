'use client';

import React, { useEffect } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import confetti from 'canvas-confetti';
import { CheckCircle2, PackageCheck, Truck, ArrowRight, ShoppingBag, Copy } from 'lucide-react';

export const OrderSuccessModal: React.FC<{ onOpenMyOrders: () => void }> = ({ onOpenMyOrders }) => {
  const {
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    lastPlacedOrder,
    formatPrice,
    showToast,
    t
  } = useMarketplace();

  useEffect(() => {
    if (isOrderSuccessOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [isOrderSuccessOpen]);

  if (!isOrderSuccessOpen || !lastPlacedOrder) return null;

  const order = lastPlacedOrder;

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    showToast('Order number copied to clipboard!', 'info');
  };

  const orderTime = new Date(order.createdAt).getTime();
  const deliveryEst = new Date(orderTime + 3 * 24 * 3600 * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-[500px] w-full p-6 text-center border border-gray-100 relative">
        {/* Animated Success Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-1">{t('orderConfirmed')}</h2>
        <p className="text-xs text-gray-500 mb-4">
          Thank you for shopping at QUATRO. We have sent an SMS confirmation to{' '}
          <strong>{order.customerPhone}</strong>.
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-left text-xs space-y-2 mb-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">Order Number:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-gray-900">
              <span>{order.orderNumber}</span>
              <button
                onClick={copyOrderNumber}
                className="text-gray-400 hover:text-[#0284c7] p-0.5"
                title="Copy"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Delivery:</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-sky-600" />
              {deliveryEst}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Address:</span>
            <span className="font-medium text-gray-800 text-right max-w-[220px] truncate">
              {order.shippingAddress.addressLine}, {order.shippingAddress.district}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Payment:</span>
            <span className="font-bold text-gray-800">
              {order.paymentMethod} ({order.paymentStatus})
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black">
            <span>Total Paid / Payable:</span>
            <span className="text-[#0284c7] tabular-nums">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={() => {
              setIsOrderSuccessOpen(false);
              onOpenMyOrders();
            }}
            className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs py-2.5 rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{t('viewMyOrders')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOrderSuccessOpen(false)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-md transition-colors"
          >
            {t('continueShopping')}
          </button>
        </div>
      </div>
    </div>
  );
};
