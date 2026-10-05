'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { cleanQAId } from '@/lib/utils/id-generator';
import { Product, OrderStatus, PayoutMethod, ProductMedia, Order } from '@/lib/types/ecommerce';
import { CourierDispatchModal } from '@/components/Orders/CourierDispatchModal';
import {
  Store,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  TrendingUp,
  Wallet,
  Star,
  Tag,
  Bell,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  BarChart3,
  HelpCircle,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  ArrowUpRight,
  DollarSign,
  FileSpreadsheet,
  Building,
  UserCheck,
  UploadCloud,
  Menu,
  Check,
  X,
  Share2,
  LogOut,
  Megaphone,
  Zap,
  Sparkles,
  Play,
  Pause,
  Target,
  Flame,
  Activity,
  Copy,
  Globe,
  Save,
  Video,
  Upload,
  FolderPlus,
  Image as ImageIcon
} from 'lucide-react';
import SellerWalletDashboard from './SellerWalletDashboard';

export const SellerCenter: React.FC<{
  onOpenPublicShop?: (slug: string) => void;
}> = ({ onOpenPublicShop }) => {
  const router = useRouter();
  const {
    currentSeller,
    sellers,
    setCurrentSeller,
    language,
    setLanguage,
    t,
    sellerWallets,
    sellerTransactions,
    withdrawalRequests,
    sellerNotifications,
    productQnAs,
    sellerPromotions,
    sponsoredCampaigns,
    products,
    categories,
    orders,
    addSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    updateSellerProfile,
    requestWithdrawal,
    replyToReview,
    answerQuestion,
    createSellerPromotion,
    createSponsoredCampaign,
    toggleCampaignStatus,
    deleteSponsoredCampaign,
    simulateCampaignTraffic,
    markNotificationAsRead,
    showToast,
    formatPrice,
    setIsAdminView,
    updateOrderStatus,
    logout,
    adminAdSettings,
    depositRequests,
    submitSellerDeposit
  } = useMarketplace();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'reports' | 'orders' | 'earnings' | 'reviews' | 'promotions' | 'ads' | 'notifications' | 'settings'
  >('overview');

  // Responsive Mobile Menu Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Filter & Search states
  const [productSearch, setProductQ] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING_REVIEW' | 'REJECTED'>('ALL');
  const [orderSearch, setOrderQ] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');

  // Ad Campaign Creation Modal State
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [selectedProductForAd, setSelectedProductForAd] = useState<string>('');
  const [adDailyBudget, setAdDailyBudget] = useState<number>(500);
  const [adBiddingType, setAdBiddingType] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [adBidAmount, setAdBidAmount] = useState<number>(1.5);
  const [adKeywordsInput, setAdKeywordsInput] = useState<string>('smartwatch, bluetooth call, waterproof');
  const [adNegativeKeywordsInput, setAdNegativeKeywordsInput] = useState<string>('free, fake, broken');

  // Deposit for Ads Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(1000);
  const [depositMethod, setDepositMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer'>('bKash');
  const [depositSenderNumber, setDepositSenderNumber] = useState('');
  const [depositTrxId, setDepositTrxId] = useState('');
  const [depositNotes, setDepositNotes] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(language === 'bn' ? `"${text}" ক্লিপবোর্ডে কপি হয়েছে!` : `Copied "${text}" to clipboard!`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Modal states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [dispatchingOrder, setDispatchingOrder] = useState<Order | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<number>(5000);
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('bKash');
  const [payoutAccountNum, setPayoutAccountNum] = useState<string>(currentSeller?.payoutAccount || '01712998877');

  // Reply Modals / inputs
  const [qnaAnswerText, setQnaAnswerText] = useState<{ [id: string]: string }>({});

  // Active Seller Object
  const seller = currentSeller || sellers[0] || {
    id: 'seller-apex-01',
    shopName: 'Apex Tech & Gadget Center',
    slug: 'apex-gadget-store',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    status: 'Approved' as const,
    phone: '01712998877',
    email: 'seller@apexbd.com',
    shopAddress: 'Shop #304, Level 4, IDB Bhaban, Dhaka',
    payoutMethod: 'bKash' as const,
    payoutAccount: '01712998877',
    rating: 4.9,
    followerCount: 12840,
    joinedDate: '2024-03-15'
  };

  // Local Shop Settings State
  const [shopForm, setShopForm] = useState({
    shopName: seller.shopName || '',
    logo: seller.logo || '',
    banner: seller.banner || '',
    description: seller.description || '',
    phone: seller.phone || '',
    shopAddress: seller.shopAddress || '',
    payoutMethod: (seller.payoutMethod as PayoutMethod) || 'bKash',
    payoutAccount: seller.payoutAccount || ''
  });

  useEffect(() => {
    if (seller) {
      setShopForm({
        shopName: seller.shopName || '',
        logo: seller.logo || '',
        banner: seller.banner || '',
        description: seller.description || '',
        phone: seller.phone || '',
        shopAddress: seller.shopAddress || '',
        payoutMethod: (seller.payoutMethod as PayoutMethod) || 'bKash',
        payoutAccount: seller.payoutAccount || ''
      });
      setPayoutAccountNum(seller.payoutAccount || '01712998877');
    }
  }, [
    seller.id,
    seller.shopName,
    seller.logo,
    seller.banner,
    seller.description,
    seller.phone,
    seller.shopAddress,
    seller.payoutMethod,
    seller.payoutAccount
  ]);

  const handleSaveShopSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSellerProfile(seller.id, {
      shopName: shopForm.shopName,
      logo: shopForm.logo,
      banner: shopForm.banner,
      description: shopForm.description,
      phone: shopForm.phone,
      shopAddress: shopForm.shopAddress,
      payoutMethod: shopForm.payoutMethod,
      payoutAccount: shopForm.payoutAccount
    });
    showToast(
      language === 'bn'
        ? '🎉 শপ প্রোফাইল ও সেটিংস সফলভাবে সেভ করা হয়েছে এবং ওয়েবসাইটে আপডেট হয়েছে!'
        : '🎉 Shop Profile & Settings saved successfully! Updated across Website & Admin Panel.',
      'success'
    );
  };

  // Seller's Products & Orders
  const sellerProducts = useMemo(() => {
    return products.filter((p) => !p.sellerId || p.sellerId === seller.id);
  }, [products, seller.id]);

  const filteredSellerProducts = useMemo(() => {
    return sellerProducts.filter((p) => {
      const q = productSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.titleBn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.specifications?.SKU && p.specifications.SKU.toLowerCase().includes(q));

      const matchesStatus =
        productStatusFilter === 'ALL' ||
        (productStatusFilter === 'ACTIVE' && (!p.status || p.status === 'ACTIVE')) ||
        p.status === productStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sellerProducts, productSearch, productStatusFilter]);

  const sellerOrders = useMemo(() => {
    return orders.filter((ord) =>
      ord.items.some((item) => {
        const matchingProd = products.find((p) => p.id === item.productId);
        return matchingProd ? (!matchingProd.sellerId || matchingProd.sellerId === seller.id) : true;
      })
    );
  }, [orders, products, seller.id]);

  // Sponsored Ad Campaigns for this seller
  const myCampaigns = useMemo(() => {
    return (sponsoredCampaigns || []).filter((c) => c.sellerId === seller.id);
  }, [sponsoredCampaigns, seller.id]);

  // Wallet & QnAs
  const wallet = sellerWallets[seller.id] || {
    id: `wal-${seller.id}`,
    sellerId: seller.id,
    totalIncome: 148500,
    totalCommission: 7425,
    netEarnings: 141075,
    availableBalance: 42500,
    adBalance: 1500,
    pendingBalance: 18200,
    withdrawnAmount: 80375,
    updatedAt: new Date().toISOString()
  };

  const myQnas = useMemo(() => {
    return productQnAs.filter((q) => q.sellerId === seller.id);
  }, [productQnAs, seller.id]);

  const myNotifications = useMemo(() => {
    return sellerNotifications.filter((n) => n.sellerId === seller.id);
  }, [sellerNotifications, seller.id]);

  const unreadNotifCount = myNotifications.filter((n) => !n.isRead).length;

  // New Product Upload Form State (5 Images + 1 Video + Description + Specs + Keywords)
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdTitleBn, setNewProdTitleBn] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdDescBn, setNewProdDescBn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(1200);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(1500);
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || 'cat-electronics');
  const [newProdStock, setNewProdStock] = useState<number>(25);
  const [newProdBrand, setNewProdBrand] = useState('Apex Tech');
  const [newProdWarranty, setNewProdWarranty] = useState('7 Days Replacement & 1 Year Service Warranty');
  const [newProdTags, setNewProdTags] = useState('bluetooth, smartwatch, calling, waterproof');

  // Up to 5 Images State
  const [newProdImage1, setNewProdImage1] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');
  const [newProdImage2, setNewProdImage2] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
  const [newProdImage3, setNewProdImage3] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
  const [newProdImage4, setNewProdImage4] = useState('https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80');
  const [newProdImage5, setNewProdImage5] = useState('https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80');

  // 1 Video URL State
  const [newProdVideoUrl, setNewProdVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

  // Specialist Specs
  const [newProdSpec1, setNewProdSpec1] = useState('Display: 1.96" Super AMOLED Touch Screen');
  const [newProdSpec2, setNewProdSpec2] = useState('Battery: 450mAh Ultra Long 7 Days Backup');
  const [newProdSpec3, setNewProdSpec3] = useState('Body & Water Rating: Metallic Alloy IP68 Waterproof');

  // Helper to store image via /api/upload-image API route
  const uploadImageApi = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string) || '';
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64, fileName: file.name })
          });
          const data = await res.json();
          if (data.success && data.url) {
            resolve(data.url);
            return;
          }
        } catch (e) {
          console.warn('API upload error fallback to base64:', e);
        }
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  };

  // Direct Gallery / Desktop File Upload Handlers (Up to 5 images)
  const handleBatchGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArr = Array.from(files).slice(0, 5);
    for (let idx = 0; idx < fileArr.length; idx++) {
      const url = await uploadImageApi(fileArr[idx]);
      if (idx === 0) setNewProdImage1(url);
      if (idx === 1) setNewProdImage2(url);
      if (idx === 2) setNewProdImage3(url);
      if (idx === 3) setNewProdImage4(url);
      if (idx === 4) setNewProdImage5(url);
    }
    showToast(
      isBn
        ? `🎉 /api/upload-image এর মাধ্যমে ${fileArr.length}টি ছবি সফলভাবে আপলোড ও স্টোর হয়েছে!`
        : `🎉 ${fileArr.length} image(s) uploaded & stored via Image API!`,
      'success'
    );
  };

  const handleSingleImageUpload = async (slotIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageApi(file);
    if (slotIndex === 0) setNewProdImage1(url);
    if (slotIndex === 1) setNewProdImage2(url);
    if (slotIndex === 2) setNewProdImage3(url);
    if (slotIndex === 3) setNewProdImage4(url);
    if (slotIndex === 4) setNewProdImage5(url);
    showToast(isBn ? `ছবি #${slotIndex + 1} আপলোড ও স্টোর হয়েছে!` : `Image #${slotIndex + 1} uploaded & stored!`, 'success');
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageApi(file);
    setNewProdVideoUrl(url);
    showToast(isBn ? '🎬 ভিডিও ফাইল সফলভাবে আপলোড ও যুক্ত হয়েছে!' : '🎬 Video file attached successfully!', 'success');
  };

  const handleShopLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageApi(file);
    setShopForm((prev) => ({ ...prev, logo: url }));
    showToast(isBn ? '🖼️ শপ লোগো আপলোড ও স্টোর হয়েছে!' : '🖼️ Shop logo stored via Image API!', 'success');
  };

  const handleShopBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageApi(file);
    setShopForm((prev) => ({ ...prev, banner: url }));
    showToast(isBn ? '🖼️ শপ ব্যানার আপলোড ও স্টোর হয়েছে!' : '🖼️ Shop banner stored via Image API!', 'success');
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setNewProdTitle('');
    setNewProdTitleBn('');
    setNewProdDesc('');
    setNewProdDescBn('');
    setNewProdPrice(1200);
    setNewProdOriginalPrice(1500);
    setNewProdStock(25);
    setNewProdBrand('Apex Tech');
    setNewProdWarranty('7 Days Replacement & 1 Year Service Warranty');
    setNewProdTags('bluetooth, smartwatch, calling, waterproof');
    setNewProdImage1('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');
    setNewProdImage2('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
    setNewProdImage3('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
    setNewProdImage4('https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80');
    setNewProdImage5('https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80');
    setNewProdVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setNewProdSpec1('Display: 1.96" Super AMOLED Touch Screen');
    setNewProdSpec2('Battery: 450mAh Ultra Long 7 Days Backup');
    setNewProdSpec3('Body & Water Rating: Metallic Alloy IP68 Waterproof');
    setIsAddProductOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setNewProdTitle(p.title);
    setNewProdTitleBn(p.titleBn || p.title);
    setNewProdDesc(p.description || '');
    setNewProdDescBn(p.descriptionBn || p.description || '');
    setNewProdPrice(p.price);
    setNewProdOriginalPrice(p.originalPrice || p.price);
    setNewProdStock(p.stock);
    setNewProdCategory(p.categoryId || categories[0]?.id || 'cat-electronics');
    setNewProdBrand(p.brand || 'Generic');
    setNewProdWarranty(p.warranty || '7 Days Replacement Warranty');
    setNewProdTags(p.tags ? p.tags.join(', ') : 'gadget, electronics');
    
    // Populate up to 5 images
    const images = (p.media || []).filter((m) => m.type === 'IMAGE').map((m) => m.url);
    setNewProdImage1(images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80');
    setNewProdImage2(images[1] || '');
    setNewProdImage3(images[2] || '');
    setNewProdImage4(images[3] || '');
    setNewProdImage5(images[4] || '');

    // Populate video
    const vid = (p.media || []).find((m) => m.type === 'VIDEO')?.url || p.videoUrl || '';
    setNewProdVideoUrl(vid);

    // Specs
    setNewProdSpec1(p.specifications?.Feature1 || p.specifications?.Display || '');
    setNewProdSpec2(p.specifications?.Feature2 || p.specifications?.Battery || '');
    setNewProdSpec3(p.specifications?.Feature3 || p.specifications?.Warranty || '');

    setIsAddProductOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle || !newProdPrice) {
      showToast(language === 'bn' ? 'প্রোডাক্টের নাম এবং মূল্য অবশ্যই প্রয়োজন' : 'Product title and price are required', 'error');
      return;
    }

    const discount = newProdOriginalPrice > newProdPrice
      ? Math.round(((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100)
      : 0;

    // Up to 5 Images List
    const imageList: ProductMedia[] = [newProdImage1, newProdImage2, newProdImage3, newProdImage4, newProdImage5]
      .filter((url) => Boolean(url && url.trim()))
      .map((url, index) => ({
        id: `med-${Date.now()}-${index}`,
        url: url.trim(),
        type: 'IMAGE' as const,
        alt: `${newProdTitle} image ${index + 1}`
      }));

    if (imageList.length === 0) {
      imageList.push({
        id: `med-${Date.now()}-0`,
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        type: 'IMAGE' as const,
        alt: newProdTitle
      });
    }

    // Add Video Media item if present
    if (newProdVideoUrl && newProdVideoUrl.trim()) {
      imageList.push({
        id: `med-vid-${Date.now()}`,
        url: newProdVideoUrl.trim(),
        type: 'VIDEO' as const,
        alt: `${newProdTitle} Official Video`
      });
    }

    const prodData = {
      title: newProdTitle,
      titleBn: newProdTitleBn || newProdTitle,
      description: newProdDesc || 'Official guaranteed item from seller.',
      descriptionBn: newProdDescBn || newProdDesc || 'অফিসিয়াল গ্যারান্টিযুক্ত পণ্য।',
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice) || Number(newProdPrice),
      discountPercent: discount,
      stock: Number(newProdStock),
      brand: newProdBrand || 'Generic',
      categoryId: newProdCategory,
      warranty: newProdWarranty || '7 Days Replacement Warranty',
      videoUrl: newProdVideoUrl ? newProdVideoUrl.trim() : undefined,
      tags: newProdTags ? newProdTags.split(',').map((t) => t.trim()).filter(Boolean) : ['electronics'],
      rating: editingProduct ? editingProduct.rating : 5,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
      soldCount: editingProduct ? editingProduct.soldCount : 0,
      specifications: {
        Warranty: newProdWarranty || '7 Days Replacement',
        Brand: newProdBrand || 'Generic',
        Feature1: newProdSpec1 || 'High Performance',
        Feature2: newProdSpec2 || 'Premium Build Quality',
        Feature3: newProdSpec3 || 'Official Guarantee'
      },
      media: imageList
    };

    if (editingProduct) {
      updateSellerProduct(editingProduct.id, prodData);
      showToast(
        language === 'bn'
          ? 'প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে!'
          : 'Product updated successfully!',
        'success'
      );
    } else {
      addSellerProduct(prodData);
    }

    setIsAddProductOpen(false);
    setEditingProduct(null);
  };

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const success = requestWithdrawal(seller.id, Number(payoutAmount), payoutMethod, payoutAccountNum);
    if (success) {
      setIsWithdrawModalOpen(false);
      showToast(
        language === 'bn'
          ? 'উইথড্র রিকোয়েস্ট সফলভাবে জমা এবং এডমিন প্যানেলে সেভ হয়েছে!'
          : 'Withdrawal request saved & submitted to Admin Panel!',
        'success'
      );
    }
  };

  // Promotion submit
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number>(10);
  const [promoCode, setPromoCode] = useState('');

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle) {
      showToast(language === 'bn' ? 'প্রোমোশন নাম দিন' : 'Promo title is required', 'error');
      return;
    }
    createSellerPromotion({
      sellerId: seller.id,
      title: promoTitle,
      discountPercent: Number(promoDiscount),
      productIds: sellerProducts.map((p) => p.id),
      startTime: new Date().toISOString(),
      endTime: '2026-12-31',
      isActive: true
    });
    setPromoTitle('');
    setPromoCode('');
    showToast(language === 'bn' ? 'প্রোমোশন ডিল সেভ ও ওয়েবসাইটে চালু করা হয়েছে!' : 'Promotion deal saved & live on website!', 'success');
  };

  // Ad Campaign Submit
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = sellerProducts.find((p) => p.id === selectedProductForAd) || sellerProducts[0];
    if (!prod) {
      showToast(language === 'bn' ? 'প্রথমে একটি প্রোডাক্ট নির্বাচন করুন' : 'Please select a product for ad', 'error');
      return;
    }

    const keywords = adKeywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const negativeKeywords = adNegativeKeywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    createSponsoredCampaign({
      sellerId: seller.id,
      productId: prod.id,
      productTitle: prod.title,
      productImage:
        prod.media[0]?.url ||
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      dailyBudget: Number(adDailyBudget) || 500,
      bidAmount: adBiddingType === 'AUTO' ? 1.5 : Number(adBidAmount) || 1.2,
      biddingType: adBiddingType,
      targetKeywords: keywords.length > 0 ? keywords : [prod.title, prod.brand, 'best product'],
      negativeKeywords,
      status: 'ACTIVE'
    });

    setIsCreateCampaignOpen(false);
    showToast(
      language === 'bn'
        ? '🚀 স্পনসরড এড ক্যাম্পেইন সেভ ও ওয়েবসাইটে চালু হয়েছে!'
        : '🚀 Sponsored Ad Campaign saved & live on website!',
      'success'
    );
  };

  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans pb-16 text-gray-800">
      {/* Top Seller Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Left section */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* 3-line Hamburger Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-800 text-white focus:outline-none cursor-pointer flex items-center justify-center shrink-0 border border-slate-700"
              title="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <img
                src={shopForm.logo || seller.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'}
                alt={shopForm.shopName || seller.shopName}
                className="w-8 h-8 rounded-lg object-cover border border-sky-400/30 shrink-0 hidden sm:block"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-xs sm:text-sm tracking-tight leading-tight text-white truncate max-w-[160px] sm:max-w-[220px]">
                  {shopForm.shopName || seller.shopName}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-sky-300 font-mono font-bold leading-none bg-sky-950/70 border border-sky-500/30 px-1.5 py-0.5 rounded">
                    ID: {cleanQAId(seller.sellerIdNumber || '81049281')}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">
                    {isBn ? 'মার্চেন্ট অ্যাকাউন্ট' : 'Merchant Account'}
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Switcher Dropdown */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80 text-xs">
              <Store className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
              <select
                value={seller.id}
                onChange={(e) => {
                  const found = sellers.find((s) => s.id === e.target.value);
                  if (found) setCurrentSeller(found);
                }}
                className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer max-w-[180px]"
              >
                {sellers.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.shopName} ({s.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Verified Merchant Badge */}
            <span
              className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                seller.status === 'Approved'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : seller.status === 'Pending'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                  : 'bg-red-500/15 text-red-300 border border-red-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">
                {seller.status === 'Approved' ? (isBn ? 'ভেরিফাইড মার্চেন্ট' : 'Verified Merchant') : seller.status}
              </span>
            </span>

            {/* BN / EN Language Switcher */}
            <button
              onClick={() => {
                const nextLang = language === 'bn' ? 'en' : 'bn';
                setLanguage(nextLang);
                showToast(
                  nextLang === 'bn'
                    ? 'ভাষা পরিবর্তন করা হয়েছে: বাংলা'
                    : 'Language switched to English',
                  'info'
                );
              }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-700 cursor-pointer transition-all shrink-0"
              title="Switch Language / ভাষা পরিবর্তন করুন"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>{isBn ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-1.5 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
              title={isBn ? 'নোটিফিকেশনস' : 'Notifications'}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#0284c7] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Public Shop Preview */}
            <button
              onClick={() => {
                if (onOpenPublicShop) {
                  onOpenPublicShop(seller.slug);
                }
                router.push(`/shop/${seller.slug}`);
              }}
              className="hidden sm:flex items-center gap-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
              title={isBn ? 'পাবলিক শপ পেইজ দেখুন' : 'View Public Store Page'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isBn ? 'শপ দেখুন' : 'View Shop'}</span>
            </button>

            <button
              onClick={() => {
                setIsAdminView(false);
                router.push('/');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer hidden md:block"
            >
              {isBn ? 'স্টোরফ্রন্ট' : 'Storefront'}
            </button>

            <button
              onClick={() => {
                logout();
                setIsAdminView(false);
                router.push('/');
                showToast(isBn ? 'সেলার অ্যাকাউন্ট থেকে সফলভাবে লগআউট করা হয়েছে' : 'Logged out of Seller Account', 'info');
              }}
              className="bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              title={isBn ? 'লগআউট' : 'Logout'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Container */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 mt-5 flex flex-col md:flex-row gap-5">
        {/* Compact Sidebar Navigation */}
        <aside className={`${isMobileMenuOpen ? 'block animate-in slide-in-from-top duration-200' : 'hidden'} md:block w-full md:w-60 shrink-0 bg-white rounded-2xl border border-gray-200 p-2.5 shadow-2xs h-fit md:sticky top-16 z-20`}>
          {/* Shop Card Header */}
          <div className="p-3 bg-gradient-to-br from-sky-50/80 to-amber-50/50 rounded-xl border border-sky-100 mb-3 flex items-center gap-3">
            <img
              src={shopForm.logo || seller.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'}
              alt={shopForm.shopName || seller.shopName}
              className="w-10 h-10 rounded-xl object-cover border border-sky-200 shadow-2xs"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-xs text-gray-900 truncate">{shopForm.shopName || seller.shopName}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-[11px] font-bold text-gray-800">{seller.rating}</span>
                <span className="text-[10px] text-gray-400">({seller.followerCount.toLocaleString()} {isBn ? 'ফলোয়ার' : 'Followers'})</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-[9.5px] font-mono font-bold bg-white text-sky-800 px-1.5 py-0.2 rounded border border-sky-200">
                  ID: {cleanQAId(seller.sellerIdNumber || '81049281')}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex flex-col space-y-1 text-xs font-bold text-gray-700">
            <button
              onClick={() => selectTab('overview')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'ড্যাশবোর্ড (সারসংক্ষেপ)' : 'Dashboard'}</span>
            </button>

            <button
              onClick={() => selectTab('products')}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'আমার প্রোডাক্টসমূহ' : 'My Products'}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {sellerProducts.length}
              </span>
            </button>

            <button
              onClick={() => selectTab('reports')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'সেলস রিপোর্ট' : 'Sales Report'}</span>
            </button>

            <button
              onClick={() => selectTab('orders')}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'অর্ডার হ্যান্ডলিং' : 'Manage Orders'}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {sellerOrders.length}
              </span>
            </button>

            <button
              onClick={() => selectTab('earnings')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'earnings'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <Wallet className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'ওয়ালেট ও ইনকাম' : 'Earnings & Wallet'}</span>
            </button>

            <button
              onClick={() => selectTab('reviews')}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'রিভিউ ও প্রশ্ন' : 'Reviews & Q&A'}</span>
              </div>
              {myQnas.filter((q) => !q.answer).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-ping ml-1" />
              )}
            </button>

            <button
              onClick={() => selectTab('promotions')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'promotions'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <Tag className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'প্রোমোশন ডিল' : 'Promotions'}</span>
            </button>

            <button
              onClick={() => selectTab('ads')}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'ads'
                  ? 'bg-gradient-to-r from-amber-500 to-[#0284c7] text-white shadow-xs font-bold'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 shrink-0 text-amber-500" />
                <span>{isBn ? 'স্পনসরড এডস' : 'Sponsored Ads'}</span>
              </div>
              <span
                className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  activeTab === 'ads' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {myCampaigns.length} Live
              </span>
            </button>

            <button
              onClick={() => selectTab('notifications')}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'নোটিফিকেশনস' : 'Notifications'}</span>
              </div>
              {unreadNotifCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <button
              onClick={() => selectTab('settings')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>{isBn ? 'শপ সেটিংস' : 'Shop Settings'}</span>
            </button>

            <button
              onClick={() => {
                logout();
                setIsAdminView(false);
                setIsMobileMenuOpen(false);
                showToast(isBn ? 'সেলার অ্যাকাউন্ট থেকে লগআউট করা হয়েছে' : 'Logged out of Seller Account', 'info');
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 mt-2"
            >
              <LogOut className="w-4 h-4 shrink-0 text-red-600" />
              <span>{isBn ? 'লগআউট সেলার' : 'Log Out Seller'}</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Pending Review Notice Header */}
          {sellerProducts.some((p) => p.status === 'PENDING_REVIEW') && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 animate-spin" />
                </div>
                <div>
                  <span className="font-extrabold block">
                    {isBn ? '⏳ আপনার কিছু প্রোডাক্ট এডমিন অনুমোদনের অপেক্ষায় আছে (Pending Review)' : '⏳ Products Pending Admin Review'}
                  </span>
                  <span className="text-[11px] text-amber-800">
                    {isBn
                      ? 'নতুন আপলোড করা প্রোডাক্ট এডমিন রিভিউ করে অনুমোদন (Approved) দিলে সাথে সাথে ওয়েবসাইটে লাইভ দেখাবে।'
                      : 'Newly uploaded products are reviewed by Admin before appearing on the public marketplace.'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('products');
                  setProductStatusFilter('PENDING_REVIEW');
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shrink-0 cursor-pointer shadow-2xs"
              >
                {isBn ? 'পেন্ডিং লিস্ট দেখুন →' : 'View Pending →'}
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW / DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-extrabold text-lg sm:text-xl">
                    {isBn ? `স্বাগতম, ${shopForm.shopName || seller.shopName}! 🏪` : `Welcome back, ${shopForm.shopName || seller.shopName}! 🏪`}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    {isBn
                      ? 'ইনভেন্টরি পরিচালনা, কাস্টমার অর্ডার ট্র্যাক, উইথড্রয়াল প্রসেস এবং শপের বিক্রি বাড়ান।'
                      : 'Manage inventory, track customer orders, process payouts & grow your shop sales.'}
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBn ? 'নতুন প্রোডাক্ট আপলোড করুন' : 'Upload New Product'}</span>
                </button>
              </div>

              {/* Top Summary Analytics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Products Uploaded */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-[11px] font-bold uppercase tracking-wider">{isBn ? 'মোট প্রোডাক্ট' : 'Total Products'}</span>
                    <div className="w-7 h-7 rounded-lg bg-sky-50 text-[#0284c7] flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-gray-900 tabular-nums">
                    {sellerProducts.length}
                  </div>
                  <div className="text-[10.5px] text-gray-400">
                    {isBn
                      ? `স্টকে আছে: ${sellerProducts.filter((p) => p.stock > 0).length} | পেন্ডিং: ${sellerProducts.filter((p) => p.status === 'PENDING_REVIEW').length}`
                      : `Active: ${sellerProducts.filter((p) => p.stock > 0).length} | Pending: ${sellerProducts.filter((p) => p.status === 'PENDING_REVIEW').length}`}
                  </div>
                </div>

                {/* Total Orders & Pieces Sold */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-[11px] font-bold uppercase tracking-wider">{isBn ? 'অর্ডারস ও আইটেমস' : 'Orders & Items'}</span>
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-gray-900 tabular-nums">
                    {sellerOrders.length} {isBn ? 'টি অর্ডার' : 'Orders'}
                  </div>
                  <div className="text-[10.5px] text-gray-400">
                    {isBn
                      ? `মোট বিক্রি: ${sellerProducts.reduce((sum, p) => sum + p.soldCount, 0)} টি`
                      : `Total Units Sold: ${sellerProducts.reduce((sum, p) => sum + p.soldCount, 0)} Pcs`}
                  </div>
                </div>

                {/* Gross Income & Commission */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-[11px] font-bold uppercase tracking-wider">{isBn ? 'মোট বিক্রি (Gross)' : 'Gross Income'}</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-gray-900 tabular-nums">
                    {formatPrice(wallet.totalIncome)}
                  </div>
                  <div className="text-[10.5px] text-emerald-600 font-bold">
                    {isBn ? `নিট ইনকাম: ${formatPrice(wallet.netEarnings)}` : `Net Earnings: ${formatPrice(wallet.netEarnings)}`}
                  </div>
                </div>

                {/* Available Balance */}
                <div className="bg-white p-4 rounded-2xl border border-sky-200 bg-sky-50/30 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-900">{isBn ? 'উত্তোলনযোগ্য ব্যালেন্স' : 'Available Payout'}</span>
                    <div className="w-7 h-7 rounded-lg bg-[#0284c7] text-white flex items-center justify-center shadow-xs">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-[#0284c7] tabular-nums">
                    {formatPrice(wallet.availableBalance)}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
                    <span>{isBn ? `পেন্ডিং: ${formatPrice(wallet.pendingBalance)}` : `Pending: ${formatPrice(wallet.pendingBalance)}`}</span>
                    <button
                      onClick={() => setIsWithdrawModalOpen(true)}
                      className="text-[#0284c7] font-bold underline cursor-pointer hover:text-[#0369a1]"
                    >
                      {isBn ? 'উইথড্র →' : 'Withdraw →'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Sales Line Chart & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Sales Line Chart */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900">{isBn ? 'সেলস ও ইনকাম ট্রেন্ড' : 'Sales & Income Trend'}</h3>
                      <p className="text-[11px] text-gray-400">{isBn ? 'দৈনিক শপ বিক্রি ও পারফর্মেন্স' : 'Daily sales performance & gross revenue'}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[11px] font-bold">
                      <span className="px-2 py-0.5 bg-white text-gray-900 rounded shadow-2xs">{isBn ? 'দৈনিক' : 'Daily'}</span>
                      <span className="px-2 py-0.5 text-gray-500 hover:text-gray-900 cursor-pointer">{isBn ? 'সাপ্তাহিক' : 'Weekly'}</span>
                      <span className="px-2 py-0.5 text-gray-500 hover:text-gray-900 cursor-pointer">{isBn ? 'মাসিক' : 'Monthly'}</span>
                    </div>
                  </div>

                  <div className="h-44 w-full relative flex items-end pt-6 pb-2 px-2 border-b border-gray-100">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,100 Q60,30 120,70 T240,40 T360,80 T500,20 L500,120 L0,120 Z"
                        fill="url(#salesGrad)"
                      />
                      <path
                        d="M0,100 Q60,30 120,70 T240,40 T360,80 T500,20"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                    <span>{isBn ? 'সোম' : 'Mon'}</span>
                    <span>{isBn ? 'মঙ্গল' : 'Tue'}</span>
                    <span>{isBn ? 'বুধ' : 'Wed'}</span>
                    <span>{isBn ? 'বৃহস্পতি' : 'Thu'}</span>
                    <span>{isBn ? 'শুক্র' : 'Fri'}</span>
                    <span>{isBn ? 'শনি' : 'Sat'}</span>
                    <span>{isBn ? 'আজ' : 'Today'}</span>
                  </div>
                </div>

                {/* Top Selling Products List */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <h3 className="font-extrabold text-sm text-gray-900">{isBn ? 'সর্বোচ্চ বিক্রীত প্রোডাক্টস' : 'Top Selling Products'}</h3>
                  <div className="divide-y divide-gray-100 space-y-2 pt-1">
                    {sellerProducts.slice(0, 4).map((p) => (
                      <div key={p.id} className="pt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.media[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'}
                            alt={p.title}
                            className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{isBn ? (p.titleBn || p.title) : p.title}</p>
                            <p className="text-[10px] text-gray-400 tabular-nums">{formatPrice(p.price)}</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                          {p.soldCount} {isBn ? 'টি বিক্রি' : 'Sold'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Platform Category Commission Rates Schedule for Sellers */}
              <div className="bg-gradient-to-br from-amber-50/90 to-sky-50/80 rounded-2xl border border-amber-200/80 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <h3 className="font-extrabold text-sm">
                      {isBn ? 'প্ল্যাটফর্ম ক্যাটাগরি কমিশন তালিকা (Commission Schedule)' : 'Platform Category Commission Rates'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    {isBn ? 'অর্ডার কমপ্লিট হলে প্রযোজ্য' : 'Active Fees'}
                  </span>
                </div>
                <p className="text-xs text-amber-800">
                  {isBn
                    ? 'আপনার বিক্রয় করা প্রোডাক্টের ক্যাটাগরি অনুযায়ী অ্যাডমিন নির্ধারিত কমিশন রেট নিচে দেওয়া হলো:'
                    : 'Commission deducted by marketplace administration based on product category upon successful order delivery:'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
                  {categories.map((cat) => {
                    const comm = cat.commission ?? (cat.id.includes('electronic') || cat.id.includes('accessories') ? 5 : cat.id.includes('fashion') ? 12 : 10);
                    return (
                      <div key={cat.id} className="bg-white p-2.5 rounded-xl border border-amber-200/60 shadow-2xs space-y-1 text-center">
                        <div className="text-[11px] font-extrabold text-gray-900 truncate">{isBn ? (cat.nameBn || cat.name) : cat.name}</div>
                        <div className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 py-0.5 rounded-md font-mono">
                          {comm}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h2 className="font-extrabold text-base text-gray-900">{isBn ? 'প্রোডাক্ট ক্যাটালগ ম্যানেজমেন্ট' : 'Product Catalog Management'}</h2>
                  <p className="text-xs text-gray-400">{isBn ? 'আপনার শপের প্রোডাক্টস যোগ, ৫টি ছবি ও ১টি ভিডিও আপলোড এবং স্টক আপডেট করুন' : 'Add products with up to 5 images, 1 video URL, descriptions & stock'}</p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBn ? '+ নতুন প্রোডাক্ট যোগ করুন' : '+ Add New Product'}</span>
                </button>
              </div>

              {/* Status Filter Tabs & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto overflow-x-auto">
                  <button
                    onClick={() => setProductStatusFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                      productStatusFilter === 'ALL' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {isBn ? `সকল (${sellerProducts.length})` : `All (${sellerProducts.length})`}
                  </button>

                  <button
                    onClick={() => setProductStatusFilter('ACTIVE')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                      productStatusFilter === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700 hover:text-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'অ্যাক্টিভ ও লাইভ' : 'Active'}</span>
                  </button>

                  <button
                    onClick={() => setProductStatusFilter('PENDING_REVIEW')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                      productStatusFilter === 'PENDING_REVIEW' ? 'bg-amber-500 text-white shadow-2xs' : 'text-amber-700 hover:text-amber-800'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isBn ? `পেন্ডিং রিভিউ (${sellerProducts.filter((p) => p.status === 'PENDING_REVIEW').length})` : `Pending Review (${sellerProducts.filter((p) => p.status === 'PENDING_REVIEW').length})`}</span>
                  </button>

                  <button
                    onClick={() => setProductStatusFilter('REJECTED')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 ${
                      productStatusFilter === 'REJECTED' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:text-rose-800'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{isBn ? 'রিজেক্টেড' : 'Rejected'}</span>
                  </button>
                </div>

                {/* Search */}
                <div className="relative flex-1 w-full sm:w-auto max-w-xs">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductQ(e.target.value)}
                    placeholder={isBn ? 'টাইটেল, ব্র্যান্ড বা SKU দিয়ে খুঁজুন...' : 'Search by title, SKU or brand...'}
                    className="w-full py-2 pl-9 pr-3 text-xs rounded-xl border border-gray-200 focus:border-[#0284c7] outline-none"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">{isBn ? 'প্রোডাক্ট বিবরণ' : 'Product'}</th>
                      <th className="py-3 px-4">{isBn ? 'মিডিয়া (ছবি/ভিডিও)' : 'Media'}</th>
                      <th className="py-3 px-4">{isBn ? 'মূল্য' : 'Price'}</th>
                      <th className="py-3 px-4">{isBn ? 'স্টক' : 'Stock'}</th>
                      <th className="py-3 px-4">{isBn ? 'এডমিন স্ট্যাটাস' : 'Approval Status'}</th>
                      <th className="py-3 px-4">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredSellerProducts.map((p) => {
                      const imageCount = (p.media || []).filter((m) => m.type === 'IMAGE').length;
                      const hasVideo = Boolean(p.videoUrl || (p.media || []).some((m) => m.type === 'VIDEO'));

                      return (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={p.media[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80'}
                                alt={p.title}
                                className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-gray-900 block truncate max-w-xs">{isBn ? (p.titleBn || p.title) : p.title}</span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  Brand: {p.brand || 'Generic'} | SKU: {p.specifications?.SKU || p.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold">
                              <span className="bg-sky-50 text-[#0284c7] px-2 py-0.5 rounded-lg border border-sky-100 flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                {imageCount} Images
                              </span>
                              {hasVideo && (
                                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg border border-purple-100 flex items-center gap-1">
                                  <Video className="w-3 h-3 text-purple-600" />
                                  1 Video
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-bold text-gray-900 tabular-nums">
                            {formatPrice(p.price)}
                            {p.originalPrice > p.price && (
                              <span className="text-[10px] text-gray-400 line-through block font-normal">
                                {formatPrice(p.originalPrice)}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {p.stock > 0 ? `${p.stock} Pcs` : (isBn ? 'স্টক শেষ' : 'Out of stock')}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {p.status === 'PENDING_REVIEW' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                <Clock className="w-3 h-3" />
                                {isBn ? '⏳ পেন্ডিং এডমিন রিভিউ' : '⏳ Pending Review'}
                              </span>
                            ) : p.status === 'REJECTED' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                                <XCircle className="w-3 h-3" />
                                {isBn ? '❌ রিজেক্টেড' : '❌ Rejected'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                {isBn ? '✅ অ্যাপ্রুভড ও লাইভ' : '✅ Approved & Live'}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 bg-gray-100 hover:bg-sky-50 hover:text-[#0284c7] rounded-lg transition-colors cursor-pointer"
                                title={isBn ? 'এডিট করুন' : 'Edit'}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  deleteSellerProduct(p.id);
                                  showToast(isBn ? 'প্রোডাক্ট ক্যাটাগরি থেকে রিমুভ করা হয়েছে' : 'Product removed', 'info');
                                }}
                                className="p-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                title={isBn ? 'মুছে ফেলুন' : 'Delete'}
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
          )}

          {/* TAB 3: REPORTS & ANALYTICS */}
          {activeTab === 'reports' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
              <div className="border-b pb-3">
                <h2 className="font-extrabold text-base text-gray-900">{isBn ? 'ফাইন্যান্সিয়াল ও এনালাইটিক্স রিপোর্ট' : 'Financial & Analytics Reports'}</h2>
                <p className="text-xs text-gray-400">{isBn ? 'আপনার শপের ইনকাম, সেটেলমেন্ট এবং কমিশন হিস্টোরি' : 'Track net revenue, order commissions and sales metrics'}</p>
              </div>
              <div className="p-6 bg-sky-50/60 rounded-2xl border border-sky-100 text-center space-y-2">
                <BarChart3 className="w-8 h-8 text-[#0284c7] mx-auto" />
                <h3 className="font-bold text-sm text-gray-900">{isBn ? 'সম্পূর্ণ কাস্টমাইজড রিপোর্ট জেনারেটর' : 'Comprehensive Analytics'}</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  {isBn
                    ? 'আপনার শপের দৈনিক বিক্রি, কাস্টমার রিটার্ন এবং নিট উইথড্রয়াল হিস্টোরি অটো-হিসাব করা হচ্ছে।'
                    : 'Sales analytics and financial summaries are computed live based on your shop orders and wallet withdrawals.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <h2 className="font-extrabold text-base text-gray-900">{isBn ? 'অর্ডার প্রসেসিং ও ডেলিভারি' : 'Order Fulfillment & Management'}</h2>
                <p className="text-xs text-gray-400">{isBn ? 'কাস্টমারের নতুন অর্ডার প্রসেস করুন এবং কুরিয়ার স্ট্যাটাস আপডেট করুন' : 'View new incoming orders, update shipping and print customer invoices'}</p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">{isBn ? 'অর্ডার নম্বর' : 'Order ID'}</th>
                      <th className="py-3 px-4">{isBn ? 'কাস্টমার' : 'Customer'}</th>
                      <th className="py-3 px-4">{isBn ? 'মোট টাকা' : 'Total Amount'}</th>
                      <th className="py-3 px-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                      <th className="py-3 px-4">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {sellerOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#0284c7]">{ord.orderNumber}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{ord.customerName}</td>
                        <td className="py-3 px-4 font-extrabold text-gray-900 tabular-nums">{formatPrice(ord.total)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ord.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => {
                              updateOrderStatus(ord.id, e.target.value as OrderStatus);
                              showToast(isBn ? `অর্ডার স্ট্যাটাস ${e.target.value} এ সেভ হয়েছে!` : `Order status updated to ${e.target.value}`, 'success');
                            }}
                            className="bg-gray-100 border border-gray-300 rounded-lg text-[11px] font-bold px-2 py-1 outline-none cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => setDispatchingOrder(ord)}
                            className="bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-200 px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Book Steadfast / Pathao Courier Dispatch"
                          >
                            <Truck className="w-3 h-3" />
                            <span>{isBn ? 'কুরিয়ারে বুকিং' : 'Dispatch'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: EARNINGS & WALLET */}
          {activeTab === 'earnings' && <SellerWalletDashboard />}

          {/* TAB 6: REVIEWS & Q&A */}
          {activeTab === 'reviews' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <div className="border-b pb-3">
                <h2 className="font-extrabold text-base text-gray-900">{isBn ? 'কাস্টমার রিভিউ ও প্রশ্নোত্তর' : 'Reviews & Customer Q&A'}</h2>
                <p className="text-xs text-gray-400">{isBn ? 'কাস্টমারের প্রশ্নের উত্তর দিন এবং রিভিউ রিপ্লাই করুন' : 'Respond to customer reviews and answer product questions'}</p>
              </div>

              <div className="space-y-3">
                {myQnas.length === 0 ? (
                  <p className="text-xs text-gray-400 italic p-4 text-center">{isBn ? 'কোনো কাস্টমার প্রশ্ন নেই' : 'No pending customer questions.'}</p>
                ) : (
                  myQnas.map((q) => (
                    <div key={q.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                      <div className="font-bold text-gray-900 flex justify-between">
                        <span>❓ {q.userName}: "{q.question}"</span>
                        <span className="text-[10px] text-gray-400">{q.createdAt}</span>
                      </div>
                      {q.answer ? (
                        <div className="bg-sky-50 text-[#0284c7] font-semibold p-2 rounded-lg">
                          💬 {isBn ? 'আপনার উত্তর:' : 'Your Answer:'} {q.answer}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={isBn ? 'উত্তর লিখুন...' : 'Write answer...'}
                            value={qnaAnswerText[q.id] || ''}
                            onChange={(e) => setQnaAnswerText((prev) => ({ ...prev, [q.id]: e.target.value }))}
                            className="flex-1 p-1.5 border border-gray-300 rounded-lg outline-none"
                          />
                          <button
                            onClick={() => {
                              if (qnaAnswerText[q.id]) {
                                answerQuestion(q.id, qnaAnswerText[q.id]);
                                showToast(isBn ? 'উত্তর সেভ করা হয়েছে!' : 'Answer saved!', 'success');
                              }
                            }}
                            className="bg-[#0284c7] text-white px-3 py-1 rounded-lg font-bold cursor-pointer"
                          >
                            {isBn ? 'উত্তর সেভ করুন' : 'Save Answer'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <div className="border-b pb-3">
                <h2 className="font-extrabold text-base text-gray-900">{isBn ? 'প্রোমোশন ডিল ও ভাউচার' : 'Promotions & Vouchers'}</h2>
                <p className="text-xs text-gray-400">{isBn ? 'আপনার শপের প্রোডাক্টে ডিসকাউন্ট কোড যুক্ত করুন' : 'Create voucher deals for your store items'}</p>
              </div>

              <form onSubmit={handleCreatePromo} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                <div>
                  <label className="font-bold block mb-1">{isBn ? 'প্রোমোশন নাম' : 'Promo Title'}</label>
                  <input
                    type="text"
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                    placeholder={isBn ? 'যেমন: ঈদ ক্যাশব্যাক' : 'e.g. Eid Cashback'}
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">{isBn ? 'ভাউচার কোড' : 'Voucher Code'}</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="EID100"
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none font-mono font-bold bg-white"
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold rounded-lg cursor-pointer">
                    {isBn ? 'প্রোমোশন সেভ করুন' : 'Save Promotion'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: SPONSORED ADS */}
          {activeTab === 'ads' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="font-extrabold text-base text-gray-900">{isBn ? 'স্পনসরড এডস ক্যাম্পেইন' : 'Sponsored Ad Campaigns'}</h2>
                  <p className="text-xs text-gray-400">{isBn ? 'প্রোডাক্ট বুস্ট করে ফ্রন্টপেইজে তুলে আনুন' : 'Boost product visibility on top store pages'}</p>
                </div>
                <button
                  onClick={() => setIsCreateCampaignOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl cursor-pointer"
                >
                  {isBn ? '+ নতুন এড চালু করুন' : '+ Create Ad Campaign'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {myCampaigns.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-gray-900 block">{c.productTitle}</span>
                      <span className="text-[10px] text-gray-500">{isBn ? `দৈনিক বাজেট: ৳${c.dailyBudget}` : `Daily Budget: ৳${c.dailyBudget}`}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <div className="border-b pb-3">
                <h2 className="font-extrabold text-base text-gray-900">{isBn ? 'শপ নোটিফিকেশনস' : 'Shop Notifications'}</h2>
                <p className="text-xs text-gray-400">{isBn ? 'অর্ডার, উইথড্রয়াল ও আপডেট নোটিফিকেশনস' : 'Updates on orders, deposits & approvals'}</p>
              </div>
              <div className="space-y-2">
                {myNotifications.map((n) => (
                  <div key={n.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                    <p className="font-extrabold text-gray-900">{n.title}</p>
                    <p className="text-gray-600">{n.message}</p>
                    <span className="text-[10px] text-gray-400 block mt-1">{n.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: SHOP PROFILE & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="font-extrabold text-base text-gray-900">
                    {isBn ? 'শপ প্রোফাইল ও সেটিংসে কাস্টমাইজেশন' : 'Shop Profile Branding & Customization'}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {isBn ? 'আপনার শপের নাম, লোগো, ব্যানার এবং পেমেন্ট একাউন্ট সেট করুন' : 'Customize your public storefront name, logo, banner, and payout account'}
                  </p>
                </div>
                <span className="text-[10px] bg-sky-50 text-[#0284c7] font-extrabold px-2.5 py-1 rounded-lg border border-sky-100">
                  {isBn ? 'লাইভ মার্চেন্ট শপ' : 'Live Merchant Storefront'}
                </span>
              </div>

              {/* Store Branding Live Preview Header */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-slate-900 shadow-2xs">
                <div className="h-28 w-full relative">
                  <img
                    src={shopForm.banner || seller.banner || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80'}
                    alt="Store Banner Preview"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                </div>
                <div className="p-4 flex items-center gap-3.5 relative -mt-10">
                  <img
                    src={shopForm.logo || seller.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'}
                    alt={shopForm.shopName || seller.shopName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md bg-white shrink-0"
                  />
                  <div className="text-white space-y-0.5 min-w-0">
                    <h3 className="font-black text-base truncate">{shopForm.shopName || seller.shopName}</h3>
                    <p className="text-xs text-sky-200 truncate max-w-lg">{shopForm.description || seller.description || 'Official verified merchant shop'}</p>
                    <span className="inline-block text-[10px] text-emerald-400 font-bold">
                      ⭐ {seller.rating} Rating • {seller.followerCount.toLocaleString()} {isBn ? 'ফলোয়ার' : 'Followers'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Editing Form */}
              <form onSubmit={handleSaveShopSettings} className="space-y-4 text-xs">
                {/* Shop Name */}
                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    {isBn ? 'স্টোর / শপের নাম (Shop Name) *' : 'Store / Shop Name *'}
                  </label>
                  <input
                    type="text"
                    value={shopForm.shopName}
                    onChange={(e) => setShopForm((prev) => ({ ...prev, shopName: e.target.value }))}
                    placeholder="Apex Tech & Gadget Center"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-bold text-gray-900 text-sm focus:border-[#0284c7]"
                    required
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-bold">{isBn ? 'কুইক ডেমো নাম:' : 'Quick Presets:'}</span>
                    {[
                      'Apex Tech & Gadget Center',
                      'Gadget Hub BD',
                      'Dhaka Fashion Zone',
                      'Bengal Organic Shop'
                    ].map((presetName) => (
                      <button
                        key={presetName}
                        type="button"
                        onClick={() => setShopForm((prev) => ({ ...prev, shopName: presetName }))}
                        className="text-[10px] bg-gray-100 hover:bg-sky-50 hover:text-[#0284c7] font-bold px-2 py-0.5 rounded-lg border border-gray-200 cursor-pointer transition-colors"
                      >
                        {presetName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logo Upload & URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-800 block">
                      {isBn ? 'স্টোর লোগো ছবি (Store Logo Image)' : 'Store Logo Image'}
                    </label>
                    <label className="text-[10px] bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold px-2.5 py-1 rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-2xs">
                      <FolderPlus className="w-3 h-3" />
                      <span>{isBn ? 'গ্যালারি থেকে লোগো আপলোড' : 'Upload Logo File'}</span>
                      <input type="file" accept="image/*" onChange={handleShopLogoUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    {shopForm.logo && (
                      <img src={shopForm.logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0" />
                    )}
                    <input
                      type="text"
                      value={shopForm.logo}
                      onChange={(e) => setShopForm((prev) => ({ ...prev, logo: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 p-2.5 border border-gray-300 rounded-xl outline-none text-gray-700 font-mono text-xs focus:border-[#0284c7]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-bold">{isBn ? 'লোগো ডেমো:' : 'Logo Presets:'}</span>
                    {[
                      { label: isBn ? 'টেক লোগো' : 'Tech Logo', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' },
                      { label: isBn ? 'ফ্যাশন লোগো' : 'Fashion Logo', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
                      { label: isBn ? 'গ্যাজেট লোগো' : 'Gadgets Logo', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80' }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setShopForm((prev) => ({ ...prev, logo: preset.url }))}
                        className="text-[10px] bg-gray-100 hover:bg-sky-50 hover:text-[#0284c7] font-bold px-2 py-0.5 rounded-lg border border-gray-200 cursor-pointer transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banner Upload & URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-800 block">
                      {isBn ? 'স্টোর ব্যানার ছবি (Banner Image)' : 'Store Banner Image'}
                    </label>
                    <label className="text-[10px] bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold px-2.5 py-1 rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-2xs">
                      <FolderPlus className="w-3 h-3" />
                      <span>{isBn ? 'গ্যালারি থেকে ব্যানার আপলোড' : 'Upload Banner File'}</span>
                      <input type="file" accept="image/*" onChange={handleShopBannerUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    {shopForm.banner && (
                      <img src={shopForm.banner} alt="Banner" className="w-16 h-10 rounded-xl object-cover border border-gray-200 shrink-0" />
                    )}
                    <input
                      type="text"
                      value={shopForm.banner}
                      onChange={(e) => setShopForm((prev) => ({ ...prev, banner: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 p-2.5 border border-gray-300 rounded-xl outline-none text-gray-700 font-mono text-xs focus:border-[#0284c7]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    {isBn ? 'শপ স্লোগান ও বর্ণনা (Store Description)' : 'Store Slogan & Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={shopForm.description}
                    onChange={(e) => setShopForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="100% Genuine Electronics, Fast Shipping."
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none text-gray-800 focus:border-[#0284c7]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-800 block mb-1">{isBn ? 'যোগাযোগের ফোন' : 'Contact Phone'}</label>
                    <input
                      type="text"
                      value={shopForm.phone}
                      onChange={(e) => setShopForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-800 block mb-1">{isBn ? 'দোকানের ঠিকানা' : 'Shop Address'}</label>
                    <input
                      type="text"
                      value={shopForm.shopAddress}
                      onChange={(e) => setShopForm((prev) => ({ ...prev, shopAddress: e.target.value }))}
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-800 block mb-1">{isBn ? 'উইথড্র মেথড' : 'Payout Method'}</label>
                    <select
                      value={shopForm.payoutMethod}
                      onChange={(e: any) => setShopForm((prev) => ({ ...prev, payoutMethod: e.target.value }))}
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none bg-white font-bold"
                    >
                      <option value="bKash">bKash Personal / Agent</option>
                      <option value="Nagad">Nagad Personal</option>
                      <option value="Bank">Bank Wire Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-gray-800 block mb-1">{isBn ? 'উইথড্র অ্যাকাউন্ট নম্বর' : 'Payout Account Number'}</label>
                    <input
                      type="text"
                      value={shopForm.payoutAccount}
                      onChange={(e) => setShopForm((prev) => ({ ...prev, payoutAccount: e.target.value }))}
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold px-6 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all active:scale-98 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isBn ? '💾 শপ সেটিংসে সেভ করুন' : '💾 Save Store Profile'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* RICH ADD / EDIT PRODUCT MODAL (5 IMAGES + 1 VIDEO + SPECS + TAGS) */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  {editingProduct
                    ? (isBn ? 'প্রোডাক্ট এডিট করুন (Edit Product)' : 'Edit Seller Product')
                    : (isBn ? 'নতুন প্রোডাক্ট আপলোড করুন (Upload New Product)' : 'Upload New Product to Shop')}
                </h3>
                <p className="text-xs text-gray-400">
                  {isBn ? '৫টি ছবি, ১টি ভিডিও লিংক, প্রোডাক্ট বিবরণ ও দাম দিয়ে আপলোড করুন' : 'Fill details, up to 5 images, 1 video link, specs & submit for Admin Review'}
                </p>
              </div>
              <button onClick={() => setIsAddProductOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg font-bold cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">{isBn ? 'প্রোডাক্ট টাইটেল (English) *' : 'Product Title (English) *'}</label>
                  <input
                    type="text"
                    value={newProdTitle}
                    onChange={(e) => setNewProdTitle(e.target.value)}
                    placeholder="e.g. Ultra Smartwatch with Bluetooth Calling"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-bold text-gray-900 focus:border-[#0284c7]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">{isBn ? 'প্রোডাক্ট টাইটেল (বাংলা) *' : 'Product Title (Bengali) *'}</label>
                  <input
                    type="text"
                    value={newProdTitleBn}
                    onChange={(e) => setNewProdTitleBn(e.target.value)}
                    placeholder="যেমন: ব্লুটুথ কলিং আল্ট্রা স্মার্টওয়াচ"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-bold text-gray-900 focus:border-[#0284c7]"
                  />
                </div>
              </div>

              {/* Price, Original Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">{isBn ? 'বিক্রি মূল্য (৳ Taka) *' : 'Selling Price (৳ Taka) *'}</label>
                  <input
                    type="number"
                    min="1"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-black text-gray-900 text-sm focus:border-[#0284c7]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">{isBn ? 'আসল গায়ের দাম (Reg. Price ৳)' : 'Original Price (৳ Regular)'}</label>
                  <input
                    type="number"
                    min="1"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-bold text-gray-700 text-sm focus:border-[#0284c7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">{isBn ? 'স্টক পরিমাণ (Pcs) *' : 'Stock Quantity (Pcs) *'}</label>
                  <input
                    type="number"
                    min="0"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-black text-gray-900 text-sm focus:border-[#0284c7]"
                    required
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">{isBn ? 'ক্যাটাগরি *' : 'Category *'}</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none bg-white font-bold text-gray-900 focus:border-[#0284c7]"
                  >
                    {categories.map((c) => {
                      const comm = c.commission ?? (c.id.includes('electronic') || c.id.includes('accessories') ? 5 : c.id.includes('fashion') ? 12 : 10);
                      return (
                        <option key={c.id} value={c.id}>
                          {isBn ? (c.nameBn || c.name) : c.name} — ({comm}% Commission)
                        </option>
                      );
                    })}
                  </select>

                  {/* Live Category Platform Commission Rate Badge */}
                  {(() => {
                    const selectedCat = categories.find((c) => c.id === newProdCategory);
                    const commRate = selectedCat?.commission ?? (newProdCategory.includes('electronic') || newProdCategory.includes('accessories') ? 5 : newProdCategory.includes('fashion') ? 12 : 10);
                    const estimatedDeduction = newProdPrice ? ((Number(newProdPrice) * commRate) / 100).toFixed(2) : '0';
                    const estimatedNet = newProdPrice ? (Number(newProdPrice) - Number(estimatedDeduction)).toFixed(2) : '0';

                    return (
                      <div className="mt-2 p-2.5 bg-amber-50/90 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex flex-wrap items-center justify-between gap-1 font-medium">
                        <span>
                          {isBn
                            ? `⚡ ক্যাটাগরি কমিশন রেট: ${commRate}% (অর্ডার কমপ্লিট হলে কাটা হবে)`
                            : `⚡ Category Platform Fee: ${commRate}% (Deducted on completion)`}
                        </span>
                        {newProdPrice > 0 && (
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                            {isBn ? `আপনার আনুমানিক আয়: ৳${estimatedNet}` : `Est. Net Profit: ৳${estimatedNet}`}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">{isBn ? 'ব্র্যান্ড নাম' : 'Brand Name'}</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    placeholder="e.g. Apex Tech / Samsung / Local"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-bold text-gray-900 focus:border-[#0284c7]"
                  />
                </div>
              </div>

              {/* UP TO 5 IMAGES SECTION WITH DIRECT GALLERY / DESKTOP UPLOAD */}
              <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#0284c7]" />
                    <div>
                      <label className="font-extrabold text-gray-900 block text-xs sm:text-sm">
                        {isBn ? 'প্রোডাক্টের ৫টি ছবি আপলোড (Direct Gallery Upload)' : 'Direct Gallery Image Upload (Up to 5 Images)'}
                      </label>
                      <span className="text-[10px] text-gray-500">
                        {isBn ? 'গ্যালারি বা কম্পিউটার থেকে সরাসরি ৫টি ছবি সিলেক্ট করুন' : 'Select up to 5 photos directly from desktop/gallery'}
                      </span>
                    </div>
                  </div>

                  {/* MASTER BATCH UPLOAD BUTTON */}
                  <label className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs px-3 py-2 rounded-xl cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-98">
                    <Upload className="w-4 h-4" />
                    <span>{isBn ? '📂 গ্যালারি থেকে ৫টি ছবি সিলেক্ট করুন' : '📂 Browse Desktop / Gallery'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleBatchGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 5 IMAGE CARDS GRID (STANDARD E-COMMERCE SQUARE ASPECT RATIO) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                  {[
                    { label: isBn ? '1. মেইন কভার *' : '1. Main Cover *', val: newProdImage1, setFn: setNewProdImage1, slot: 0 },
                    { label: isBn ? '2. সাইড ভিউ' : '2. Side Angle', val: newProdImage2, setFn: setNewProdImage2, slot: 1 },
                    { label: isBn ? '3. ক্লোজ আপ' : '3. Close-up', val: newProdImage3, setFn: setNewProdImage3, slot: 2 },
                    { label: isBn ? '4. বক্স ও অ্যাক্সেসরিজ' : '4. Box & Accs', val: newProdImage4, setFn: setNewProdImage4, slot: 3 },
                    { label: isBn ? '5. ইন-হ্যান্ড/ব্যবহার' : '5. In-Hand', val: newProdImage5, setFn: setNewProdImage5, slot: 4 }
                  ].map((imgItem) => (
                    <div
                      key={imgItem.slot}
                      className="bg-white p-2 rounded-xl border border-gray-200 flex flex-col items-center justify-between shadow-2xs group relative"
                    >
                      <span className="text-[10px] font-extrabold text-gray-700 block mb-1 text-center truncate w-full">
                        {imgItem.label}
                      </span>

                      {/* Square Aspect Ratio Preview Box */}
                      <div className="w-full aspect-square bg-gray-50 rounded-lg border border-dashed border-gray-300 relative overflow-hidden flex items-center justify-center mb-1.5 group-hover:border-[#0284c7] transition-colors">
                        {imgItem.val ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgItem.val}
                              alt={`Slot ${imgItem.slot + 1}`}
                              className="w-full h-full object-contain p-1"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              type="button"
                              onClick={() => imgItem.setFn('')}
                              className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-full text-[9px] shadow-xs cursor-pointer"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-1 text-gray-400">
                            <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                            <span className="text-[9px] font-semibold block">{isBn ? 'ছবি সিলেক্ট করুন' : 'No photo'}</span>
                          </div>
                        )}
                      </div>

                      {/* File input button per slot */}
                      <label className="w-full py-1 px-1 bg-sky-50 hover:bg-sky-100 text-[#0284c7] font-extrabold text-[10px] rounded-lg cursor-pointer text-center block border border-sky-200 transition-colors">
                        <span>{imgItem.val ? (isBn ? 'ছবি পাল্টান' : 'Change') : (isBn ? 'ছবি পছন্দ করুন' : 'Upload File')}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSingleImageUpload(imgItem.slot, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ))}
                </div>

                {/* Optional URL Paste Row */}
                <details className="text-[10px] text-gray-500 font-medium">
                  <summary className="cursor-pointer hover:text-[#0284c7] font-bold">
                    {isBn ? '🔗 বা সরাসরি Image URL টেক্সট পেস্ট করতে চান? (ক্লিক করুন)' : '🔗 Or paste Image URLs manually (Click to expand)'}
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-2 bg-white rounded-xl border border-gray-200">
                    <input
                      type="text"
                      value={newProdImage1}
                      onChange={(e) => setNewProdImage1(e.target.value)}
                      placeholder="Image 1 URL..."
                      className="p-1.5 border border-gray-200 rounded-lg text-[10px] font-mono"
                    />
                    <input
                      type="text"
                      value={newProdImage2}
                      onChange={(e) => setNewProdImage2(e.target.value)}
                      placeholder="Image 2 URL..."
                      className="p-1.5 border border-gray-200 rounded-lg text-[10px] font-mono"
                    />
                    <input
                      type="text"
                      value={newProdImage3}
                      onChange={(e) => setNewProdImage3(e.target.value)}
                      placeholder="Image 3 URL..."
                      className="p-1.5 border border-gray-200 rounded-lg text-[10px] font-mono"
                    />
                    <input
                      type="text"
                      value={newProdImage4}
                      onChange={(e) => setNewProdImage4(e.target.value)}
                      placeholder="Image 4 URL..."
                      className="p-1.5 border border-gray-200 rounded-lg text-[10px] font-mono"
                    />
                    <input
                      type="text"
                      value={newProdImage5}
                      onChange={(e) => setNewProdImage5(e.target.value)}
                      placeholder="Image 5 URL..."
                      className="p-1.5 border border-gray-200 rounded-lg text-[10px] font-mono"
                    />
                  </div>
                </details>

                {/* Quick 5-Image Preset Packs */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] text-gray-500 font-bold">{isBn ? 'কুইক ৫-ছবি ডেমো প্যাক:' : 'Auto 5-Pack Presets:'}</span>
                  {[
                    {
                      label: 'Smartwatch Pack',
                      imgs: [
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
                      ]
                    },
                    {
                      label: 'Fashion Shirt Pack',
                      imgs: [
                        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80'
                      ]
                    }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setNewProdImage1(preset.imgs[0]);
                        setNewProdImage2(preset.imgs[1]);
                        setNewProdImage3(preset.imgs[2]);
                        setNewProdImage4(preset.imgs[3]);
                        setNewProdImage5(preset.imgs[4]);
                        showToast(isBn ? '৫টি ছবি লোড করা হয়েছে!' : 'Loaded 5 high-res product images!', 'info');
                      }}
                      className="text-[10px] bg-white hover:bg-sky-100 text-[#0284c7] font-bold px-2 py-0.5 rounded-lg border border-sky-200 cursor-pointer shadow-2xs"
                    >
                      ⚡ {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1 VIDEO UPLOAD / URL SECTION */}
              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-700 shrink-0" />
                    <label className="font-extrabold text-purple-950 block text-xs">
                      {isBn ? 'প্রোডাক্ট ভিডিও (Product Video - Max 1 Video)' : 'Product Video (Max 1 Video)'}
                    </label>
                  </div>

                  <label className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer shadow-2xs flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isBn ? '🎬 ডিভাইস থেকে ভিডিও আপলোড' : 'Upload Video File'}</span>
                    <input type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
                  </label>
                </div>

                <input
                  type="text"
                  value={newProdVideoUrl}
                  onChange={(e) => setNewProdVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or mp4 video URL"
                  className="w-full p-2 bg-white border border-purple-200 rounded-xl outline-none font-mono text-[11px] text-purple-900 focus:border-purple-500"
                />
                <p className="text-[10px] text-purple-700">
                  {isBn ? 'ভিডিও থাকলে কাস্টমার প্রোডাক্টের রিয়েল রিভিউ দেখতে পায় এবং বিক্রি ৩০% বৃদ্ধি পায়।' : 'A video demo increases customer trust and product sales.'}
                </p>
              </div>

              {/* Description (EN & BN) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">{isBn ? 'প্রোডাক্ট বর্ণনা (English)' : 'Description (English)'}</label>
                  <textarea
                    rows={3}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="High resolution AMOLED display smartwatch with dual Bluetooth calling chip..."
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none text-gray-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-800 block mb-1">{isBn ? 'প্রোডাক্ট বর্ণনা (বাংলা)' : 'Description (Bengali)'}</label>
                  <textarea
                    rows={3}
                    value={newProdDescBn}
                    onChange={(e) => setNewProdDescBn(e.target.value)}
                    placeholder="উন্নত মানের এমোলেড ডিসপ্লে, ব্লুটুথ কলিং এবং ওয়াটারপ্রুফ বডি..."
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Keywords / Search Tags */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'সার্চ কিওয়ার্ড ও ট্যাগস (Keywords / Tags)' : 'Search Keywords & Tags'}
                </label>
                <input
                  type="text"
                  value={newProdTags}
                  onChange={(e) => setNewProdTags(e.target.value)}
                  placeholder="smartwatch, bluetooth calling, waterproof, fitness band"
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none font-bold text-gray-800"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {isBn ? 'কমা (,) দিয়ে আলাদা করে কিওয়ার্ড লিখুন যা দিয়ে কাস্টমার সার্চ করলে এই প্রোডাক্ট পাবে।' : 'Enter comma-separated keywords to help customers search and discover this item.'}
                </p>
              </div>

              {/* Specialist Specifications */}
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-2">
                <label className="font-extrabold text-gray-900 block">
                  {isBn ? 'স্পেশাল স্পেসিফিকেশনস ও ওয়ারেন্টি (Special Specifications)' : 'Specialist Specifications & Warranty'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-gray-700 text-[11px] block mb-0.5">Warranty &amp; Guarantee</label>
                    <input
                      type="text"
                      value={newProdWarranty}
                      onChange={(e) => setNewProdWarranty(e.target.value)}
                      placeholder="e.g. 7 Days Replacement & 1 Year Warranty"
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-medium text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 text-[11px] block mb-0.5">Spec 1 (Display / Material)</label>
                    <input
                      type="text"
                      value={newProdSpec1}
                      onChange={(e) => setNewProdSpec1(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-medium text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 text-[11px] block mb-0.5">Spec 2 (Battery / Power)</label>
                    <input
                      type="text"
                      value={newProdSpec2}
                      onChange={(e) => setNewProdSpec2(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-medium text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 text-[11px] block mb-0.5">Spec 3 (Rating / Build)</label>
                    <input
                      type="text"
                      value={newProdSpec3}
                      onChange={(e) => setNewProdSpec3(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl outline-none font-medium text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold rounded-xl shadow-xs cursor-pointer text-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isBn
                      ? '💾 আপলোড সম্পূর্ণ করুন (এডমিন অনুমোদনের জন্য পেন্ডিং এ যাবে)'
                      : '💾 Submit Upload for Admin Review & Approval'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-sm text-gray-900">{isBn ? 'ইনকাম উইথড্রয়াল রিকোয়েস্ট' : 'Payout Withdrawal Request'}</h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestWithdrawal} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">{isBn ? 'টাকার পরিমাণ (৳) *' : 'Withdrawal Amount (৳) *'}</label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-black text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">{isBn ? 'পেমেন্ট মেথড *' : 'Payout Method *'}</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold bg-white"
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">{isBn ? 'অ্যাকাউন্ট নম্বর *' : 'Account Number *'}</label>
                <input
                  type="text"
                  value={payoutAccountNum}
                  onChange={(e) => setPayoutAccountNum(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-xs cursor-pointer"
              >
                {isBn ? '💸 উইথড্রয়াল সাবমিট করুন' : '💸 Submit Payout Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Courier Dispatch Modal */}
      {dispatchingOrder && (
        <CourierDispatchModal
          order={dispatchingOrder}
          onClose={() => setDispatchingOrder(null)}
          onDispatchSuccess={(trackingCode, partner) => {
            updateOrderStatus(dispatchingOrder.id, 'Shipped');
            showToast(`Consignment booked with ${partner}! Tracking: ${trackingCode}`, 'success');
            setDispatchingOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default SellerCenter;
