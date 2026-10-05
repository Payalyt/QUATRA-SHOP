'use client';

import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'dark' | 'light' | 'white';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  theme = 'light'
}) => {
  // Dimension mappings
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base tracking-tight',
    md: 'text-xl tracking-tight',
    lg: 'text-2xl tracking-normal',
    xl: 'text-3xl tracking-normal'
  };

  const isWhite = theme === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Signature "Q" Icon with the 4 Dots inside */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center transition-transform hover:scale-105`}
        title="QUATRO - 4 Dots Identity"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle stylish background pill/squircle */}
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="24"
            className={isWhite ? 'fill-white/15 stroke-white/30' : 'fill-sky-500/10 stroke-sky-500/25'}
            strokeWidth="2"
          />

          {/* Letter "Q" Outer Geometry */}
          {/* The ring of Q */}
          <circle
            cx="48"
            cy="46"
            r="28"
            className={isWhite ? 'stroke-white' : 'stroke-gray-900'}
            strokeWidth="8.5"
            strokeLinecap="round"
          />

          {/* Tail of "Q" */}
          <path
            d="M59 57 L77 75"
            className={isWhite ? 'stroke-[#0284c7]' : 'stroke-[#0284c7]'}
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* THE 4 SIGNATURE DOTS INSIDE "Q" (2x2 Grid) */}
          {/* Top-Left Dot */}
          <circle
            cx="41"
            cy="39"
            r="4.2"
            className={isWhite ? 'fill-white' : 'fill-[#0284c7]'}
          />
          {/* Top-Right Dot */}
          <circle
            cx="55"
            cy="39"
            r="4.2"
            className={isWhite ? 'fill-white' : 'fill-[#0284c7]'}
          />
          {/* Bottom-Left Dot */}
          <circle
            cx="41"
            cy="53"
            r="4.2"
            className={isWhite ? 'fill-white' : 'fill-[#0284c7]'}
          />
          {/* Bottom-Right Dot */}
          <circle
            cx="55"
            cy="53"
            r="4.2"
            className={isWhite ? 'fill-white' : 'fill-[#0284c7]'}
          />
        </svg>
      </div>

      {/* Wordmark Text (When variant is full) */}
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black font-sans uppercase ${textSizes[size]} ${
                isWhite ? 'text-white' : 'text-gray-950'
              }`}
              style={{ letterSpacing: '0.06em' }}
            >
              QUATRO
            </span>

            {/* 4 dots decorative mark above or beside the wordmark */}
            <div className="grid grid-cols-2 gap-0.5" title="4 dots of Quatro">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]" />
            </div>
          </div>
          <span
            className={`text-[9.5px] font-bold tracking-widest uppercase mt-0.5 ${
              isWhite ? 'text-white/80' : 'text-gray-400'
            }`}
          >
            Marketplace
          </span>
        </div>
      )}
    </div>
  );
};
