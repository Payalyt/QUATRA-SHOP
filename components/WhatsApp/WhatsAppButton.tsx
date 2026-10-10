'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';

export const WhatsAppButton: React.FC = () => {
  const { settings, language } = useMarketplace();

  // Normalize WhatsApp number so any admin input works seamlessly
  const rawNumber = settings.whatsappNumber?.trim() || '+8801712345678';
  let cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  // If local BD format starting with 01 (e.g. 01712345678), prepend country code 88
  if (cleanNumber.startsWith('01') && cleanNumber.length === 11) {
    cleanNumber = `88${cleanNumber}`;
  }

  const greeting =
    settings.whatsappGreeting ||
    'Hello QUATRO! I want to inquire about a product or my order.';

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;

  return (
    <aside
      aria-label="Direct WhatsApp Support Contact"
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center group pointer-events-auto"
    >
      {/* Tooltip Pill */}
      <span className="hidden sm:inline-block mr-2.5 bg-gray-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-700">
        {language === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি চ্যাট করুন' : 'Chat on WhatsApp'}
      </span>

      {/* WhatsApp Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact QUATRO Support on WhatsApp"
        className="relative w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-108 active:scale-95 transition-all duration-200 ring-3 ring-white"
        title={`WhatsApp Support: ${settings.whatsappNumber || '+8801712345678'}`}
      >
        <svg
          className="w-7 h-7 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.95.556 3.774 1.517 5.325L2.35 22l4.805-1.139c1.478.85 3.195 1.34 4.876 1.34 5.536 0 10.031-4.495 10.031-10.031C22.062 6.495 17.567 2 12.031 2zm5.795 14.157c-.244.686-1.22 1.305-1.996 1.473-.526.115-1.213.208-3.52-.751-2.952-1.226-4.856-4.225-5.003-4.42-.147-.196-1.198-1.597-1.198-3.045 0-1.448.758-2.158 1.027-2.452.269-.294.587-.367.783-.367.196 0 .391.002.562.012.184.01.428-.07.67.511.244.587.831 2.029.905 2.176.073.147.122.319.024.515-.098.196-.147.319-.293.49-.147.171-.31.382-.44.514-.147.147-.3.308-.129.602.171.294.761 1.254 1.632 2.03 1.121.998 2.066 1.308 2.359 1.455.294.147.465.122.636-.073.171-.196.734-.856.93-1.15.196-.294.391-.245.66-.147.269.098 1.711.807 2.005.954.294.147.489.22.562.342.074.123.074.71-.17 1.396z" />
        </svg>

        {/* Live Support Indicator Dot */}
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white animate-pulse" />
      </a>
    </aside>
  );
};
