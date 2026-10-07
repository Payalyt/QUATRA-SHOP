'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, Home, PhoneCall } from 'lucide-react';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error safely to console for debugging
    console.error('Captured Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-6">
        {/* Animated Warning Icon */}
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100 shadow-sm animate-bounce">
          <ShieldAlert className="w-9 h-9" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
            দুঃখিত! কোথাও একটি সমস্যা হয়েছে
          </h2>
          <h3 className="text-sm font-bold text-gray-500">
            Oops! Something went wrong on this page.
          </h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed pt-1">
            ভবিষ্যতে যেন কোনো ক্র্যাশ না হয়, সেজন্য সিস্টেমটি সচল আছে। নিচের বাটনে ক্লিক করে পেজটি রিফ্রেশ করুন অথবা মূল পাতায় ফিরে যান।
          </p>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Our automated stability system has successfully intercepted a runtime crash. Please try resetting the page.
          </p>
        </div>

        {/* Technical details accordion */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-3 text-left">
          <details className="cursor-pointer group text-xs">
            <summary className="font-extrabold text-gray-600 select-none flex items-center justify-between">
              <span>Technical Information (টেকনিক্যাল তথ্য)</span>
              <span className="transition-transform group-open:rotate-180 text-gray-400">▼</span>
            </summary>
            <div className="mt-2 text-[10px] text-gray-500 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border-t border-gray-200 pt-2">
              Error Message: {error?.message || 'Unknown error'}<br />
              {error?.digest && `Digest ID: ${error.digest}`}
            </div>
          </details>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:flex-1 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>পেজ পুনরায় লোড করুন (Retry)</span>
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>হোমপেজ</span>
          </Link>
        </div>

        {/* Helpline */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-bold">
          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
          <span>জরুরী হেল্পলাইন: ০১৭১২-৩৪৫৬৭৮</span>
        </div>
      </div>
    </div>
  );
}
