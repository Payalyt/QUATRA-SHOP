'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Heart,
  Store,
  Ticket,
  UserPlus,
  Check,
  MessageSquare,
  HelpCircle,
  Upload,
  Camera,
  ThumbsUp,
  Sparkles,
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  Coins,
  Copy,
  Share2
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const router = useRouter();
  const {
    products,
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
    addLead,
    user,
    setIsAuthModalOpen,
    setAuthModalTab,
    showToast,
    coupons,
    collectedVouchers,
    collectVoucher,
    isVoucherCollected,
    productQnAs,
    addCustomerQuestion,
    toggleFollowShop,
    isFollowingShop,
    addCustomerReviewWithPhoto,
    affiliates,
    currentAffiliate,
    generateAffiliateLink
  } = useMarketplace();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'qna'>('desc');
  const [leadContact, setLeadContact] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isAffiliateWidgetOpen, setIsAffiliateWidgetOpen] = useState(false);

  // Check if current logged-in user has an active registered affiliate profile with matching email
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

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImageUrls, setReviewImageUrls] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');

  // Question submission state
  const [questionText, setQuestionText] = useState('');
  const [isSubmittingQna, setIsSubmittingQna] = useState(false);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const isWishlisted = isInWishlist(product.id);
  const currentImage = product.media[selectedImageIndex]?.url || product.media[0]?.url;

  // Selected variant
  const activeVariant = product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0];
  const effectivePrice = product.price + (activeVariant?.priceDiff || 0);

  // Seller info
  const sellerObj = sellers.find((s) => s.id === product.sellerId || s.slug === product.sellerId) || sellers[0];
  const isShopFollowed = sellerObj ? isFollowingShop(sellerObj.id) : false;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  // Filtered reviews
  const allReviews = product.reviews || [];
  const filteredReviews = allReviews.filter((r) => {
    if (selectedStarFilter === 'all') return true;
    return r.rating === selectedStarFilter;
  });

  // Star breakdown calculation
  const totalReviewsCount = allReviews.length || 1;
  const starCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = allReviews.filter((r) => r.rating === stars).length;
    const percent = Math.round((count / totalReviewsCount) * 100);
    return { stars, count, percent };
  });

  // Questions for this product
  const productQuestions = productQnAs.filter((q) => q.productId === product.id);

  const handleBuyNow = () => {
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
    if (!user) {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn'
          ? 'কার্টে পণ্য যোগ করতে অনুগ্রহ করে প্রথমে অ্যাকাউন্টে লগইন বা সাইন-আপ করুন।'
          : 'Please log in or sign up to add items to your cart.',
        'info'
      );
      return;
    }

    addToCart(
      product,
      quantity,
      activeVariant?.id,
      activeVariant?.name,
      activeVariant?.value
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    try {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64, fileName: file.name })
          });
          const data = await res.json();
          if (data.success && data.url) {
            setReviewImageUrls((prev) => [...prev, data.url]);
            showToast('Photo attached to review!', 'success');
          } else {
            setReviewImageUrls((prev) => [...prev, base64]);
          }
        } catch {
          setReviewImageUrls((prev) => [...prev, base64]);
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingPhoto(false);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn'
          ? 'রিভিউ দিতে অনুগ্রহ করে প্রথমে লগইন করুন।'
          : 'Please log in to submit a review.',
        'info'
      );
      return;
    }

    if (!reviewComment.trim()) {
      showToast('Please enter your review comments', 'error');
      return;
    }

    addCustomerReviewWithPhoto(product.id, reviewRating, reviewComment.trim(), reviewImageUrls);
    setReviewComment('');
    setReviewImageUrls([]);
    setShowReviewForm(false);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
      showToast(
        language === 'bn'
          ? 'সেলারকে প্রশ্ন করতে অনুগ্রহ করে প্রথমে লগইন করুন।'
          : 'Please log in to ask a question.',
        'info'
      );
      return;
    }

    if (!questionText.trim()) return;

    setIsSubmittingQna(true);
    addCustomerQuestion(product.id, questionText.trim());
    setQuestionText('');
    setIsSubmittingQna(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-[1040px] w-full max-h-[92vh] overflow-y-auto flex flex-col relative border border-gray-100">
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Image Gallery & Video Player & Badges (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              {/* Main Image / Video Viewport */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200 group flex items-center justify-center">
                {product.media[selectedImageIndex]?.type === 'VIDEO' || product.videoUrl ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.media[0]?.url || 'https://picsum.photos/seed/vid/600/600'}
                      alt={product.title}
                      className="w-full h-full object-cover opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={() =>
                        setActiveVideoModalUrl(
                          product.media[selectedImageIndex]?.url ||
                            product.videoUrl ||
                            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                        )
                      }
                      className="absolute z-10 w-16 h-16 rounded-full bg-purple-600/90 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110 cursor-pointer"
                      title="Play Product HD Video"
                    >
                      <PlayCircle className="w-10 h-10 fill-white text-purple-600 ml-0.5" />
                    </button>
                    <span className="absolute bottom-3 left-3 bg-black/70 text-purple-200 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                      <PlayCircle className="w-3 h-3" />
                      <span>{language === 'bn' ? 'ভিডিও দেখুন' : 'Watch Video'}</span>
                    </span>
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={currentImage}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Left & Right Image Gallery Carousel Arrows */}
                {product.media && product.media.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : product.media.length - 1))
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 hover:text-[#0284c7] shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-20 border border-gray-200 cursor-pointer"
                      title="Previous Image"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) => (prev < product.media.length - 1 ? prev + 1 : 0))
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 hover:text-[#0284c7] shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-20 border border-gray-200 cursor-pointer"
                      title="Next Image"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full z-10 pointer-events-none">
                      {selectedImageIndex + 1} / {product.media.length}
                    </div>
                  </>
                )}

                {/* Floating Discount Tag */}
                {product.discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md">
                    -{product.discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Selector Gallery */}
              {product.media && product.media.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {product.media.map((mediaItem, idx) => {
                    const isVid = mediaItem.type === 'VIDEO';
                    return (
                      <button
                        key={mediaItem.id || idx}
                        onClick={() => {
                          setSelectedImageIndex(idx);
                          if (isVid) {
                            setActiveVideoModalUrl(
                              mediaItem.url ||
                                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
                            );
                          }
                        }}
                        className={`w-14 h-14 rounded-lg border-2 overflow-hidden shrink-0 transition-all relative cursor-pointer ${
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

              {/* Daraz Verified Delivery & Trust Badges */}
              <div className="bg-sky-50/60 rounded-xl p-3.5 border border-sky-100 space-y-2.5 text-[12px] text-gray-700 shadow-2xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span className="font-bold text-gray-900">
                    {language === 'bn' ? '১০০% অরিজিনাল ও অথেনটিক পণ্য' : '100% Authentic & Genuine Product'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong className="text-gray-900">{language === 'bn' ? '৭ দিনের সহজ রিটার্ন:' : '7 Days Easy Return:'}</strong>{' '}
                    {language === 'bn' ? 'ত্রুটিযুক্ত বা পছন্দ না হলে বদলে নেওয়ার সুবিধা' : 'Change of mind or defective replacement'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    <strong className="text-gray-900">{language === 'bn' ? 'স্ট্যান্ডার্ড ডেলিভারি:' : 'Standard Shipping:'}</strong> ৳৬০ (ঢাকা) | ৳১২০ (ঢাকার বাইরে)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong className="text-gray-900">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD):' : 'Cash on Delivery:'}</strong> বিকাশ, নগদ ও কার্ড সাপোর্টেড
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Buying Module, Vouchers & Shop Card (7 cols) */}
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
                <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-snug mb-2">
                  {language === 'bn' ? product.titleBn : product.title}
                </h1>

                {/* Rating & Reviews Bar */}
                <div className="flex items-center gap-3 text-xs text-gray-600 pb-3 border-b border-gray-100 font-semibold">
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
                    <span className="font-black text-gray-900 ml-1">{product.rating.toFixed(1)}</span>
                  </div>
                  <span>·</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="hover:text-[#0284c7] text-[#0284c7] font-bold cursor-pointer underline decoration-dotted"
                  >
                    {product.reviewCount} {t('ratings')}
                  </button>
                  <span>·</span>
                  <span className="text-gray-500 font-medium">{product.soldCount} {t('sold')}</span>
                </div>

                {/* Price Section */}
                <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100 my-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-[#0284c7] tabular-nums">
                      {formatPrice(effectivePrice)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm sm:text-base text-gray-400 line-through tabular-nums font-semibold">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    {product.discountPercent > 0 && (
                      <span className="text-xs bg-[#0284c7] text-white font-black px-2 py-0.5 rounded">
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

                {/* FEATURE 1: DARAZ COLLECTIBLE STORE VOUCHERS BANNER */}
                {coupons && coupons.length > 0 && (
                  <div className="mb-3 p-2.5 bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                        <Ticket className="w-4 h-4 text-amber-600" />
                        <span>{language === 'bn' ? 'স্টোর ভাউচার কালেকশন' : 'Store Vouchers Available'}</span>
                      </div>
                      <span className="text-[10px] text-amber-700 font-semibold">
                        {language === 'bn' ? 'চেকআউটে অটো-অ্যাপ্লাই হবে' : 'Auto-applies at checkout'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {coupons.slice(0, 2).map((cpn) => {
                        const isCollected = isVoucherCollected(cpn.code);
                        return (
                          <div
                            key={cpn.id}
                            className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-dashed border-amber-300 shadow-2xs text-xs"
                          >
                            <div>
                              <span className="font-extrabold text-amber-900 block leading-tight">
                                {cpn.discountType === 'PERCENT' ? `${cpn.discountValue}% OFF` : `৳${cpn.discountValue} OFF`}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono font-bold">
                                Code: {cpn.code}
                              </span>
                            </div>
                            <button
                              onClick={() => collectVoucher(cpn.code)}
                              disabled={isCollected}
                              className={`px-2 py-1 rounded text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                                isCollected
                                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                                  : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95 shadow-2xs'
                              }`}
                            >
                              {isCollected ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>{language === 'bn' ? 'কালেক্টেড' : 'Collected'}</span>
                                </>
                              ) : (
                                <span>{language === 'bn' ? 'কালেক্ট' : 'Collect'}</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FEATURE 2: SOLD BY SHOP CARD WITH FOLLOW BUTTON & REPUTATION */}
                {sellerObj && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between my-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#0284c7] text-white flex items-center justify-center font-extrabold text-sm shadow-2xs shrink-0 overflow-hidden border border-sky-200">
                        {sellerObj.logo ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={sellerObj.logo} alt={sellerObj.shopName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{sellerObj.shopName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-gray-500 font-medium block leading-none">Sold by</span>
                        <span className="font-extrabold text-xs text-gray-900 truncate block mt-0.5">{sellerObj.shopName}</span>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500">
                          <span className="text-emerald-700 font-bold">★ {sellerObj.rating || 4.9} (98% Positive)</span>
                          <span>·</span>
                          <span>{sellerObj.followerCount || 120} Followers</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleFollowShop(sellerObj.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                          isShopFollowed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        {isShopFollowed ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 text-[#0284c7]" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setActiveProductModal(null);
                          router.push(`/shop/${sellerObj.slug}`);
                        }}
                        className="text-xs bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Visit</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Variants Selection */}
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
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
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
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-2xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1 text-xs font-bold text-gray-800 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                        className="flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-sm py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer active:scale-98"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>{t('buyNow')} (Direct Cash on Delivery)</span>
                      </button>
                    )}

                    {settings?.isAddToCartEnabled !== false && (
                      <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="flex-1 bg-[#f85606] hover:bg-[#d94803] text-white font-extrabold text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer active:scale-98"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{t('addToCart')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3 rounded-xl border transition-colors flex items-center justify-center cursor-pointer ${
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
              </div>

              {/* AFFILIATE PROGRAM: GET AFFILIATE LINK & EARN 10% (ONLY FOR LOGGED-IN USERS WITH MATCHING ACTIVE AFFILIATE ACCOUNT) */}
              {userActiveAffiliate && (
                <div className="mt-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-2xl p-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Coins className="w-4 h-4 text-yellow-300" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-gray-900 flex items-center gap-1.5 flex-wrap">
                          <span>Earn 10% Affiliate Commission</span>
                          <span className="text-[10px] text-blue-700 font-black bg-white px-2 py-0.5 rounded-full border border-blue-200">
                            ৳{Math.round(effectivePrice * 0.1)} / sale
                          </span>
                        </div>
                        <p className="text-[10.5px] text-gray-500 mt-0.5">
                          Active Affiliate: <strong className="text-blue-700">{userActiveAffiliate.name}</strong> ({userActiveAffiliate.code})
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsAffiliateWidgetOpen(!isAffiliateWidgetOpen)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <span>{isAffiliateWidgetOpen ? 'Hide Link' : 'Get Link'}</span>
                    </button>
                  </div>

                  {isAffiliateWidgetOpen && (
                    <div className="mt-3 pt-3 border-t border-blue-200/80 space-y-2 text-xs">
                      {(() => {
                        const affCode = userActiveAffiliate.code;
                        const linkUrl = `/product/${product.slug || product.id}?ref=${affCode}`;
                        const fullShareUrl = typeof window !== 'undefined' ? `${window.location.origin}${linkUrl}` : linkUrl;

                        return (
                          <>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                readOnly
                                value={fullShareUrl}
                                className="flex-1 p-2 bg-white border border-blue-200 rounded-xl text-xs font-mono text-gray-800 select-all"
                              />
                              <button
                                onClick={() => {
                                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                    navigator.clipboard.writeText(fullShareUrl);
                                    showToast('Affiliate product link copied to clipboard!', 'success');
                                  }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </button>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10.5px] text-gray-500">
                                10% Commission auto-tracked on order completion
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    const text = encodeURIComponent(`Check out this product on QUATRO: ${product.title} `);
                                    window.open(`https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(fullShareUrl)}`, '_blank');
                                  }}
                                  className="bg-emerald-600 text-white text-[10.5px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                                >
                                  <span>WhatsApp</span>
                                </button>
                                <Link
                                  href="/affiliate/dashboard"
                                  className="text-[10.5px] text-blue-600 font-extrabold hover:underline"
                                >
                                  Dashboard &rarr;
                                </Link>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Tabs: Description, Specs, Reviews & Q&A */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {/* Tab navigation */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-4 overflow-x-auto scrollbar-thin">
              <button
                onClick={() => setActiveTab('desc')}
                className={`px-4 py-2 rounded-t text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'desc'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                {t('productDescription')}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 rounded-t text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                {t('specifications')}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-t text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>{t('customerReviews')} ({allReviews.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('qna')}
                className={`px-4 py-2 rounded-t text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'qna'
                    ? 'border-[#0284c7] text-[#0284c7]'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                <span>Q&amp;A / {language === 'bn' ? 'প্রশ্ন ও উত্তর' : 'Questions'} ({productQuestions.length})</span>
              </button>
            </div>

            {/* Tab 1: Description */}
            {activeTab === 'desc' && (
              <div className="prose prose-sm max-w-none text-gray-700 text-[13px] leading-relaxed">
                <p>{product.description}</p>
                {product.descriptionBn && (
                  <p className="mt-2 text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                    বাংলা বিবরণ: {product.descriptionBn}
                  </p>
                )}
              </div>
            )}

            {/* Tab 2: Specifications */}
            {activeTab === 'specs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-gray-200 divide-y divide-gray-200 rounded-lg overflow-hidden">
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

            {/* FEATURE 4: ENHANCED REVIEWS WITH STAR BREAKDOWN & PHOTO UPLOAD */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Overview Card */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 text-center md:border-r border-gray-200 md:pr-4">
                    <span className="text-4xl font-black text-gray-900 block">{product.rating.toFixed(1)}</span>
                    <div className="flex justify-center text-amber-400 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-semibold block">{allReviews.length} Verified Reviews</span>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="mt-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-black py-2 px-4 rounded-lg shadow-2xs transition-all cursor-pointer"
                    >
                      {showReviewForm ? 'Cancel' : '✍️ Write a Review'}
                    </button>
                  </div>

                  {/* Star Distribution Progress Bars */}
                  <div className="md:col-span-8 space-y-1.5 text-xs">
                    {starCounts.map(({ stars, count, percent }) => (
                      <div
                        key={stars}
                        onClick={() => setSelectedStarFilter(selectedStarFilter === stars ? 'all' : stars)}
                        className={`flex items-center gap-2 cursor-pointer p-1 rounded transition-colors ${
                          selectedStarFilter === stars ? 'bg-sky-100/70 font-bold' : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className="w-10 text-gray-700 font-semibold">{stars} Star</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-gray-500 tabular-nums">{count} ({percent}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Submission Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-3">
                    <h4 className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#0284c7]" />
                      <span>{language === 'bn' ? 'আপনার রেটিং ও ফটো রিভিউ দিন' : 'Rate & Review this Product'}</span>
                    </h4>

                    {/* Star Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">Rating:</span>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 cursor-pointer hover:scale-110 transition-transform"
                          >
                            <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-black text-[#0284c7] ml-2">{reviewRating} out of 5</span>
                    </div>

                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="পণ্যটির গুণমান, ডেলিভারি এবং আপনার মতামত বিস্তারিত লিখুন..."
                      rows={3}
                      className="w-full bg-white p-3 rounded-lg border border-gray-300 text-xs text-gray-800 outline-none focus:border-[#0284c7]"
                      required
                    />

                    {/* Photo Upload for Unboxing / Real Product */}
                    <div className="flex items-center gap-3">
                      <label className="bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold py-2 px-3 rounded-lg border border-gray-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer">
                        <Camera className="w-3.5 h-3.5 text-[#0284c7]" />
                        <span>{isUploadingPhoto ? 'Uploading Photo...' : 'Attach Unboxing Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={isUploadingPhoto}
                        />
                      </label>

                      {reviewImageUrls.map((url, i) => (
                        <div key={i} className="relative w-10 h-10 rounded border border-gray-300 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="Attached" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-black py-2.5 px-6 rounded-lg shadow-2xs transition-all cursor-pointer"
                    >
                      {language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                    </button>
                  </form>
                )}

                {/* Filter pill */}
                {selectedStarFilter !== 'all' && (
                  <div className="flex items-center justify-between text-xs bg-sky-50 p-2 rounded-lg border border-sky-100">
                    <span>Showing {selectedStarFilter}-Star reviews</span>
                    <button
                      onClick={() => setSelectedStarFilter('all')}
                      className="text-[#0284c7] font-bold hover:underline"
                    >
                      Show All
                    </button>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-gray-900">{rev.userName}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Verified Purchase ({rev.userCity})</span>
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

                        <p className="text-xs text-gray-700 leading-normal whitespace-pre-line">{rev.comment}</p>

                        {rev.images && rev.images.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {rev.images.map((img, i) => (
                              <div key={i} className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img}
                                  alt="Customer unboxing photo"
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
                      No customer reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* FEATURE 5: PRODUCT Q&A (CUSTOMER QUESTIONS & SELLER REPLIES) */}
            {activeTab === 'qna' && (
              <div className="space-y-6">
                {/* Ask Question Box */}
                <form onSubmit={handleQuestionSubmit} className="p-4 bg-sky-50/60 border border-sky-200 rounded-xl space-y-3">
                  <h4 className="font-black text-xs text-gray-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-[#0284c7]" />
                    <span>{language === 'bn' ? 'সেলারকে পণ্য সম্পর্কে সরাসরি প্রশ্ন করুন' : 'Ask Seller a Question about this Product'}</span>
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="যেমন: এই পণ্যটির গ্যারান্টি কত দিনের? স্টক আছে কি না?"
                      className="flex-1 bg-white px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#0284c7] outline-none font-medium"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingQna}
                      className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-black px-4 py-2 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      {language === 'bn' ? 'প্রশ্ন পাঠান' : 'Ask'}
                    </button>
                  </div>
                </form>

                {/* Questions List */}
                <div className="space-y-4">
                  {productQuestions.length > 0 ? (
                    productQuestions.map((q) => (
                      <div key={q.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-sky-100 text-[#0284c7] font-black text-[10px] flex items-center justify-center shrink-0">
                            Q
                          </span>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{q.question}</p>
                            <span className="text-[10px] text-gray-400">Asked by {q.userName} · {q.createdAt}</span>
                          </div>
                        </div>

                        {q.answer ? (
                          <div className="ml-7 p-3 bg-white rounded-lg border border-emerald-200 text-xs flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0">
                              A
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium leading-relaxed">{q.answer}</p>
                              <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                                ✓ Answered by {sellerObj?.shopName || 'Shop Seller'} · {q.answeredAt || 'Verified'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="ml-7 text-[11px] text-gray-400 italic">
                            ⏳ Waiting for seller response...
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-gray-500">
                      <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p>কোনো প্রশ্ন নেই এখনো। আপনার প্রশ্ন থাকলে সেলারকে জিজ্ঞেস করুন!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* FEATURE 6: "YOU MAY ALSO LIKE" RELATED PRODUCTS CAROUSEL */}
          {relatedProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0284c7]" />
                  <h3 className="font-black text-sm text-gray-900">
                    {language === 'bn' ? 'অনুরূপ অন্যান্য পণ্য (You May Also Like)' : 'You May Also Like'}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.map((relProd) => (
                  <div
                    key={relProd.id}
                    onClick={() => setActiveProductModal(relProd)}
                    className="bg-white rounded-xl border border-gray-200 hover:border-[#0284c7] p-2.5 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={relProd.media[0]?.url || 'https://picsum.photos/seed/rel/300/300'}
                          alt={relProd.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {relProd.discountPercent > 0 && (
                          <span className="absolute top-1 left-1 bg-[#0284c7] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                            -{relProd.discountPercent}%
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-gray-800 line-clamp-2 leading-tight group-hover:text-[#0284c7]">
                        {language === 'bn' ? relProd.titleBn : relProd.title}
                      </h4>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="font-black text-xs text-[#0284c7] tabular-nums">
                        {formatPrice(relProd.price)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(relProd, 1);
                        }}
                        className="p-1.5 rounded-lg bg-sky-50 text-[#0284c7] hover:bg-[#0284c7] hover:text-white transition-colors cursor-pointer"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
