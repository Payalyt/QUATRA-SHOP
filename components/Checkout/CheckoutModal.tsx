'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { BANGLADESH_DIVISIONS } from '@/lib/data/seed-products';
import { PaymentMethod, ShippingAddress, PaymentGatewayConfig } from '@/lib/types/ecommerce';
import {
  X,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Phone,
  User,
  Home,
  Copy,
  Info,
  Gift,
  Zap
} from 'lucide-react';
import { BkashDirectModal } from './BkashDirectModal';
import { NagadDirectModal } from './NagadDirectModal';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotal,
    appliedDiscount,
    placeOrder,
    formatPrice,
    gateways,
    user,
    showToast,
    settings,
    t,
    language,
    setIsAuthModalOpen,
    setAuthModalTab,
    applyVoucherCode,
    voucherCode,
    collectedVouchers,
    coupons
  } = useMarketplace();

  // Address state - Clean empty initialization unless logged-in user profile exists
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [division, setDivision] = useState(user?.address ? 'Dhaka' : 'Dhaka');
  const [district, setDistrict] = useState('Dhaka City');
  const [thanaCity, setThanaCity] = useState('');
  const [addressLine, setAddressLine] = useState('');

  // Delivery & Payment
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<string>(() => {
    if (settings.isCodEnabled !== false) return 'COD';
    const activeGateway = gateways.find(g => g.isActive);
    return activeGateway ? activeGateway.id : '';
  });
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [couponInput, setCouponInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    phone?: string;
    thanaCity?: string;
    addressLine?: string;
    senderNumber?: string;
    transactionId?: string;
    general?: string;
  }>({});
  const [showBkashModal, setShowBkashModal] = useState(false);
  const [showNagadModal, setShowNagadModal] = useState(false);

  if (!isCheckoutModalOpen) return null;

  // Calculate dynamic shipping fee (Inside Dhaka: 60 standard / 150 express, Outside: 150 standard / 200 express)
  const baseShippingFee = division === 'Dhaka' ? 60 : 150;
  const shippingFee = deliveryType === 'express'
    ? (division === 'Dhaka' ? 150 : 200)
    : baseShippingFee;
  const totalAmount = Math.max(0, cartSubtotal + shippingFee - appliedDiscount);

  // Current division districts
  const currentDivData = BANGLADESH_DIVISIONS.find((d) => d.name === division);
  const districts = currentDivData ? currentDivData.districts : ['Dhaka City'];

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const divObj = BANGLADESH_DIVISIONS.find((d) => d.name === newDiv);
    if (divObj && divObj.districts.length > 0) {
      setDistrict(divObj.districts[0]);
    }
  };

  // Generate Payment Options List dynamic from Gateways state
  const paymentOptions = [
    ...(settings.isCodEnabled !== false ? [{
      id: 'COD',
      name: 'Cash on Delivery (COD)',
      logo: '',
      type: 'COD',
      number: '',
      instructions: settings.codInstructions || 'Cash on Delivery standard & 24h shipping. Pay remaining balance when package arrives.'
    }] : []),
    ...(settings.isOnlinePaymentEnabled !== false
      ? gateways.filter(g => g.isActive).map(gw => ({
          id: gw.id,
          name: gw.name,
          logo: gw.logoUrl || '',
          type: gw.type,
          number: gw.accountNumber,
          instructions: gw.instructions || `Please Send Money to the official ${gw.name} number.`
        }))
      : [])
  ];

  const selectedOption = paymentOptions.find(o => o.id === paymentMethod);

  const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;

  const validateAddressBeforePayment = (): boolean => {
    const errs: typeof fieldErrors = {};

    if (!cart || cart.length === 0) {
      showToast('আপনার কার্ট খালি! অনুগ্রহ করে কোনো পণ্য কার্টে যোগ করুন।', 'error');
      return false;
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'আপনার পূর্ণ নাম লেখা আবশ্যক (Full Name is required)';
    }

    const cleanPhone = phone.trim().replace(/[-+\s]/g, '');
    if (!cleanPhone || !bdPhoneRegex.test(cleanPhone)) {
      errs.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (e.g. 01712345678)';
    }

    if (!thanaCity.trim() || thanaCity.trim().length < 2) {
      errs.thanaCity = 'থানা বা উপজেলা লেখা আবশ্যক (Thana is required)';
    }

    if (!addressLine.trim() || addressLine.trim().length < 4) {
      errs.addressLine = 'বিস্তারিত ডেলিভারি ঠিকানা দিন (Address is required)';
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('অনুগ্রহ করে প্রয়োজনীয় লাল চিহ্নিত তথ্যগুলো সঠিকভাবে পূরণ করুন', 'error');
      return false;
    }
    return true;
  };

  const validateAndProceed = async () => {
    if (!user) {
      setIsCheckoutModalOpen(false);
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn'
          ? 'অর্ডার সম্পন্ন করতে অনুগ্রহ করে প্রথমে অ্যাকাউন্টে লগইন বা সাইন-আপ করুন।'
          : 'Please log in or sign up to complete your order.',
        'info'
      );
      return;
    }

    if (!validateAddressBeforePayment()) {
      return;
    }

    const errs: typeof fieldErrors = {};

    if (!paymentMethod) {
      errs.general = 'অনুগ্রহ করে একটি পেমেন্ট পদ্ধতি নির্বাচন করুন।';
      setFieldErrors(errs);
      showToast('অনুগ্রহ করে একটি পেমেন্ট পদ্ধতি নির্বাচন করুন।', 'error');
      return;
    }

    // Strict validation for non-COD payment options (bKash / Nagad / Rocket / Bank)
    if (paymentMethod !== 'COD') {
      const cleanSender = senderNumber.trim().replace(/[-+\s]/g, '');
      if (!cleanSender || !bdPhoneRegex.test(cleanSender)) {
        errs.senderNumber = 'সঠিক ১১ ডিজিটের সেন্ডার বিকাশ/নগদ নম্বর দিন';
      }

      if (!transactionId.trim() || transactionId.trim().length < 6) {
        errs.transactionId = 'সঠিক ট্রানজেকশন আইডি (TrxID) লিখুন (কমপক্ষে ৬ সংখ্যার)';
      }

      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        showToast('পেমেন্টের সেন্ডার নম্বর ও ট্রানজেকশন আইডি (TrxID) দিন', 'error');
        return;
      }
    }

    setFieldErrors({});

    const address: ShippingAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      division,
      district,
      thanaCity: thanaCity.trim(),
      addressLine: addressLine.trim()
    };

    // Direct checkout with conditional live API Verification for bKash / Nagad
    setIsSubmitting(true);
    try {
      if (paymentMethod !== 'COD' && settings.isMerchantVerifyEnabled === true) {
        // Call Payment API to verify the TrxID with bKash Merchant API
        const verifyRes = await fetch('/api/payment/gateway', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'verify_trx',
            provider: paymentMethod,
            trxID: transactionId.trim().toUpperCase(),
            senderNumber: senderNumber.trim(),
            amount: totalAmount
          })
        });

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || verifyData.statusCode !== '0000') {
          setFieldErrors({ transactionId: verifyData.statusMessage || 'বিকাশ এপিআই থেকে ট্রানজেকশন যাচাই ব্যর্থ হয়েছে। সঠিক TrxID দিন।' });
          showToast(verifyData.statusMessage || 'বিকাশ এপিআই থেকে ট্রানজেকশন যাচাই ব্যর্থ হয়েছে।', 'error');
          setIsSubmitting(false);
          return;
        }

        showToast(verifyData.statusMessage || 'বিকাশ এপিআই থেকে পেমেন্ট সফলভাবে ভেরিফাইড হয়েছে!', 'success');
      }

      await placeOrder(
        address,
        paymentMethod,
        shippingFee,
        paymentMethod === 'COD' ? 'COD-DELIVERY' : transactionId.trim().toUpperCase(),
        paymentMethod === 'COD' ? phone.trim() : senderNumber.trim()
      );
    } catch (err: any) {
      showToast(err?.message || 'অর্ডার প্রসেস করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in-50 duration-200">
        <div className="bg-white rounded-xl shadow-2xl max-w-[900px] w-full max-h-[92vh] overflow-y-auto flex flex-col relative border border-gray-100">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2 flex-wrap">
              <Lock className="w-4 h-4 text-[#0284c7]" />
              <h2 className="font-extrabold text-base text-gray-900">{t('checkout')}</h2>
              {user?.customerId && (
                <span className="bg-sky-50 text-[#0284c7] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-sky-200">
                  ID: {user.customerId}
                </span>
              )}
              <span className="text-xs text-gray-400">· 256-bit Secure Order</span>
            </div>
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 sm:p-5 overflow-y-auto">
            {/* Left 7 cols: Billing & Shipping Address / Payment Methods */}
            <div className="md:col-span-7 space-y-5">
              {/* 1. Shipping Address */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <MapPin className="w-4 h-4 text-[#0284c7]" />
                  <span>1. {t('shippingAddress')} (Bangladesh)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1.5">
                      {language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Full Name'} *
                    </label>
                    <div className="relative">
                      <User className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${fieldErrors.fullName ? 'text-red-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                        }}
                        placeholder={language === 'bn' ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your full name'}
                        className={`w-full h-11 pl-9 pr-3 rounded-xl border outline-none font-bold text-gray-800 text-xs sm:text-sm transition-all ${
                          fieldErrors.fullName ? 'border-red-500 bg-red-50/20 focus:border-red-600 ring-2 ring-red-200' : 'border-gray-300 focus:border-[#0284c7] focus:ring-2 focus:ring-sky-100'
                        }`}
                        required
                      />
                    </div>
                    {fieldErrors.fullName && (
                      <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                        <span>*</span> {fieldErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1.5">
                      {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'} *
                    </label>
                    <div className="relative">
                      <Phone className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${fieldErrors.phone ? 'text-red-500' : 'text-gray-400'}`} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                        }}
                        placeholder="017XXXXXXXX"
                        className={`w-full h-11 pl-9 pr-3 rounded-xl border outline-none font-bold text-gray-800 text-xs sm:text-sm transition-all ${
                          fieldErrors.phone ? 'border-red-500 bg-red-50/20 focus:border-red-600 ring-2 ring-red-200' : 'border-gray-300 focus:border-[#0284c7] focus:ring-2 focus:ring-sky-100'
                        }`}
                        required
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                        <span>*</span> {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1.5">{language === 'bn' ? 'বিভাগ' : 'Division'} *</label>
                    <select
                      value={division}
                      onChange={(e) => handleDivisionChange(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-300 focus:border-[#0284c7] focus:ring-2 focus:ring-sky-100 outline-none bg-white font-bold text-gray-800 text-xs sm:text-sm"
                    >
                      {BANGLADESH_DIVISIONS.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1.5">{language === 'bn' ? 'জেলা / শহর' : 'District / City'} *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-300 focus:border-[#0284c7] focus:ring-2 focus:ring-sky-100 outline-none bg-white font-bold text-gray-800 text-xs sm:text-sm"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1.5">{language === 'bn' ? 'থানা / উপজেলা' : 'Thana / Upazila'} *</label>
                    <input
                      type="text"
                      value={thanaCity}
                      onChange={(e) => {
                        setThanaCity(e.target.value);
                        if (fieldErrors.thanaCity) setFieldErrors((prev) => ({ ...prev, thanaCity: undefined }));
                      }}
                      placeholder={language === 'bn' ? 'থানা / উপজেলা লিখুন' : 'Enter Thana / Upazila'}
                      className={`w-full h-11 px-3 rounded-xl border outline-none font-bold text-gray-800 text-xs sm:text-sm transition-all ${
                        fieldErrors.thanaCity ? 'border-red-500 bg-red-50/20 focus:border-red-600 ring-2 ring-red-200' : 'border-gray-300 focus:border-[#0284c7] focus:ring-2 focus:ring-sky-100'
                      }`}
                      required
                    />
                    {fieldErrors.thanaCity && (
                      <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                        <span>*</span> {fieldErrors.thanaCity}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1.5">{language === 'bn' ? 'বিস্তারিত ডেলিভারি ঠিকানা' : 'Detailed Street Address'} *</label>
                    <div className="relative">
                      <Home className={`w-4 h-4 absolute left-3 top-3.5 ${fieldErrors.addressLine ? 'text-red-500' : 'text-gray-400'}`} />
                      <textarea
                        rows={2}
                        value={addressLine}
                        onChange={(e) => {
                          setAddressLine(e.target.value);
                          if (fieldErrors.addressLine) setFieldErrors((prev) => ({ ...prev, addressLine: undefined }));
                        }}
                        placeholder={language === 'bn' ? 'বাসা নং, রোড নং, এলাকা / গ্রাম ইত্যাদি' : 'House no, Road no, Area / Village details'}
                        className={`w-full py-2.5 pl-9 pr-3 rounded-xl border outline-none resize-none font-bold text-gray-800 text-xs sm:text-sm transition-all ${
                          fieldErrors.addressLine ? 'border-red-500 bg-red-50/20 focus:border-red-600 ring-2 ring-red-200' : 'border-gray-300 focus:border-[#0284c7] focus:ring-2 focus:ring-sky-100'
                        }`}
                        required
                      />
                    </div>
                    {fieldErrors.addressLine && (
                      <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                        <span>*</span> {fieldErrors.addressLine}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Delivery Speed & Charge */}
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                  <Truck className="w-4 h-4 text-[#0284c7]" />
                  <span>2. Delivery Speed &amp; Charge</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      deliveryType === 'standard'
                        ? 'border-[#0284c7] bg-sky-50/20 ring-1 ring-[#0284c7] shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryType === 'standard'}
                        onChange={() => setDeliveryType('standard')}
                        className="accent-[#0284c7] mt-0.5 cursor-pointer"
                      />
                      <div>
                        <p className="font-extrabold text-gray-800">Standard Delivery</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">2-4 Business Days</p>
                      </div>
                    </div>
                    <span className="font-black text-sm text-[#0284c7]">
                      {formatPrice(baseShippingFee)}
                    </span>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      deliveryType === 'express'
                        ? 'border-[#0284c7] bg-sky-50/20 ring-1 ring-[#0284c7] shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryType === 'express'}
                        onChange={() => setDeliveryType('express')}
                        className="accent-[#0284c7] mt-0.5 cursor-pointer"
                      />
                      <div>
                        <p className="font-extrabold text-gray-800">Express 24h Delivery</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">Next-Day Hub Dispatch</p>
                      </div>
                    </div>
                    <span className="font-black text-sm text-[#0284c7]">
                      {formatPrice(division === 'Dhaka' ? 150 : 200)}
                    </span>
                  </label>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <CreditCard className="w-4 h-4 text-[#0284c7]" />
                    <span>3. {t('paymentMethod')}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold bg-gray-50 px-2 py-0.5 border border-gray-150 rounded">Secure Checkout</span>
                </div>

                {/* Responsive Payment Gateway Grid: 2 columns on mobile, 4 columns on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-2 mb-3.5">
                  {paymentOptions.map((opt) => {
                    const isSelected = paymentMethod === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(opt.id);
                          setFieldErrors((prev) => ({ ...prev, general: undefined }));
                        }}
                        className={`p-2.5 sm:p-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[60px] active:scale-97 ${
                          isSelected
                            ? 'border-[#0284c7] bg-sky-50/30 ring-2 ring-[#0284c7]/80 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {opt.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={opt.logo}
                            alt={opt.name}
                            className="h-7 object-contain rounded"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className={`flex items-center justify-center w-full h-7 rounded-lg shadow-2xs gap-1 px-1.5 transition-all ${
                            isSelected
                              ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                              : 'bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/80'
                          }`}>
                            <Truck className={`w-3.5 h-3.5 stroke-[2.5] ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                            <span className="font-black text-[10px] uppercase tracking-wider">
                              COD
                            </span>
                          </div>
                        )}
                        <span className={`text-[10px] sm:text-[9.5px] font-bold tracking-tight leading-tight text-center px-1 truncate w-full ${
                          isSelected ? 'text-[#0284c7]' : 'text-gray-700'
                        }`}>
                          {opt.id === 'COD' ? (language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery') : opt.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Payment Method Detail Box */}
                {selectedOption && (
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-200 space-y-4 animate-in fade-in-50 duration-150">
                    {selectedOption.id === 'COD' ? (
                      /* COD Clean Details Display - Basi gicimici / messy boxes text removed as requested */
                      <div className="space-y-3">
                        <div className="p-3.5 bg-sky-50/50 rounded-xl border border-sky-200 text-xs text-gray-800 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-black text-[#0284c7] text-xs">
                            <Truck className="w-4 h-4 shrink-0" />
                            <span>Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                          </div>
                          <p className="leading-relaxed font-bold text-gray-700">
                            {settings.codInstructions || 'পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করুন।'}
                          </p>
                          <div className="mt-2.5 pt-2 border-t border-sky-100 text-[11px] text-gray-600 space-y-1">
                            <p>• <strong>Standard Shipping:</strong> 2-4 Business Days (৳{division === 'Dhaka' ? '60' : '150'} Delivery Charge)</p>
                            <p>• <strong>24 Hour Shipping:</strong> Next-Day Courier Delivery (৳{division === 'Dhaka' ? '150' : '200'} Delivery Charge)</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Standard Gateway Send Money process block */
                      <div className="space-y-3.5">
                        {/* Instant Online Direct Gateway Trigger */}
                        {settings.isAutoPaymentEnabled !== false && (selectedOption.id.toLowerCase().includes('bkash') || selectedOption.id.toLowerCase().includes('nagad')) && (
                          <div className="p-3.5 bg-linear-to-r from-sky-500/10 via-indigo-500/10 to-pink-500/10 rounded-xl border border-sky-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span>Instant Direct Gateway Payment (ইনস্ট্যান্ট অটো পেমেন্ট)</span>
                              </div>
                              <span className="text-[10px] font-extrabold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                                Auto Verified
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium">
                              বিকাশ / নগদ পপআপ গেটওয়ের মাধ্যমে এক ক্লিকে পিন ডায়াল করে অটোমেটিক পেমেন্ট সম্পন্ন করুন।
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                if (!validateAddressBeforePayment()) {
                                  return;
                                }
                                setFieldErrors({});
                                if (selectedOption.id.toLowerCase().includes('bkash')) {
                                  setShowBkashModal(true);
                                } else {
                                  setShowNagadModal(true);
                                }
                              }}
                              className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
                                selectedOption.id.toLowerCase().includes('bkash')
                                  ? 'bg-[#e2136e] hover:bg-[#c20f5e]'
                                  : 'bg-orange-600 hover:bg-orange-700'
                              }`}
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>
                                Launch {selectedOption.name} Direct Gateway Popup
                              </span>
                            </button>
                          </div>
                        )}

                        <div className="p-3.5 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <p className="text-gray-500 font-bold">Or Send Money to official number:</p>
                            <p className="text-lg font-black font-mono text-[#0284c7]">{selectedOption.number}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedOption.number);
                              showToast(`Copied ${selectedOption.name} wallet number: ${selectedOption.number}`, 'info');
                            }}
                            className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-extrabold transition-all flex items-center justify-center gap-1.5 text-[11px] active:scale-95 shrink-0"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Number</span>
                          </button>
                        </div>

                        <div className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-xs text-gray-700">
                          <p className="leading-relaxed font-semibold">{selectedOption.instructions}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="font-extrabold text-gray-700 block mb-1">
                              Your {selectedOption.id} Number (Sender) *
                            </label>
                            <input
                              type="text"
                              value={senderNumber}
                              onChange={(e) => {
                                setSenderNumber(e.target.value);
                                if (fieldErrors.senderNumber) setFieldErrors((prev) => ({ ...prev, senderNumber: undefined }));
                              }}
                              placeholder="017XXXXXXXX"
                              className={`w-full p-2.5 rounded-lg border bg-white outline-none font-bold text-gray-900 transition-colors ${
                                fieldErrors.senderNumber ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' : 'border-gray-300 focus:border-[#0284c7]'
                              }`}
                            />
                            {fieldErrors.senderNumber && (
                              <p className="text-[10px] text-red-600 font-bold mt-1">
                                * {fieldErrors.senderNumber}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="font-extrabold text-gray-700 block mb-1">
                              Transaction ID (TrxID) *
                            </label>
                            <input
                              type="text"
                              value={transactionId}
                              onChange={(e) => {
                                setTransactionId(e.target.value);
                                if (fieldErrors.transactionId) setFieldErrors((prev) => ({ ...prev, transactionId: undefined }));
                              }}
                              placeholder="e.g. 9J4K82LA"
                              className={`w-full p-2.5 rounded-lg border bg-white outline-none font-mono uppercase font-bold tracking-wider text-gray-900 transition-colors ${
                                fieldErrors.transactionId ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' : 'border-gray-300 focus:border-[#0284c7]'
                              }`}
                            />
                            {fieldErrors.transactionId && (
                              <p className="text-[10px] text-red-600 font-bold mt-1">
                                * {fieldErrors.transactionId}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 cols: Order Summary */}
            <div className="md:col-span-5 bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Order Summary ({cart.length} items)
                </h3>

                {/* Items preview list */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto divide-y divide-gray-100 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-2 text-xs">
                      <div className="w-10 h-10 rounded bg-white border border-gray-200 shrink-0 overflow-hidden p-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.media[0]?.url}
                          alt={item.product.title}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{item.product.title}</p>
                        <p className="text-[10px] text-gray-500">
                          Qty: {item.quantity} {item.variantValue ? `(${item.variantValue})` : ''}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900 tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Coupon Voucher Box (User Request 6: "copne code dela kaj korba") */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 mt-4 space-y-2">
                  <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Apply Store Coupon Voucher (কুপন কোড ব্যবহার করুন)</span>
                  </span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. EID2026"
                      className="flex-1 p-2 rounded-lg border border-gray-300 font-mono text-xs uppercase font-extrabold focus:border-[#0284c7] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!couponInput.trim()) {
                          showToast('Please enter a coupon code', 'error');
                          return;
                        }
                        const ok = applyVoucherCode(couponInput);
                        if (ok) setCouponInput('');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {voucherCode && (
                    <div className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 p-1.5 rounded-lg flex items-center justify-between">
                      <span>✓ Applied Coupon: &quot;{voucherCode}&quot;</span>
                    </div>
                  )}

                  {/* 1-Tap Collected Vouchers Quick Apply */}
                  {collectedVouchers && collectedVouchers.length > 0 && !voucherCode && (
                    <div className="pt-1">
                      <span className="text-[10px] text-gray-500 font-bold block mb-1">
                        {language === 'bn' ? 'আপনার সংরক্ষিত ভাউচার (ক্লিক করে ব্যবহার করুন):' : 'Your Collected Vouchers:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {collectedVouchers.map((vCode) => (
                          <button
                            key={vCode}
                            type="button"
                            onClick={() => applyVoucherCode(vCode)}
                            className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                          >
                            <span>🎟️ {vCode}</span>
                            <span className="text-[9px] bg-amber-500 text-white px-1 rounded">Apply</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Calculations */}
                <div className="mt-4 pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>{t('subtotal')}</span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>{t('shippingFee')}</span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {formatPrice(shippingFee)}
                    </span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>{t('voucherDiscount')}</span>
                      <span>-{formatPrice(appliedDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                    <span>{t('totalAmount')}</span>
                    <span className="text-[#0284c7] tabular-nums">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Return Policy Notice */}
                <div className="mt-4 bg-white p-2.5 rounded border border-gray-200 text-[11px] text-gray-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7]" />
                    <span>Daraz-Style Buyer Protection</span>
                  </div>
                  <p>7 Days Easy Return window begins after your package is delivered.</p>
                </div>
              </div>

              {/* Confirm & Place Order CTA - Mobile optimized & prominent */}
              <button
                onClick={validateAndProceed}
                disabled={isSubmitting || cart.length === 0}
                className="w-full mt-5 min-h-[50px] bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Order...'}</span>
                  </span>
                ) : (
                  <>
                    <span>{language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm & Place Order'}</span>
                    <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-xs font-black tabular-nums">
                      {formatPrice(totalAmount)}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Payment Gateway Modals */}
      {showBkashModal && (
        <BkashDirectModal
          amount={totalAmount}
          invoiceRef={`INV-${Date.now()}`}
          onClose={() => setShowBkashModal(false)}
          onSuccess={async (trxId, accNum) => {
            setShowBkashModal(false);
            setSenderNumber(accNum);
            setTransactionId(trxId);
            setIsSubmitting(true);
            try {
              const address: ShippingAddress = {
                fullName,
                phone,
                division,
                district,
                thanaCity,
                addressLine
              };
              await placeOrder(address, 'bKash', shippingFee, trxId, accNum);
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      )}

      {showNagadModal && (
        <NagadDirectModal
          amount={totalAmount}
          invoiceRef={`INV-${Date.now()}`}
          onClose={() => setShowNagadModal(false)}
          onSuccess={async (trxId, accNum) => {
            setShowNagadModal(false);
            setSenderNumber(accNum);
            setTransactionId(trxId);
            setIsSubmitting(true);
            try {
              const address: ShippingAddress = {
                fullName,
                phone,
                division,
                district,
                thanaCity,
                addressLine
              };
              await placeOrder(address, 'Nagad', shippingFee, trxId, accNum);
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      )}
    </>
  );
};
