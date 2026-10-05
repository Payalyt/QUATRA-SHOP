'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Heart, X, Trash2, ShoppingCart } from 'lucide-react';

export const WishlistModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { wishlist, products, toggleWishlist, addToCart, formatPrice, setActiveProductModal, t } =
    useMarketplace();

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-[560px] w-full max-h-[85vh] overflow-y-auto flex flex-col border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="font-extrabold text-base text-gray-900">{t('wishlist')}</h2>
            <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
              {wishlistedProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto flex-1 divide-y divide-gray-100">
          {wishlistedProducts.length > 0 ? (
            wishlistedProducts.map((p) => (
              <div key={p.id} className="pt-3 first:pt-0 flex items-center gap-3 text-xs">
                <div
                  onClick={() => {
                    setActiveProductModal(p);
                    onClose();
                  }}
                  className="w-14 h-14 rounded bg-gray-50 border border-gray-200 overflow-hidden shrink-0 cursor-pointer p-0.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.media[0]?.url}
                    alt={p.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      setActiveProductModal(p);
                      onClose();
                    }}
                    className="font-semibold text-gray-800 line-clamp-1 hover:text-[#0284c7] cursor-pointer"
                  >
                    {p.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-sm text-[#0284c7] tabular-nums">
                      {formatPrice(p.price)}
                    </span>
                    {p.originalPrice > p.price && (
                      <span className="text-gray-400 line-through tabular-nums text-[11px]">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(p, 1)}
                    disabled={p.stock <= 0}
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-2xs transition-colors disabled:bg-gray-300"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              <Heart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs">Your wishlist is empty. Browse and save items you love!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
