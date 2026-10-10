'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    voucherCode,
    appliedDiscount,
    applyVoucherCode,
    formatPrice,
    setIsCheckoutModalOpen,
    user,
    setIsAuthModalOpen,
    setAuthModalTab,
    showToast,
    language,
    t
  } = useMarketplace();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon) {
      applyVoucherCode(inputCoupon);
      setInputCoupon('');
    }
  };

  const handleProceed = () => {
    if (!user) {
      setIsCartOpen(false);
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn'
          ? 'চেকআউট করতে অনুগ্রহ করে প্রথমে অ্যাকাউন্টে লগইন বা সাইন-আপ করুন।'
          : 'Please log in or sign up to proceed with checkout.',
        'info'
      );
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in-50 duration-200">
      <div className="bg-white w-full max-w-[440px] h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0284c7]" />
            <h2 className="font-bold text-base text-gray-900">{t('shoppingCart')}</h2>
            <span className="text-xs bg-sky-100 text-[#0284c7] font-bold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-sky-50/70 p-3 border-b border-sky-100 text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-gray-700">
              Add <strong className="text-[#0284c7]">{formatPrice(remainingForFreeShipping)}</strong> more to get <strong>FREE Delivery</strong> across Bangladesh!
            </p>
          ) : (
            <p className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Congratulations! You unlocked FREE Nationwide Delivery.
            </p>
          )}
          <div className="w-full bg-sky-200 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#0284c7] h-full transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded bg-gray-50 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.media[0]?.url}
                    alt={item.product.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {item.product.title}
                  </h4>
                  {item.variantValue && (
                    <span className="text-[11px] text-gray-500 block">
                      {item.variantName}: {item.variantValue}
                    </span>
                  )}
                  <div className="text-xs font-bold text-[#0284c7] mt-1 tabular-nums">
                    {formatPrice(item.price)}
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-gray-500 flex flex-col items-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium">{t('cartEmpty')}</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-xs font-bold text-[#0284c7] hover:underline"
              >
                {t('continueShopping')}
              </button>
            </div>
          )}
        </div>

        {/* Voucher and Checkout Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            {/* Voucher input form */}
            <form onSubmit={handleApply} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Voucher code (DARAZBD10)"
                  className="w-full text-xs py-2 pl-3 pr-2 rounded border border-gray-300 outline-none focus:border-[#0284c7] uppercase"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-800 hover:bg-black text-white text-xs font-bold px-3 py-2 rounded transition-colors"
              >
                Apply
              </button>
            </form>

            {voucherCode && (
              <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                <span className="flex items-center gap-1 font-semibold">
                  <Tag className="w-3 h-3" /> {voucherCode} Applied
                </span>
                <span className="font-bold">-{formatPrice(appliedDiscount)}</span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-600 pt-1">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-gray-900 tabular-nums">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t('voucherDiscount')}</span>
                  <span>-{formatPrice(appliedDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>{t('totalAmount')}</span>
                <span className="text-[#0284c7] text-base tabular-nums">
                  {formatPrice(Math.max(0, cartSubtotal - appliedDiscount))}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceed}
              className="w-full bg-[#f85606] hover:bg-[#d94803] text-white font-extrabold text-sm py-3 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{t('proceedCheckout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
