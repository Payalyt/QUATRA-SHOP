'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { useRouter } from 'next/navigation';
import { Store, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { SellerRegisterModal } from '@/components/Seller/SellerRegisterModal';

export default function SellerLoginPage() {
  const { sellerLogin, showToast } = useMarketplace();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await sellerLogin(email, password);
      router.push('/seller');
    } catch (err: any) {
      setError(err.message || 'Failed to login to seller account');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-gray-200">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0284c7] text-white flex items-center justify-center mx-auto shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-gray-900">QUATRO Seller Center</h1>
          <p className="text-xs text-gray-500">Sign in to manage your shop, orders &amp; payouts</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Seller Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@apexbd.com"
                className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-gray-300 focus:border-[#0284c7] outline-none font-bold text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-2.5 pl-9 pr-3 rounded-xl border border-gray-300 focus:border-[#0284c7] outline-none font-bold text-gray-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-xs"
          >
            <span>Sign In to Seller Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center text-xs">
          <span className="text-gray-500">Don&apos;t have a seller account? </span>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="text-[#0284c7] font-extrabold hover:underline cursor-pointer"
          >
            Register New Shop →
          </button>
        </div>
      </div>

      <SellerRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => router.push('/seller')}
      />
    </div>
  );
}
