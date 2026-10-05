'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  X,
  Star,
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  PlayCircle,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  CheckCircle2,
  Clock,
  Heart,
  Store
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const router = useRouter();
  const {
    activeProductModal,
    setActiveProductModal,
    setActiveVideoModalUrl,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    setIsCheckoutModalOpen,
    language,
    t,
    settings,
    sellers,
    addLead
  } = useMarketplace();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [leadContact, setLeadContact] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const isWishlisted = isInWishlist(product.id);
  const currentImage = product.media[selectedImageIndex]?.url || product.media[0]?.url;

  // Selected variant
  const activeVariant = product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0];
  const effectivePrice = product.price + (activeVariant?.priceDiff || 0);

  const handleBuyNow = () => {
    addToCart(
      product,
      quantity,
      activeVariant?.id,
      activeVariant?.name,
      activeVariant?.value
    );
    setActiveProductModal(null);
    setIsCheckoutModalOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      activeVariant?.id,
      activeVariant?.name,
      activeVariant?.value
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-lg shadow-2xl max-w-[1040px] w-full max-h-[92vh] overflow-y-auto flex flex-col relative border border-gray-100">
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Gallery & Video (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-3">
              {/* Main Image Stage */}
              <div className="w-full aspect-square rounded-lg bg-gray-50 border border-gray-200 relative overflow-hidden flex items-center justify-center p-4 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Video Play Button if available */}
                {product.videoUrl && (
                  <button
                    onClick={() => setActiveVideoModalUrl(product.videoUrl || null)}
                    className="absolute bottom-3 left-3 bg-black/75 hover:bg-[#0284c7] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <PlayCircle className="w-4 h-4 text-white" />
                    <span>Watch Video Demo</span>
                  </button>
                )}

                {/* Discount Badge */}
                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#0284c7] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                    -{product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnail Selector */}
              {product.media.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {product.media.map((mediaItem, idx) => {
                    const isVid = mediaItem.type === 'VIDEO';
                    return (
                      <button
                        key={mediaItem.id || idx}
                        onClick={() => {
                          if (isVid) {
                            setActiveVideoModalUrl(mediaItem.url);
                          } else {
                            setSelectedImageIndex(idx);
                          }
                        }}
                        className={`w-14 h-14 rounded-lg border-2 overflow-hidden shrink-0 transition-all relative ${
                          selectedImageIndex === idx && !isVid
                            ? 'border-[#0284c7] ring-1 ring-[#0284c7] scale-102'
                            : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        {isVid ? (
                          <div className="w-full h-full bg-purple-900/90 text-white flex flex-col items-center justify-center p-1">
                            <PlayCircle className="w-6 h-6 text-purple-200 animate-pulse" />
                            <span className="text-[8px] font-extrabold uppercase tracking-tighter text-purple-100 mt-0.5">Video</span>
                          </div>
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={mediaItem.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Trust Badges */}
              <div className="bg-[#fbfbfb] rounded-lg p-3 border border-gray-200 space-y-2 text-[12px] text-gray-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span className="font-semibold">{t('authenticity')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>7 Days Easy Return:</strong> If damaged, wrong size or defective.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Standard Delivery: ৳60 (Dhaka) | ৳120 (Outside)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Cash on Delivery (COD) &amp; bKash Supported</span>
                </div>
              </div>
            </div>

            {/* Right Column: Buying Module & Product Info (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand & Stock */}
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider">
                    Brand: <span className="text-[#0284c7] font-bold">{product.brand}</span>
                  </span>
                  {product.stock <= 0 ? (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold text-[11px]">
                      {t('outOfStock')}
                    </span>
                  ) : product.stock < 10 ? (
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[11px]">
                      {t('onlyLeft', { count: product.stock })}
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('inStock')}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-lg sm:text-xl font-black text-[#0284c7] leading-snug mb-2">
                  {language === 'bn' ? product.titleBn : product.title}
                </h1>

                {/* Rating & Reviews Bar */}
                <div className="flex items-center gap-3 text-xs text-[#0284c7] pb-3 border-b border-gray-100 font-semibold">
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-[#0284c7] ml-1">{product.rating.toFixed(1)}</span>
                  </div>
                  <span>·</span>
                  <span className="hover:text-[#0369a1] text-[#0284c7] font-medium cursor-pointer">
                    {product.reviewCount} {t('ratings')}
                  </span>
                  <span>·</span>
                  <span className="text-[#0284c7] font-medium">{product.soldCount} {t('sold')}</span>
                </div>

                {/* Price Section */}
                <div className="bg-sky-50/50 p-3.5 rounded-lg border border-sky-100 my-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-[#0284c7] tabular-nums">
                      {formatPrice(effectivePrice)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm sm:text-base text-gray-400 line-through tabular-nums">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.discountPercent > 0 && (
                      <span className="text-xs bg-[#0284c7] text-white font-bold px-2 py-0.5 rounded">
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>
                  {product.warranty && (
                    <p className="text-[11px] text-gray-600 mt-1 font-medium">
                      🛡️ {product.warranty}
                    </p>
                  )}
                </div>

                {/* Sold By [Shop Name] Badge & Visit Shop Button */}
                {(() => {
                  const sellerObj = sellers.find((s) => s.id === product.sellerId || s.slug === product.sellerId) || sellers[0];
                  if (!sellerObj) return null;
                  return (
                    <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-xl flex items-center justify-between my-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#0284c7] text-white flex items-center justify-center font-extrabold text-xs shadow-2xs shrink-0 overflow-hidden border border-sky-200">
                          {sellerObj.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={sellerObj.logo} alt={sellerObj.shopName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{sellerObj.shopName.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-500 font-medium block leading-none">Sold by</span>
                          <span className="font-extrabold text-xs text-gray-900 truncate block mt-0.5">{sellerObj.shopName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] bg-white text-[#0284c7] font-extrabold px-2 py-1 rounded-lg border border-sky-200 shadow-2xs">
                          ★ {sellerObj.rating || 4.9}
                        </span>
                        <button
                          onClick={() => {
                            setActiveProductModal(null);
                            router.push(`/shop/${sellerObj.slug}`);
                          }}
                          className="text-xs bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-98"
                        >
                          <Store className="w-3.5 h-3.5" />
                          <span>Visit Shop</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Variants Selection (Color / Size / Storage) */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <label className="text-xs font-bold text-gray-700 block">
                      Select {product.variants[0].name}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => {
                        const isSelected = (activeVariant?.id || product.variants?.[0].id) === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariantId(v.id)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                              isSelected
                                ? 'border-[#0284c7] bg-sky-50 text-[#0284c7] ring-1 ring-[#0284c7]'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            <span>{v.value}</span>
                            {v.priceDiff ? (
                              <span className="text-[10px] ml-1 text-gray-500">
                                (+{formatPrice(v.priceDiff)})
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-xs font-bold text-gray-700">{t('quantity')}:</span>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1 text-xs font-bold text-gray-800 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {product.stock} pieces available
                  </span>
                </div>
              </div>

              {/* Purchase Action Buttons */}
              <div className="pt-3 border-t border-gray-100">
                {settings?.isAddToCartEnabled === false && settings?.isBuyNowEnabled === false ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs font-semibold flex items-center justify-center gap-2">
                    <span>⚠️ Store purchasing &amp; ordering is temporarily paused by store administrator.</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    {settings?.isBuyNowEnabled !== false && (
                      <button
                        onClick={handleBuyNow}
                        disabled={product.stock <= 0}
                        className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-sm py-3 px-6 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>{t('buyNow')} (Direct Cash on Delivery)</span>
                      </button>
                    )}

                    {settings?.isAddToCartEnabled !== false && (
                      <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm py-3 px-6 rounded-md shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{t('addToCart')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3 rounded-md border transition-colors flex items-center justify-center ${
                        isWishlisted
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-gray-300 hover:border-gray-400 text-gray-600'
                      }`}
                      title="Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                    </button>
                  </div>
                )}

                {/* Lead Capture for Interested Buyers (পণ্যটি কিনতে আগ্রহী?) */}
                <div className="mt-4 p-3 bg-gradient-to-r from-sky-50 to-blue-50/50 rounded-xl border border-sky-100/80 shadow-2xs">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm">🔔</span>
                    <h5 className="font-extrabold text-[11px] text-gray-900">
                      {language === 'bn'
                        ? 'পণ্যটি কিনতে আগ্রহী? বিশেষ অফার বা কল পেতে নাম্বার দিন'
                        : 'Interested in buying? Request special deal or stock alert'}
                    </h5>
                  </div>
                  {leadSubmitted ? (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {language === 'bn'
                          ? 'ধন্যবাদ! আপনার তথ্য সংরক্ষিত হয়েছে, প্রতিনিধি যোগাযোগ করবে।'
                          : 'Thank you! Your inquiry is recorded, our team will contact you.'}
                      </span>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (leadContact.trim()) {
                          const isPhone = /^[0-9+ \-]+$/.test(leadContact.trim());
                          addLead(
                            isPhone ? undefined : leadContact.trim(),
                            isPhone ? leadContact.trim() : undefined,
                            'Product Buy Intent',
                            undefined,
                            `Interested in buying ${product.title}`,
                            product.title
                          );
                          setLeadSubmitted(true);
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={leadContact}
                        onChange={(e) => setLeadContact(e.target.value)}
                        placeholder="Your phone (017...) or email"
                        className="flex-1 bg-white px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:border-[#0284c7] outline-none font-medium"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        {language === 'bn' ? 'আগ্রহ প্রকাশ করুন' : 'Notify Me'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Description, Specs & Customer Reviews */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {/* Tab navigation */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-4">
              <button
                onClick={() => setActiveTab('desc')}
                className={`px-4 py-2 rounded-t text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'desc'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                {t('productDescription')}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 rounded-t text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'specs'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                {t('specifications')}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-t text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                {t('customerReviews')} ({product.reviews?.length || 0})
              </button>
            </div>

            {/* Tab 1: Description */}
            {activeTab === 'desc' && (
              <div className="prose prose-sm max-w-none text-gray-700 text-[13px] leading-relaxed">
                <p>{product.description}</p>
                {product.descriptionBn && (
                  <p className="mt-2 text-gray-600 italic bg-gray-50 p-3 rounded">
                    বাংলা বিবরণ: {product.descriptionBn}
                  </p>
                )}
              </div>
            )}

            {/* Tab 2: Specifications */}
            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gray-200 divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-100">
                    {Object.entries(product.specifications || {}).map(([key, val]) => (
                      <tr key={key} className="even:bg-gray-50">
                        <td className="py-2.5 px-4 font-semibold text-gray-800 w-1/3 bg-gray-50/50">
                          {key}
                        </td>
                        <td className="py-2.5 px-4 text-gray-600 font-mono text-[12px]">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-gray-900">{rev.userName}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                            Verified Purchase ({rev.userCity})
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">{rev.createdAt}</span>
                      </div>

                      <div className="flex text-amber-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-gray-700 leading-normal">{rev.comment}</p>

                      {rev.images && rev.images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {rev.images.map((img, i) => (
                            <div key={i} className="w-16 h-16 rounded border border-gray-200 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img}
                                alt="Customer photo"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 py-4 text-center">
                    No customer reviews yet. Be the first to review this product after purchase!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
