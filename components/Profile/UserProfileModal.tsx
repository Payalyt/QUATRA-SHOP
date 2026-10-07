'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { BANGLADESH_DIVISIONS } from '@/lib/data/seed-products';
import {
  User as UserIcon,
  X,
  Mail,
  Phone,
  MapPin,
  Camera,
  Check,
  ShieldCheck,
  Package,
  Truck,
  Copy,
  Coins,
  ExternalLink
} from 'lucide-react';
import { generateCustomerQAId, generateSellerQAId, cleanQAId } from '@/lib/utils/id-generator';
import Link from 'next/link';

export const UserProfileModal: React.FC<{ onOpenMyOrders?: () => void }> = ({ onOpenMyOrders }) => {
  const {
    user,
    updateUserProfile,
    isProfileModalOpen,
    setIsProfileModalOpen,
    orders,
    setIsTrackOrderModalOpen,
    showToast,
    switchRole,
    upgradeCustomerToAffiliate,
    currentAffiliate
  } = useMarketplace();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  // Address
  const [division, setDivision] = useState(user?.address?.division || 'Dhaka');
  const [district, setDistrict] = useState(user?.address?.district || 'Dhaka City');
  const [thanaCity, setThanaCity] = useState(user?.address?.thanaCity || 'Dhanmondi');
  const [addressLine, setAddressLine] = useState(
    user?.address?.addressLine || 'House 42, Road 7/A, Dhanmondi R/A'
  );
  const [copiedId, setCopiedId] = useState(false);

  // Compute 8-Digit Numeric ID (No text prefix)
  const displayQAId = cleanQAId(user?.customerId || (user?.role === 'SELLER' ? generateSellerQAId() : generateCustomerQAId()));

  const handleCopyId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(displayQAId);
      setCopiedId(true);
      showToast(
        user?.role === 'SELLER'
          ? `Seller ID copied: ${displayQAId}`
          : `Customer ID copied: ${displayQAId}`,
        'success'
      );
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  if (!isProfileModalOpen || !user) return null;

  const currentDivisionObj =
    BANGLADESH_DIVISIONS.find((d) => d.name === division) || BANGLADESH_DIVISIONS[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar: avatar.trim(),
      address: {
        fullName: name.trim(),
        phone: phone.trim(),
        division,
        district,
        thanaCity,
        addressLine: addressLine.trim()
      }
    });
    showToast('Profile updated successfully!', 'success');
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-[560px] w-full max-h-[92vh] overflow-y-auto flex flex-col relative border border-gray-100 text-gray-900">
        
        {/* Simple & Clean Header */}
        <div className="relative bg-gradient-to-r from-[#0284c7] via-sky-600 to-[#0369a1] p-6 text-white rounded-t-2xl">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/15 hover:bg-black/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-white/20 shadow-md flex items-center justify-center text-white">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="font-black text-2xl uppercase">
                    {name ? name.charAt(0) : 'U'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarInput(!showAvatarInput)}
                className="absolute -bottom-1 -right-1 bg-white text-[#0284c7] p-1.5 rounded-full shadow-md hover:scale-105 transition-transform"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            {/* User Basic Info - Displaying Name prominently */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl text-white truncate drop-shadow-xs">{name || user.name}</h2>
                <span className="bg-emerald-500/25 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 border border-emerald-300/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          </div>

          {/* QA Customer / Seller ID Display Card */}
          <div className="mt-3.5 bg-black/20 backdrop-blur-md rounded-xl p-2.5 border border-white/20 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-400/30 border border-sky-300/50 flex items-center justify-center shrink-0 text-white font-mono font-black text-xs shadow-xs">
                QA
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-extrabold text-sky-200 tracking-wider">
                  {user.role === 'SELLER' ? 'QA Seller ID' : 'QA Customer ID'}
                </span>
                <span className="font-mono font-black text-base text-white tracking-widest truncate">
                  {displayQAId}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all border border-white/25 cursor-pointer shrink-0"
              title="Copy QA ID to Clipboard"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
            </button>
          </div>

          {/* Quick Avatar URL input toggle */}
          {showAvatarInput && (
            <div className="mt-4 pt-3 border-t border-white/20 flex gap-2 animate-in fade-in-50 duration-150">
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="flex-1 px-3 py-1.5 rounded-lg bg-white/95 text-gray-800 text-xs outline-none font-mono placeholder:text-gray-400"
              />
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar('')}
                  className="px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white text-[11px] font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Order Shortcuts & Seller Verification */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false);
                if (onOpenMyOrders) onOpenMyOrders();
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 hover:border-sky-300 hover:bg-sky-50/40 text-gray-800 font-bold text-xs transition-all shadow-2xs"
            >
              <Package className="w-4 h-4 text-[#0284c7]" />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false);
                setIsTrackOrderModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 hover:border-sky-300 hover:bg-sky-50/40 text-[#0284c7] font-bold text-xs transition-all shadow-2xs"
            >
              <Truck className="w-4 h-4 text-[#0284c7]" />
              <span>Track Order</span>
            </button>
          </div>

          {/* Seller Verification Link Card */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-extrabold text-amber-950 block">
                  {user.role === 'SELLER' ? '🪪 সেলার একাউন্ট ভেরিফিকেশন (NID Verification)' : '🏪 সেলার হিসেবে একাউন্ট ভেরিফাই করুন'}
                </span>
                <span className="text-[10px] text-amber-800 block">
                  এনআইডি/পাসপোর্ট দিয়ে একাউন্ট ভেরিফাই করে প্রোডাক্ট আপলোড শুরু করুন
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false);
                switchRole('SELLER');
                showToast('সেলার প্যানেলে নিয়ে যাওয়া হচ্ছে...', 'info');
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] rounded-lg cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            >
              ভেরিফাই করুন ➔
            </button>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 pl-9 rounded-lg border border-gray-200 focus:border-[#0284c7] outline-none font-medium text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2 pl-9 rounded-lg border border-gray-200 focus:border-[#0284c7] outline-none font-medium text-gray-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-gray-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 pl-9 rounded-lg border border-gray-200 focus:border-[#0284c7] outline-none font-medium text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Default Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Division</label>
                <select
                  value={division}
                  onChange={(e) => {
                    const newDiv = e.target.value;
                    setDivision(newDiv);
                    const divObj = BANGLADESH_DIVISIONS.find((d) => d.name === newDiv);
                    if (divObj && divObj.districts[0]) {
                      setDistrict(divObj.districts[0]);
                    }
                  }}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-[#0284c7] outline-none bg-white font-medium"
                >
                  {BANGLADESH_DIVISIONS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-[#0284c7] outline-none bg-white font-medium"
                >
                  {currentDivisionObj.districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Thana / Area</label>
                <input
                  type="text"
                  value={thanaCity}
                  onChange={(e) => setThanaCity(e.target.value)}
                  placeholder="e.g. Dhanmondi"
                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-[#0284c7] outline-none font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="font-semibold text-gray-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="House #, Road #, Area..."
                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-[#0284c7] outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Affiliate Partner Program Status & Upgrade */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f85606] text-white flex items-center justify-center font-bold shadow-2xs">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">
                    {user?.role === 'AFFILIATE' || currentAffiliate
                      ? `Active Affiliate Partner (${currentAffiliate?.code || 'AFF-ACTIVE'})`
                      : 'Earn 10% as an Affiliate Partner'}
                  </h4>
                  <p className="text-[11px] text-gray-600">
                    {user?.role === 'AFFILIATE' || currentAffiliate
                      ? `Payout configured via ${currentAffiliate?.payoutMethod || 'bKash'} (${currentAffiliate?.payoutAccount || user?.phone})`
                      : 'Share products with friends and earn 10% commission on every order.'}
                  </p>
                </div>
              </div>

              {user?.role === 'AFFILIATE' || currentAffiliate ? (
                <Link
                  href="/affiliate/dashboard"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="bg-[#f85606] hover:bg-orange-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg shadow-2xs transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    await upgradeCustomerToAffiliate('bKash', user.phone || '01712345678');
                    setIsProfileModalOpen(false);
                  }}
                  className="bg-[#f85606] hover:bg-orange-700 text-white font-black text-[11px] px-3.5 py-1.5 rounded-lg shadow-2xs transition-all shrink-0 cursor-pointer"
                >
                  Upgrade Account
                </button>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold px-5 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
