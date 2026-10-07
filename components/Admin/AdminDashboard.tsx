'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Product, OrderStatus, GatewayAccountType, PaymentGatewayConfig, Order } from '@/lib/types/ecommerce';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Store,
  Layers,
  Sparkles,
  CreditCard,
  Settings,
  Phone,
  Mail,
  MapPin,
  Truck,
  Check,
  ShieldCheck,
  Zap,
  Tag,
  MessageCircle,
  Clock,
  Download,
  Copy,
  FileSpreadsheet,
  UserCheck,
  Shield,
  Key,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Coins,
  ShieldAlert
} from 'lucide-react';
import { FooterLinksManager } from './FooterLinksManager';
import { FooterFeaturesManager } from './FooterFeaturesManager';
import { DeliveryPartnerManager } from './DeliveryPartnerManager';
import { SellerManager } from './SellerManager';
import AdminFinancialDashboard from './AdminFinancialDashboard';
import { UnifiedUserManager } from './UnifiedUserManager';
import { AdminAffiliateManager } from './AdminAffiliateManager';
import { CourierDispatchModal } from '@/components/Orders/CourierDispatchModal';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    addCategory,
    deleteCategory,
    orders,
    formatPrice,
    updateOrderStatus,
    updatePaymentStatus,
    updateOrderTracking,
    addProduct,
    updateProduct,
    deleteProduct,
    approveReview,
    settings,
    updateSettings,
    gateways,
    addGateway,
    updateGateway,
    deleteGateway,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    setIsAdminView,
    showToast,
    leads,
    addLead,
    updateLead,
    deleteLead,
    subAgents,
    addSubAgent,
    updateSubAgent,
    deleteSubAgent,
    currentSubAgent,
    setCurrentSubAgent,
    liveChats,
    replyToLiveChat,
    setIsAuthModalOpen,
    setAuthModalTab,
    user,
    logout,
    sellers,
    depositRequests,
    language
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'flashsale' | 'coupons' | 'banners' | 'gateways' | 'orders' | 'reviews' | 'settings' | 'leads' | 'subagents' | 'livechat' | 'sellers' | 'financials' | 'users' | 'affiliates'
  >('overview');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTopActionsOpen, setIsTopActionsOpen] = useState(false);

  const [manualSubAgentOverride, setManualSubAgentOverride] = useState<boolean | null>(null);
  const isSubAgent = manualSubAgentOverride !== null ? manualSubAgentOverride : Boolean(currentSubAgent);
  const setIsSubAgent = (val: boolean) => setManualSubAgentOverride(val);

  const [productSearch, setProductSearch] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [dispatchingOrder, setDispatchingOrder] = useState<Order | null>(null);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newStock, setNewStock] = useState('20');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.id || 'cat-electronics');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [img1, setImg1] = useState('');
  const [img2, setImg2] = useState('');
  const [img3, setImg3] = useState('');
  const [img4, setImg4] = useState('');
  const [img5, setImg5] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRating, setNewRating] = useState('4.8');
  const [newSoldCount, setNewSoldCount] = useState('45');
  const [newReviewCount, setNewReviewCount] = useState('18');
  const [isFlashSale, setIsFlashSale] = useState(false);

  // Category state
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catNameBn, setCatNameBn] = useState('');
  const [catIcon, setCatIcon] = useState('ShoppingBag');
  const [catSubs, setCatSubs] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');
  const [catCommissionRate, setCatCommissionRate] = useState('10');

  // Banner state
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerBadge, setBannerBadge] = useState('MEGA DEAL');
  const [bannerLink, setBannerLink] = useState('all');
  const [bannerCta, setBannerCta] = useState('Shop Now');
  const [bannerCategoryId, setBannerCategoryId] = useState<string>('all');
  const [bannerType, setBannerType] = useState<'slider' | 'bottom'>('slider');

  // Gateway form state
  const [isAddGwOpen, setIsAddGwOpen] = useState(false);
  const [gwName, setGwName] = useState('bKash (Personal)');
  const [gwType, setGwType] = useState<GatewayAccountType>('Personal');
  const [gwNumber, setGwNumber] = useState('');
  const [gwInstructions, setGwInstructions] = useState('');
  const [gwBadge, setGwBadge] = useState('Send Money');
  const [gwLogoUrl, setGwLogoUrl] = useState('');

  // Contact settings state
  const [storePhone, setStorePhone] = useState(settings.supportPhone);
  const [storeEmail, setStoreEmail] = useState(settings.supportEmail);
  const [storeAddress, setStoreAddress] = useState(settings.officeAddress);
  const [storeNotice, setStoreNotice] = useState(settings.helplineNotice);
  const [storeLogoUrl, setStoreLogoUrl] = useState(settings.siteLogoUrl || '');
  const [aboutUs, setAboutUs] = useState(settings.aboutUsContent || '');
  const [privacyPolicy, setPrivacyPolicy] = useState(settings.privacyPolicyContent || '');
  const [terms, setTerms] = useState(settings.termsConditionsContent || '');
  const [careers, setCareers] = useState(settings.careersContent || '');

  // Seller Portal Branding State
  const [sellerName, setSellerName] = useState(settings.sellerPortalName || 'QUATRO Seller Center');
  const [sellerLogoUrl, setSellerLogoUrl] = useState(settings.sellerPortalLogoUrl || '');
  const [sellerHotline, setSellerHotline] = useState(settings.sellerPortalHotline || '+880 9612-444888');
  const [sellerEmail, setSellerEmail] = useState(settings.sellerPortalEmail || 'seller-support@quatro.com.bd');
  const [sellerBannerText, setSellerBannerText] = useState(settings.sellerPortalBannerText || 'Grow Your Business Across All 64 Districts of Bangladesh');
  const [sellerStatBuyers, setSellerStatBuyers] = useState(settings.sellerStatBuyers || '10M+ Monthly Active Buyers');
  const [sellerStatFee, setSellerStatFee] = useState(settings.sellerStatFee || '৳0 Fee (Free Registration)');
  const [sellerStatPayout, setSellerStatPayout] = useState(settings.sellerStatPayout || '7 Days Guaranteed Payout Cycle');

  // Seller Dynamic Onboarding Steps
  const [sellerOnboardingStep1Title, setSellerOnboardingStep1Title] = useState(settings.sellerOnboardingStep1Title || '1. Register Your Shop');
  const [sellerOnboardingStep1Desc, setSellerOnboardingStep1Desc] = useState(settings.sellerOnboardingStep1Desc || 'Provide your shop name, owner contact details, address, and payout account (bKash, Nagad, or Bank). Your request is verified within hours.');
  const [sellerOnboardingStep2Title, setSellerOnboardingStep2Title] = useState(settings.sellerOnboardingStep2Title || '2. Upload Products');
  const [sellerOnboardingStep2Desc, setSellerOnboardingStep2Desc] = useState(settings.sellerOnboardingStep2Desc || 'Add titles, multiple images, video preview, prices, discount offers, stock quantities, and variants using our compact Seller Center dashboard.');
  const [sellerOnboardingStep3Title, setSellerOnboardingStep3Title] = useState(settings.sellerOnboardingStep3Title || '3. Start Earning & Payouts');
  const [sellerOnboardingStep3Desc, setSellerOnboardingStep3Desc] = useState(settings.sellerOnboardingStep3Desc || 'Receive orders from buyers nationwide. Pack items, hand over to courier agents, and withdraw net earnings directly to your mobile bank account!');

  // Seller Dynamic Value Propositions
  const [sellerValueProp1Title, setSellerValueProp1Title] = useState(settings.sellerValueProp1Title || 'Guaranteed Weekly Payouts');
  const [sellerValueProp1Desc, setSellerValueProp1Desc] = useState(settings.sellerValueProp1Desc || 'Withdraw your earnings hassle-free directly to bKash, Nagad, or any Bangladeshi bank.');
  const [sellerValueProp2Title, setSellerValueProp2Title] = useState(settings.sellerValueProp2Title || '64 District Delivery Network');
  const [sellerValueProp2Desc, setSellerValueProp2Desc] = useState(settings.sellerValueProp2Desc || 'Integrated courier pickup agents collect parcels directly from your shop or warehouse.');
  const [sellerValueProp3Title, setSellerValueProp3Title] = useState(settings.sellerValueProp3Title || 'Powerful Seller Analytics');
  const [sellerValueProp3Desc, setSellerValueProp3Desc] = useState(settings.sellerValueProp3Desc || 'Track total pieces sold, net income, top products, low stock alerts, and CSV sales reports.');
  const [sellerValueProp4Title, setSellerValueProp4Title] = useState(settings.sellerValueProp4Title || '24/7 Merchant Support');
  const [sellerValueProp4Desc, setSellerValueProp4Desc] = useState(settings.sellerValueProp4Desc || 'Dedicated key account managers and WhatsApp hotline to assist you with sales growth.');

  // Seller Commission Rates Table & FAQs
  const [sellerCommissionsList, setSellerCommissionsList] = useState(
    settings.sellerCategoryCommissions && settings.sellerCategoryCommissions.length > 0
      ? settings.sellerCategoryCommissions
      : [
          { categoryName: 'Consumer Electronics & Gadgets', listingFee: 'FREE (৳0)', commissionPercent: 5.0, payoutCycle: 'Weekly (Every Monday)' },
          { categoryName: 'Fashion & Apparel', listingFee: 'FREE (৳0)', commissionPercent: 8.0, payoutCycle: 'Weekly (Every Monday)' },
          { categoryName: 'Health & Beauty', listingFee: 'FREE (৳0)', commissionPercent: 6.0, payoutCycle: 'Weekly (Every Monday)' },
          { categoryName: 'Home & Kitchen Essentials', listingFee: 'FREE (৳0)', commissionPercent: 7.0, payoutCycle: 'Weekly (Every Monday)' },
          { categoryName: 'Groceries & Daily Mart', listingFee: 'FREE (৳0)', commissionPercent: 4.0, payoutCycle: 'Weekly (Every Monday)' }
        ]
  );

  const [sellerFaqsList, setSellerFaqsList] = useState(
    settings.sellerFaqs && settings.sellerFaqs.length > 0
      ? settings.sellerFaqs
      : [
          {
            q: 'How long does the seller approval process take?',
            a: 'After submitting your registration form with shop name, owner details, and payout method, our merchant verification team reviews it within 2 to 6 hours. You will receive an immediate notification once approved.'
          },
          {
            q: 'What documents or credentials do I need to register?',
            a: 'You only need a valid Bangladeshi phone number, email address, shop location, and a bKash, Nagad, or Bank account for payouts. NID or Trade License is optional but speeds up verification.'
          },
          {
            q: 'When and how do I receive payments for sold items?',
            a: 'Funds become available 7 days after the customer receives the item (matching our 7-day return policy). You can request withdrawals anytime via bKash, Nagad, or direct Bank transfer with minimum payout threshold of ৳500.'
          },
          {
            q: 'Are there any upfront listing fees or hidden charges?',
            a: 'No! Listing products on QUATRO is 100% free with 0 upfront cost. Platform commission is deducted only when you make a successful sale.'
          },
          {
            q: 'How are orders delivered to customers across Bangladesh?',
            a: 'QUATRO integrates directly with Steadfast Courier Express API (as well as Pathao & RedX). When an order is placed, you confirm it in the seller dashboard, get an instant Steadfast Consignment Tracking Code, print the dispatch memo, and the rider picks it up from your shop!'
          }
        ]
  );

  const [sellerEmpoweringStatement, setSellerEmpoweringStatement] = useState(
    settings.sellerEmpoweringStatement || 'Empowering 15,000+ local sellers, MSMEs and brands across all 64 districts in Bangladesh with cutting-edge technology, instant payouts and national logistics.'
  );

  const [sellerLogisticsPartnersStr, setSellerLogisticsPartnersStr] = useState(
    (settings.sellerLogisticsPartners && settings.sellerLogisticsPartners.length > 0
      ? settings.sellerLogisticsPartners
      : ['Steadfast Express API (Integrated 24h)', 'Pathao Express Nationwide', 'RedX & Paperfly Doorstep Pickup', 'Automatic Consignment Tracking Codes']
    ).join(', ')
  );

  const [sellerPaymentChannelsStr, setSellerPaymentChannelsStr] = useState(
    (settings.sellerPaymentChannels && settings.sellerPaymentChannels.length > 0
      ? settings.sellerPaymentChannels
      : ['Weekly Automated Settlements', 'Direct bKash Merchant / Personal Payouts', 'Nagad & Rocket Instant Transfer', 'BEFTN / NPSB Direct Bank Transfer']
    ).join(', ')
  );

  // New Commission Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newListingFee, setNewListingFee] = useState('FREE (৳0)');
  const [newCommissionPercent, setNewCommissionPercent] = useState('5.0');
  const [newPayoutCycle, setNewPayoutCycle] = useState('Weekly (Every Monday)');

  // New FAQ Form State
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Sub-Agent Portal Branding State
  const [subAgentPortalTitle, setSubAgentPortalTitle] = useState(settings.subAgentPortalName || 'QUATRO Staff & Sub-Agent Portal');
  const [subAgentPortalLogo, setSubAgentPortalLogo] = useState(settings.subAgentPortalLogoUrl || '');
  const [subAgentHotline, setSubAgentHotline] = useState(settings.subAgentPortalHotline || '16124');
  const [subAgentEmail, setSubAgentEmail] = useState(settings.subAgentPortalEmail || 'agent-support@quatro.com.bd');

  // Tracking updater state
  const [trackingModalOrder, setTrackingModalOrder] = useState<string | null>(null);
  const [courierName, setCourierName] = useState('Pathao Express');
  const [trackingNote, setTrackingNote] = useState('Dispatched from Dhaka Sorting Hub');
  const [trackingLocation, setTrackingLocation] = useState('Dhaka Central Hub');

  // Firebase Registered Users & Sellers State for Overview
  const [overviewUsers, setOverviewUsers] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadAdminUsers() {
      try {
        const res = await fetch('/api/admin/users?role=ALL');
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.users)) {
          setOverviewUsers(data.users);
        }
      } catch {
        // silent fallback
      }
    }
    loadAdminUsers();
    return () => { isMounted = false; };
  }, [activeTab, sellers.length]);

  // Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered');
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending');
  const processingOrders = orders.filter(
    (o) => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing' || o.orderStatus === 'Shipped'
  );
  const totalPendingRevenue = pendingOrders.reduce((sum, ord) => sum + ord.total, 0);
  const totalDeliveredRevenue = completedOrders.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter((p) => p.stock < 10);
  const allReviews = products.flatMap((p) =>
    (p.reviews || []).map((r) => ({ ...r, productTitle: p.title }))
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubAgent) {
      showToast('Action Denied: Only Super Admin can create products', 'error');
      return;
    }
    if (!newTitle || !newPrice) {
      showToast('Please provide at least a product title and price', 'error');
      return;
    }

    const priceNum = parseFloat(newPrice);
    const origPriceNum = newOriginalPrice ? parseFloat(newOriginalPrice) : priceNum * 1.25;
    const discount = Math.max(0, Math.round(((origPriceNum - priceNum) / origPriceNum) * 100));

    addProduct({
      title: newTitle,
      titleBn: newTitleBn || newTitle,
      description: newDescription || 'Premium product available on QUATRO.',
      descriptionBn: 'বাজারবিডিতে পাওয়া যাচ্ছে চমৎকার এই পণ্যটি।',
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent: discount,
      stock: parseInt(newStock) || 15,
      brand: newBrand || 'QUATRO Exclusive',
      categoryId: newCategory,
      rating: Math.min(5, Math.max(1, parseFloat(newRating) || 4.8)),
      soldCount: Math.max(0, parseInt(newSoldCount) || 0),
      reviewCount: Math.max(0, parseInt(newReviewCount) || 15),
      isFeatured: true,
      isFlashSale,
      flashSaleEnd: isFlashSale ? new Date(Date.now() + 24 * 3600 * 1000).toISOString() : undefined,
      tags: newKeywords ? newKeywords.split(',').map((k) => k.trim()).filter(Boolean) : undefined,
      videoUrl: newVideoUrl || undefined,
      specifications: {
        'Quality': 'Guaranteed Original',
        'Delivery': 'Nationwide Courier',
        'Warranty': '7 Days Replacement'
      },
      media: [img1, img2, img3, img4, img5]
        .map((url) => url.trim())
        .filter(Boolean)
        .map((url, idx) => ({
          id: `med-${Date.now()}-${idx}`,
          url,
          type: 'IMAGE' as const,
          isThumbnail: idx === 0
        })).concat(
          [img1, img2, img3, img4, img5].filter(Boolean).length === 0
            ? [{
                id: `med-${Date.now()}`,
                url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
                type: 'IMAGE' as const,
                isThumbnail: true
              }]
            : []
        )
    });

    setNewTitle('');
    setNewTitleBn('');
    setNewKeywords('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewBrand('');
    setNewImageUrl('');
    setImg1('');
    setImg2('');
    setImg3('');
    setImg4('');
    setImg5('');
    setNewVideoUrl('');
    setNewDescription('');
    setIsAddProductOpen(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubAgent) {
      showToast('Action Denied: Sub-Agents are not authorized to create categories', 'error');
      return;
    }
    if (!catName || !catNameBn) {
      showToast('Please provide English and Bangla names for the category', 'error');
      return;
    }

    const subArr = catSubs
      ? catSubs.split(',').map((s, i) => {
          const clean = s.trim();
          return {
            id: `sub-${Date.now()}-${i}`,
            name: clean,
            nameBn: clean,
            slug: clean.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          };
        })
      : [];

    const commissionValue = Number(catCommissionRate) || 10;
    const generatedCatId = `cat-${catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    addCategory({
      name: catName,
      nameBn: catNameBn,
      iconName: catIcon,
      image: catImageUrl.trim() || undefined,
      commission: commissionValue,
      subcategories: subArr
    });

    // Sync Category Commission with API & Firestore
    fetch('/api/admin/categories/commission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId: generatedCatId, name: catName, commission: commissionValue })
    }).catch(() => {});

    setCatName('');
    setCatNameBn('');
    setCatSubs('');
    setCatImageUrl('');
    setCatCommissionRate('10');
    setIsAddCatOpen(false);
    showToast(`Category added successfully with ${commissionValue}% Commission!`, 'success');
  };

  const handleCreateGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubAgent) {
      showToast('Action Denied: Sub-Agents are not authorized to create payment gateways', 'error');
      return;
    }
    if (!gwNumber) {
      showToast('Please provide an account number for the gateway', 'error');
      return;
    }

    addGateway({
      name: gwName,
      type: gwType,
      accountNumber: gwNumber,
      instructions:
        gwInstructions ||
        `Please send money to our ${gwType} number: ${gwNumber}. Enter TrxID in the box.`,
      isActive: true,
      badge: gwBadge
    });

    setGwNumber('');
    setGwInstructions('');
    setIsAddGwOpen(false);
  };

  // Product edit state - Rating, Stock, Sold count, Flash Sale
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editStock, setEditStock] = useState('20');
  const [editBrand, setEditBrand] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImg1, setEditImg1] = useState('');
  const [editImg2, setEditImg2] = useState('');
  const [editImg3, setEditImg3] = useState('');
  const [editImg4, setEditImg4] = useState('');
  const [editImg5, setEditImg5] = useState('');
  const [editRating, setEditRating] = useState('4.8');
  const [editSoldCount, setEditSoldCount] = useState('0');
  const [editReviewCount, setEditReviewCount] = useState('0');
  const [editIsFlashSale, setEditIsFlashSale] = useState(false);

  // Banner edit state
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [editBannerTitle, setEditBannerTitle] = useState('');
  const [editBannerSubtitle, setEditBannerSubtitle] = useState('');
  const [editBannerBadge, setEditBannerBadge] = useState('');
  const [editBannerImageUrl, setEditBannerImageUrl] = useState('');
  const [editBannerCta, setEditBannerCta] = useState('');
  const [editBannerCategoryId, setEditBannerCategoryId] = useState('all');
  const [editBannerType, setEditBannerType] = useState<'slider' | 'bottom'>('slider');

  // Flash Sale Timer state
  const [flashHours, setFlashHours] = useState((settings.flashSaleHoursLeft ?? 11).toString());
  const [flashMinutes, setFlashMinutes] = useState((settings.flashSaleMinutesLeft ?? 45).toString());

  // WhatsApp settings state
  const [storeWhatsapp, setStoreWhatsapp] = useState(settings.whatsappNumber || '+8801712345678');
  const [storeWhatsappGreeting, setStoreWhatsappGreeting] = useState(
    settings.whatsappGreeting || 'Hello QUATRO! I want to inquire about a product or my order.'
  );
  const [storeCodInstructions, setStoreCodInstructions] = useState(
    settings.codInstructions || 'পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করুন। standard & 24h shipping available.'
  );

  // Coupon form state
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [cpnCode, setCpnCode] = useState('');
  const [cpnType, setCpnType] = useState<'PERCENT' | 'FLAT'>('PERCENT');
  const [cpnValue, setCpnValue] = useState('10');
  const [cpnMinSpend, setCpnMinSpend] = useState('500');
  const [cpnDesc, setCpnDesc] = useState('');

  // Audience & Leads state
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterTab, setLeadFilterTab] = useState<'all' | 'newsletter' | 'buy_intent' | 'phone' | 'email'>('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED'>('all');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [manualLeadName, setManualLeadName] = useState('');
  const [manualLeadPhone, setManualLeadPhone] = useState('');
  const [manualLeadEmail, setManualLeadEmail] = useState('');
  const [manualLeadSource, setManualLeadSource] = useState('Direct Admin Entry');
  const [manualLeadProduct, setManualLeadProduct] = useState('');
  const [manualLeadNote, setManualLeadNote] = useState('');
  const [editingNoteLeadId, setEditingNoteLeadId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  const handleExportCSV = () => {
    if (!leads || leads.length === 0) {
      showToast('No audience leads available to export', 'error');
      return;
    }
    const headers = [
      'Lead ID',
      'Customer Name',
      'Phone Number',
      'Email Address',
      'Source / Campaign',
      'Interested Product',
      'Admin / Customer Note',
      'Lead Status',
      'Created Date'
    ];
    const rows = leads.map((l) => [
      l.id,
      l.name || 'N/A',
      l.phone || 'N/A',
      l.email || 'N/A',
      l.source || 'N/A',
      l.productTitle || 'N/A',
      (l.note || '').replace(/"/g, '""'),
      l.status || 'NEW',
      l.createdAt
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bazaarbd_audience_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audience list exported as CSV spreadsheet!', 'success');
  };

  const handleExportJSON = () => {
    if (!leads || leads.length === 0) {
      showToast('No audience leads available to export', 'error');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `bazaarbd_audience_leads_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audience database exported as JSON!', 'success');
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLeadPhone.trim() && !manualLeadEmail.trim()) {
      showToast('Please provide at least a phone number or email address', 'error');
      return;
    }
    addLead(
      manualLeadEmail.trim() || undefined,
      manualLeadPhone.trim() || undefined,
      manualLeadSource.trim() || 'Direct Admin Entry',
      manualLeadName.trim() || undefined,
      manualLeadNote.trim() || undefined,
      manualLeadProduct.trim() || undefined
    );
    setManualLeadName('');
    setManualLeadPhone('');
    setManualLeadEmail('');
    setManualLeadSource('Direct Admin Entry');
    setManualLeadProduct('');
    setManualLeadNote('');
    setIsAddLeadOpen(false);
  };

  // Sub-Agent Form State
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentPassword, setAgentPassword] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentPermOrders, setAgentPermOrders] = useState(true);
  const [agentPermPayments, setAgentPermPayments] = useState(true);
  const [agentPermChat, setAgentPermChat] = useState(true);
  const [agentPermReviews, setAgentPermReviews] = useState(true);

  // Live Chat Reply State
  const [chatReplyMap, setChatReplyMap] = useState<Record<string, string>>({});

  const handleCreateSubAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubAgent) {
      showToast('Action Denied: Only Super Admin can create sub-agents', 'error');
      return;
    }
    if (!agentName.trim() || !agentEmail.trim() || !agentPassword.trim()) {
      showToast('Please provide Agent Name, Email, and Login Password', 'error');
      return;
    }
    addSubAgent({
      name: agentName.trim(),
      email: agentEmail.trim().toLowerCase(),
      password: agentPassword.trim(),
      phone: agentPhone.trim() || '01700000000',
      role: 'SUB_AGENT',
      permissions: {
        canManageOrders: agentPermOrders,
        canVerifyPayments: agentPermPayments,
        canLiveChat: agentPermChat,
        canModerateReviews: agentPermReviews
      },
      isActive: true
    });
    setAgentName('');
    setAgentEmail('');
    setAgentPassword('');
    setAgentPhone('');
    setIsAddAgentOpen(false);
  };

  const handleSendChatReply = (chatId: string) => {
    if (isSubAgent && currentSubAgent && currentSubAgent.permissions.canLiveChat === false) {
      showToast('Action Denied: You do not have permission to reply to customer live chats', 'error');
      return;
    }
    const text = chatReplyMap[chatId]?.trim();
    if (!text) {
      showToast('Please type a reply message first', 'error');
      return;
    }
    const sender = isSubAgent ? currentSubAgent?.name || 'Support Sub-Agent' : 'Super Admin';
    replyToLiveChat(chatId, text, sender);
    setChatReplyMap((prev) => ({ ...prev, [chatId]: '' }));
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const priceNum = parseFloat(editPrice) || editingProduct.price;
    const origPriceNum = editOriginalPrice ? parseFloat(editOriginalPrice) : editingProduct.originalPrice;
    const stockNum = parseInt(editStock);
    const soldNum = parseInt(editSoldCount);
    const ratingNum = Math.min(5, Math.max(1, parseFloat(editRating) || 4.8));
    const reviewsNum = parseInt(editReviewCount) || editingProduct.reviewCount;

    const mediaList = [editImg1, editImg2, editImg3, editImg4, editImg5]
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url, idx) => ({
        id: `med-${Date.now()}-${idx}`,
        url,
        type: 'IMAGE' as const,
        isThumbnail: idx === 0
      }));

    updateProduct(editingProduct.id, {
      title: editTitle.trim() || editingProduct.title,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent: origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0,
      stock: isNaN(stockNum) ? editingProduct.stock : Math.max(0, stockNum),
      soldCount: isNaN(soldNum) ? editingProduct.soldCount : Math.max(0, soldNum),
      rating: ratingNum,
      reviewCount: reviewsNum,
      isFlashSale: editIsFlashSale,
      brand: editBrand.trim() || editingProduct.brand,
      media: mediaList.length > 0 ? mediaList : editingProduct.media
    });
    setEditingProduct(null);
    showToast(`Product "${editTitle}" updated! Rating: ${ratingNum}★, Sold: ${soldNum}, Stock: ${stockNum} pcs`, 'success');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubAgent) {
      showToast('Action Denied: Sub-Agents are not authorized to create coupons', 'error');
      return;
    }
    if (!cpnCode.trim()) {
      showToast('Please enter a coupon code', 'error');
      return;
    }
    addCoupon({
      code: cpnCode.trim().toUpperCase(),
      discountType: cpnType,
      discountValue: parseFloat(cpnValue) || 10,
      minSpend: cpnMinSpend ? parseFloat(cpnMinSpend) : 0,
      description: cpnDesc.trim() || `${cpnValue}${cpnType === 'PERCENT' ? '%' : '৳'} discount voucher`,
      isActive: true
    });
    setCpnCode('');
    setCpnValue('10');
    setCpnMinSpend('500');
    setCpnDesc('');
    setIsAddCouponOpen(false);
  };

  const handleSaveFlashSaleTimer = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubAgent) {
      showToast('Action Denied: Sub-Agents are not authorized to modify flash sale configurations', 'error');
      return;
    }
    updateSettings({
      flashSaleHoursLeft: parseInt(flashHours) || 12,
      flashSaleMinutesLeft: parseInt(flashMinutes) || 0
    });
    showToast(`Flash Sale countdown timer updated to ${flashHours}h ${flashMinutes}m!`, 'success');
  };

  // Gateway edit state
  const [editingGateway, setEditingGateway] = useState<PaymentGatewayConfig | null>(null);
  const [editGwName, setEditGwName] = useState('');
  const [editGwType, setEditGwType] = useState<GatewayAccountType>('Personal');
  const [editGwNumber, setEditGwNumber] = useState('');
  const [editGwInstructions, setEditGwInstructions] = useState('');
  const [editGwBadge, setEditGwBadge] = useState('');
  const [editGwLogoUrl, setEditGwLogoUrl] = useState('');

  const handleSaveGatewayEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubAgent) {
      showToast('Action Denied: Sub-Agents are not authorized to modify payment gateway configurations', 'error');
      return;
    }
    if (!editingGateway) return;
    updateGateway(editingGateway.id, {
      name: editGwName.trim() || editingGateway.name,
      type: editGwType,
      accountNumber: editGwNumber.trim() || editingGateway.accountNumber,
      instructions: editGwInstructions.trim() || editingGateway.instructions,
      badge: editGwBadge.trim(),
      logoUrl: editGwLogoUrl.trim() || editingGateway.logoUrl
    });
    setEditingGateway(null);
    showToast('Payment gateway updated successfully!', 'success');
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubAgent) {
      showToast('Action Denied: Sub-Agents are not authorized to add banners', 'error');
      return;
    }
    if (!bannerTitle || !bannerImageUrl) {
      showToast('Please provide a banner title and image URL', 'error');
      return;
    }
    addBanner({
      title: bannerTitle,
      subtitle: bannerSubtitle || 'Exclusive discounts across all categories.',
      imageUrl: bannerImageUrl,
      badge: bannerBadge,
      linkUrl: bannerLink,
      ctaText: bannerCta,
      categoryId: bannerCategoryId,
      type: bannerType
    });
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerImageUrl('');
    setBannerCategoryId('all');
    setIsAddBannerOpen(false);
    showToast('Banner added successfully!', 'success');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubAgent) {
      showToast('Action Denied: Sub-Agents are not authorized to modify store configurations', 'error');
      return;
    }
    updateSettings({
      supportPhone: storePhone,
      supportEmail: storeEmail,
      officeAddress: storeAddress,
      helplineNotice: storeNotice,
      whatsappNumber: storeWhatsapp,
      whatsappGreeting: storeWhatsappGreeting,
      flashSaleHoursLeft: parseInt(flashHours) || 12,
      flashSaleMinutesLeft: parseInt(flashMinutes) || 0,
      codInstructions: storeCodInstructions,
      siteLogoUrl: storeLogoUrl,
      sellerPortalName: sellerName,
      sellerPortalLogoUrl: sellerLogoUrl,
      sellerPortalHotline: sellerHotline,
      sellerPortalEmail: sellerEmail,
      sellerPortalBannerText: sellerBannerText,
      sellerStatBuyers: sellerStatBuyers,
      sellerStatFee: sellerStatFee,
      sellerStatPayout: sellerStatPayout,
      sellerOnboardingStep1Title,
      sellerOnboardingStep1Desc,
      sellerOnboardingStep2Title,
      sellerOnboardingStep2Desc,
      sellerOnboardingStep3Title,
      sellerOnboardingStep3Desc,
      sellerValueProp1Title,
      sellerValueProp1Desc,
      sellerValueProp2Title,
      sellerValueProp2Desc,
      sellerValueProp3Title,
      sellerValueProp3Desc,
      sellerValueProp4Title,
      sellerValueProp4Desc,
      sellerCategoryCommissions: sellerCommissionsList,
      sellerFaqs: sellerFaqsList,
      sellerEmpoweringStatement,
      sellerLogisticsPartners: sellerLogisticsPartnersStr.split(',').map((s) => s.trim()).filter(Boolean),
      sellerPaymentChannels: sellerPaymentChannelsStr.split(',').map((s) => s.trim()).filter(Boolean),
      subAgentPortalName: subAgentPortalTitle,
      subAgentPortalLogoUrl: subAgentPortalLogo,
      subAgentPortalHotline: subAgentHotline,
      subAgentPortalEmail: subAgentEmail,
      aboutUsContent: aboutUs,
      privacyPolicyContent: privacyPolicy,
      termsConditionsContent: terms,
      careersContent: careers
    });
    showToast('Store, Seller Center & Sub-Agent Portal settings saved successfully!', 'success');
  };

  const handleAddCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }
    const updated = [
      ...sellerCommissionsList,
      {
        categoryName: newCategoryName.trim(),
        listingFee: newListingFee.trim() || 'FREE (৳0)',
        commissionPercent: parseFloat(newCommissionPercent) || 5.0,
        payoutCycle: newPayoutCycle.trim() || 'Weekly (Every Monday)'
      }
    ];
    setSellerCommissionsList(updated);
    updateSettings({ sellerCategoryCommissions: updated });
    setNewCategoryName('');
    showToast('Category commission rate added successfully!', 'success');
  };

  const handleDeleteCommission = (index: number) => {
    const updated = sellerCommissionsList.filter((_, idx) => idx !== index);
    setSellerCommissionsList(updated);
    updateSettings({ sellerCategoryCommissions: updated });
    showToast('Commission row removed', 'info');
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) {
      showToast('Both Question and Answer are required', 'error');
      return;
    }
    const updated = [...sellerFaqsList, { q: newFaqQ.trim(), a: newFaqA.trim() }];
    setSellerFaqsList(updated);
    updateSettings({ sellerFaqs: updated });
    setNewFaqQ('');
    setNewFaqA('');
    showToast('Seller FAQ added successfully!', 'success');
  };

  const handleDeleteFaq = (index: number) => {
    const updated = sellerFaqsList.filter((_, idx) => idx !== index);
    setSellerFaqsList(updated);
    updateSettings({ sellerFaqs: updated });
    showToast('FAQ removed', 'info');
  };

  const handleRestock = (productId: string) => {
    updateProduct(productId, { stock: 50 });
    showToast('Restocked item with 50 units', 'success');
  };

  const handleSaveTracking = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;
    updateOrderTracking(orderId, courierName, ord.orderStatus, trackingNote, trackingLocation);
    setTrackingModalOrder(null);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12 font-sans">
      {/* Top Admin Bar */}
      <div className="bg-[#0284c7] text-white border-b border-sky-700 shadow-xs relative">
        <div className="max-w-[1240px] mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Brand Name Title: QUATRO Admin */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 text-white flex items-center justify-center font-black">
              <Shield className="w-4 h-4 text-sky-100" />
            </div>
            <h1 className="font-black text-base sm:text-lg tracking-wide uppercase text-white">
              QUATRO Admin
            </h1>
          </div>

          {/* Desktop Right Buttons (hidden on mobile) */}
          <div className="hidden md:flex md:items-center gap-2.5">
            {/* Role selector dropdown */}
            <div className="flex items-center gap-1.5 bg-sky-900/60 px-2 py-1.5 rounded-xl border border-sky-600/50">
              <span className="text-[11px] text-sky-200 font-extrabold ml-1">Access:</span>
              <select
                value={isSubAgent ? 'subagent' : 'admin'}
                onChange={(e) => {
                  const next = e.target.value === 'subagent';
                  setIsSubAgent(next);
                  if (!next) {
                    setCurrentSubAgent(null);
                  }
                  showToast(next ? 'Switched to Sub-Agent Role (Moderation-only)' : 'Switched to Super Admin (Full Access)', 'info');
                }}
                className="bg-sky-950 text-white text-[11px] font-black py-1 px-2.5 rounded-lg cursor-pointer outline-none border border-sky-700/60 focus:border-white"
              >
                <option value="admin">Super Admin (Full Access) 👑</option>
                <option value="subagent">Sub-Agent (Moderator - No Settings/Delete) 👤</option>
              </select>
            </div>

            <button
              onClick={() => {
                setIsSavingAll(true);
                localStorage.setItem('bazaarbd_products', JSON.stringify(products));
                localStorage.setItem('bazaarbd_settings', JSON.stringify(settings));
                localStorage.setItem('bazaarbd_gateways', JSON.stringify(gateways));
                localStorage.setItem('bazaarbd_categories', JSON.stringify(categories));
                localStorage.setItem('bazaarbd_banners', JSON.stringify(banners));
                localStorage.setItem('bazaarbd_coupons', JSON.stringify(coupons));
                localStorage.setItem('bazaarbd_leads', JSON.stringify(leads));
                localStorage.setItem('bazaarbd_subagents', JSON.stringify(subAgents));
                localStorage.setItem('bazaarbd_livechats', JSON.stringify(liveChats));
                localStorage.setItem('bazaarbd_sellers', JSON.stringify(sellers));

                setTimeout(() => {
                  setIsSavingAll(false);
                  showToast(language === 'bn' ? 'সব পরিবর্তন ডাটাবেজে সফলভাবে সেভ করা হয়েছে!' : 'All changes saved successfully to database!', 'success');
                }, 1000);
              }}
              disabled={isSavingAll}
              className={`${
                isSavingAll ? 'bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-500'
              } text-white text-xs font-black px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-80 active:scale-97`}
            >
              {isSavingAll ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-100 shrink-0" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsAdminView(false)}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-white/20"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Log out of account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Mobile Right Quick 3-Line Actions Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => {
                setIsSavingAll(true);
                localStorage.setItem('bazaarbd_products', JSON.stringify(products));
                localStorage.setItem('bazaarbd_settings', JSON.stringify(settings));
                localStorage.setItem('bazaarbd_gateways', JSON.stringify(gateways));
                localStorage.setItem('bazaarbd_categories', JSON.stringify(categories));
                localStorage.setItem('bazaarbd_banners', JSON.stringify(banners));
                localStorage.setItem('bazaarbd_coupons', JSON.stringify(coupons));
                localStorage.setItem('bazaarbd_leads', JSON.stringify(leads));
                localStorage.setItem('bazaarbd_subagents', JSON.stringify(subAgents));
                localStorage.setItem('bazaarbd_livechats', JSON.stringify(liveChats));
                localStorage.setItem('bazaarbd_sellers', JSON.stringify(sellers));

                setTimeout(() => {
                  setIsSavingAll(false);
                  showToast(language === 'bn' ? 'সব পরিবর্তন ডাটাবেজে সফলভাবে সেভ করা হয়েছে!' : 'All changes saved successfully!', 'success');
                }, 1000);
              }}
              disabled={isSavingAll}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              onClick={() => setIsTopActionsOpen(!isTopActionsOpen)}
              className="bg-white/15 hover:bg-white/25 text-white p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 active:scale-95"
              aria-label="Toggle Top Actions Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Quick Actions Panel */}
        {isTopActionsOpen && (
          <div className="md:hidden bg-sky-950 border-t border-sky-800 p-3.5 space-y-2.5 animate-in slide-in-from-top duration-200 shadow-xl">
            <div className="flex items-center justify-between pb-1 border-b border-sky-800">
              <span className="text-[10px] font-black text-sky-300 uppercase tracking-wider">Top Header Quick Actions</span>
              <button
                onClick={() => setIsTopActionsOpen(false)}
                className="text-sky-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Access Role Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-sky-300 uppercase">Access Role</label>
              <select
                value={isSubAgent ? 'subagent' : 'admin'}
                onChange={(e) => {
                  const next = e.target.value === 'subagent';
                  setIsSubAgent(next);
                  if (!next) {
                    setCurrentSubAgent(null);
                  }
                  showToast(next ? 'Switched to Sub-Agent Role (Moderation-only)' : 'Switched to Super Admin (Full Access)', 'info');
                }}
                className="w-full bg-sky-900 text-white text-xs font-bold p-2 rounded-xl border border-sky-700 outline-none"
              >
                <option value="admin">Super Admin (Full Access) 👑</option>
                <option value="subagent">Sub-Agent (Moderator - No Settings/Delete) 👤</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setIsAdminView(false);
                  setIsTopActionsOpen(false);
                }}
                className="w-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2 rounded-xl border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Storefront</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setIsTopActionsOpen(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Agent Operational Banner */}
      {isSubAgent && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-purple-100 px-4 py-2.5 border-b border-purple-750 shadow-xs">
          <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-700/80 text-white flex items-center justify-center shrink-0 border border-purple-500/40">
                <ShieldCheck className="w-4 h-4 text-purple-200" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-xs sm:text-sm text-white">
                    Sub-Agent Staff Session: {currentSubAgent ? currentSubAgent.name : 'Moderator / Operator'}
                  </span>
                  {currentSubAgent?.email && (
                    <span className="text-[11px] text-purple-300 font-mono bg-purple-800/80 px-2 py-0.5 rounded border border-purple-600/40">
                      {currentSubAgent.email}
                    </span>
                  )}
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded font-bold uppercase">
                    Active (Moderator)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={logout}
                className="bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-red-500/50 shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Sub-Agent</span>
              </button>
              <button
                onClick={() => {
                  setCurrentSubAgent(null);
                  setIsSubAgent(false);
                  showToast('Switched to Super Admin Mode (Full Access)', 'info');
                }}
                className="bg-purple-700 hover:bg-purple-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-purple-500/50 shadow-2xs transition-colors cursor-pointer"
              >
                Exit to Super Admin 👑
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1240px] mx-auto px-4 mt-6">
        {/* ===================== MOBILE PHONE HEADER & LEFT SLIDE DRAWER ===================== */}
        {(() => {
          const menuGroups = [
            {
              groupName: 'MAIN DASHBOARD',
              items: [
                { id: 'overview', label: 'Overview', icon: LayoutDashboard, visible: true, badge: null, iconColor: 'text-[#0284c7]' },
                {
                  id: 'users',
                  label: 'Users & Sellers Directory',
                  icon: Users,
                  visible: !isSubAgent,
                  badge: <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">Live</span>,
                  iconColor: 'text-emerald-600',
                },
              ],
            },
            {
              groupName: 'STORE & CATALOG',
              items: [
                { id: 'products', label: `Products (${products.length})`, icon: Package, visible: true, badge: null, iconColor: 'text-sky-600' },
                { id: 'categories', label: `Categories (${categories.length})`, icon: Layers, visible: !isSubAgent, badge: null, iconColor: 'text-indigo-600' },
                { id: 'flashsale', label: `Flash Sale (${products.filter((p) => p.isFlashSale).length})`, icon: Zap, visible: !isSubAgent, badge: null, iconColor: 'text-amber-500' },
                { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag, visible: !isSubAgent, badge: null, iconColor: 'text-emerald-600' },
                { id: 'banners', label: `Banners (${banners.length})`, icon: Sparkles, visible: !isSubAgent, badge: null, iconColor: 'text-purple-600' },
              ],
            },
            {
              groupName: 'ORDERS & CUSTOMERS',
              items: [
                { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart, visible: (!isSubAgent || !currentSubAgent || currentSubAgent.permissions.canManageOrders || currentSubAgent.permissions.canVerifyPayments), badge: null, iconColor: 'text-blue-600' },
                { id: 'reviews', label: `Reviews (${allReviews.length})`, icon: Star, visible: (!isSubAgent || !currentSubAgent || currentSubAgent.permissions.canModerateReviews), badge: null, iconColor: 'text-amber-500' },
                { id: 'leads', label: `Leads (${leads?.length || 0})`, icon: Users, visible: true, badge: null, iconColor: 'text-teal-600' },
                { id: 'livechat', label: `Live Chat (${liveChats?.filter((c) => c.status === 'Open').length || 0})`, icon: MessageCircle, visible: (!isSubAgent || !currentSubAgent || currentSubAgent.permissions.canLiveChat), badge: null, iconColor: 'text-emerald-600' },
              ],
            },
            {
              groupName: 'GATEWAYS & SELLERS',
              items: [
                { id: 'gateways', label: `Gateways (${gateways.length})`, icon: CreditCard, visible: !isSubAgent, badge: null, iconColor: 'text-[#0284c7]' },
                {
                  id: 'sellers',
                  label: `Sellers & Ads (${sellers.length})`,
                  icon: Store,
                  visible: !isSubAgent,
                  badge: depositRequests.filter((d) => d.status === 'PENDING').length > 0 ? (
                    <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                      {depositRequests.filter((d) => d.status === 'PENDING').length} dep
                    </span>
                  ) : null,
                  iconColor: 'text-sky-500',
                },
                { id: 'financials', label: 'Financials & Commission', icon: DollarSign, visible: !isSubAgent, badge: null, iconColor: 'text-emerald-600' },
                { id: 'affiliates', label: 'Affiliates (10%)', icon: Coins, visible: !isSubAgent, badge: null, iconColor: 'text-[#f85606]' },
              ],
            },
            {
              groupName: 'SYSTEM & STAFF',
              items: [
                { id: 'settings', label: 'Store Settings', icon: Settings, visible: !isSubAgent, badge: null, iconColor: 'text-gray-700' },
                { id: 'subagents', label: `Staff Sub-Agents (${subAgents?.length || 0})`, icon: UserCheck, visible: !isSubAgent, badge: null, iconColor: 'text-purple-600' },
              ],
            },
          ];

          const allFlatTabs = menuGroups.flatMap((g) => g.items);
          const currentTabObj = allFlatTabs.find((t) => t.id === activeTab) || allFlatTabs[0];
          const CurrentIcon = currentTabObj.icon;

          return (
            <>
              {/* Top Mobile Bar with 3-Line Hamburger Button */}
              <div className="md:hidden mb-5">
                <div className="bg-[#0284c7] text-white p-3 rounded-2xl shadow-md flex items-center justify-between">
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="flex items-center gap-2.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border border-white/20"
                    aria-label="Open Admin Menu"
                  >
                    <Menu className="w-5 h-5 shrink-0" />
                    <span>3-Line Menu</span>
                  </button>

                  <div className="flex items-center gap-2 text-right min-w-0 pl-2">
                    <div className="truncate">
                      <p className="text-[9px] text-sky-200 font-bold uppercase tracking-wider">Active Section</p>
                      <p className="text-xs font-black text-white truncate">{currentTabObj.label.split(' (')[0]}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-white text-[#0284c7] flex items-center justify-center shrink-0 shadow-xs">
                      <CurrentIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* LEFT SLIDE-OUT OFF-CANVAS DRAWER (EXACT MATCH TO UPLOADED IMAGE) */}
              {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                  {/* Backdrop Overlay */}
                  <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />

                  {/* Left Drawer Container */}
                  <div className="relative w-[82%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden z-50 animate-in slide-in-from-left duration-300">
                    {/* Drawer Header (Blue top header bar) */}
                    <div className="bg-[#0284c7] text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center font-black">
                          <LayoutDashboard className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="font-black text-sm tracking-wide uppercase">QUATRO MARKETPLACE</h2>
                          <p className="text-[10px] text-sky-200 font-semibold">Admin Panel Control</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                        aria-label="Close menu"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Admin User Welcome Card inside Drawer */}
                    <div className="p-3 bg-sky-50/80 border-b border-sky-100 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#0284c7] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-[10px] font-extrabold text-[#0284c7] uppercase tracking-wider">Welcome Admin</p>
                          <p className="text-xs font-black text-gray-900 truncate">
                            {isSubAgent ? (currentSubAgent?.name || 'Staff Operator') : 'Super Admin Access'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsAdminView(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 cursor-pointer shadow-2xs"
                      >
                        Store
                      </button>
                    </div>

                    {/* Scrollable Drawer Menu Items */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                      {menuGroups.map((group, idx) => {
                        const visibleItems = group.items.filter((item) => item.visible);
                        if (visibleItems.length === 0) return null;

                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                {group.groupName}
                              </span>
                              <span className="text-[10px] font-bold text-gray-400">{visibleItems.length}</span>
                            </div>

                            <div className="space-y-1.5">
                              {visibleItems.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                  <button
                                    key={tab.id}
                                    onClick={() => {
                                      setActiveTab(tab.id as any);
                                      setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                      isActive
                                        ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-xs'
                                        : 'bg-white text-gray-800 border-gray-200/90 hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : tab.iconColor}`} />
                                      <span className="truncate">{tab.label}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {tab.badge}
                                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Drawer Footer Actions */}
                    <div className="p-3 border-t border-gray-200 bg-gray-50/80 shrink-0 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setIsAdminView(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Store className="w-3.5 h-3.5" />
                          <span>Storefront</span>
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 text-center font-bold tracking-tight">
                        © 2026 QUATRO MARKETPLACE LTD.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= DESKTOP HORIZONTAL TABS ================= */}
              <div className="hidden md:flex md:flex-wrap md:items-center border-b border-gray-200 pb-3 mb-6 gap-1.5 sm:gap-2">
                {allFlatTabs
                  .filter((t) => t.visible)
                  .map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-[#0284c7] text-white shadow-xs'
                            : tab.id === 'users'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-extrabold'
                            : 'text-gray-600 hover:bg-gray-100 bg-gray-50/80 border border-gray-200'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : tab.iconColor || ''}`} />
                        <span className="truncate">{tab.label}</span>
                        {tab.badge}
                      </button>
                    );
                  })}
              </div>
            </>
          );
        })()}

        {/* TAB: UNIFIED USERS & SELLERS DIRECTORY (FIREBASE 'users' COLLECTION) */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <UnifiedUserManager />
          </div>
        )}

        {/* TAB: SELLERS & ADS MANAGEMENT */}
        {activeTab === 'sellers' && (
          <div className="space-y-6">
            <SellerManager />
          </div>
        )}

        {/* TAB: FINANCIALS & COMMISSIONS */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            <AdminFinancialDashboard />
          </div>
        )}

        {/* TAB: AFFILIATE PARTNER SYSTEM (STRICT ADMIN ONLY CONTROL) */}
        {activeTab === 'affiliates' && (
          <div className="space-y-6">
            {isSubAgent ? (
              <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3 max-w-xl mx-auto my-12 shadow-sm">
                <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
                <h3 className="text-lg font-black text-rose-900">অ্যাক্সেস সংরক্ষিত: সাব-এজেন্টদের জন্য নিষিদ্ধ</h3>
                <p className="text-xs text-rose-700 leading-relaxed">
                  সাব-এজেন্টরা অ্যাফিলিয়েট সিস্টেম কন্ট্রোল করতে পারবে না। অ্যাফিলিয়েট পার্টনার, কমিশন রুলস এবং পেআউট উইথড্রয়াল ম্যানেজ করার পূর্ণ নিয়ন্ত্রণ শুধুমাত্র সুপার অ্যাডমিন প্যানেলেরই থাকবে।
                </p>
              </div>
            ) : (
              <AdminAffiliateManager />
            )}
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Top Quick Stats Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span>Executive Overview</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                    ● Live System
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  Manage Orders &rarr;
                </button>
                <button
                  onClick={() => setActiveTab('sellers')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  Seller Approvals &rarr;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Total Revenue
                </span>
                <p className="text-xl font-black text-gray-900 mt-1 tabular-nums">
                  {formatPrice(totalRevenue)}
                </p>
                <span className="text-[11px] text-emerald-600 mt-1 block font-bold">
                  Delivered: {formatPrice(totalDeliveredRevenue)}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                  Pending Revenue
                </span>
                <p className="text-xl font-black text-amber-700 mt-1 tabular-nums">
                  {formatPrice(totalPendingRevenue)}
                </p>
                <span className="text-[11px] text-gray-500 mt-1 block font-medium">
                  {pendingOrders.length} orders pending
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                  Completed Orders
                </span>
                <p className="text-xl font-black text-emerald-700 mt-1 tabular-nums">
                  {completedOrders.length} / {totalOrders}
                </p>
                <span className="text-[11px] text-gray-500 mt-1 block font-medium">Delivered successfully</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
                  Processing / Shipped
                </span>
                <p className="text-xl font-black text-purple-700 mt-1 tabular-nums">
                  {processingOrders.length}
                </p>
                <span className="text-[11px] text-gray-500 mt-1 block font-medium">In courier transit</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Low Stock Alerts
                </span>
                <p className="text-xl font-black text-amber-600 mt-1 tabular-nums">
                  {lowStockProducts.length} items
                </p>
                <span className="text-[11px] text-rose-600 mt-1 block font-bold">Requires restocking</span>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-extrabold text-sm text-gray-900">
                    Low Stock &amp; Inventory Alerts
                  </h3>
                </div>
                <span className="text-xs font-bold text-gray-400">
                  {lowStockProducts.length} items below minimum threshold
                </span>
              </div>

              {lowStockProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                        <th className="py-2.5 px-3">Product Name</th>
                        <th className="py-2.5 px-3">Brand</th>
                        <th className="py-2.5 px-3">Current Stock</th>
                        <th className="py-2.5 px-3">Price</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lowStockProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-3 font-medium text-gray-800 flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.media[0]?.url}
                                alt={p.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="truncate max-w-[280px] font-bold">{p.title}</span>
                          </td>
                          <td className="py-2.5 px-3 text-gray-600">{p.brand}</td>
                          <td className="py-2.5 px-3">
                            <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                              {p.stock === 0 ? 'Out of Stock' : `${p.stock} units left`}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-gray-900 tabular-nums">
                            {formatPrice(p.price)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleRestock(p.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              Restock +50
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-3 text-center italic">All product inventory levels are healthy.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <div className="relative flex-1 max-w-[340px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title or brand..."
                  className="w-full text-xs py-2 pl-9 pr-3 rounded-md border border-gray-300 focus:border-[#0284c7] outline-none"
                />
              </div>

              <button
                onClick={() => setIsAddProductOpen(!isAddProductOpen)}
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs py-2 px-4 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddProductOpen ? 'Cancel' : 'Add New Product'}</span>
              </button>
            </div>

            {/* Add Product Form Drawer */}
            {isAddProductOpen && (
              <form
                onSubmit={handleCreateProduct}
                className="bg-white p-5 rounded-xl border-2 border-sky-200 shadow-sm space-y-4 text-xs animate-in fade-in-50 duration-200"
              >
                <h4 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#0284c7]" />
                  <span>Create &amp; Publish New Product</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Product Title (EN) *</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Walton Primo H10 Smartphone"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Product Title (Bangla)</label>
                    <input
                      type="text"
                      value={newTitleBn}
                      onChange={(e) => setNewTitleBn(e.target.value)}
                      placeholder="e.g. ওয়ালটন প্রিমো এইচ১০"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Brand Name *</label>
                    <input
                      type="text"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      placeholder="e.g. Walton / Xiaomi / Samsung"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Selling Price (৳ BDT) *</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="18500"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Original Price (৳ BDT)</label>
                    <input
                      type="number"
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(e.target.value)}
                      placeholder="21500"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Initial Stock (Pieces / কত পিস আছে) *</label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      placeholder="25"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Initial Sold Count (কত বিক্রি হয়েছে)</label>
                    <input
                      type="number"
                      value={newSoldCount}
                      onChange={(e) => setNewSoldCount(e.target.value)}
                      placeholder="45"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-bold text-[#0284c7]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Product Rating (১-৫ স্টার রেটিং)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      placeholder="4.8"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-bold text-amber-600"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Review Count (রিভিউ সংখ্যা)</label>
                    <input
                      type="number"
                      value={newReviewCount}
                      onChange={(e) => setNewReviewCount(e.target.value)}
                      placeholder="18"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="font-semibold text-gray-700 block mb-1">
                      Search Keywords / Tags (সার্চ কিওয়ার্ড ও ট্যাগ - কমা দিয়ে আলাদা করুন)
                    </label>
                    <input
                      type="text"
                      value={newKeywords}
                      onChange={(e) => setNewKeywords(e.target.value)}
                      placeholder="e.g. headphone, wireless, bluetooth, bass, gaming earphone, boat"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-medium"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      💡 ক্রেতারা সার্চ বারে এই কিওয়ার্ডগুলো লিখলে সরাসরি এই প্রোডাক্টটি সার্চ লিস্টে পেয়ে যাবে।
                    </span>
                  </div>

                  <div className="sm:col-span-2 md:col-span-3 space-y-2 p-3 bg-sky-50/50 rounded-lg border border-sky-100">
                    <label className="font-bold text-gray-900 block">
                      Product Images (Up to 5 Images supported for gallery) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      <input
                        type="text"
                        value={img1}
                        onChange={(e) => setImg1(e.target.value)}
                        placeholder="Image 1 (Main Thumbnail) URL *"
                        className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                        required
                      />
                      <input
                        type="text"
                        value={img2}
                        onChange={(e) => setImg2(e.target.value)}
                        placeholder="Image 2 URL"
                        className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                      />
                      <input
                        type="text"
                        value={img3}
                        onChange={(e) => setImg3(e.target.value)}
                        placeholder="Image 3 URL"
                        className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                      />
                      <input
                        type="text"
                        value={img4}
                        onChange={(e) => setImg4(e.target.value)}
                        placeholder="Image 4 URL"
                        className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                      />
                      <input
                        type="text"
                        value={img5}
                        onChange={(e) => setImg5(e.target.value)}
                        placeholder="Image 5 URL"
                        className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Video Demo URL</label>
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://.../video.mp4"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide details..."
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="flash"
                    checked={isFlashSale}
                    onChange={(e) => setIsFlashSale(e.target.checked)}
                    className="accent-[#0284c7]"
                  />
                  <label htmlFor="flash" className="font-semibold text-gray-800 cursor-pointer">
                    Highlight in Flash Sale Countdown
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="py-2 px-4 rounded border border-gray-300 text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2 px-5 rounded shadow-sm"
                  >
                    Save &amp; Publish
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                      <th className="py-3 px-3 whitespace-nowrap">Item</th>
                      <th className="py-3 px-2 whitespace-nowrap">Brand</th>
                      <th className="py-3 px-3 whitespace-nowrap">Rating (রেটিং)</th>
                      <th className="py-3 px-3 whitespace-nowrap">Stock (পিস সংখ্যা)</th>
                      <th className="py-3 px-3 whitespace-nowrap">Sold (বিক্রি সংখ্যা)</th>
                      <th className="py-3 px-2 whitespace-nowrap">Flash Sale</th>
                      <th className="py-3 px-3 whitespace-nowrap">Price</th>
                      <th className="py-3 px-3 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-2 px-3 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-2 max-w-[260px]">
                            <div className="w-8 h-8 rounded bg-gray-50 border border-gray-200 overflow-hidden shrink-0 p-0.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.media[0]?.url}
                                alt={p.title}
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-gray-900 truncate text-xs" title={p.title}>
                                {p.title}
                              </p>
                              <span className="text-[9px] font-mono text-gray-400 block">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-gray-700 font-semibold whitespace-nowrap align-middle">{p.brand}</td>

                        {/* Rating Column with quick edit */}
                        <td className="py-2 px-3 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-1">
                            <span className="flex items-center gap-0.5 text-amber-600 font-black text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              <span className="tabular-nums">{p.rating.toFixed(1)}</span>
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">({p.reviewCount})</span>
                            <button
                              onClick={() => {
                                const newR = prompt(`Edit rating for "${p.title}" (1.0 to 5.0):`, p.rating.toFixed(1));
                                if (newR !== null) {
                                  const parsed = Math.min(5, Math.max(1, parseFloat(newR) || 4.8));
                                  updateProduct(p.id, { rating: parsed });
                                  showToast(`Rating updated to ${parsed}★`, 'success');
                                }
                              }}
                              className="text-[10px] text-gray-400 hover:text-[#0284c7] p-0.5 rounded hover:bg-sky-50 font-bold cursor-pointer"
                              title="Quick Edit Rating"
                            >
                              ✎
                            </button>
                          </div>
                        </td>

                        {/* Pieces / Stock with quick adjustment buttons */}
                        <td className="py-2 px-3 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-1">
                            <span
                              className={`font-black px-1.5 py-0.5 rounded text-[11px] tabular-nums ${
                                p.stock === 0
                                  ? 'bg-red-100 text-red-700'
                                  : p.stock < 10
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.stock} pcs
                            </span>
                            <button
                              onClick={() => {
                                const newStk = Math.max(0, p.stock - 1);
                                updateProduct(p.id, { stock: newStk });
                              }}
                              className="w-4 h-4 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-[9px] cursor-pointer"
                              title="Minus 1 pc"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => {
                                const newStk = p.stock + 5;
                                updateProduct(p.id, { stock: newStk });
                              }}
                              className="px-1 h-4 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[9px] cursor-pointer"
                              title="Add 5 pcs"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => {
                                const custom = prompt(`Enter exact stock pieces for "${p.title}":`, p.stock.toString());
                                if (custom !== null) {
                                  const parsed = Math.max(0, parseInt(custom) || 0);
                                  updateProduct(p.id, { stock: parsed });
                                  showToast(`Stock updated to ${parsed} pcs`, 'success');
                                }
                              }}
                              className="px-1 h-4 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[9px] cursor-pointer"
                              title="Set exact stock pieces"
                            >
                              Set
                            </button>
                          </div>
                        </td>

                        {/* Sold Count with +5, -5 buttons */}
                        <td className="py-2 px-3 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-1">
                            <span className="font-black bg-sky-50 text-[#0284c7] border border-sky-200 px-1.5 py-0.5 rounded text-[11px] tabular-nums">
                              {p.soldCount} sold
                            </span>
                            <button
                              onClick={() => {
                                const newSold = Math.max(0, p.soldCount - 5);
                                updateProduct(p.id, { soldCount: newSold });
                                showToast(`Sold count decreased to ${newSold}`, 'info');
                              }}
                              className="px-1 h-4 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-[9px] cursor-pointer"
                              title="Minus 5 sold"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => {
                                const newSold = p.soldCount + 5;
                                updateProduct(p.id, { soldCount: newSold });
                                showToast(`Sold count increased to ${newSold}`, 'success');
                              }}
                              className="px-1 h-4 rounded bg-sky-100 hover:bg-sky-200 text-[#0284c7] flex items-center justify-center font-bold text-[9px] cursor-pointer"
                              title="Add 5 sold"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => {
                                const custom = prompt(`Set total sold count for "${p.title}":`, p.soldCount.toString());
                                if (custom !== null) {
                                  const parsed = Math.max(0, parseInt(custom) || 0);
                                  updateProduct(p.id, { soldCount: parsed });
                                  showToast(`Sold count set to ${parsed}`, 'success');
                                }
                              }}
                              className="px-1 h-4 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[9px] cursor-pointer"
                              title="Set exact sold count"
                            >
                              Set
                            </button>
                          </div>
                        </td>

                        {/* Flash Sale Toggle */}
                        <td className="py-2 px-2 whitespace-nowrap align-middle">
                          <button
                            onClick={() => {
                              const next = !p.isFlashSale;
                              updateProduct(p.id, {
                                isFlashSale: next,
                                flashSaleEnd: next ? new Date(Date.now() + 24 * 3600 * 1000).toISOString() : undefined
                              });
                            }}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                              p.isFlashSale
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title="Toggle Flash Sale status"
                          >
                            <Zap className={`w-3 h-3 ${p.isFlashSale ? 'fill-amber-500 text-amber-500' : ''}`} />
                            <span>{p.isFlashSale ? 'Active' : 'Off'}</span>
                          </button>
                        </td>

                        <td className="py-2 px-3 font-bold text-gray-900 tabular-nums whitespace-nowrap align-middle">
                          {formatPrice(p.price)}
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setEditTitle(p.title);
                                setEditPrice(p.price.toString());
                                setEditOriginalPrice((p.originalPrice || Math.round(p.price * 1.25)).toString());
                                setEditStock(p.stock.toString());
                                setEditBrand(p.brand);
                                setEditImageUrl(p.media[0]?.url || '');
                                setEditImg1(p.media[0]?.url || '');
                                setEditImg2(p.media[1]?.url || '');
                                setEditImg3(p.media[2]?.url || '');
                                setEditImg4(p.media[3]?.url || '');
                                setEditImg5(p.media[4]?.url || '');
                                setEditRating(p.rating.toString());
                                setEditSoldCount(p.soldCount.toString());
                                setEditReviewCount((p.reviewCount || 15).toString());
                                setEditIsFlashSale(Boolean(p.isFlashSale));
                              }}
                              className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-[#0284c7] font-bold rounded flex items-center gap-1 text-[11px]"
                              title="Edit Product Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (isSubAgent) {
                                  showToast('Sub-Agents cannot delete products from catalog', 'error');
                                  return;
                                }
                                deleteProduct(p.id);
                              }}
                              className={`p-1 rounded ${isSubAgent ? 'text-gray-300 cursor-not-allowed opacity-50' : 'hover:bg-red-50 text-red-500'}`}
                              title={isSubAgent ? 'Delete (Locked for Sub-Agent)' : 'Delete'}
                              disabled={isSubAgent}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Marketplace Categories</h3>
              </div>

              <button
                onClick={() => setIsAddCatOpen(!isAddCatOpen)}
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs py-2 px-4 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddCatOpen ? 'Cancel' : 'Add New Category'}</span>
              </button>
            </div>

            {isAddCatOpen && (
              <form
                onSubmit={handleCreateCategory}
                className="bg-white p-5 rounded-xl border-2 border-sky-200 shadow-sm space-y-3 text-xs animate-in fade-in-50"
              >
                <h4 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                  Add New Marketplace Category
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Category Name (EN) *
                    </label>
                    <input
                      type="text"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="e.g. Kitchen &amp; Dining"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Category Name (বাংলা) *
                    </label>
                    <input
                      type="text"
                      value={catNameBn}
                      onChange={(e) => setCatNameBn(e.target.value)}
                      placeholder="e.g. রান্নাঘর ও ডাইনিং"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Icon Style</label>
                    <select
                      value={catIcon}
                      onChange={(e) => setCatIcon(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
                    >
                      <option value="Smartphone">Smartphone / Mobile</option>
                      <option value="Headphones">Headphones / Audio</option>
                      <option value="Tv">TV / Appliance</option>
                      <option value="Shirt">Shirt / Fashion</option>
                      <option value="Sparkles">Sparkles / Luxury</option>
                      <option value="ShoppingBag">ShoppingBag / Groceries</option>
                      <option value="HeartHandshake">Heart / Beauty</option>
                      <option value="Activity">Activity / Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Sub-categories (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={catSubs}
                      onChange={(e) => setCatSubs(e.target.value)}
                      placeholder="e.g. Cookware, Cutlery, Storage"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Platform Commission Rate (%) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={catCommissionRate}
                      onChange={(e) => setCatCommissionRate(e.target.value)}
                      placeholder="e.g. 5 or 12"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-bold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">
                      Category Round Logo / Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={catImageUrl}
                      onChange={(e) => setCatImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... (Square or Round image for homepage round filter)"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCatOpen(false)}
                    className="py-2 px-4 rounded border border-gray-300 text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2 px-5 rounded shadow-sm"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            )}

            {/* Categories List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                      <th className="py-3 px-4 whitespace-nowrap">Category Name (EN)</th>
                      <th className="py-3 px-4 whitespace-nowrap">Name (Bangla)</th>
                      <th className="py-3 px-4 whitespace-nowrap">Icon</th>
                      <th className="py-3 px-4 whitespace-nowrap">Commission Rate</th>
                      <th className="py-3 px-4 whitespace-nowrap">Subcategories</th>
                      <th className="py-3 px-4 whitespace-nowrap">Products</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.categoryId === cat.id).length;
                      const commRate =
                        cat.commission ??
                        (cat.id.includes('electronic') || cat.id.includes('accessories')
                          ? 5
                          : cat.id.includes('fashion')
                          ? 12
                          : 10);
                      return (
                        <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-gray-900 whitespace-nowrap align-middle">
                            {cat.name}
                          </td>
                          <td className="py-2.5 px-4 text-gray-700 font-medium whitespace-nowrap align-middle">
                            {cat.nameBn}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-gray-500 whitespace-nowrap align-middle">
                            {cat.iconName}
                          </td>
                          <td className="py-2.5 px-4 whitespace-nowrap align-middle">
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-black text-xs">
                              {commRate}% Commission
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-gray-500 whitespace-nowrap align-middle">
                            <span
                              className="truncate max-w-[260px] block"
                              title={cat.subcategories?.map((s) => s.name).join(', ')}
                            >
                              {cat.subcategories?.map((s) => s.name).join(', ') || 'None'}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-[#0284c7] whitespace-nowrap align-middle">
                            {count} items
                          </td>
                          <td className="py-2.5 px-4 text-right whitespace-nowrap align-middle">
                            <button
                              onClick={() => {
                                if (isSubAgent) {
                                  showToast('Action Denied: Sub-Agents are not authorized to delete categories', 'error');
                                  return;
                                }
                                deleteCategory(cat.id);
                              }}
                              className={`p-1 ${
                                isSubAgent
                                  ? 'text-gray-300 cursor-not-allowed opacity-50'
                                  : 'text-red-500 hover:text-red-700 cursor-pointer'
                              }`}
                              title={isSubAgent ? 'Delete Category (Locked)' : 'Delete Category'}
                              disabled={isSubAgent}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BANNERS MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Hero &amp; Promotional Banners</h3>
              </div>

              <button
                onClick={() => setIsAddBannerOpen(!isAddBannerOpen)}
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs py-2 px-4 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddBannerOpen ? 'Cancel' : 'Add New Banner'}</span>
              </button>
            </div>

            {isAddBannerOpen && (
              <form
                onSubmit={handleCreateBanner}
                className="bg-white p-5 rounded-xl border-2 border-sky-200 shadow-sm space-y-3 text-xs animate-in fade-in-50"
              >
                <h4 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                  Add New Homepage Banner
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Banner Title *</label>
                    <input
                      type="text"
                      value={bannerTitle}
                      onChange={(e) => setBannerTitle(e.target.value)}
                      placeholder="e.g. Eid Mega Flash Sale"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Subtitle / Offer</label>
                    <input
                      type="text"
                      value={bannerSubtitle}
                      onChange={(e) => setBannerSubtitle(e.target.value)}
                      placeholder="e.g. Up to 70% Off on Electronics &amp; Fashion"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={bannerBadge}
                      onChange={(e) => setBannerBadge(e.target.value)}
                      placeholder="e.g. FLASH SALE"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">Banner Image URL *</label>
                    <input
                      type="text"
                      value={bannerImageUrl}
                      onChange={(e) => setBannerImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or paste image link"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={bannerCta}
                      onChange={(e) => setBannerCta(e.target.value)}
                      placeholder="e.g. Shop Now"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Target Category / Placement</label>
                    <select
                      value={bannerCategoryId}
                      onChange={(e) => setBannerCategoryId(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
                    >
                      <option value="all">All / Homepage Banner</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Banner Placement / Type</label>
                    <select
                      value={bannerType}
                      onChange={(e) => setBannerType(e.target.value as 'slider' | 'bottom')}
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
                    >
                      <option value="slider">Top Slider Banner (Header)</option>
                      <option value="bottom">Bottom Deal Banner (Nicher Banner)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddBannerOpen(false)}
                    className="py-2 px-4 rounded border border-gray-300 text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2 px-5 rounded shadow-sm"
                  >
                    Save Banner
                  </button>
                </div>
              </form>
            )}

            {/* Banners Grid */}
            <div className="space-y-6">
              {/* TOP SLIDER BANNERS SECTION */}
              <div>
                <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b pb-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Top Slider Banners (হেডার স্লাইডার ব্যানার)</span>
                  <span className="text-gray-400 font-normal text-[10px]">({banners.filter(b => !b.type || b.type === 'slider').length})</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.filter(b => !b.type || b.type === 'slider').map((b) => (
                    <div key={b.id} className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between">
                      <div className="relative h-40 bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                          <span className="bg-[#0284c7] text-white text-[10px] font-bold px-2 py-0.5 rounded w-max mb-1">
                            {b.badge || 'PROMO'}
                          </span>
                          <h4 className="font-bold text-sm leading-tight">{b.title}</h4>
                          <p className="text-[11px] text-white/80 truncate">{b.subtitle}</p>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500">
                        <div className="flex flex-col gap-0.5">
                          <span>CTA: <strong className="text-gray-800">{b.ctaText}</strong></span>
                          <span>Target: <strong className="text-sky-600 font-bold uppercase">{b.categoryId === 'all' || !b.categoryId ? 'All / Homepage' : categories.find(c => c.id === b.categoryId)?.name || b.categoryId}</strong></span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              setEditingBanner(b);
                              setEditBannerTitle(b.title);
                              setEditBannerSubtitle(b.subtitle || '');
                              setEditBannerBadge(b.badge || '');
                              setEditBannerImageUrl(b.imageUrl);
                              setEditBannerCta(b.ctaText || 'Shop Now');
                              setEditBannerCategoryId(b.categoryId || 'all');
                              setEditBannerType(b.type || 'slider');
                            }}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-[#0284c7] font-bold rounded flex items-center gap-1 text-[11px]"
                            title="Edit Banner Details"
                          >
                            <Edit className="w-3.5 h-3.5 shrink-0" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              if (isSubAgent) {
                                showToast('Action Denied: Sub-Agents are not authorized to delete banners', 'error');
                                return;
                              }
                              deleteBanner(b.id);
                            }}
                            className={`p-1 flex items-center gap-1 font-semibold text-xs ${isSubAgent ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-red-500 hover:text-red-700'}`}
                            disabled={isSubAgent}
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {banners.filter(b => !b.type || b.type === 'slider').length === 0 && (
                    <div className="col-span-2 text-center py-6 bg-gray-50 rounded-lg text-gray-400 font-medium">
                      No top slider banners found.
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM PROMOTIONAL BANNERS SECTION */}
              <div>
                <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b pb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Bottom Deal Banners (নিচের প্রমোশনাল ব্যানার)</span>
                  <span className="text-gray-400 font-normal text-[10px]">({banners.filter(b => b.type === 'bottom').length})</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.filter(b => b.type === 'bottom').map((b) => (
                    <div key={b.id} className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col justify-between">
                      <div className="relative h-40 bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                          <span className="bg-[#0284c7] text-white text-[10px] font-bold px-2 py-0.5 rounded w-max mb-1">
                            {b.badge || 'PROMO'}
                          </span>
                          <h4 className="font-bold text-sm leading-tight">{b.title}</h4>
                          <p className="text-[11px] text-white/80 truncate">{b.subtitle}</p>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500">
                        <div className="flex flex-col gap-0.5">
                          <span>CTA: <strong className="text-gray-800">{b.ctaText}</strong></span>
                          <span>Target: <strong className="text-sky-600 font-bold uppercase">{b.categoryId === 'all' || !b.categoryId ? 'All / Homepage' : categories.find(c => c.id === b.categoryId)?.name || b.categoryId}</strong></span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              setEditingBanner(b);
                              setEditBannerTitle(b.title);
                              setEditBannerSubtitle(b.subtitle || '');
                              setEditBannerBadge(b.badge || '');
                              setEditBannerImageUrl(b.imageUrl);
                              setEditBannerCta(b.ctaText || 'Shop Now');
                              setEditBannerCategoryId(b.categoryId || 'all');
                              setEditBannerType(b.type || 'slider');
                            }}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-[#0284c7] font-bold rounded flex items-center gap-1 text-[11px]"
                            title="Edit Banner Details"
                          >
                            <Edit className="w-3.5 h-3.5 shrink-0" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              if (isSubAgent) {
                                showToast('Action Denied: Sub-Agents are not authorized to delete banners', 'error');
                                return;
                              }
                              deleteBanner(b.id);
                            }}
                            className={`p-1 flex items-center gap-1 font-semibold text-xs ${isSubAgent ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-red-500 hover:text-red-700'}`}
                            disabled={isSubAgent}
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {banners.filter(b => b.type === 'bottom').length === 0 && (
                    <div className="col-span-2 text-center py-6 bg-gray-50 rounded-lg text-gray-400 font-medium">
                      No bottom promotional banners found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT GATEWAYS (Personal / Agent / Merchant) */}
        {activeTab === 'gateways' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Payment Gateways &amp; Wallet Numbers
                </h3>
              </div>

              <button
                onClick={() => setIsAddGwOpen(!isAddGwOpen)}
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs py-2 px-4 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddGwOpen ? 'Cancel' : 'Add Payment Gateway'}</span>
              </button>
            </div>

            {isAddGwOpen && (
              <form
                onSubmit={handleCreateGateway}
                className="bg-white p-5 rounded-xl border-2 border-sky-200 shadow-sm space-y-3 text-xs animate-in fade-in-50"
              >
                <h4 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-100">
                  Add New Payment Gateway &amp; Account Number
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Gateway Provider *
                    </label>
                    <select
                      value={gwName}
                      onChange={(e) => setGwName(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
                    >
                      <option value="bKash (Personal)">bKash (Personal)</option>
                      <option value="bKash (Merchant)">bKash (Merchant)</option>
                      <option value="Nagad (Personal)">Nagad (Personal)</option>
                      <option value="Nagad (Agent)">Nagad (Agent)</option>
                      <option value="Rocket (Personal)">Rocket (Personal)</option>
                      <option value="Rocket (Agent)">Rocket (Agent)</option>
                      <option value="Upay (Personal)">Upay (Personal)</option>
                      <option value="Visa / Mastercard / Debit Card">Visa / Mastercard / Debit Card</option>
                      <option value="Stripe (International Cards)">Stripe (International Cards)</option>
                      <option value="PayPal Checkout">PayPal Checkout</option>
                      <option value="PayTM Wallet">PayTM Wallet</option>
                      <option value="Bank Transfer">City Bank / DBBL Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Account Type *
                    </label>
                    <select
                      value={gwType}
                      onChange={(e) => setGwType(e.target.value as GatewayAccountType)}
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
                    >
                      <option value="Personal">Personal (Send Money)</option>
                      <option value="Agent">Agent (Cash In)</option>
                      <option value="Merchant">Merchant (Payment Gateway)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Wallet / Account Number *
                    </label>
                    <input
                      type="text"
                      value={gwNumber}
                      onChange={(e) => setGwNumber(e.target.value)}
                      placeholder="e.g. 01712-345678"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Badge Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={gwBadge}
                      onChange={(e) => setGwBadge(e.target.value)}
                      placeholder="e.g. 10% Cashback or Send Money"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="font-semibold text-gray-700 block mb-1">
                      Payment Instructions for Customer
                    </label>
                    <input
                      type="text"
                      value={gwInstructions}
                      onChange={(e) => setGwInstructions(e.target.value)}
                      placeholder="e.g. Please Send Money to this Personal number. Enter the Transaction ID (TrxID) below."
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">
                      Gateway Logo URL (bKash, Nagad, etc.)
                    </label>
                    <input
                      type="text"
                      value={gwLogoUrl}
                      onChange={(e) => setGwLogoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or logo link"
                      className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">
                      Quick Logo Presets:
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setGwLogoUrl('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80')}
                        className="px-2 py-1 bg-pink-50 text-pink-700 hover:bg-pink-100 rounded border border-pink-200 text-[11px] font-bold"
                      >
                        bKash Logo
                      </button>
                      <button
                        type="button"
                        onClick={() => setGwLogoUrl('https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80')}
                        className="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 text-[11px] font-bold"
                      >
                        Nagad Logo
                      </button>
                      <button
                        type="button"
                        onClick={() => setGwLogoUrl('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80')}
                        className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded border border-purple-200 text-[11px] font-bold"
                      >
                        Rocket Logo
                      </button>
                      <button
                        type="button"
                        onClick={() => setGwLogoUrl('https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=100&auto=format&fit=crop&q=80')}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200 text-[11px] font-bold"
                      >
                        Visa / MC Logo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddGwOpen(false)}
                    className="py-2 px-4 rounded border border-gray-300 text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2 px-5 rounded shadow-sm"
                  >
                    Save Gateway
                  </button>
                </div>
              </form>
            )}

            {/* Gateways Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gateways.map((gw) => (
                <div
                  key={gw.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">{gw.name}</span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            gw.type === 'Merchant'
                              ? 'bg-pink-100 text-pink-700'
                              : gw.type === 'Agent'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {gw.type}
                        </span>
                        {gw.badge && (
                          <span className="bg-sky-100 text-[#0284c7] font-bold text-[10px] px-1.5 py-0.5 rounded">
                            {gw.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateGateway(gw.id, { isActive: !gw.isActive })}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            gw.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {gw.isActive ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingGateway(gw);
                            setEditGwName(gw.name);
                            setEditGwType(gw.type);
                            setEditGwNumber(gw.accountNumber);
                            setEditGwInstructions(gw.instructions);
                            setEditGwBadge(gw.badge || '');
                            setEditGwLogoUrl(gw.logoUrl || '');
                          }}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded flex items-center gap-1 text-[11px]"
                          title="Edit Gateway Details & Logo"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (isSubAgent) {
                              showToast('Action Denied: Sub-Agents are not authorized to delete payment gateways', 'error');
                              return;
                            }
                            deleteGateway(gw.id);
                            showToast(`Payment gateway "${gw.name}" deleted successfully`, 'success');
                          }}
                          className={`px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold rounded flex items-center gap-1 text-[11px] border border-red-200 transition-colors cursor-pointer ${
                            isSubAgent ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
                          }`}
                          title="Delete Payment Gateway"
                          disabled={isSubAgent}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2.5 rounded border border-gray-100 my-2 text-xs">
                      <p className="text-gray-500 text-[11px]">Account / Wallet Number:</p>
                      <p className="font-mono font-bold text-sm text-gray-900">{gw.accountNumber}</p>
                    </div>

                    <p className="text-xs text-gray-600 italic">{gw.instructions}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS & TRACKING MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Orders &amp; Live Tracking
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                    <th className="py-3 px-3">Order Number</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Payment Info</th>
                    <th className="py-3 px-3">Total (BDT)</th>
                    <th className="py-3 px-3">Courier Partner</th>
                    <th className="py-3 px-3 whitespace-nowrap">Status</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">Update Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900 whitespace-nowrap align-middle">
                        {ord.orderNumber}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900 text-xs">{ord.customerName}</span>
                          <span className="text-[10.5px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {ord.customerPhone} ({ord.shippingAddress?.district || 'Hub'})
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-gray-900">{ord.paymentMethod}</span>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                              ord.paymentStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : ord.paymentStatus === 'Failed'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            {ord.paymentStatus === 'Paid'
                              ? 'Verified ✓'
                              : ord.paymentStatus === 'Failed'
                              ? 'Rejected ✗'
                              : 'Pending ⌛'}
                          </span>
                          {ord.transactionId && (
                            <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              Trx: {ord.transactionId}
                            </span>
                          )}
                          {ord.paymentStatus === 'Pending' &&
                            (!isSubAgent || !currentSubAgent || currentSubAgent.permissions.canVerifyPayments) && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updatePaymentStatus(ord.id, 'Paid')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-2xs cursor-pointer"
                                  title="Approve / Verify payment"
                                >
                                  Approve ✓
                                </button>
                                <button
                                  onClick={() => updatePaymentStatus(ord.id, 'Failed')}
                                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-2xs cursor-pointer"
                                  title="Reject payment"
                                >
                                  Reject ✗
                                </button>
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-black text-[#0284c7] tabular-nums whitespace-nowrap align-middle">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-800 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-[#0284c7]" />
                            <span>{ord.courierPartner || 'Steadfast Courier'}</span>
                          </span>
                          {ord.trackingNumber && (
                            <span className="font-mono text-[10px] bg-sky-50 text-sky-900 border border-sky-200 px-1.5 py-0.5 rounded font-bold">
                              {ord.trackingNumber}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap align-middle">
                        <span
                          className={`font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase border ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : ord.orderStatus === 'Returned'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap align-middle">
                        {!isSubAgent || !currentSubAgent || currentSubAgent.permissions.canManageOrders ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="text-xs py-1 px-2 rounded-lg border border-gray-300 font-bold bg-white outline-none cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Returned">Returned</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            <button
                              onClick={() => setDispatchingOrder(ord)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                              title="Book Courier & Send Tracking SMS"
                            >
                              <Truck className="w-3.5 h-3.5 text-white" />
                              <span>Book Courier</span>
                            </button>

                            <button
                              onClick={() => {
                                setTrackingModalOrder(ord.id);
                                setCourierName(ord.courierPartner || 'Steadfast Courier');
                              }}
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Add Tracking Event"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Log</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">Order Edit Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tracking Update Dialog */}
            {trackingModalOrder && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
                <div className="bg-white rounded-lg p-5 max-w-[440px] w-full text-xs space-y-3">
                  <h4 className="font-bold text-sm text-gray-900 border-b pb-2">
                    Update Delivery &amp; Live Tracking Note
                  </h4>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Courier Partner:
                    </label>
                    <select
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full p-2 rounded border bg-white font-medium"
                    >
                      <option value="Pathao Express">Pathao Express</option>
                      <option value="RedX Logistics">RedX Logistics</option>
                      <option value="Paperfly">Paperfly</option>
                      <option value="eCourier">eCourier</option>
                      <option value="Sundarban Courier">Sundarban Courier</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Tracking Event Note:
                    </label>
                    <input
                      type="text"
                      value={trackingNote}
                      onChange={(e) => setTrackingNote(e.target.value)}
                      placeholder="e.g. Out for delivery with courier agent Kabir (01788-990011)"
                      className="w-full p-2 rounded border"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">
                      Current Location Hub:
                    </label>
                    <input
                      type="text"
                      value={trackingLocation}
                      onChange={(e) => setTrackingLocation(e.target.value)}
                      placeholder="e.g. Gulshan Delivery Center, Dhaka"
                      className="w-full p-2 rounded border"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setTrackingModalOrder(null)}
                      className="py-1.5 px-3 border rounded font-semibold text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveTracking(trackingModalOrder)}
                      className="py-1.5 px-4 bg-[#0284c7] text-white font-bold rounded"
                    >
                      Save Tracking
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Courier Dispatch Modal for Steadfast / Pathao */}
            {dispatchingOrder && (
              <CourierDispatchModal
                order={dispatchingOrder}
                onDispatchSuccess={(code, partner) => {
                  updateOrderTracking(
                    dispatchingOrder.id,
                    partner,
                    'Shipped',
                    `Dispatched with ${partner}. Consignment: ${code}`,
                    dispatchingOrder.shippingAddress?.district || 'Hub',
                    code
                  );
                  setDispatchingOrder(null);
                  showToast(`🎉 Steadfast বুকিং সফল! ট্র্যাকিং কোড: ${code} এবং SMS পাঠানো হয়েছে`, 'success');
                }}
                onClose={() => setDispatchingOrder(null)}
              />
            )}
          </div>
        )}

        {/* TAB: FLASH SALE TIMER & COUNTDOWN MANAGEMENT */}
        {activeTab === 'flashsale' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-[#0284c7] flex items-center justify-center text-white shadow-xs">
                    <Zap className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">
                      Flash Sale Countdown Timer
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-sky-50 px-3.5 py-1.5 rounded-lg border border-sky-200">
                  <Clock className="w-4 h-4 text-[#0284c7]" />
                  <span className="text-xs font-bold text-gray-700">Live Timer:</span>
                  <span className="bg-[#0284c7] text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                    {String(flashHours).padStart(2, '0')}h : {String(flashMinutes).padStart(2, '0')}m
                  </span>
                </div>
              </div>

              {/* Countdown form */}
              <form onSubmit={handleSaveFlashSaleTimer} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Hours Left (ঘণ্টা) *</label>
                    <input
                      type="number"
                      min="0"
                      max="72"
                      value={flashHours}
                      onChange={(e) => setFlashHours(e.target.value)}
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] font-bold text-base text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Minutes Left (মিনিট) *</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={flashMinutes}
                      onChange={(e) => setFlashMinutes(e.target.value)}
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] font-bold text-base text-gray-900"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Quick Timer Presets:</label>
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {['4', '8', '12', '24', '48'].map((hr) => (
                        <button
                          key={hr}
                          type="button"
                          onClick={() => {
                            setFlashHours(hr);
                            setFlashMinutes('00');
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                            flashHours === hr
                              ? 'bg-[#0284c7] text-white shadow-xs'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {hr} Hours
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs py-2 px-5 rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Flash Sale Timer</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Flash Sale Featured Items */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden p-5">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900">
                    Flash Sale Products ({products.filter((p) => p.isFlashSale).length})
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((p) => {
                  const quota = p.stock + p.soldCount;
                  const progressPercent = Math.min(95, Math.max(25, Math.round((p.soldCount / (quota || 1)) * 100)));

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                        p.isFlashSale
                          ? 'border-sky-300 bg-sky-50/30 ring-1 ring-sky-200'
                          : 'border-gray-200 bg-white opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0 p-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.media[0]?.url} alt={p.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-gray-900 truncate">{p.title}</h5>
                            <p className="text-[#0284c7] font-extrabold tabular-nums">{formatPrice(p.price)}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500">
                              <span>Stock: <strong>{p.stock} pcs</strong></span>
                              <span>·</span>
                              <span>Sold: <strong>{p.soldCount}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Sold Progress Bar Preview */}
                        <div className="space-y-1 my-2 bg-white p-2 rounded border border-gray-100">
                          <div className="flex justify-between text-[10px] font-semibold text-gray-600">
                            <span>Sold Progress Meter</span>
                            <span className="text-[#0284c7] font-bold">{progressPercent}% Sold</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-linear-to-r from-amber-500 to-[#0284c7] h-full rounded-full"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        {/* Quick Sold Count Adjustment */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-500 font-bold">Sold:</span>
                          <button
                            onClick={() => updateProduct(p.id, { soldCount: Math.max(0, p.soldCount - 5) })}
                            className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px]"
                            title="Minus 5 sold"
                          >
                            -5
                          </button>
                          <span className="font-bold font-mono text-[11px] px-1">{p.soldCount}</span>
                          <button
                            onClick={() => updateProduct(p.id, { soldCount: p.soldCount + 5 })}
                            className="w-5 h-5 rounded bg-sky-100 hover:bg-sky-200 text-[#0284c7] font-bold text-[10px]"
                            title="Add 5 sold"
                          >
                            +5
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            const next = !p.isFlashSale;
                            updateProduct(p.id, {
                              isFlashSale: next,
                              flashSaleEnd: next ? new Date(Date.now() + 24 * 3600 * 1000).toISOString() : undefined
                            });
                          }}
                          className={`px-3 py-1 rounded-md text-[11px] font-extrabold flex items-center gap-1 transition-colors ${
                            p.isFlashSale
                              ? 'bg-[#0284c7] text-white shadow-xs'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <Zap className={`w-3 h-3 ${p.isFlashSale ? 'fill-white' : ''}`} />
                          <span>{p.isFlashSale ? 'In Flash Sale' : 'Add to Flash'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: COUPONS & OFFERS MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>Coupon Codes &amp; Promotional Offers ({coupons.length})</span>
                </h3>
              </div>

              <button
                onClick={() => setIsAddCouponOpen(!isAddCouponOpen)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddCouponOpen ? 'Cancel' : 'Create New Coupon Offer'}</span>
              </button>
            </div>

            {/* Create Coupon Form */}
            {isAddCouponOpen && (
              <form
                onSubmit={handleCreateCoupon}
                className="bg-white p-5 rounded-xl border-2 border-emerald-200 shadow-sm space-y-4 text-xs animate-in fade-in-50"
              >
                <h4 className="font-extrabold text-sm text-gray-900 pb-2 border-b border-gray-100">
                  New Coupon Code Details (নতুন অফার কুপন তৈরি)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Coupon Code (কুপন কোড) *</label>
                    <input
                      type="text"
                      value={cpnCode}
                      onChange={(e) => setCpnCode(e.target.value.toUpperCase())}
                      placeholder="e.g. FLASH50 or EID2026"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-emerald-600 font-mono font-extrabold uppercase text-gray-900 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Discount Type (ছাড়ের ধরন) *</label>
                    <select
                      value={cpnType}
                      onChange={(e) => setCpnType(e.target.value as 'PERCENT' | 'FLAT')}
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-emerald-600 font-semibold bg-white outline-none"
                    >
                      <option value="PERCENT">Percentage (%) Discount</option>
                      <option value="FLAT">Flat Amount (৳ BDT) Discount</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      {cpnType === 'PERCENT' ? 'Discount Percentage (%) *' : 'Flat Discount (৳ BDT) *'}
                    </label>
                    <input
                      type="number"
                      value={cpnValue}
                      onChange={(e) => setCpnValue(e.target.value)}
                      placeholder={cpnType === 'PERCENT' ? '15' : '150'}
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-emerald-600 font-bold text-gray-900 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Minimum Spend (সর্বনিম্ন অর্ডার ৳)</label>
                    <input
                      type="number"
                      value={cpnMinSpend}
                      onChange={(e) => setCpnMinSpend(e.target.value)}
                      placeholder="500"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-emerald-600 font-bold text-gray-900 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-4">
                    <label className="font-bold text-gray-700 block mb-1">Offer Description / Subtitle</label>
                    <input
                      type="text"
                      value={cpnDesc}
                      onChange={(e) => setCpnDesc(e.target.value)}
                      placeholder="e.g. Special Eid 20% discount on orders above ৳1,000"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-emerald-600 text-gray-900 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddCouponOpen(false)}
                    className="py-2 px-4 rounded border border-gray-300 text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm"
                  >
                    Publish Coupon Offer
                  </button>
                </div>
              </form>
            )}

            {/* Coupons List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {coupons.map((cpn) => (
                <div
                  key={cpn.id}
                  className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between transition-all ${
                    cpn.isActive
                      ? 'bg-white border-emerald-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-black text-sm bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200 tracking-wider">
                        {cpn.code}
                      </span>
                      <button
                        onClick={() => updateCoupon(cpn.id, { isActive: !cpn.isActive })}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          cpn.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {cpn.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <div className="text-lg font-black text-gray-900 mt-2">
                      {cpn.discountType === 'PERCENT' ? `${cpn.discountValue}% OFF` : `৳${cpn.discountValue} FLAT OFF`}
                    </div>

                    <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">
                      {cpn.description || 'Special store discount voucher'}
                    </p>

                    {cpn.minSpend ? (
                      <p className="text-[10px] text-amber-700 font-semibold mt-1">
                        Min. Order: ৳{cpn.minSpend}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(cpn.code);
                        showToast(`Copied coupon "${cpn.code}"!`, 'success');
                      }}
                      className="text-emerald-700 hover:underline font-bold text-[11px]"
                    >
                      Copy Code
                    </button>
                    <button
                      onClick={() => {
                        if (isSubAgent) {
                          showToast('Action Denied: Sub-Agents are not authorized to delete coupons', 'error');
                          return;
                        }
                        deleteCoupon(cpn.id);
                      }}
                      className={`p-1 ${isSubAgent ? 'text-gray-300 cursor-not-allowed opacity-50' : 'text-red-500 hover:text-red-700'}`}
                      title={isSubAgent ? 'Delete Coupon (Locked)' : 'Delete Coupon'}
                      disabled={isSubAgent}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT & HELPLINE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-5 max-w-[700px]">
            <h3 className="font-bold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Store Contact, WhatsApp &amp; Helpline Settings
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              {/* Site Logo Section */}
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900">Website Brand Logo URL</h4>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={storeLogoUrl}
                      onChange={(e) => setStoreLogoUrl(e.target.value)}
                      placeholder="https://ais-dev-kzjwcmsvdqu5ezdwhtt2l3.../logo.png"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-blue-600 outline-none font-mono text-[11px]"
                    />
                  </div>
                  {storeLogoUrl && (
                    <div className="w-10 h-10 rounded border bg-white p-1 flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={storeLogoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp Direct Contact Section */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                      <MessageCircle className="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">WhatsApp Contact Number</h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Active on Website
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="text"
                      value={storeWhatsapp}
                      onChange={(e) => setStoreWhatsapp(e.target.value)}
                      placeholder="+8801712345678 or 01712345678"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-emerald-600 outline-none font-bold text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Pre-filled Chat Greeting</label>
                    <input
                      type="text"
                      value={storeWhatsappGreeting}
                      onChange={(e) => setStoreWhatsappGreeting(e.target.value)}
                      placeholder="Hello QUATRO! I need help with..."
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-emerald-600 outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-1">
                  <a
                    href={`https://wa.me/${storeWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(storeWhatsappGreeting)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>Test WhatsApp Link ↗</span>
                  </a>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Helpline Phone Number *</span>
                </label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  placeholder="e.g. 16124 or 01712-345678"
                  className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-bold text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Official Support Email *</span>
                </label>
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  placeholder="support@bazaarbd.com"
                  className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Physical Corporate / Warehouse Address</span>
                </label>
                <textarea
                  rows={2}
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Level 6, Navana Tower, Gulshan 1, Dhaka-1212"
                  className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Customer Support Notice</span>
                </label>
                <input
                  type="text"
                  value={storeNotice}
                  onChange={(e) => setStoreNotice(e.target.value)}
                  placeholder="24/7 Helpline & Order Support Available Across Bangladesh"
                  className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                />
              </div>

              {/* Dedicated Seller Center Portal Branding & Hotline Section */}
              <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-sky-200/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0284c7] text-white flex items-center justify-center shadow-xs">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">Seller Center Portal Branding &amp; Hotline (সেলার পোর্টাল সেটিংস)</h4>
                      <p className="text-[10px] text-gray-500">সেলার পোর্টালের নাম, লোগো এবং মার্চেন্ট সাপোর্ট হটলাইন নাম্বার পরিবর্তন করুন</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                    Seller Portal Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Seller Portal Name / Title *</label>
                    <input
                      type="text"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      placeholder="QUATRO Seller Center"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-bold text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Merchant Support Hotline Phone *</label>
                    <input
                      type="text"
                      value={sellerHotline}
                      onChange={(e) => setSellerHotline(e.target.value)}
                      placeholder="+880 9612-444888 or 017xxxxxxxx"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-bold text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Merchant Support Email Address</label>
                    <input
                      type="email"
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      placeholder="seller-support@quatro.com.bd"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Seller Portal Logo URL</label>
                    <input
                      type="text"
                      value={sellerLogoUrl}
                      onChange={(e) => setSellerLogoUrl(e.target.value)}
                      placeholder="https://.../seller-logo.png"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px] bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Seller Landing Page Headline / Tagline</label>
                    <input
                      type="text"
                      value={sellerBannerText}
                      onChange={(e) => setSellerBannerText(e.target.value)}
                      placeholder="Grow Your Business Across All 64 Districts of Bangladesh"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Metric 1: Buyers Highlight String</label>
                    <input
                      type="text"
                      value={sellerStatBuyers}
                      onChange={(e) => setSellerStatBuyers(e.target.value)}
                      placeholder="10M+ Monthly Active Buyers"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Metric 2: Registration Fee String</label>
                    <input
                      type="text"
                      value={sellerStatFee}
                      onChange={(e) => setSellerStatFee(e.target.value)}
                      placeholder="৳0 Fee (Free Registration)"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white text-xs font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Metric 3: Payout Cycle String</label>
                    <input
                      type="text"
                      value={sellerStatPayout}
                      onChange={(e) => setSellerStatPayout(e.target.value)}
                      placeholder="7 Days Guaranteed Payout Cycle"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white text-xs font-semibold"
                    />
                  </div>

                  {/* 3 Onboarding Steps Configuration */}
                  <div className="sm:col-span-2 pt-3 border-t border-sky-200/80 space-y-3">
                    <h5 className="font-black text-xs text-sky-950 uppercase tracking-wider">
                      Seller Onboarding 3 Steps Configuration
                    </h5>

                    <div className="space-y-3 bg-white p-3.5 rounded-xl border border-sky-200/70">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Step 1 Title & Description</label>
                        <input
                          type="text"
                          value={sellerOnboardingStep1Title}
                          onChange={(e) => setSellerOnboardingStep1Title(e.target.value)}
                          placeholder="1. Register Your Shop"
                          className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none text-xs font-bold mb-1.5"
                        />
                        <textarea
                          rows={2}
                          value={sellerOnboardingStep1Desc}
                          onChange={(e) => setSellerOnboardingStep1Desc(e.target.value)}
                          placeholder="Provide your shop name, owner contact details..."
                          className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none text-xs resize-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Step 2 Title & Description</label>
                        <input
                          type="text"
                          value={sellerOnboardingStep2Title}
                          onChange={(e) => setSellerOnboardingStep2Title(e.target.value)}
                          placeholder="2. Upload Products"
                          className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none text-xs font-bold mb-1.5"
                        />
                        <textarea
                          rows={2}
                          value={sellerOnboardingStep2Desc}
                          onChange={(e) => setSellerOnboardingStep2Desc(e.target.value)}
                          placeholder="Add titles, multiple images, video preview..."
                          className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none text-xs resize-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Step 3 Title & Description</label>
                        <input
                          type="text"
                          value={sellerOnboardingStep3Title}
                          onChange={(e) => setSellerOnboardingStep3Title(e.target.value)}
                          placeholder="3. Start Earning & Payouts"
                          className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none text-xs font-bold mb-1.5"
                        />
                        <textarea
                          rows={2}
                          value={sellerOnboardingStep3Desc}
                          onChange={(e) => setSellerOnboardingStep3Desc(e.target.value)}
                          placeholder="Receive orders from buyers nationwide..."
                          className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none text-xs resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Value Propositions Configuration */}
                  <div className="sm:col-span-2 pt-3 border-t border-sky-200/80 space-y-3">
                    <h5 className="font-black text-xs text-sky-950 uppercase tracking-wider">
                      Seller Value Propositions (4 Highlight Cards)
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-sky-200/70 space-y-1.5">
                        <label className="font-bold text-gray-700 block">Card 1 (Payouts)</label>
                        <input
                          type="text"
                          value={sellerValueProp1Title}
                          onChange={(e) => setSellerValueProp1Title(e.target.value)}
                          className="w-full p-2 rounded border border-gray-300 outline-none text-xs font-bold"
                          placeholder="Guaranteed Weekly Payouts"
                        />
                        <textarea
                          rows={2}
                          value={sellerValueProp1Desc}
                          onChange={(e) => setSellerValueProp1Desc(e.target.value)}
                          className="w-full p-2 rounded border border-gray-300 outline-none text-xs resize-none"
                          placeholder="Withdraw your earnings hassle-free..."
                        />
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-sky-200/70 space-y-1.5">
                        <label className="font-bold text-gray-700 block">Card 2 (Logistics)</label>
                        <input
                          type="text"
                          value={sellerValueProp2Title}
                          onChange={(e) => setSellerValueProp2Title(e.target.value)}
                          className="w-full p-2 rounded border border-gray-300 outline-none text-xs font-bold"
                          placeholder="64 District Delivery Network"
                        />
                        <textarea
                          rows={2}
                          value={sellerValueProp2Desc}
                          onChange={(e) => setSellerValueProp2Desc(e.target.value)}
                          className="w-full p-2 rounded border border-gray-300 outline-none text-xs resize-none"
                          placeholder="Integrated courier pickup agents..."
                        />
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-sky-200/70 space-y-1.5">
                        <label className="font-bold text-gray-700 block">Card 3 (Analytics)</label>
                        <input
                          type="text"
                          value={sellerValueProp3Title}
                          onChange={(e) => setSellerValueProp3Title(e.target.value)}
                          className="w-full p-2 rounded border border-gray-300 outline-none text-xs font-bold"
                          placeholder="Powerful Seller Analytics"
                        />
                        <textarea
                          rows={2}
                          value={sellerValueProp3Desc}
                          onChange={(e) => setSellerValueProp3Desc(e.target.value)}
                          className="w-full p-2 rounded border border-gray-300 outline-none text-xs resize-none"
                          placeholder="Track total pieces sold, net income..."
                        />
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-sky-200/70 space-y-1.5">
                        <label className="font-bold text-gray-700 block">Card 4 (Support)</label>
                        <input
                          type="text"
                          value={sellerValueProp4Title}
                          onChange={(e) => setSellerValueProp4Title(e.target.value)}
                          className="w-full p-2 rounded border border-gray-300 outline-none text-xs font-bold"
                          placeholder="24/7 Merchant Support"
                        />
                        <textarea
                          rows={2}
                          value={sellerValueProp4Desc}
                          onChange={(e) => setSellerValueProp4Desc(e.target.value)}
                          className="w-full p-2 rounded border border-gray-300 outline-none text-xs resize-none"
                          placeholder="Dedicated key account managers..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Commission Rates Table */}
                  <div className="sm:col-span-2 pt-3 border-t border-sky-200/80 space-y-3">
                    <h5 className="font-black text-xs text-sky-950 uppercase tracking-wider">
                      Category Commission Rates Management
                    </h5>

                    <div className="bg-white p-3 rounded-xl border border-sky-200/70 space-y-3">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-gray-50 text-gray-600 uppercase text-[10px] font-extrabold border-b border-gray-200">
                              <th className="p-2">Category</th>
                              <th className="p-2">Listing Fee</th>
                              <th className="p-2">Commission %</th>
                              <th className="p-2">Payout Cycle</th>
                              <th className="p-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {sellerCommissionsList.map((comm, idx) => (
                              <tr key={idx}>
                                <td className="p-2 font-bold text-gray-900">{comm.categoryName}</td>
                                <td className="p-2 text-emerald-600 font-bold">{comm.listingFee}</td>
                                <td className="p-2 font-bold text-[#0284c7]">{comm.commissionPercent}%</td>
                                <td className="p-2 text-gray-500">{comm.payoutCycle}</td>
                                <td className="p-2 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCommission(idx)}
                                    className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Add new commission row form */}
                      <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Category Name"
                          className="p-2 rounded border border-gray-300 text-xs outline-none"
                        />
                        <input
                          type="text"
                          value={newListingFee}
                          onChange={(e) => setNewListingFee(e.target.value)}
                          placeholder="Listing Fee (e.g. FREE ৳0)"
                          className="p-2 rounded border border-gray-300 text-xs outline-none"
                        />
                        <input
                          type="number"
                          step="0.1"
                          value={newCommissionPercent}
                          onChange={(e) => setNewCommissionPercent(e.target.value)}
                          placeholder="Commission %"
                          className="p-2 rounded border border-gray-300 text-xs outline-none"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newPayoutCycle}
                            onChange={(e) => setNewPayoutCycle(e.target.value)}
                            placeholder="Payout Cycle"
                            className="p-2 rounded border border-gray-300 text-xs outline-none flex-1"
                          />
                          <button
                            type="button"
                            onClick={handleAddCommission}
                            className="px-3 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded font-bold text-xs cursor-pointer shrink-0"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seller FAQs Configuration */}
                  <div className="sm:col-span-2 pt-3 border-t border-sky-200/80 space-y-3">
                    <h5 className="font-black text-xs text-sky-950 uppercase tracking-wider">
                      Seller Frequently Asked Questions (FAQs)
                    </h5>

                    <div className="bg-white p-3 rounded-xl border border-sky-200/70 space-y-3">
                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        {sellerFaqsList.map((faq, idx) => (
                          <div key={idx} className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between gap-2">
                            <div className="space-y-1 text-xs">
                              <p className="font-bold text-gray-900">Q: {faq.q}</p>
                              <p className="text-gray-600">A: {faq.a}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteFaq(idx)}
                              className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add FAQ form */}
                      <div className="pt-2 border-t border-gray-100 space-y-2">
                        <input
                          type="text"
                          value={newFaqQ}
                          onChange={(e) => setNewFaqQ(e.target.value)}
                          placeholder="New FAQ Question..."
                          className="w-full p-2 rounded border border-gray-300 text-xs outline-none font-medium"
                        />
                        <textarea
                          rows={2}
                          value={newFaqA}
                          onChange={(e) => setNewFaqA(e.target.value)}
                          placeholder="FAQ Answer details..."
                          className="w-full p-2 rounded border border-gray-300 text-xs outline-none resize-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddFaq}
                          className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Seller FAQ</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Seller Footer & Partners Statement */}
                  <div className="sm:col-span-2 pt-3 border-t border-sky-200/80 space-y-3">
                    <h5 className="font-black text-xs text-sky-950 uppercase tracking-wider">
                      Seller Footer &amp; Logistics/Finance Statements
                    </h5>

                    <div className="space-y-3 bg-white p-3.5 rounded-xl border border-sky-200/70">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Empowering Statement (Footer)</label>
                        <textarea
                          rows={2}
                          value={sellerEmpoweringStatement}
                          onChange={(e) => setSellerEmpoweringStatement(e.target.value)}
                          placeholder="Empowering 15,000+ local sellers across Bangladesh..."
                          className="w-full p-2 rounded border border-gray-300 text-xs outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Logistics Partners (Comma-separated)</label>
                        <input
                          type="text"
                          value={sellerLogisticsPartnersStr}
                          onChange={(e) => setSellerLogisticsPartnersStr(e.target.value)}
                          placeholder="Steadfast Express, Pathao Express, RedX..."
                          className="w-full p-2 rounded border border-gray-300 text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Payment &amp; Payout Channels (Comma-separated)</label>
                        <input
                          type="text"
                          value={sellerPaymentChannelsStr}
                          onChange={(e) => setSellerPaymentChannelsStr(e.target.value)}
                          placeholder="Weekly Automated Settlements, Direct bKash..."
                          className="w-full p-2 rounded border border-gray-300 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dedicated Sub-Agent Portal Branding & Hotline Section */}
              <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-purple-200/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center shadow-xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">Staff &amp; Sub-Agent Portal Branding &amp; Hotline (সাব-এজেন্ট পোর্টাল সেটিংস)</h4>
                      <p className="text-[10px] text-gray-500">সাব-এজেন্ট লগইন ও স্টাফ প্যানেলের নাম, লোগো ও হেল্পলাইন নাম্বার পরিবর্তন করুন</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    Sub-Agent Staff
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Sub-Agent Portal Title *</label>
                    <input
                      type="text"
                      value={subAgentPortalTitle}
                      onChange={(e) => setSubAgentPortalTitle(e.target.value)}
                      placeholder="QUATRO Staff & Sub-Agent Portal"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-purple-600 outline-none font-bold text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Staff Helpline / Support Phone *</label>
                    <input
                      type="text"
                      value={subAgentHotline}
                      onChange={(e) => setSubAgentHotline(e.target.value)}
                      placeholder="16124 or 01700-000000"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-purple-600 outline-none font-bold text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Sub-Agent Support Email</label>
                    <input
                      type="email"
                      value={subAgentEmail}
                      onChange={(e) => setSubAgentEmail(e.target.value)}
                      placeholder="agent-support@quatro.com.bd"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-purple-600 outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Sub-Agent Portal Logo URL</label>
                    <input
                      type="text"
                      value={subAgentPortalLogo}
                      onChange={(e) => setSubAgentPortalLogo(e.target.value)}
                      placeholder="https://.../subagent-logo.png"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-purple-600 outline-none font-mono text-[11px] bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h4 className="font-bold text-sm text-gray-900 mb-1">Customer Purchasing &amp; Button Control Toggles</h4>

                {/* Add to Cart Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-amber-50/50 rounded-xl border border-amber-100">
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">1. &quot;Add to Cart&quot; Button</h5>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.isAddToCartEnabled !== false}
                      onChange={(e) => updateSettings({ isAddToCartEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    <span className="ml-2 text-xs font-bold text-gray-700 min-w-[70px]">
                      {settings.isAddToCartEnabled !== false ? 'ON (Active)' : 'OFF (Hidden)'}
                    </span>
                  </label>
                </div>

                {/* Buy Now / Direct COD Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-sky-50/50 rounded-xl border border-sky-100">
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">2. &quot;Buy Now / Direct COD&quot; Button</h5>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.isBuyNowEnabled !== false}
                      onChange={(e) => updateSettings({ isBuyNowEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284c7]"></div>
                    <span className="ml-2 text-xs font-bold text-gray-700 min-w-[70px]">
                      {settings.isBuyNowEnabled !== false ? 'ON (Active)' : 'OFF (Hidden)'}
                    </span>
                  </label>
                </div>

                {/* Cash on Delivery (COD) Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">3. Cash on Delivery (COD) Payment Option</h5>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.isCodEnabled !== false}
                      onChange={(e) => updateSettings({ isCodEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-2 text-xs font-bold text-gray-700 min-w-[70px]">
                      {settings.isCodEnabled !== false ? 'ON (Active)' : 'OFF (Hidden)'}
                    </span>
                  </label>
                </div>

                {/* All Online Payments Master Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">4. Online Payments Master Switch</h5>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.isOnlinePaymentEnabled !== false}
                      onChange={(e) => updateSettings({ isOnlinePaymentEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    <span className="ml-2 text-xs font-bold text-gray-700 min-w-[70px]">
                      {settings.isOnlinePaymentEnabled !== false ? 'ON (Active)' : 'OFF (Disabled)'}
                    </span>
                  </label>
                </div>

                {/* Auto Direct Gateway Popup Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-pink-50/50 rounded-xl border border-pink-100">
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">5. Auto Direct Gateway Popup</h5>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.isAutoPaymentEnabled !== false}
                      onChange={(e) => updateSettings({ isAutoPaymentEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    <span className="ml-2 text-xs font-bold text-gray-700 min-w-[70px]">
                      {settings.isAutoPaymentEnabled !== false ? 'ON (Active)' : 'OFF (Manual Only)'}
                    </span>
                  </label>
                </div>

                {/* Live Merchant API TrxID Verification Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-purple-50/50 rounded-xl border border-purple-100">
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">6. Merchant API TrxID Verification</h5>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.isMerchantVerifyEnabled === true}
                      onChange={(e) => updateSettings({ isMerchantVerifyEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    <span className="ml-2 text-xs font-bold text-gray-700 min-w-[70px]">
                      {settings.isMerchantVerifyEnabled === true ? 'ON (Strict API)' : 'OFF (Manual Check)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* PAYMENT ENGINE & SSLCOMMERZ INTEGRATION BOX */}
              <div className="p-4 bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 rounded-2xl border border-indigo-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      💳
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">
                        Payment Engine &amp; SSLCommerz Automated Gateway
                      </h4>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    settings.paymentEngineMode === 'sslcommerz_auto'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {settings.paymentEngineMode === 'sslcommerz_auto' ? 'SSLCommerz Active' : 'Manual Mode Active'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Active Payment Engine Mode (পেমেন্ট মোড)
                    </label>
                    <select
                      value={settings.paymentEngineMode || 'manual_send_money'}
                      onChange={(e) => updateSettings({ paymentEngineMode: e.target.value as any })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none font-bold text-gray-900 bg-white"
                    >
                      <option value="manual_send_money">1. Manual Send Money (বিকাশ/নগদ ম্যানুয়াল সেন্ড মানি - বর্তমান)</option>
                      <option value="sslcommerz_auto">2. SSLCommerz Auto Gateway (কার্ড, বিকাশ, নগদ অটোমেটেড - ১৫-২০ দিন পর)</option>
                      <option value="direct_pgw">3. Direct bKash / Nagad PGW (টোকেনাইজড পপআপ)</option>
                      <option value="cod_only">4. Cash on Delivery Only (শুধুমাত্র ক্যাশ অন ডেলিভারি)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      SSLCommerz Environment
                    </label>
                    <select
                      value={settings.sslcommerzConfig?.environment || 'sandbox'}
                      onChange={(e) => updateSettings({
                        sslcommerzConfig: {
                          ...settings.sslcommerzConfig,
                          environment: e.target.value as any
                        }
                      })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none font-bold text-gray-900 bg-white"
                    >
                      <option value="sandbox">Sandbox (Testing / Demo Mode)</option>
                      <option value="live">Live Production (Real Payment Capture)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      SSLCommerz Store ID
                    </label>
                    <input
                      type="text"
                      value={settings.sslcommerzConfig?.storeId || ''}
                      onChange={(e) => updateSettings({
                        sslcommerzConfig: {
                          ...settings.sslcommerzConfig,
                          storeId: e.target.value
                        }
                      })}
                      placeholder="e.g. testbox or your_store_id"
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none font-mono text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      SSLCommerz Store Password
                    </label>
                    <input
                      type="password"
                      value={settings.sslcommerzConfig?.storePassword || ''}
                      onChange={(e) => updateSettings({
                        sslcommerzConfig: {
                          ...settings.sslcommerzConfig,
                          storePassword: e.target.value
                        }
                      })}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-indigo-600 outline-none font-mono text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SMS GATEWAY CONFIGURATION BOX */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      💬
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">
                        Automated SMS Gateway Configuration
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                    {settings.smsConfig?.apiKey ? 'SMS API Connected' : 'Ready for API Key'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">SMS Provider</label>
                    <select
                      value={settings.smsConfig?.provider || 'mim_sms'}
                      onChange={(e) => updateSettings({
                        smsConfig: {
                          ...settings.smsConfig,
                          provider: e.target.value as any
                        }
                      })}
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-emerald-600 outline-none font-bold text-gray-900 bg-white"
                    >
                      <option value="ssl_wireless">SSLWireless SMS</option>
                      <option value="mim_sms">MimSMS BD</option>
                      <option value="greenweb">Greenweb SMS</option>
                      <option value="elitbuzz">ElitBuzz BD</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Sender ID / Masking</label>
                    <input
                      type="text"
                      value={settings.smsConfig?.senderId || 'QUATRO'}
                      onChange={(e) => updateSettings({
                        smsConfig: {
                          ...settings.smsConfig,
                          senderId: e.target.value
                        }
                      })}
                      placeholder="QUATRO or 8809..."
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-emerald-600 outline-none font-bold text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">SMS API Key</label>
                    <input
                      type="password"
                      value={settings.smsConfig?.apiKey || ''}
                      onChange={(e) => updateSettings({
                        smsConfig: {
                          ...settings.smsConfig,
                          apiKey: e.target.value
                        }
                      })}
                      placeholder="Paste your SMS API key here"
                      className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-emerald-600 outline-none font-mono text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs py-2.5 px-6 rounded shadow-md transition-colors"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
            <FooterLinksManager />
            <FooterFeaturesManager />
            <DeliveryPartnerManager />

            {/* Content Policies Section */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4 space-y-4">
              <h4 className="font-bold text-sm text-gray-900">Manage Website Policy Content</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1 text-[11px]">About QUATRO Content</label>
                  <textarea
                    value={aboutUs}
                    onChange={(e) => setAboutUs(e.target.value)}
                    placeholder="Describe your marketplace..."
                    className="w-full p-2 border rounded text-xs outline-none focus:border-[#0284c7]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1 text-[11px]">Privacy Policy Content</label>
                  <textarea
                    value={privacyPolicy}
                    onChange={(e) => setPrivacyPolicy(e.target.value)}
                    placeholder="Legal privacy terms..."
                    className="w-full p-2 border rounded text-xs outline-none focus:border-[#0284c7]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1 text-[11px]">Terms & Conditions Content</label>
                  <textarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Usage terms..."
                    className="w-full p-2 border rounded text-xs outline-none focus:border-[#0284c7]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1 text-[11px]">Careers Content</label>
                  <textarea
                    value={careers}
                    onChange={(e) => setCareers(e.target.value)}
                    placeholder="Job opportunities..."
                    className="w-full p-2 border rounded text-xs outline-none focus:border-[#0284c7]"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xs p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Customer Reviews &amp; Moderation
            </h3>

            <div className="space-y-3">
              {allReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-gray-900 mr-2">{rev.userName}</span>
                      <span className="text-gray-500">on &ldquo;{rev.productTitle}&rdquo;</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{rev.createdAt}</span>
                  </div>

                  <div className="flex text-amber-400 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Status: {rev.isApproved ? 'Approved & Visible' : 'Pending Approval'}
                    </span>
                    <button
                      onClick={() => {
                        if (isSubAgent && currentSubAgent && currentSubAgent.permissions.canModerateReviews === false) {
                          showToast('Action Denied: You do not have permission to approve reviews', 'error');
                          return;
                        }
                        approveReview(rev.productId, rev.id);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1 rounded transition-colors cursor-pointer"
                    >
                      {rev.isApproved ? 'Verified' : 'Approve Review'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: AUDIENCE, LEADS & NEWSLETTER SIGNUPS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* Header with Stats & Export */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-black px-2 py-0.5 rounded">
                      Audience CRM &amp; Leads
                    </span>
                    <h3 className="font-extrabold text-base text-gray-900">
                      Audience, Product Inquiries &amp; Newsletter Signups
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-3.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Download audience list as CSV spreadsheet"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className="bg-gray-800 hover:bg-black text-white font-extrabold text-xs py-2 px-3.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    title="Export database as JSON"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    onClick={() => setIsAddLeadOpen(!isAddLeadOpen)}
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs py-2 px-3.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAddLeadOpen ? 'Cancel' : 'Add Interested Customer'}</span>
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
                <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-700 uppercase">Total Audience</span>
                  <p className="text-xl font-black text-blue-900 mt-0.5 tabular-nums">{leads.length}</p>
                </div>
                <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">Phone Numbers</span>
                  <p className="text-xl font-black text-emerald-900 mt-0.5 tabular-nums">
                    {leads.filter((l) => Boolean(l.phone)).length}
                  </p>
                </div>
                <div className="bg-purple-50/60 p-3 rounded-lg border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-700 uppercase">Email Leads</span>
                  <p className="text-xl font-black text-purple-900 mt-0.5 tabular-nums">
                    {leads.filter((l) => Boolean(l.email)).length}
                  </p>
                </div>
                <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-100">
                  <span className="text-[11px] font-bold text-amber-700 uppercase">Deals Newsletter</span>
                  <p className="text-xl font-black text-amber-900 mt-0.5 tabular-nums">
                    {leads.filter((l) => l.source?.toLowerCase().includes('deal') || l.source?.toLowerCase().includes('newsletter')).length}
                  </p>
                </div>
                <div className="bg-rose-50/60 p-3 rounded-lg border border-rose-100">
                  <span className="text-[11px] font-bold text-rose-700 uppercase">Product Inquiries</span>
                  <p className="text-xl font-black text-rose-900 mt-0.5 tabular-nums">
                    {leads.filter((l) => Boolean(l.productTitle) || l.source?.toLowerCase().includes('product') || l.source?.toLowerCase().includes('intent')).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Manual Lead Form */}
            {isAddLeadOpen && (
              <form
                onSubmit={handleCreateLead}
                className="bg-white p-5 rounded-xl border-2 border-sky-200 shadow-sm space-y-3 text-xs animate-in fade-in-50"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    <span className="text-[#0284c7]">👥</span>
                    <span>Add Interested Customer Lead (আগ্রহী ক্রেতার তথ্য সংরক্ষণ)</span>
                  </h4>
                  <span className="text-[10px] text-gray-400">Save for WhatsApp / SMS / Call Follow-up</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Customer Name (ক্রেতার নাম)</label>
                    <input
                      type="text"
                      value={manualLeadName}
                      onChange={(e) => setManualLeadName(e.target.value)}
                      placeholder="e.g. Shakib Ahmed"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Phone Number (ফোন নাম্বার) *</label>
                    <input
                      type="text"
                      value={manualLeadPhone}
                      onChange={(e) => setManualLeadPhone(e.target.value)}
                      placeholder="e.g. 01712-345678"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-bold text-gray-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Email Address (ইমেইল)</label>
                    <input
                      type="email"
                      value={manualLeadEmail}
                      onChange={(e) => setManualLeadEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Lead Source / Channel (চ্যানেল)</label>
                    <select
                      value={manualLeadSource}
                      onChange={(e) => setManualLeadSource(e.target.value)}
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-medium"
                    >
                      <option value="Direct Admin Entry">Direct Admin Entry</option>
                      <option value="Phone Call Inquiry">Phone Call Inquiry</option>
                      <option value="WhatsApp Chat Inquiry">WhatsApp Chat Inquiry</option>
                      <option value="Facebook Campaign Lead">Facebook Campaign Lead</option>
                      <option value="Footer Deals Newsletter">Footer Deals Newsletter</option>
                      <option value="Product Buy Intent">Product Buy Intent</option>
                      <option value="Offline Store Walk-in">Offline Store Walk-in</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Interested Product (আগ্রহী প্রোডাক্ট)</label>
                    <input
                      type="text"
                      value={manualLeadProduct}
                      onChange={(e) => setManualLeadProduct(e.target.value)}
                      placeholder="e.g. Anker R50i Earbuds or apex shoe"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Admin / Customer Note (নোট)</label>
                    <input
                      type="text"
                      value={manualLeadNote}
                      onChange={(e) => setManualLeadNote(e.target.value)}
                      placeholder="e.g. Called for size 42, requested discount"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-[#0284c7] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddLeadOpen(false)}
                    className="py-2 px-4 rounded border border-gray-300 text-gray-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2 px-5 rounded-lg shadow-sm cursor-pointer"
                  >
                    Save Customer Data
                  </button>
                </div>
              </form>
            )}

            {/* Filter Tabs & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setLeadFilterTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadFilterTab === 'all'
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All ({leads.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadFilterTab('newsletter')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadFilterTab === 'newsletter'
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Deals Newsletter ({leads.filter((l) => l.source?.toLowerCase().includes('newsletter') || l.source?.toLowerCase().includes('deal')).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadFilterTab('buy_intent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadFilterTab === 'buy_intent'
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Product Buy-Intent ({leads.filter((l) => Boolean(l.productTitle) || l.source?.toLowerCase().includes('product') || l.source?.toLowerCase().includes('intent')).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadFilterTab('phone')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadFilterTab === 'phone'
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Phone ({leads.filter((l) => Boolean(l.phone)).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadFilterTab('email')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadFilterTab === 'email'
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Email ({leads.filter((l) => Boolean(l.email)).length})
                  </button>
                </div>

                {/* Status Dropdown Filter */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-gray-500">Status:</span>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value as any)}
                    className="p-1.5 text-xs rounded-lg border border-gray-300 focus:border-[#0284c7] outline-none bg-white font-semibold text-gray-800"
                  >
                    <option value="all">All Statuses</option>
                    <option value="NEW">🟢 NEW (নতুন)</option>
                    <option value="CONTACTED">🟡 CONTACTED (যোগাযোগ হয়েছে)</option>
                    <option value="CONVERTED">🔵 CONVERTED (অর্ডার করেছে)</option>
                    <option value="CLOSED">⚪ CLOSED (সম্পন্ন)</option>
                  </select>
                </div>
              </div>

              {/* Search Box */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search by phone, email, name, product, notes..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:border-[#0284c7] outline-none"
                  />
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  Showing{' '}
                  <strong className="text-gray-900">
                    {
                      leads.filter((l) => {
                        const matchTab =
                          leadFilterTab === 'all' ||
                          (leadFilterTab === 'newsletter' && (l.source?.toLowerCase().includes('newsletter') || l.source?.toLowerCase().includes('deal'))) ||
                          (leadFilterTab === 'buy_intent' && (Boolean(l.productTitle) || l.source?.toLowerCase().includes('product') || l.source?.toLowerCase().includes('intent'))) ||
                          (leadFilterTab === 'phone' && Boolean(l.phone)) ||
                          (leadFilterTab === 'email' && Boolean(l.email));

                        const matchStatus = leadStatusFilter === 'all' || (l.status || 'NEW') === leadStatusFilter;

                        const q = leadSearch.toLowerCase();
                        const matchSearch =
                          !leadSearch ||
                          (l.name && l.name.toLowerCase().includes(q)) ||
                          (l.email && l.email.toLowerCase().includes(q)) ||
                          (l.phone && l.phone.includes(leadSearch)) ||
                          (l.source && l.source.toLowerCase().includes(q)) ||
                          (l.productTitle && l.productTitle.toLowerCase().includes(q)) ||
                          (l.note && l.note.toLowerCase().includes(q));

                        return matchTab && matchStatus && matchSearch;
                      }).length
                    }
                  </strong>{' '}
                  of {leads.length} recorded leads
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                      <th className="py-3 px-3">Lead ID &amp; Status</th>
                      <th className="py-3 px-3">Customer Contact</th>
                      <th className="py-3 px-3">Source &amp; Product Interest</th>
                      <th className="py-3 px-3">Notes (নোট রাখুন)</th>
                      <th className="py-3 px-3">Recorded At</th>
                      <th className="py-3 px-3 text-right">Direct Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-800 bg-white">
                    {leads
                      .filter((l) => {
                        const matchTab =
                          leadFilterTab === 'all' ||
                          (leadFilterTab === 'newsletter' && (l.source?.toLowerCase().includes('newsletter') || l.source?.toLowerCase().includes('deal'))) ||
                          (leadFilterTab === 'buy_intent' && (Boolean(l.productTitle) || l.source?.toLowerCase().includes('product') || l.source?.toLowerCase().includes('intent'))) ||
                          (leadFilterTab === 'phone' && Boolean(l.phone)) ||
                          (leadFilterTab === 'email' && Boolean(l.email));

                        const matchStatus = leadStatusFilter === 'all' || (l.status || 'NEW') === leadStatusFilter;

                        const q = leadSearch.toLowerCase();
                        const matchSearch =
                          !leadSearch ||
                          (l.name && l.name.toLowerCase().includes(q)) ||
                          (l.email && l.email.toLowerCase().includes(q)) ||
                          (l.phone && l.phone.includes(leadSearch)) ||
                          (l.source && l.source.toLowerCase().includes(q)) ||
                          (l.productTitle && l.productTitle.toLowerCase().includes(q)) ||
                          (l.note && l.note.toLowerCase().includes(q));

                        return matchTab && matchStatus && matchSearch;
                      })
                      .map((lead) => {
                        const leadStatus = lead.status || 'NEW';
                        const statusColor =
                          leadStatus === 'CONVERTED'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : leadStatus === 'CONTACTED'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : leadStatus === 'CLOSED'
                            ? 'bg-gray-100 text-gray-700 border-gray-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                        return (
                          <tr key={lead.id} className="hover:bg-sky-50/30 transition-colors">
                            {/* Lead ID & Status in 1 Single Line */}
                            <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-gray-600 text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                                  {lead.id}
                                </span>
                                <select
                                  value={leadStatus}
                                  onChange={(e) => {
                                    updateLead(lead.id, { status: e.target.value as any });
                                  }}
                                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border outline-none cursor-pointer ${statusColor}`}
                                >
                                  <option value="NEW">🟢 NEW</option>
                                  <option value="CONTACTED">🟡 CONTACTED</option>
                                  <option value="CONVERTED">🔵 CONVERTED</option>
                                  <option value="CLOSED">⚪ CLOSED</option>
                                </select>
                              </div>
                            </td>

                            {/* Customer Contact in 1 Single Line */}
                            <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                              <div className="flex items-center gap-2 text-[11px]">
                                {lead.name && (
                                  <span className="font-extrabold text-gray-900 text-xs flex items-center gap-1">
                                    <span>👤</span>
                                    <span>{lead.name}</span>
                                  </span>
                                )}

                                {lead.phone ? (
                                  <span className="inline-flex items-center gap-1 font-mono font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                                    <Phone className="w-3 h-3 text-[#0284c7] shrink-0" />
                                    <span>{lead.phone}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(lead.phone || '');
                                        showToast(`Copied phone ${lead.phone}!`, 'info');
                                      }}
                                      className="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                                      title="Copy Phone"
                                    >
                                      <Copy className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ) : (
                                  <span className="text-gray-400 italic text-[10px]">No phone</span>
                                )}

                                {lead.email && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <span className="inline-flex items-center gap-1 font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                                      <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                                      <span>{lead.email}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(lead.email || '');
                                          showToast(`Copied email ${lead.email}!`, 'info');
                                        }}
                                        className="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                                        title="Copy Email"
                                      >
                                        <Copy className="w-2.5 h-2.5" />
                                      </button>
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* Source & Product in 1 Single Line */}
                            <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-[11px]">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#0284c7] border border-sky-200">
                                  {lead.source}
                                </span>
                                {lead.productTitle && (
                                  <span className="inline-flex items-center gap-1 font-semibold text-gray-800 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md max-w-[200px] truncate" title={lead.productTitle}>
                                    <span className="text-gray-400">📦</span>
                                    <span className="truncate">{lead.productTitle}</span>
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Notes in 1 Single Line */}
                            <td className="py-3 px-3.5 align-middle whitespace-nowrap max-w-[240px]">
                              {editingNoteLeadId === lead.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={editingNoteText}
                                    onChange={(e) => setEditingNoteText(e.target.value)}
                                    className="p-1 text-xs rounded border border-sky-300 outline-none w-44 font-medium"
                                    placeholder="Write note..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateLead(lead.id, { note: editingNoteText.trim() || undefined });
                                      setEditingNoteLeadId(null);
                                    }}
                                    className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-1 rounded cursor-pointer hover:bg-emerald-700"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingNoteLeadId(null)}
                                    className="text-gray-500 text-[10px] px-1.5 py-1 rounded hover:bg-gray-100 cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="group flex items-center justify-between gap-1.5">
                                  <span className="text-gray-600 text-[11px] italic truncate max-w-[180px] block" title={lead.note || 'No note added'}>
                                    {lead.note || <span className="text-gray-400 not-italic">No note added</span>}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingNoteLeadId(lead.id);
                                      setEditingNoteText(lead.note || '');
                                    }}
                                    className="text-gray-400 hover:text-[#0284c7] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer px-1 py-0.5 rounded hover:bg-sky-50"
                                    title="Edit Note"
                                  >
                                    ✏️
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Recorded Date in 1 Single Line */}
                            <td className="py-3 px-3.5 text-gray-500 text-[11px] align-middle whitespace-nowrap">
                              {lead.createdAt}
                            </td>

                            {/* Actions in 1 Single Line */}
                            <td className="py-3 px-3.5 text-right align-middle whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                {lead.phone && (
                                  <>
                                    <a
                                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.name || ''}! We received your inquiry on QUATRO.`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors border border-emerald-200"
                                      title="Chat on WhatsApp"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                    <a
                                      href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                                      className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors border border-blue-200"
                                      title="Call customer directly"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                    </a>
                                  </>
                                )}

                                {lead.email && (
                                  <a
                                    href={`mailto:${lead.email}?subject=${encodeURIComponent('Special Offer from QUATRO')}`}
                                    className="p-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 transition-colors border border-purple-200"
                                    title="Send Email"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isSubAgent) {
                                      showToast('Sub-Agents cannot delete audience records', 'error');
                                      return;
                                    }
                                    deleteLead(lead.id);
                                  }}
                                  className={`p-1.5 rounded-lg border transition-colors ${
                                    isSubAgent
                                      ? 'text-gray-300 border-gray-100 cursor-not-allowed opacity-50'
                                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50 border-gray-200 cursor-pointer'
                                  }`}
                                  title={isSubAgent ? 'Delete (Locked)' : 'Delete lead record'}
                                  disabled={isSubAgent}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SUB-AGENTS & STAFF PERMISSIONS */}
        {activeTab === 'subagents' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 text-xs font-black px-2 py-0.5 rounded">
                    Staff &amp; Sub-Agents
                  </span>
                  <h3 className="font-extrabold text-base text-gray-900">
                    Sub-Agent Accounts, Passwords &amp; Permissions
                  </h3>
                </div>
              </div>

              {!isSubAgent && (
                <button
                  onClick={() => setIsAddAgentOpen(!isAddAgentOpen)}
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs py-2 px-4 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer w-max"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddAgentOpen ? 'Cancel' : 'Add New Sub-Agent'}</span>
                </button>
              )}
            </div>

            {/* Sub-Agent Portal Action Strip */}
            <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-purple-950">Sub-Agent Staff Portal</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('subagent');
                  setIsAuthModalOpen(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Open Login Modal</span>
              </button>
            </div>

            {/* Sub-Agent Creation Form */}
            {isAddAgentOpen && !isSubAgent && (
              <form
                onSubmit={handleCreateSubAgent}
                className="bg-white p-5 rounded-xl border-2 border-purple-200 shadow-sm space-y-4 text-xs animate-in fade-in-50"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>Create Sub-Agent Account with Login Credentials</span>
                  </h4>
                  <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                    Moderator Access
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Agent Full Name *</label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="e.g. Tanvir Hossain"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-purple-600 outline-none font-bold text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Agent Login Email *</label>
                    <input
                      type="email"
                      value={agentEmail}
                      onChange={(e) => setAgentEmail(e.target.value)}
                      placeholder="agent@bazaarbd.com"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-purple-600 outline-none font-semibold text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Agent Login Password *</label>
                    <input
                      type="text"
                      value={agentPassword}
                      onChange={(e) => setAgentPassword(e.target.value)}
                      placeholder="Password for agent login"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-purple-600 outline-none font-mono font-bold text-purple-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Agent Phone Number</label>
                    <input
                      type="text"
                      value={agentPhone}
                      onChange={(e) => setAgentPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full p-2.5 rounded border border-gray-300 focus:border-purple-600 outline-none font-bold text-gray-900"
                    />
                  </div>
                </div>

                {/* Permissions Toggles */}
                <div className="pt-3 border-t border-gray-100">
                  <h5 className="font-bold text-gray-900 mb-2">Access Permissions (অনুমতিসমূহ নির্ধারণ করুন):</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <label className="flex items-center gap-2 p-2.5 bg-gray-50 border rounded-lg cursor-pointer hover:bg-purple-50/40">
                      <input
                        type="checkbox"
                        checked={agentPermPayments}
                        onChange={(e) => setAgentPermPayments(e.target.checked)}
                        className="accent-purple-600 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-gray-800 block text-[11px]">Verify Payments</span>
                        <span className="text-[10px] text-gray-500">Approve/Reject TrxIDs</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-gray-50 border rounded-lg cursor-pointer hover:bg-purple-50/40">
                      <input
                        type="checkbox"
                        checked={agentPermOrders}
                        onChange={(e) => setAgentPermOrders(e.target.checked)}
                        className="accent-purple-600 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-gray-800 block text-[11px]">Manage Orders</span>
                        <span className="text-[10px] text-gray-500">Update status &amp; courier</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-gray-50 border rounded-lg cursor-pointer hover:bg-purple-50/40">
                      <input
                        type="checkbox"
                        checked={agentPermChat}
                        onChange={(e) => setAgentPermChat(e.target.checked)}
                        className="accent-purple-600 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-gray-800 block text-[11px]">Live Chat Support</span>
                        <span className="text-[10px] text-gray-500">Reply to customer queries</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 bg-gray-50 border rounded-lg cursor-pointer hover:bg-purple-50/40">
                      <input
                        type="checkbox"
                        checked={agentPermReviews}
                        onChange={(e) => setAgentPermReviews(e.target.checked)}
                        className="accent-purple-600 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-gray-800 block text-[11px]">Review Moderation</span>
                        <span className="text-[10px] text-gray-500">Approve star ratings</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddAgentOpen(false)}
                    className="py-2 px-4 rounded border border-gray-300 text-gray-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm cursor-pointer"
                  >
                    Save &amp; Activate Sub-Agent
                  </button>
                </div>
              </form>
            )}

            {/* Sub-Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 flex flex-col justify-between ${
                    agent.isActive ? 'border-gray-200' : 'border-gray-200 opacity-60 bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">{agent.name}</h4>
                        <p className="text-[11px] text-purple-700 font-semibold font-mono mt-0.5">
                          {agent.email}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          agent.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {agent.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    {/* Password display */}
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs font-mono flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Key className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-bold">Password:</span>
                        <span className="font-black text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {agent.password || 'agent'}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">Phone: {agent.phone}</span>
                    </div>

                    {/* Permissions list */}
                    <div className="mt-3">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                        Active Permissions:
                      </span>
                      <div className="flex flex-wrap gap-1.5 text-[10.5px]">
                        {agent.permissions.canVerifyPayments && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                            ✓ Payment Verification
                          </span>
                        )}
                        {agent.permissions.canManageOrders && (
                          <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold">
                            ✓ Order Management
                          </span>
                        )}
                        {agent.permissions.canLiveChat && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-bold">
                            ✓ Live Chat
                          </span>
                        )}
                        {agent.permissions.canModerateReviews && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                            ✓ Reviews
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setIsSubAgent(true);
                          setCurrentSubAgent(agent);
                          showToast(`Logged in as Sub-Agent: ${agent.name}`, 'info');
                        }}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-lg border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Log in as this Agent</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`Sub-Agent Login:\nEmail: ${agent.email}\nPassword: ${agent.password || 'agent'}`);
                          showToast(`Copied login credentials for ${agent.name}!`, 'success');
                        }}
                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold p-1.5 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                        title="Copy Email & Password"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!isSubAgent && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateSubAgent(agent.id, { isActive: !agent.isActive })}
                          className="text-[11px] font-bold text-gray-600 hover:text-gray-900 px-2 py-1 rounded cursor-pointer"
                        >
                          {agent.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteSubAgent(agent.id)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          title="Delete Agent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: LIVE CHAT & CUSTOMER INQUIRIES */}
        {activeTab === 'livechat' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded">
                  Support CRM
                </span>
                <h3 className="font-extrabold text-base text-gray-900">
                  Customer Live Chat &amp; Inquiries
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {liveChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 ${
                    chat.status === 'Open' ? 'border-sky-200 bg-sky-50/20' : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-gray-900 text-sm">{chat.customerName}</span>
                      {chat.customerPhone && (
                        <span className="font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                          {chat.customerPhone}
                        </span>
                      )}
                      {chat.customerPhone && (
                        <a
                          href={`https://wa.me/${chat.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          chat.status === 'Open'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {chat.status === 'Open' ? '⌛ Open Inquiry' : '✓ Resolved'}
                      </span>
                      <span className="text-[10px] text-gray-400">{chat.timestamp}</span>
                    </div>
                  </div>

                  {/* Customer Question */}
                  <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-800">
                    <p className="font-semibold">{chat.message}</p>
                  </div>

                  {/* Existing Reply if any */}
                  {chat.reply && (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700">
                        <span>Replied by: {chat.repliedBy || 'Support Agent'}</span>
                        <span>{chat.repliedAt}</span>
                      </div>
                      <p className="font-medium">{chat.reply}</p>
                    </div>
                  )}

                  {/* Reply Input Form */}
                  <div className="flex gap-2 pt-2 text-xs">
                    <input
                      type="text"
                      value={chatReplyMap[chat.id] || ''}
                      onChange={(e) =>
                        setChatReplyMap((prev) => ({ ...prev, [chat.id]: e.target.value }))
                      }
                      placeholder={chat.reply ? 'Send a follow-up reply...' : 'Type agent response to customer...'}
                      className="flex-1 p-2 rounded-lg border border-gray-300 focus:border-emerald-600 outline-none text-gray-900 font-medium bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendChatReply(chat.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 text-xs"
                    >
                      {chat.reply ? 'Follow Up' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
          <form
            onSubmit={handleSaveProductEdit}
            className="bg-white rounded-xl p-5 max-w-[500px] w-full text-xs space-y-3 shadow-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-[#0284c7]" />
                <span>Edit Product Details</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 rounded border font-semibold text-gray-900"
                  required
                />
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Selling Price (৳ BDT) *</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full p-2 rounded border font-bold text-[#0284c7]"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Original Price (৳)</label>
                  <input
                    type="number"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    className="w-full p-2 rounded border font-medium text-gray-500"
                  />
                </div>
              </div>

              {/* Rating Editor (Rating edit kora jaba) */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-gray-900 flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>Rating (রেটিং ১.০ - ৫.০ স্টার)</span>
                  </label>
                  <span className="text-amber-800 font-black text-sm bg-white px-2 py-0.5 rounded border border-amber-200">
                    ⭐ {parseFloat(editRating || '4.8').toFixed(1)} / 5.0
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={editRating}
                      onChange={(e) => setEditRating(e.target.value)}
                      className="w-full p-2 rounded border border-amber-300 focus:border-amber-500 font-extrabold text-amber-700 bg-white"
                      required
                    />
                  </div>

                  {/* Quick rating presets */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {['4.2', '4.5', '4.8', '4.9', '5.0'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setEditRating(r)}
                        className={`px-2 py-1 rounded text-[10px] font-extrabold transition-colors ${
                          editRating === r
                            ? 'bg-amber-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-100'
                        }`}
                      >
                        {r}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stock Pieces (Koto Pics Ache Add/Edit Kora Jaba) */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-gray-900 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>Stock Count (কত পিস আছে / Pics Available) *</span>
                  </label>
                  <span className="font-mono font-bold text-xs text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                    {editStock} pcs in stock
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-28 p-2 rounded border border-blue-300 font-extrabold text-gray-900 bg-white"
                    required
                  />

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditStock((Math.max(0, parseInt(editStock || '0') - 5)).toString())}
                      className="px-2 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStock((Math.max(0, parseInt(editStock || '0') - 1)).toString())}
                      className="px-2 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStock(((parseInt(editStock || '0') || 0) + 1).toString())}
                      className="px-2 py-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-extrabold text-xs"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStock(((parseInt(editStock || '0') || 0) + 5).toString())}
                      className="px-2 py-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-extrabold text-xs"
                    >
                      +5
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditStock(((parseInt(editStock || '0') || 0) + 20).toString())}
                      className="px-2 py-1.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-xs"
                    >
                      +20
                    </button>
                  </div>
                </div>
              </div>

              {/* Sold Count (Koto Sold Hoica Add Kora Jaba, Koma Bara Kora Jaba - e.g. 90 -> 95) */}
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-gray-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#0284c7]" />
                    <span>Total Sold Count (মোট বিক্রিত সংখ্যা - কমা / বাড়া করা যাবে) *</span>
                  </label>
                  <span className="font-mono font-bold text-xs text-[#0284c7] bg-white px-2 py-0.5 rounded border border-sky-200">
                    {editSoldCount} Sold
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editSoldCount}
                    onChange={(e) => setEditSoldCount(e.target.value)}
                    className="w-28 p-2 rounded border border-sky-300 font-extrabold text-[#0284c7] bg-white"
                    required
                  />

                  {/* Stepper buttons (User specified: 90 to 95 sold) */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditSoldCount((Math.max(0, parseInt(editSoldCount || '0') - 5)).toString())}
                      className="px-2.5 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs"
                      title="Minus 5 sold"
                    >
                      -5
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSoldCount((Math.max(0, parseInt(editSoldCount || '0') - 1)).toString())}
                      className="px-2.5 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs"
                      title="Minus 1 sold"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSoldCount(((parseInt(editSoldCount || '0') || 0) + 1).toString())}
                      className="px-2.5 py-1.5 rounded bg-sky-100 hover:bg-sky-200 text-[#0284c7] font-extrabold text-xs"
                      title="Add 1 sold"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSoldCount(((parseInt(editSoldCount || '0') || 0) + 5).toString())}
                      className="px-2.5 py-1.5 rounded bg-sky-200 hover:bg-sky-300 text-[#0284c7] font-black text-xs shadow-2xs"
                      title="Add 5 sold (e.g. 90 to 95)"
                    >
                      +5
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSoldCount(((parseInt(editSoldCount || '0') || 0) + 25).toString())}
                      className="px-2.5 py-1.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs"
                      title="Add 25 sold"
                    >
                      +25
                    </button>
                  </div>
                </div>
              </div>

              {/* Review Count & Flash Sale checkbox */}
              <div className="grid grid-cols-2 gap-2 items-center">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Total Ratings / Reviews</label>
                  <input
                    type="number"
                    value={editReviewCount}
                    onChange={(e) => setEditReviewCount(e.target.value)}
                    className="w-full p-2 rounded border"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800 p-2 rounded border border-amber-200 bg-amber-50/50">
                    <input
                      type="checkbox"
                      checked={editIsFlashSale}
                      onChange={(e) => setEditIsFlashSale(e.target.checked)}
                      className="accent-[#0284c7] w-4 h-4"
                    />
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>In Flash Sale</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full p-2 rounded border font-medium text-gray-900"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3 space-y-2 p-3 bg-sky-50/50 rounded-lg border border-sky-100">
                <label className="font-bold text-gray-900 block">
                  Product Gallery Images (Up to 5 Images supported)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  <input
                    type="text"
                    value={editImg1}
                    onChange={(e) => setEditImg1(e.target.value)}
                    placeholder="Image 1 (Main Thumbnail) URL"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                  />
                  <input
                    type="text"
                    value={editImg2}
                    onChange={(e) => setEditImg2(e.target.value)}
                    placeholder="Image 2 URL"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                  />
                  <input
                    type="text"
                    value={editImg3}
                    onChange={(e) => setEditImg3(e.target.value)}
                    placeholder="Image 3 URL"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                  />
                  <input
                    type="text"
                    value={editImg4}
                    onChange={(e) => setEditImg4(e.target.value)}
                    placeholder="Image 4 URL"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                  />
                  <input
                    type="text"
                    value={editImg5}
                    onChange={(e) => setEditImg5(e.target.value)}
                    placeholder="Image 5 URL"
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] outline-none font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="py-2 px-4 border rounded font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded shadow-sm"
              >
                Save Product Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Gateway Modal */}
      {editingGateway && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
          <form
            onSubmit={handleSaveGatewayEdit}
            className="bg-white rounded-xl p-5 max-w-[500px] w-full text-xs space-y-3 shadow-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-[#0284c7]" />
                <span>Edit Payment Gateway &amp; Logo</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingGateway(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Gateway Name *</label>
                  <input
                    type="text"
                    value={editGwName}
                    onChange={(e) => setEditGwName(e.target.value)}
                    className="w-full p-2 rounded border font-semibold text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Account Type *</label>
                  <select
                    value={editGwType}
                    onChange={(e) => setEditGwType(e.target.value as GatewayAccountType)}
                    className="w-full p-2 rounded border bg-white font-medium"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Agent">Agent</option>
                    <option value="Merchant">Merchant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Account / Wallet Number *</label>
                <input
                  type="text"
                  value={editGwNumber}
                  onChange={(e) => setEditGwNumber(e.target.value)}
                  className="w-full p-2 rounded border font-mono font-bold text-gray-900"
                  required
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-semibold text-gray-700 block mb-1 text-[11px]">Gateway Logo URL</label>
                  <input
                    type="text"
                    value={editGwLogoUrl}
                    onChange={(e) => setEditGwLogoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2 rounded border font-mono text-[11px] outline-none focus:border-[#0284c7]"
                  />
                </div>
                {editGwLogoUrl && (
                  <div className="w-10 h-10 rounded border bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 mt-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editGwLogoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Instructions</label>
                <input
                  type="text"
                  value={editGwInstructions}
                  onChange={(e) => setEditGwInstructions(e.target.value)}
                  className="w-full p-2 rounded border"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingGateway(null)}
                className="py-2 px-4 border rounded font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded shadow-sm"
              >
                Save Gateway Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 animate-in fade-in-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editingBanner) return;
              updateBanner(editingBanner.id, {
                title: editBannerTitle.trim(),
                subtitle: editBannerSubtitle.trim(),
                badge: editBannerBadge.trim(),
                imageUrl: editBannerImageUrl.trim(),
                ctaText: editBannerCta.trim(),
                categoryId: editBannerCategoryId,
                type: editBannerType
              });
              setEditingBanner(null);
              showToast(`Banner "${editBannerTitle}" updated successfully!`, 'success');
            }}
            className="bg-white rounded-xl p-5 max-w-[600px] w-full text-xs space-y-3 shadow-2xl border border-gray-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Edit className="w-4 h-4 text-[#0284c7]" />
                <span>Edit Homepage Banner Details</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Banner Title *</label>
                  <input
                    type="text"
                    value={editBannerTitle}
                    onChange={(e) => setEditBannerTitle(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] font-medium text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Subtitle / Offer</label>
                  <input
                    type="text"
                    value={editBannerSubtitle}
                    onChange={(e) => setEditBannerSubtitle(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={editBannerBadge}
                    onChange={(e) => setEditBannerBadge(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editBannerCta}
                    onChange={(e) => setEditBannerCta(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] font-medium text-gray-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-700 block mb-1">Banner Image URL *</label>
                  <input
                    type="text"
                    value={editBannerImageUrl}
                    onChange={(e) => setEditBannerImageUrl(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] font-mono text-[11px]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-700 block mb-1">Target Category / Placement</label>
                  <select
                    value={editBannerCategoryId}
                    onChange={(e) => setEditBannerCategoryId(e.target.value)}
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] bg-white font-medium text-gray-900"
                  >
                    <option value="all">All / Homepage Banner</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-700 block mb-1">Banner Placement / Type</label>
                  <select
                    value={editBannerType}
                    onChange={(e) => setEditBannerType(e.target.value as 'slider' | 'bottom')}
                    className="w-full p-2 rounded border border-gray-300 focus:border-[#0284c7] bg-white font-medium text-gray-900"
                  >
                    <option value="slider">Top Slider Banner (Header)</option>
                    <option value="bottom">Bottom Deal Banner (Nicher Banner)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="py-2 px-4 border rounded font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded shadow-sm"
              >
                Save Banner Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
