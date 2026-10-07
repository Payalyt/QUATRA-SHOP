'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types/ecommerce';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Star, ShoppingCart, Heart, Eye, Zap, Megaphone, ChevronLeft, ChevronRight, Play, Share2 } from 'lucide-react';

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
    recordProductClick,
    user,
    setIsAuthModalOpen,
    setAuthModalTab,
    showToast,
    affiliates,
    currentAffiliate,
    generateAffiliateLink
  } = useMarketplace();

  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const isFavorited = isInWishlist(product.id);

  // Check if current logged in user has an active affiliate profile registered with matching email
  const userActiveAffiliate = React.useMemo(() => {
    if (!user || !user.email) return null;
    const userEmail = user.email.trim().toLowerCase();
    const matched = affiliates.find(
      (a) => a.email.trim().toLowerCase() === userEmail && a.status === 'Active'
    );
    if (matched) return matched;
    if (
      currentAffiliate &&
      currentAffiliate.email.trim().toLowerCase() === userEmail &&
      currentAffiliate.status === 'Active'
    ) {
      return currentAffiliate;
    }
    return null;
  }, [user, affiliates, currentAffiliate]);

  // Extract all media items
  const mediaList = product.media && product.media.length > 0 ? product.media : [];
  const activeMedia = mediaList[currentImgIdx] || mediaList[0];
  const activeImageUrl = activeMedia?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
  const isVideo = activeMedia?.type === 'VIDEO';

  // Navigation handlers for next/prev arrows
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaList.length <= 1) return;
    setCurrentImgIdx((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaList.length <= 1) return;
    setCurrentImgIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
  };

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

      {/* Product Image with Multi-Image Navigation Arrows */}
      <div className="w-full aspect-square bg-[#fafafa] relative overflow-hidden flex items-center justify-center p-3 group/img">
        {activeImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImageUrl}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
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

        {/* Video overlay icon if this slide is video */}
        {isVideo && (
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-white/90 text-[#0284c7] flex items-center justify-center shadow-md">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>
        )}

        {/* Left and Right Navigation Arrows for multi-image products */}
        {mediaList.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-[#0284c7] shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-15 border border-gray-200/80 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-[#0284c7] shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-15 border border-gray-200/80 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Dot Indicator / Image Counter */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-full pointer-events-none">
              {mediaList.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`rounded-full transition-all ${
                    currentImgIdx === dotIdx ? 'w-2 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hover Quick Action Bar */}
        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
          {settings?.isAddToCartEnabled !== false && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              disabled={product.stock <= 0}
              className="flex-1 bg-[#f85606] hover:bg-[#d94803] text-white text-[10px] font-bold py-1.5 px-1.5 rounded-md shadow-xs flex items-center justify-center gap-1 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                if (!user) {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                  showToast(
                    language === 'bn'
                      ? 'পণ্য ক্রয় (Buy Now) করতে অনুগ্রহ করে প্রথমে অ্যাকাউন্টে লগইন বা সাইন-আপ করুন।'
                      : 'Please log in or sign up to proceed with Buy Now.',
                    'info'
                  );
                  return;
                }
                addToCart(product, 1);
                setIsCheckoutModalOpen(true);
              }}
              disabled={product.stock <= 0}
              className="flex-1 bg-[#0284c7]/95 hover:bg-[#0369a1] text-white text-[10px] font-extrabold py-1.5 px-1.5 rounded-md shadow-xs flex items-center justify-center gap-1 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            className="w-7 bg-white/95 hover:bg-white text-gray-700 hover:text-[#0284c7] text-[10px] font-medium py-1.5 rounded-md shadow-xs flex items-center justify-center transition-colors shrink-0 border border-gray-200/60"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {userActiveAffiliate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const affCode = userActiveAffiliate.code;
                const linkUrl = `/product/${product.slug || product.id}?ref=${affCode}`;
                const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${linkUrl}` : linkUrl;
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(fullUrl);
                  showToast(`Affiliate link copied! (${affCode}) Earn 10% (৳${Math.round(product.price * 0.1)})`, 'success');
                }
              }}
              className="w-7 bg-blue-50/95 hover:bg-blue-100 text-blue-700 text-[10px] font-medium py-1.5 rounded-md shadow-xs flex items-center justify-center transition-colors shrink-0 border border-blue-200"
              title={`Get Affiliate Link (${userActiveAffiliate.code} - Earn 10%)`}
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
            </button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between bg-white border-t border-gray-100">
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between text-[10.5px] text-[#0284c7] mb-1">
            <span className="uppercase tracking-wider font-bold truncate max-w-[120px]">{product.brand}</span>
            {product.stock <= 0 ? (
              <span className="text-red-500 font-bold text-[9.5px]">Out of Stock</span>
            ) : product.stock < 10 ? (
              <span className="text-amber-600 font-bold text-[9.5px]">Only {product.stock} left</span>
            ) : null}
          </div>

          {/* Product Title */}
          <h3 className="text-[12px] sm:text-[12.5px] font-semibold text-gray-800 line-clamp-2 leading-snug transition-colors mb-1.5 min-h-[34px] group-hover:text-[#0284c7]">
            {language === 'bn' ? product.titleBn : product.title}
          </h3>
        </div>

        <div>
          {/* Rating & Sold count */}
          <div className="flex items-center justify-between text-[10.5px] text-gray-500 mb-1.5 font-medium">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold text-gray-700 tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-gray-400">({product.reviewCount})</span>
            </div>
            <span className="text-gray-500 tabular-nums">{product.soldCount} sold</span>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[14px] sm:text-[15px] font-extrabold text-[#0284c7] tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10.5px] sm:text-[11px] text-gray-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Optional Sold Progress bar for Flash Sale */}
          {showProgress && (
            <div className="mt-2">
              <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                <div
                  className="bg-linear-to-r from-sky-500 to-[#0284c7] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9.5px] text-gray-500 mt-0.5">
                <span>{progressPercent}% Sold</span>
                <span className="font-medium text-[#0284c7]">Fast Selling</span>
              </div>
            </div>
          )}

          {/* Sleek Action Buttons - Perfectly proportioned and aligned */}
          <div className="mt-2.5 flex items-center gap-1.5">
            {settings?.isAddToCartEnabled !== false && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#f85606] hover:bg-[#d94803] text-white text-[10.5px] sm:text-[11px] font-extrabold py-1.5 px-2 rounded-md shadow-xs transition-all active:scale-97 flex items-center justify-center gap-1 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                  if (!user) {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                    showToast(
                      language === 'bn'
                        ? 'পণ্য ক্রয় (Buy Now) করতে অনুগ্রহ করে প্রথমে অ্যাকাউন্টে লগইন বা সাইন-আপ করুন।'
                        : 'Please log in or sign up to proceed with Buy Now.',
                    'info'
                  );
                  return;
                }
                addToCart(product, 1);
                setIsCheckoutModalOpen(true);
              }}
              disabled={product.stock <= 0}
              className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[10.5px] sm:text-[11px] font-bold py-1.5 px-2 rounded-md shadow-2xs hover:shadow-xs transition-all active:scale-97 flex items-center justify-center gap-1 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
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
