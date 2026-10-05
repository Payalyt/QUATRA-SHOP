'use client';

import React, { useEffect, useRef } from 'react';
import { Product } from '@/lib/types/ecommerce';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Star, ShoppingCart, Heart, Eye, Zap, Megaphone } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  showProgress?: boolean;
}

// Global session-level tracker to ensure each sponsored product impression is only logged once per session
const sessionRecordedImpressions = new Set<string>();

export const ProductCard: React.FC<ProductCardProps> = ({ product, showProgress = false }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveProductModal,
    setIsCheckoutModalOpen,
    language,
    settings,
    sponsoredCampaigns,
    recordProductImpression,
    recordProductClick
  } = useMarketplace();

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.media[0]?.url;

  // Check if product is currently sponsored
  const isSponsored = Boolean(
    product.isSponsored ||
    sponsoredCampaigns?.some((c) => c.productId === product.id && c.status === 'ACTIVE')
  );

  // Safe real-time impression tracking (debounced and once per product)
  useEffect(() => {
    if (isSponsored && !sessionRecordedImpressions.has(product.id)) {
      sessionRecordedImpressions.add(product.id);
      const timer = setTimeout(() => {
        recordProductImpression(product.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [product.id, isSponsored, recordProductImpression]);

  // Handle card click and record ad click
  const handleCardClick = () => {
    if (isSponsored) {
      recordProductClick(product.id);
    }
    setActiveProductModal(product);
  };

  // Calculate sold progress percentage (between 30% and 92% for realistic flash sale)
  const quota = product.stock + product.soldCount;
  const progressPercent = Math.min(95, Math.max(25, Math.round((product.soldCount / (quota || 1)) * 100)));

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-md border border-gray-100 hover:border-sky-200 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Sponsored Ad Badge */}
      {isSponsored && (
        <div className="absolute top-2 left-2 z-10 bg-linear-to-r from-sky-500 via-[#0284c7] to-[#0369a1] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1 uppercase tracking-wider">
          <Megaphone className="w-2.5 h-2.5" />
          <span>Ad</span>
        </div>
      )}

      {/* Top Discount Tag */}
      {product.discountPercent > 0 && !isSponsored && (
        <div className="absolute top-2 left-2 z-10 bg-[#0284c7] text-white text-[10.5px] font-bold px-1.5 py-0.5 rounded shadow-xs">
          -{product.discountPercent}%
        </div>
      )}
      {product.discountPercent > 0 && isSponsored && (
        <div className="absolute top-7 left-2 z-10 bg-[#0284c7] text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded shadow-xs">
          -{product.discountPercent}%
        </div>
      )}

      {/* Wishlist Floating Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
          isFavorited
            ? 'bg-red-50 text-red-500 shadow-xs'
            : 'bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 shadow-xs'
        }`}
        title="Wishlist"
      >
        <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
      </button>

      {/* Product Image with Fallback */}
      <div className="w-full aspect-square bg-[#fafafa] relative overflow-hidden flex items-center justify-center p-3">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful CSS fallback container
              const target = e.currentTarget;
              target.style.display = 'none';
              target.parentElement?.classList.add('bg-linear-to-br', 'from-sky-50', 'to-gray-100');
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <span className="text-xs font-medium">QUATRO</span>
          </div>
        )}

        {/* Hover Quick Action Bar */}
        <div className="absolute inset-x-1.5 bottom-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {settings?.isAddToCartEnabled !== false && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              disabled={product.stock <= 0}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[10.5px] font-bold py-1.5 px-1 rounded shadow-xs flex items-center justify-center gap-1 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              title="Add to Cart"
            >
              <ShoppingCart className="w-3 h-3 shrink-0" />
              <span>Cart</span>
            </button>
          )}

          {settings?.isBuyNowEnabled !== false && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
                setIsCheckoutModalOpen(true);
              }}
              disabled={product.stock <= 0}
              className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[10.5px] font-extrabold py-1.5 px-1 rounded shadow-xs flex items-center justify-center gap-1 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              title="Buy Now (Direct COD)"
            >
              <Zap className="w-3 h-3 fill-white shrink-0" />
              <span>Buy Now</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveProductModal(product);
            }}
            className="w-7 bg-white/90 hover:bg-white text-gray-700 hover:text-[#0284c7] text-[11px] font-medium py-1.5 rounded shadow-xs flex items-center justify-center transition-colors shrink-0"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 flex-1 flex flex-col justify-between bg-sky-50/70 border-t border-sky-100">
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between text-[11px] text-[#0284c7] mb-1">
            <span className="uppercase tracking-wider font-bold truncate max-w-[120px]">{product.brand}</span>
            {product.stock <= 0 ? (
              <span className="text-red-500 font-bold text-[10px]">Out of Stock</span>
            ) : product.stock < 10 ? (
              <span className="text-amber-600 font-bold text-[10px]">Only {product.stock} left</span>
            ) : null}
          </div>

          {/* Product Title */}
          <h3 className="text-[12.5px] sm:text-[13px] font-bold text-[#0284c7] line-clamp-2 leading-snug transition-colors mb-2 min-h-[36px]">
            {language === 'bn' ? product.titleBn : product.title}
          </h3>
        </div>

        <div>
          {/* Rating & Sold count */}
          <div className="flex items-center justify-between text-[11px] text-[#0284c7] mb-2 font-semibold">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold text-[#0284c7] tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-sky-600">({product.reviewCount})</span>
            </div>
            <span className="text-[#0284c7] tabular-nums">{product.soldCount} sold</span>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] sm:text-[16px] font-black text-[#0284c7] tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-[12px] text-gray-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Optional Sold Progress bar for Flash Sale */}
          {showProgress && (
            <div className="mt-2.5">
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-sky-500 to-[#0284c7] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                <span>{progressPercent}% Sold</span>
                <span className="font-medium text-[#0284c7]">Fast Selling</span>
              </div>
            </div>
          )}

          {/* Permanent Action Buttons - Conditional on Admin settings toggles */}
          <div className="mt-3.5 flex gap-2">
            {settings?.isAddToCartEnabled !== false && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                disabled={product.stock <= 0}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] sm:text-[12px] font-bold py-2 px-2.5 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-97 flex items-center justify-center gap-1 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Add to Cart"
              >
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                <span>{language === 'bn' ? 'কার্ট' : 'Cart'}</span>
              </button>
            )}

            {settings?.isBuyNowEnabled !== false && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                  setIsCheckoutModalOpen(true);
                }}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11.5px] sm:text-[12.5px] font-black py-2 px-2.5 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-97 flex items-center justify-center gap-1 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Buy Now (Direct COD)"
              >
                <Zap className="w-3 h-3 fill-white shrink-0" />
                <span>{language === 'bn' ? 'অর্ডার' : 'Buy Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
