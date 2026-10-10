'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { X, Play } from 'lucide-react';

export const ProductVideoModal: React.FC = () => {
  const { activeVideoModalUrl, setActiveVideoModalUrl } = useMarketplace();

  if (!activeVideoModalUrl) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50 duration-200">
      <div className="relative bg-black rounded-lg overflow-hidden max-w-[800px] w-full shadow-2xl border border-gray-800">
        {/* Close Button */}
        <button
          onClick={() => setActiveVideoModalUrl(null)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-[#0284c7] text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video Player */}
        <div className="w-full aspect-video bg-black flex items-center justify-center">
          <video
            src={activeVideoModalUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="p-3 bg-gray-900 text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Play className="w-3.5 h-3.5 text-[#0284c7]" />
            <span className="font-semibold">Official Product Video Demo</span>
          </div>
          <span className="text-gray-400">High Definition 1080p</span>
        </div>
      </div>
    </div>
  );
};
