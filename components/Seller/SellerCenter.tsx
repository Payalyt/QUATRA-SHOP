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
  CreditCard,
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
    submitSellerDeposit,
    liveChats,
    replyToLiveChat,
    transferToAdBalance,
    submitSellerVerification
  } = useMarketplace();

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

  const isBn = language === 'bn';

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'reports' | 'orders' | 'earnings' | 'reviews' | 'promotions' | 'ads' | 'chat' | 'notifications' | 'settings' | 'verification'
  >('overview');
  const [chatReplyMap, setChatReplyMap] = useState<Record<string, string>>({});
  const [adTransferAmount, setAdTransferAmount] = useState<string>('500');

  // Verification Modal & Form State
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [docType, setDocType] = useState<'NID' | 'PASSPORT' | 'DRIVING_LICENSE'>('NID');
  const [docNumber, setDocNumber] = useState(seller.verificationData?.documentNumber || '');
  const [fullNameAsPerDoc, setFullNameAsPerDoc] = useState(seller.verificationData?.fullNameAsPerDoc || seller.shopName);
  const [verifPhone, setVerifPhone] = useState(seller.verificationData?.phone || seller.phone);
  const [frontImgUrl, setFrontImageUrl] = useState(seller.verificationData?.frontImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
  const [backImgUrl, setBackImageUrl] = useState(seller.verificationData?.backImageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80');
  const [isUploadingFrontDoc, setIsUploadingFrontDoc] = useState(false);
  const [isUploadingBackDoc, setIsUploadingBackDoc] = useState(false);

  // Responsive Mobile Menu Drawer & Compact Top Bar Dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTopMenuDropdownOpen, setIsTopMenuDropdownOpen] = useState(false);

  const selectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleFrontDocFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingFrontDoc(true);
      const url = await uploadImageApi(file);
      setFrontImageUrl(url);
      showToast(isBn ? '📸 এনআইডি/পাসপোর্ট ফ্রন্ট পেজ গ্যালারি থেকে সিলেক্ট হয়েছে!' : '📸 Front document photo uploaded!', 'success');
    } catch {
      showToast(isBn ? 'ছবি আপলোডে সমস্যা হয়েছে' : 'Failed to upload photo', 'error');
    } finally {
      setIsUploadingFrontDoc(false);
    }
  };

  const handleBackDocFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingBackDoc(true);
      const url = await uploadImageApi(file);
      setBackImageUrl(url);
      showToast(isBn ? '📸 এনআইডি/লাইসেন্স ব্যাক পেজ গ্যালারি থেকে সিলেক্ট হয়েছে!' : '📸 Back document photo uploaded!', 'success');
    } catch {
      showToast(isBn ? 'ছবি আপলোডে সমস্যা হয়েছে' : 'Failed to upload photo', 'error');
    } finally {
      setIsUploadingBackDoc(false);
    }
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
  const [campaignDurationDays, setCampaignDurationDays] = useState<number>(7);
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

  // Deposit Requests for this seller
  const myDeposits = useMemo(() => {
    return (depositRequests || []).filter((d) => d.sellerId === seller.id);
  }, [depositRequests, seller.id]);

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

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const docNum = docNumber.trim();
    const name = fullNameAsPerDoc.trim();
    const phone = verifPhone.trim();

    if (!docNum || !name || !phone) {
      showToast(isBn ? 'সবগুলো প্রয়োজনীয় ঘর পূরণ করুন' : 'Please fill in all required fields.', 'error');
      return;
    }

    if (!frontImgUrl) {
      showToast(isBn ? 'দয়া করে পরিচয়পত্রের সামনের ছবি গ্যালারি থেকে সিলেক্ট করুন!' : 'Please browse and select document front photo!', 'error');
      return;
    }

    submitSellerVerification(seller.id, {
      documentType: docType,
      documentNumber: docNum,
      fullNameAsPerDoc: name,
      phone: phone,
      frontImageUrl: frontImgUrl,
      backImageUrl: docType !== 'PASSPORT' ? backImgUrl : undefined
    });

    setIsVerificationModalOpen(false);
  };

  const handleOpenAddProduct = () => {
    if (seller.status === 'Suspended') {
      showToast(
        isBn
          ? '🔒 দুঃখিত, আপনার সেলার একাউন্টটি সাময়িকভাবে স্থগিত (Suspended) করা হয়েছে!'
          : '🔒 Sorry, your seller account is suspended! Please contact support.',
        'error'
      );
      return;
    }
    if (seller.status === 'Pending') {
      showToast(
        isBn
          ? '🔒 আপনার সেলার একাউন্টটি এখনও পেন্ডিং (অ্যাডমিন অনুমোদনের অপেক্ষায়) আছে!'
          : '🔒 Your seller account is pending admin approval!',
        'error'
      );
      return;
    }
    if (seller.status === 'Rejected') {
      showToast(
        isBn
          ? '🔒 আপনার সেলার একাউন্ট রেজিস্ট্রেশন বাতিল (Rejected) করা হয়েছে!'
          : '🔒 Your seller account registration is rejected!',
        'error'
      );
      return;
    }
    if (!seller.isVerified && seller.verificationStatus !== 'VERIFIED') {
      showToast(
        isBn
          ? '🔒 প্রোডাক্ট আপলোড করতে আপনার অ্যাকাউন্টটি প্রথমে ভেরিফাই করুন!'
          : '🔒 Please verify your seller account first to upload products!',
        'error'
      );
      selectTab('verification');
      setIsVerificationModalOpen(true);
      return;
    }
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
    if (seller.status === 'Suspended') {
      showToast(
        isBn
          ? '🔒 দুঃখিত, আপনার সেলার একাউন্টটি সাময়িকভাবে স্থগিত (Suspended) করা হয়েছে!'
          : '🔒 Sorry, your seller account is suspended!',
        'error'
      );
      return;
    }
    if (seller.status === 'Pending') {
      showToast(
        isBn
          ? '🔒 আপনার সেলার একাউন্টটি এখনও পেন্ডিং আছে!'
          : '🔒 Your seller account is pending admin approval!',
        'error'
      );
      return;
    }
    if (seller.status === 'Rejected') {
      showToast(
        isBn
          ? '🔒 আপনার সেলার একাউন্ট রেজিস্ট্রেশন বাতিল করা হয়েছে!'
          : '🔒 Your seller account registration is rejected!',
        'error'
      );
      return;
    }
    if (!seller.isVerified && seller.verificationStatus !== 'VERIFIED') {
      showToast(
        isBn
          ? '🔒 প্রোডাক্ট পরিবর্তন করতে আপনার অ্যাকাউন্টটি প্রথমে ভেরিফাই করুন!'
          : '🔒 Please verify your seller account first!',
        'error'
      );
      selectTab('verification');
      setIsVerificationModalOpen(true);
      return;
    }
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

    const durationDays = Number(campaignDurationDays) || 7;
    const dailyBudget = Number(adDailyBudget) || 500;
    const totalBudget = dailyBudget * durationDays;

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
      dailyBudget,
      durationDays,
      totalBudget,
      bidAmount: adBiddingType === 'AUTO' ? 1.5 : Number(adBidAmount) || 1.2,
      biddingType: adBiddingType,
      targetKeywords: keywords.length > 0 ? keywords : [prod.title, prod.brand, 'best product'],
      negativeKeywords,
      status: 'ACTIVE'
    });

    setIsCreateCampaignOpen(false);
    showToast(
      language === 'bn'
        ? `🚀 ${durationDays} দিনের স্পনসরড এড ক্যাম্পেইন চালু হয়েছে!`
        : `🚀 Sponsored Ad Campaign live for ${durationDays} days!`,
      'success'
    );
  };

  // Deposit for Ad Balance / Wallet Submit
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;
    const amt = Number(depositAmount);
    if (!amt || amt < 100) {
      showToast(language === 'bn' ? 'সর্বনিম্ন ডিপোজিট ১০০ টাকা' : 'Minimum deposit amount is ৳100', 'error');
      return;
    }
    if (!depositSenderNumber.trim()) {
      showToast(language === 'bn' ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন' : 'Please enter sender mobile/account number', 'error');
      return;
    }
    if (!depositTrxId.trim()) {
      showToast(language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID) লিখুন' : 'Please enter Transaction ID (TrxID)', 'error');
      return;
    }

    submitSellerDeposit({
      sellerId: seller.id,
      sellerShopName: seller.shopName,
      sellerPhone: depositSenderNumber.trim(),
      amount: amt,
      paymentMethod: depositMethod,
      senderNumber: depositSenderNumber.trim(),
      trxId: depositTrxId.trim().toUpperCase(),
      notes: depositNotes.trim()
    });

    setIsDepositModalOpen(false);
    setDepositTrxId('');
    setDepositSenderNumber('');
    setDepositNotes('');
    showToast(
      language === 'bn'
        ? 'ডিপোজিট রিকোয়েস্ট সফলভাবে জমা হয়েছে! এডমিন অনুমোদনের সাথে সাথে এড ব্যালেন্সে যোগ হবে।'
        : 'Deposit request submitted! Funds will be credited to Ad Balance once approved by Admin.',
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans pb-16 text-gray-800">
      {/* Top Seller Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Left section: Hamburger / Drawer Trigger & Shop Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* 3-line Sidebar Toggle Button for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-800 text-white focus:outline-none cursor-pointer flex items-center justify-center shrink-0 border border-slate-700"
              title="Toggle Sidebar Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <img
                src={shopForm.logo || seller.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'}
                alt={shopForm.shopName || seller.shopName}
                className="w-8 h-8 rounded-lg object-cover border border-sky-400/30 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-xs sm:text-sm tracking-tight leading-tight text-white truncate max-w-[140px] sm:max-w-[220px]">
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
          </div>

          {/* Right Section: Notification & Compact 3-Line Top Dropdown Menu */}
          <div className="flex items-center gap-2 shrink-0 relative">
            {/* Verified Merchant Badge */}
            <span
              className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider hidden sm:flex items-center gap-1 shrink-0 ${
                seller.status === 'Approved'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : seller.status === 'Pending'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                  : 'bg-red-500/15 text-red-300 border border-red-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {seller.status === 'Approved' ? (isBn ? 'ভেরিফাইড মার্চেন্ট' : 'Verified') : seller.status}
              </span>
            </span>

            {/* Notification Bell */}
            <button
              onClick={() => selectTab('notifications')}
              className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-slate-800 cursor-pointer border border-slate-700/60"
              title={isBn ? 'নোটিফিকেশনস' : 'Notifications'}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#0284c7] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Compact 3-Line Dropdown Menu Button */}
            <div className="relative">
              <button
                onClick={() => setIsTopMenuDropdownOpen(!isTopMenuDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition-all cursor-pointer font-bold text-xs"
                title="Quick Actions & Switcher Menu"
              >
                <Menu className="w-4 h-4 text-[#0284c7]" />
                <span className="hidden xs:inline">{isBn ? 'মেনু' : 'Menu'}</span>
                <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${isTopMenuDropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {/* Compact Dropdown Popover */}
              {isTopMenuDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs font-semibold text-slate-200 divide-y divide-slate-800 animate-in fade-in-50 zoom-in-95 duration-150">
                  {/* Shop Switcher in Dropdown */}
                  <div className="px-3 py-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {isBn ? 'সুইচ শপ / একাউন্ট' : 'Switch Active Shop'}
                    </p>
                    <select
                      value={seller.id}
                      onChange={(e) => {
                        const found = sellers.find((s) => s.id === e.target.value);
                        if (found) setCurrentSeller(found);
                        setIsTopMenuDropdownOpen(false);
                      }}
                      className="w-full bg-slate-800 text-white font-bold text-xs p-2 rounded-lg border border-slate-700 outline-none cursor-pointer"
                    >
                      {sellers.map((s) => (
                        <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                          {s.shopName} ({s.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Action Links */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        if (onOpenPublicShop) {
                          onOpenPublicShop(seller.slug);
                        }
                        router.push(`/shop/${seller.slug}`);
                        setIsTopMenuDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-800 hover:text-sky-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>{isBn ? 'পাবলিক শপ পেইজ দেখুন' : 'View Public Store Page'}</span>
                    </button>

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
                        setIsTopMenuDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-800 hover:text-sky-300 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-3.5 h-3.5 text-[#0284c7]" />
                        <span>{isBn ? 'ভাষা: বাংলা' : 'Language: English'}</span>
                      </div>
                      <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-1.5 py-0.5 rounded font-bold">
                        {isBn ? 'Switch to EN' : 'বাংলা করুন'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAdminView(false);
                        router.push('/');
                        setIsTopMenuDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-800 hover:text-sky-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Store className="w-3.5 h-3.5 text-[#0284c7]" />
                      <span>{isBn ? 'মার্কেটপ্লেস স্টোরফ্রন্ট' : 'View Marketplace Store'}</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1 px-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsAdminView(false);
                        router.push('/');
                        setIsTopMenuDropdownOpen(false);
                        showToast(isBn ? 'সেলার অ্যাকাউন্ট থেকে লগআউট হয়েছে' : 'Logged out of Seller Account', 'info');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 flex items-center gap-2.5 transition-colors cursor-pointer font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isBn ? 'লগআউট' : 'Logout Account'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
              onClick={() => selectTab('chat')}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7]'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'সেলার চ্যাট ও মেসেজ' : 'Live Chat & Messages'}</span>
              </div>
              {liveChats?.filter((c) => c.status === 'Open').length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {liveChats.filter((c) => c.status === 'Open').length}
                </span>
              )}
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
              onClick={() => selectTab('verification')}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all cursor-pointer font-bold text-xs ${
                activeTab === 'verification'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'hover:bg-sky-50 hover:text-[#0284c7] text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{isBn ? 'একাউন্ট ভেরিফিকেশন (KYC)' : 'KYC Verification'}</span>
              </div>
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                  seller.isVerified || seller.verificationStatus === 'VERIFIED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : seller.verificationStatus === 'PENDING_VERIFICATION'
                    ? 'bg-sky-100 text-[#0284c7]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {seller.isVerified || seller.verificationStatus === 'VERIFIED'
                  ? '✓ Verified'
                  : seller.verificationStatus === 'PENDING_VERIFICATION'
                  ? '⌛ Review'
                  : '⚠️ Verify'}
              </span>
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
          {/* Prominent Seller Account Verification Alert Banner */}
          {!seller.isVerified && seller.verificationStatus !== 'VERIFIED' && (
            <div className={`p-4 rounded-2xl border mb-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              seller.verificationStatus === 'PENDING_VERIFICATION'
                ? 'bg-sky-50 border-sky-200 text-sky-900'
                : seller.verificationStatus === 'REJECTED'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  seller.verificationStatus === 'PENDING_VERIFICATION'
                    ? 'bg-[#0284c7] text-white'
                    : seller.verificationStatus === 'REJECTED'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm flex items-center gap-2">
                    <span>
                      {seller.verificationStatus === 'PENDING_VERIFICATION'
                        ? (isBn ? '⏳ এনআইডি ভেরিফিকেশন এডমিন রিভিউয়ের অধীনে রয়েছে (Under Review)' : 'NID Verification Under Review')
                        : seller.verificationStatus === 'REJECTED'
                        ? (isBn ? '⚠️ এনআইডি ভেরিফিকেশন আবেদন বাতিল হয়েছে (Rejected)' : 'Verification Application Rejected')
                        : (isBn ? '🪪 প্রোডাক্ট আপলোড করতে সেলার অ্যাকাউন্ট ভেরিফাই করুন (Verification Required)' : 'Verify Seller Account to Unlock Uploads')}
                    </span>
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">
                    {seller.verificationStatus === 'PENDING_VERIFICATION'
                      ? (isBn ? 'আপনার জমাকৃত এনআইডি/পাসপোর্ট এডমিন রিভিউ করছে। অনুমোদন পেলেই প্রোডাক্ট আপলোড করতে পারবেন।' : 'Admin is reviewing your submitted NID/Passport. You will be able to upload products upon approval.')
                      : seller.verificationStatus === 'REJECTED'
                      ? (isBn ? `কারণ: ${seller.verificationData?.rejectionReason || 'তথ্য বা ডকুমেন্ট সঠিক নয়।'}` : `Reason: ${seller.verificationData?.rejectionReason || 'Invalid document.'}`)
                      : (isBn ? 'প্রোডাক্ট আপলোড করতে এবং শপ এক্টিভ রাখতে আপনার জাতীয় পরিচয়পত্র (NID), পাসপোর্ট বা ড্রাইভিং লাইসেন্স দিয়ে ভেরিফাই করুন।' : 'Submit your NID Card, Passport or Driving License to unlock product uploading.')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
                <button
                  onClick={() => {
                    setIsVerificationModalOpen(true);
                    selectTab('verification');
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {seller.verificationStatus === 'REJECTED'
                      ? (isBn ? 'পুনরায় আবেদন করুন' : 'Re-submit Document')
                      : (isBn ? 'এখনই ভেরিফাই করুন ➔' : 'Verify Account Now ➔')}
                  </span>
                </button>
              </div>
            </div>
          )}
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
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {ord.orderStatus} (Managed by Admin)
                          </span>
                        </td>
                        <td className="py-3 px-4 flex items-center gap-2">

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
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-3">
                <div>
                  <h2 className="font-extrabold text-base text-gray-900">{isBn ? 'স্পনসরড এডস ও বিজ্ঞাপন ব্যালেন্স' : 'Sponsored Ads & Ad Balance'}</h2>
                  <p className="text-xs text-gray-400">{isBn ? 'বিকাশ/নগদে ডিপোজিট করুন অথবা এভেইলেবল ব্যালেন্স ট্রান্সফার করে ক্যাম্পেইন চালান' : 'Deposit via bKash/Nagad or transfer earnings to launch sponsored ad campaigns'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all active:scale-98 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isBn ? '+ ডিপোজিট করুন (bKash/Nagad)' : '+ Deposit Funds'}</span>
                  </button>
                  <button
                    onClick={() => setIsCreateCampaignOpen(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-98 whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>{isBn ? '+ নতুন এড ক্যাম্পেইন' : '+ Create Ad Campaign'}</span>
                  </button>
                </div>
              </div>

              {/* Ad Balance & Transfer Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl border border-slate-800 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
                      {isBn ? 'বর্তমান এড ব্যালেন্স (Ad Balance)' : 'Current Ad Balance'}
                    </span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded">
                      {myCampaigns.length} {isBn ? 'সক্রিয় ক্যাম্পেইন' : 'Active Ads'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black tabular-nums">{formatPrice(wallet.adBalance || 0)}</span>
                    <button
                      onClick={() => setIsDepositModalOpen(true)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {isBn ? '⚡ সরাসরি ডিপোজিট' : '⚡ Deposit Now'}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    {isBn ? 'ইম্প্রেশন প্রতি ৳০.২০ (১,০০০ ভিউতে ৳২০০) হারে এড ব্যালেন্স থেকে অটোমেটিক কাটা হয়।' : 'Ad budget is charged at ৳0.20 per impression (৳200 / 1,000 views).'}
                  </p>
                </div>

                <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">
                      {isBn ? 'এভেইলেবল ইনকাম ব্যালেন্স:' : 'Available Earnings Balance:'}
                    </span>
                    <span className="font-black text-[#0284c7] tabular-nums text-sm">
                      {formatPrice(wallet.availableBalance || 0)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={adTransferAmount}
                      onChange={(e) => setAdTransferAmount(e.target.value)}
                      placeholder={isBn ? 'টাকার পরিমাণ (e.g. 500)' : 'Amount in BDT (e.g. 500)'}
                      className="flex-1 bg-white p-2 rounded-lg border border-gray-300 text-xs font-bold outline-none focus:border-[#0284c7]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const amt = Number(adTransferAmount);
                        if (amt > 0 && seller) {
                          const success = transferToAdBalance(seller.id, amt);
                          if (success) setAdTransferAmount('500');
                        } else {
                          showToast(isBn ? 'সঠিক পরিমাণ দিন' : 'Enter valid transfer amount', 'error');
                        }
                      }}
                      className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-black px-3.5 py-2 rounded-lg transition-all shadow-2xs cursor-pointer whitespace-nowrap text-xs"
                    >
                      {isBn ? 'ব্যালেন্স ট্রান্সফার' : 'Transfer to Ad Balance'}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    {isBn ? 'সেলস থেকে অর্জিত ইনকাম সরাসরি এড ব্যালেন্সে রূপান্তর করতে পারেন।' : 'Transfer shop sales earnings directly to run product ads.'}
                  </p>
                </div>
              </div>

              {/* CPM Pricing Model Banner */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <div>
                    <strong className="block font-black text-amber-950">
                      {isBn ? 'স্পনসরড এডস চার্জিং মডেল (CPM Rate):' : 'Sponsored Ads CPM Rate:'}
                    </strong>
                    <span className="text-[11px] text-amber-800 font-medium">
                      {isBn
                        ? `১,০০০ ইম্প্রেশনে ${adminAdSettings?.cpmRate || 200} টাকা কাটবে (প্রতি ভিউতে ৳${((adminAdSettings?.cpmRate || 200) / 1000).toFixed(2)})। ইম্প্রেশন আসলেই এড ব্যালেন্স থেকে অটোমেটিক টাকা কাটবে (সেল হোক বা না হোক)।`
                        : `৳${adminAdSettings?.cpmRate || 200} deducted per 1,000 impressions (৳${((adminAdSettings?.cpmRate || 200) / 1000).toFixed(2)} per view). Cost is deducted on impressions regardless of sales.`}
                    </span>
                  </div>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-300 font-black text-amber-900 text-xs shadow-2xs whitespace-nowrap">
                  {isBn ? `৳${adminAdSettings?.cpmRate || 200} / ১,০০০ ভিউ` : `৳${adminAdSettings?.cpmRate || 200} / 1,000 Views`}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xs text-gray-800">
                    {isBn ? 'আপনার সক্রিয় এড ক্যাম্পেইনসমূহ' : 'Active Ad Campaigns'} ({myCampaigns.length})
                  </h3>
                  <span className="text-[11px] text-gray-500 font-semibold">
                    {isBn ? 'রিয়েল-টাইমে আপডেট হচ্ছে' : 'Real-time Live Sync'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {myCampaigns.length > 0 ? (
                    myCampaigns.map((c) => {
                      const costPerCustomer = c.clicks > 0 ? Number((c.spend / c.clicks).toFixed(2)) : 0;
                      return (
                        <div key={c.id} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3 hover:border-sky-300 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={c.productImage} alt={c.productTitle} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-black text-gray-900 text-xs line-clamp-1">{c.productTitle}</h4>
                                <span className="text-[10px] text-gray-500 font-medium">
                                  {isBn
                                    ? `দৈনিক বাজেট: ৳${c.dailyBudget} · সময়কাল: ${c.durationDays || 7} দিন · রেট: ৳${((adminAdSettings?.cpmRate || 200) / 1000).toFixed(2)}/ভিউ`
                                    : `Daily Budget: ৳${c.dailyBudget} · Duration: ${c.durationDays || 7} Days · Rate: ৳${((adminAdSettings?.cpmRate || 200) / 1000).toFixed(2)}/view`}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                ● {c.status}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleCampaignStatus(c.id)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                              >
                                {c.status === 'ACTIVE' ? (isBn ? 'Pause' : 'Pause') : (isBn ? 'Resume' : 'Resume')}
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteSponsoredCampaign(c.id)}
                                className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* 4-Metric Real-time Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                              <span className="text-[10px] text-gray-500 font-bold block mb-0.5">
                                {isBn ? '👁️ মোট ইম্প্রেশন (Views)' : '👁️ Total Impressions'}
                              </span>
                              <span className="text-sm font-black text-[#0284c7] tabular-nums">
                                {c.impressions.toLocaleString()}
                              </span>
                            </div>

                            <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100">
                              <span className="text-[10px] text-gray-500 font-bold block mb-0.5">
                                {isBn ? '💸 মোট খরচ (Spent)' : '💸 Total Spend'}
                              </span>
                              <span className="text-sm font-black text-rose-600 tabular-nums">
                                {formatPrice(c.spend)}
                              </span>
                            </div>

                            <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                              <span className="text-[10px] text-gray-500 font-bold block mb-0.5">
                                {isBn ? '💬 কাস্টমার / মেসেজ (Inquiries)' : '💬 Customer Inquiries'}
                              </span>
                              <span className="text-sm font-black text-amber-700 tabular-nums">
                                {c.clicks}
                              </span>
                            </div>

                            <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                              <span className="text-[10px] text-gray-500 font-bold block mb-0.5">
                                {isBn ? '🎯 পার কাস্টমার খরচ (Cost/Inquiry)' : '🎯 Cost per Customer'}
                              </span>
                              <span className="text-sm font-black text-emerald-700 tabular-nums">
                                {c.clicks > 0 ? formatPrice(costPerCustomer) : formatPrice(0)}
                              </span>
                            </div>
                          </div>

                          {/* Real-time Test / Simulation Trigger */}
                          <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
                            <span>
                              {isBn
                                ? `⚡ ইম্প্রেশন আসলেই ব্যালেন্স থেকে প্রতি ১০০০ এ ৳${adminAdSettings?.cpmRate || 200} কাটবে`
                                : `⚡ ৳${adminAdSettings?.cpmRate || 200} deducted per 1,000 impressions`}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                simulateCampaignTraffic(c.id, 100, 2);
                                showToast(
                                  isBn
                                    ? '+১০০ ইম্প্রেশন ও ২টি কাস্টমার টেস্ট সম্পন্ন! ব্যালেন্স থেকে ৳২০ কাটা হয়েছে।'
                                    : 'Test: +100 impressions & 2 customer inquiries simulated! ৳20 deducted from ad balance.',
                                  'info'
                                );
                              }}
                              className="text-[10px] bg-sky-50 hover:bg-sky-100 text-[#0284c7] font-extrabold px-2.5 py-1 rounded-lg border border-sky-200 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                            >
                              <span>{isBn ? 'লাইভ টেস্ট করুন (+১০০ ইম্প্রেশন / ৳২০)' : 'Simulate Traffic (+100 Imp / ৳20)'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                      <p className="text-xs text-gray-400 italic">
                        {isBn
                          ? 'বর্তমানে কোনো সক্রিয় এড ক্যাম্পেইন নেই। "+ নতুন এড ক্যাম্পেইন" এ ক্লিক করুন।'
                          : 'No active ad campaigns yet. Click "+ Create Ad Campaign" to boost your products.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* RECENT DEPOSIT REQUESTS HISTORY */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xs text-gray-800 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? 'সাম্প্রতিক ডিপোজিট রিকোয়েস্ট হিস্ট্রি' : 'Recent Deposit Requests History'}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.2 rounded-full">
                      {myDeposits.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer"
                  >
                    {isBn ? '+ নতুন ডিপোজিট' : '+ New Deposit'}
                  </button>
                </div>

                {myDeposits.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-y border-gray-100">
                        <tr>
                          <th className="py-2 px-3">{isBn ? 'তারিখ' : 'Date'}</th>
                          <th className="py-2 px-3">{isBn ? 'মেথড ও নম্বর' : 'Method & Sender'}</th>
                          <th className="py-2 px-3">{isBn ? 'TrxID' : 'TrxID'}</th>
                          <th className="py-2 px-3">{isBn ? 'পরিমাণ' : 'Amount'}</th>
                          <th className="py-2 px-3">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {myDeposits.map((dep) => (
                          <tr key={dep.id} className="hover:bg-gray-50/60">
                            <td className="py-2.5 px-3 text-gray-500 text-[11px]">{dep.createdAt}</td>
                            <td className="py-2.5 px-3 font-bold text-gray-800">
                              <span className="font-mono text-purple-700">{dep.paymentMethod}</span> ({dep.senderNumber})
                            </td>
                            <td className="py-2.5 px-3 font-mono font-black text-gray-900">{dep.trxId}</td>
                            <td className="py-2.5 px-3 font-black text-emerald-600 tabular-nums text-xs">
                              {formatPrice(dep.amount)}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  dep.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : dep.status === 'PENDING'
                                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                ● {dep.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400">
                    {isBn
                      ? 'কোনো ডিপোজিট রিকোয়েস্ট নেই। সরাসরি বিকাশ/নগদে ডিপোজিট করতে "+ নতুন ডিপোজিট" বাটনে ক্লিক করুন।'
                      : 'No deposit records yet. Click "+ New Deposit" to top-up via bKash, Nagad, or Rocket.'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8.5: LIVE CHAT & MESSAGES */}
          {activeTab === 'chat' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <div className="border-b pb-3">
                <h2 className="font-extrabold text-base text-gray-900">{isBn ? 'কাস্টমার লাইভ চ্যাট ও মেসেজ' : 'Customer Live Chat & Messages'}</h2>
                <p className="text-xs text-gray-400">{isBn ? 'গ্রাহকদের লাইভ মেসেজের উত্তর দিন এবং সাপোর্ট প্রদান করুন' : 'Chat with customers and respond to direct inquiries'}</p>
              </div>

              <div className="space-y-3">
                {liveChats && liveChats.length > 0 ? (
                  liveChats.map((chat) => (
                    <div key={chat.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-900 text-sm">{chat.customerName}</span>
                          {chat.customerPhone && <span className="text-gray-500 ml-2 font-mono">({chat.customerPhone})</span>}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${chat.status === 'Open' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {chat.status}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-gray-200 text-gray-800 font-medium">
                        💬 &quot;{chat.message}&quot;
                        <span className="text-[10px] text-gray-400 block mt-1">{chat.timestamp}</span>
                      </div>

                      {chat.reply ? (
                        <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-[#0284c7] font-semibold">
                          ↩️ <strong>{chat.repliedBy || 'Shop Seller'}:</strong> {chat.reply}
                          <span className="text-[10px] text-gray-400 block mt-1">{chat.repliedAt}</span>
                        </div>
                      ) : (
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder={isBn ? 'এখানে উত্তর লিখুন...' : 'Type your reply here...'}
                            value={chatReplyMap[chat.id] || ''}
                            onChange={(e) => setChatReplyMap((prev) => ({ ...prev, [chat.id]: e.target.value }))}
                            className="flex-1 p-2 border border-gray-300 rounded-lg outline-none font-medium bg-white"
                          />
                          <button
                            onClick={() => {
                              const text = chatReplyMap[chat.id];
                              if (text) {
                                const sellerName = currentSeller?.shopName || 'Shop Seller';
                                replyToLiveChat(chat.id, text, sellerName);
                                setChatReplyMap((prev) => ({ ...prev, [chat.id]: '' }));
                                showToast(isBn ? 'মেসেজের উত্তর পাঠানো হয়েছে!' : 'Reply sent successfully!', 'success');
                              } else {
                                showToast('Please type a reply', 'error');
                              }
                            }}
                            className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                          >
                            {isBn ? 'রিপ্লাই পাঠান' : 'Send Reply'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-xs italic">
                    {isBn ? 'কোনো কাস্টমার মেসেজ পাওয়া যায়নি।' : 'No customer live chat messages yet.'}
                  </div>
                )}
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
          {/* TAB 11: SELLER ACCOUNT KYC VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>{isBn ? 'সেলার একাউন্ট ভেরিফিকেশন (KYC Verification)' : 'Seller Account Identity Verification (KYC)'}</span>
                  </h2>
                  <p className="text-xs text-gray-400">
                    {isBn
                      ? 'গ্যালারি বা ক্যামেরা থেকে এনআইডি কার্ড, পাসপোর্ট অথবা লাইসেন্সের ছবি আপলোড করে ভেরিফাই করুন।'
                      : 'Upload NID Card, Passport, or Driving License photo directly from gallery to unlock uploads.'}
                  </p>
                </div>

                <span
                  className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                    seller.isVerified || seller.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : seller.verificationStatus === 'PENDING_VERIFICATION'
                      ? 'bg-sky-100 text-[#0284c7] border border-sky-200 animate-pulse'
                      : seller.verificationStatus === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {seller.isVerified || seller.verificationStatus === 'VERIFIED'
                    ? 'Verified Seller ✓'
                    : seller.verificationStatus === 'PENDING_VERIFICATION'
                    ? 'Under Review ⌛'
                    : seller.verificationStatus === 'REJECTED'
                    ? 'Rejected ✗'
                    : 'Unverified ⚠️'}
                </span>
              </div>

              {/* Status Alert Banner */}
              {seller.isVerified || seller.verificationStatus === 'VERIFIED' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">
                      {isBn ? '🎉 অভিনন্দন! আপনার সেলার একাউন্ট সফলভাবে ভেরিফাইড (Verified Seller)' : '🎉 Verified Seller Account Active!'}
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      {isBn
                        ? 'আপনার এনআইডি ভেরিফিকেশন অনুমোদিত হয়েছে। আপনি এখন আপনার শপে আনলিমিটেড প্রোডাক্ট আপলোড করতে পারবেন।'
                        : 'Your identity documents have been approved by Admin. You are now authorized to upload products.'}
                    </p>
                  </div>
                </div>
              ) : seller.verificationStatus === 'PENDING_VERIFICATION' ? (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-3 text-sky-900">
                  <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">
                      {isBn ? '⏳ এনআইডি ভেরিফিকেশন আবেদন এডমিন রিভিউয়ের অধীনে রয়েছে (Under Review)' : '⏳ Verification Documents Under Admin Review'}
                    </h4>
                    <p className="text-xs text-sky-800 mt-0.5">
                      {isBn
                        ? 'আপনার জমাকৃত এনআইডি/পাসপোর্ট ছবি এডমিন যাচাই করছে। ২৪ ঘন্টার মধ্যে ভেরিফিকেশন সম্পন্ন হবে।'
                        : 'Admin is reviewing your submitted document photos. Your application will be approved shortly.'}
                    </p>
                  </div>
                </div>
              ) : seller.verificationStatus === 'REJECTED' ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-900">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">
                      {isBn ? '⚠️ ভেরিফিকেশন আবেদন বাতিল করা হয়েছে (Application Rejected)' : '⚠️ Verification Application Rejected'}
                    </h4>
                    <p className="text-xs text-rose-800 mt-0.5 font-bold">
                      {isBn ? `বাতিলের কারণ: ${seller.verificationData?.rejectionReason || 'তথ্য বা ডকুমেন্ট ছবি সঠিক নয়।'}` : `Reason: ${seller.verificationData?.rejectionReason || 'Invalid document photo.'}`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">
                      {isBn ? '🔒 সেলার একাউন্ট ভেরিফিকেশন বাধ্যতামূলক' : '🔒 Identity Verification Required'}
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      {isBn
                        ? 'প্রোডাক্ট আপলোড করার পূর্বে গ্যালারি থেকে আপনার জাতীয় পরিচয়পত্র (NID), পাসপোর্ট বা ড্রাইভিং লাইসেন্সের ছবি আপলোড করে ভেরিফাই করুন।'
                        : 'Select your NID, Passport or Driving License photo directly from gallery to complete verification.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Submission Form */}
              {(!seller.isVerified && seller.verificationStatus !== 'VERIFIED') && (
                <form onSubmit={handleVerificationSubmit} className="space-y-4 text-xs pt-2">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                    <h3 className="font-extrabold text-sm text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                      <FolderPlus className="w-4 h-4 text-[#0284c7]" />
                      <span>{isBn ? 'গ্যালারি থেকে এনআইডি/পাসপোর্ট ছবি আপলোড করুন' : 'Upload NID/Passport Image from Device Gallery'}</span>
                    </h3>

                    {/* Document Type Selector */}
                    <div>
                      <label className="font-bold text-gray-800 block mb-1.5">
                        {isBn ? 'পরিচয়পত্রের ধরণ (Document Type) *' : 'Select Document Type *'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'NID', labelBn: '🪪 জাতীয় পরিচয়পত্র (NID)', labelEn: '🪪 NID Card' },
                          { id: 'PASSPORT', labelBn: '🛂 পাসপোর্ট (Passport)', labelEn: 'Passport' },
                          { id: 'DRIVING_LICENSE', labelBn: '🚘 ড্রাইভিং লাইসেন্স', labelEn: 'Driving License' }
                        ].map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setDocType(doc.id as any)}
                            className={`p-3 rounded-xl border font-bold text-left transition-all cursor-pointer ${
                              docType === doc.id
                                ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-2xs'
                                : 'bg-white hover:bg-sky-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {isBn ? doc.labelBn : doc.labelEn}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-gray-800 block mb-1">
                          {isBn ? 'ডকুমেন্ট নম্বর (NID / Passport No.) *' : 'Document Number *'}
                        </label>
                        <input
                          type="text"
                          value={docNumber}
                          onChange={(e) => setDocNumber(e.target.value)}
                          placeholder={docType === 'NID' ? 'e.g. 1992839201928' : 'e.g. A01928374'}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono font-bold text-gray-900 outline-none focus:border-[#0284c7]"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-gray-800 block mb-1">
                          {isBn ? 'ডকুমেন্ট অনুযায়ী আপনার নাম *' : 'Full Name on Document *'}
                        </label>
                        <input
                          type="text"
                          value={fullNameAsPerDoc}
                          onChange={(e) => setFullNameAsPerDoc(e.target.value)}
                          placeholder={isBn ? 'e.g. মোঃ রফিকুল ইসলাম' : 'e.g. Md. Rafiqul Islam'}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 outline-none focus:border-[#0284c7]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-gray-800 block mb-1">
                        {isBn ? 'যোগাযোগের মোবাইল নম্বর *' : 'Contact Mobile Number *'}
                      </label>
                      <input
                        type="text"
                        value={verifPhone}
                        onChange={(e) => setVerifPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono font-bold text-gray-900 outline-none focus:border-[#0284c7]"
                        required
                      />
                    </div>

                    {/* DIRECT GALLERY FILE UPLOAD SECTION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                      {/* FRONT PHOTO UPLOAD */}
                      <div className="bg-white p-3 rounded-2xl border border-gray-200 space-y-2">
                        <label className="font-extrabold text-gray-900 block text-xs">
                          {isBn ? '১. সামনের দিকের ছবি (Front Photo) *' : '1. Front Page Photo *'}
                        </label>

                        {/* Image Preview Box */}
                        <div className="h-36 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center relative group">
                          {frontImgUrl ? (
                            <img src={frontImgUrl} alt="Front Doc" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-2 text-gray-400">
                              <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-60 text-[#0284c7]" />
                              <span className="text-[11px] font-bold block">{isBn ? 'গ্যালারি থেকে এনআইডি সামনের ছবি সিলেক্ট করুন' : 'Choose Front NID Photo'}</span>
                            </div>
                          )}
                          {isUploadingFrontDoc && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                              <Clock className="w-4 h-4 animate-spin" />
                              <span>আপলোড হচ্ছে...</span>
                            </div>
                          )}
                        </div>

                        {/* File Choose Button */}
                        <label className="w-full py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs rounded-xl cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all">
                          <Upload className="w-4 h-4" />
                          <span>{isBn ? '📂 গ্যালারি থেকে সিলেক্ট করুন (Front)' : '📂 Browse Photo from Gallery'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFrontDocFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* BACK PHOTO UPLOAD */}
                      {docType !== 'PASSPORT' && (
                        <div className="bg-white p-3 rounded-2xl border border-gray-200 space-y-2">
                          <label className="font-extrabold text-gray-900 block text-xs">
                            {isBn ? '২. পিছনের দিকের ছবি (Back Photo) *' : '2. Back Page Photo *'}
                          </label>

                          {/* Image Preview Box */}
                          <div className="h-36 w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center relative group">
                            {backImgUrl ? (
                              <img src={backImgUrl} alt="Back Doc" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center p-2 text-gray-400">
                                <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-60 text-[#0284c7]" />
                                <span className="text-[11px] font-bold block">{isBn ? 'গ্যালারি থেকে এনআইডি পিছনের ছবি সিলেক্ট করুন' : 'Choose Back NID Photo'}</span>
                              </div>
                            )}
                            {isUploadingBackDoc && (
                              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                                <Clock className="w-4 h-4 animate-spin" />
                                <span>আপলোড হচ্ছে...</span>
                              </div>
                            )}
                          </div>

                          {/* File Choose Button */}
                          <label className="w-full py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs rounded-xl cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 transition-all">
                            <Upload className="w-4 h-4" />
                            <span>{isBn ? '📂 গ্যালারি থেকে সিলেক্ট করুন (Back)' : '📂 Browse Photo from Gallery'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBackDocFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>{isBn ? '🛡️ ভেরিফিকেশন আবেদন জমা দিন (Submit KYC)' : '🛡️ Submit Verification Request'}</span>
                    </button>
                  </div>
                </form>
              )}
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

      {/* CREATE SPONSORED AD CAMPAIGN MODAL */}
      {isCreateCampaignOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-sm text-gray-900">
                  {isBn ? 'নতুন স্পনসরড এড ক্যাম্পেইন তৈরি করুন' : 'Create Sponsored Ad Campaign'}
                </h3>
              </div>
              <button onClick={() => setIsCreateCampaignOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'প্রোডাক্ট নির্বাচন করুন *' : 'Select Product to Boost *'}
                </label>
                <select
                  value={selectedProductForAd}
                  onChange={(e) => setSelectedProductForAd(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold bg-white text-gray-800 outline-none focus:border-[#0284c7]"
                  required
                >
                  <option value="">{isBn ? '-- আপনার শপের প্রোডাক্ট সিলেক্ট করুন --' : '-- Select your store product --'}</option>
                  {sellerProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-800">
                    {isBn ? 'দৈনিক বাজেট (৳) *' : 'Daily Ad Budget (৳) *'}
                  </label>
                  <span className="text-[10px] text-gray-400">
                    {isBn ? 'সর্বনিম্ন ৳১০০' : 'Min ৳100'}
                  </span>
                </div>
                <input
                  type="number"
                  value={adDailyBudget}
                  onChange={(e) => setAdDailyBudget(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-black text-gray-900 outline-none focus:border-[#0284c7]"
                  min={100}
                  required
                />
                <div className="flex gap-1.5 pt-1.5">
                  {[200, 300, 500, 1000, 2000].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setAdDailyBudget(b)}
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-lg border cursor-pointer transition-all ${
                        adDailyBudget === b
                          ? 'bg-[#0284c7] text-white border-[#0284c7]'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      ৳{b}
                    </button>
                  ))}
                </div>
              </div>

              {/* DURATION SELECTION */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-800">
                    {isBn ? 'ক্যাম্পেইনের সময়কাল (দিন) *' : 'Campaign Duration (Days) *'}
                  </label>
                  <span className="text-[10px] text-[#0284c7] font-bold">
                    {campaignDurationDays} {isBn ? 'দিন চলবে' : 'Days Total'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 mb-1.5">
                  {[3, 5, 7, 14, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setCampaignDurationDays(days)}
                      className={`py-1.5 rounded-xl font-black text-center text-xs border cursor-pointer transition-all ${
                        campaignDurationDays === days
                          ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-2xs'
                          : 'bg-white hover:bg-sky-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {days} {isBn ? 'দিন' : 'Days'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 font-medium">
                    {isBn ? 'অথবা কাস্টম দিন লিখুন:' : 'Or custom days:'}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={campaignDurationDays}
                    onChange={(e) => setCampaignDurationDays(Math.max(1, Number(e.target.value)))}
                    className="w-20 p-1.5 border border-gray-300 rounded-lg text-center font-bold text-xs"
                  />
                  <span className="text-[11px] text-gray-500">{isBn ? 'দিন' : 'Days'}</span>
                </div>
              </div>

              {/* DYNAMIC METRICS SUMMARY BOX */}
              {(() => {
                const totalEstimatedBudget = (Number(adDailyBudget) || 500) * (Number(campaignDurationDays) || 7);
                const rate = adminAdSettings?.cpmRate || 200;
                const estImpressions = Math.round((totalEstimatedBudget / rate) * 1000);
                const estInquiries = Math.round(estImpressions * 0.04);
                const isBalanceLow = (wallet.adBalance || 0) < totalEstimatedBudget;

                return (
                  <div className="space-y-2">
                    <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-gray-800">
                        <span>{isBn ? 'মোট আনুমানিক বাজেট:' : 'Total Estimated Budget:'}</span>
                        <span className="font-black text-[#0284c7] text-sm tabular-nums">
                          {formatPrice(totalEstimatedBudget)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600 text-[11px]">
                        <span>{isBn ? 'আনুমানিক ভিউ / ইম্প্রেশন:' : 'Estimated Views / Impressions:'}</span>
                        <span className="font-extrabold text-gray-900 tabular-nums">
                          ~{estImpressions.toLocaleString()} {isBn ? 'ভিউ' : 'Views'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600 text-[11px]">
                        <span>{isBn ? 'আনুমানিক কাস্টমার এনগেজমেন্ট:' : 'Estimated Inquiries / Traffic:'}</span>
                        <span className="font-extrabold text-amber-700 tabular-nums">
                          ~{estInquiries.toLocaleString()} {isBn ? 'কাস্টমার' : 'Inquiries'}
                        </span>
                      </div>
                    </div>

                    {isBalanceLow ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-900">
                        <div>
                          <strong className="block font-black text-amber-950">
                            {isBn ? '⚠️ কম এড ব্যালেন্স:' : '⚠️ Low Ad Balance:'} {formatPrice(wallet.adBalance || 0)}
                          </strong>
                          <span className="text-[10px] text-amber-800">
                            {isBn
                              ? 'ক্যাম্পেইন নিরবচ্ছিন্ন রাখতে বিকাশ/নগদে ডিপোজিট করুন।'
                              : 'Deposit funds to avoid ad delivery interruption.'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDepositModalOpen(true);
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer shadow-2xs"
                        >
                          {isBn ? '+ ডিপোজিট করুন' : '+ Deposit Funds'}
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] font-semibold flex items-center justify-between">
                        <span>{isBn ? '✓ বর্তমান এড ব্যালেন্স পর্যাপ্ত রয়েছে:' : '✓ Sufficient Ad Balance:'}</span>
                        <strong className="font-black text-emerald-700">{formatPrice(wallet.adBalance || 0)}</strong>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateCampaignOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 font-bold rounded-xl text-gray-700 cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-md cursor-pointer active:scale-98"
                >
                  {isBn ? 'ক্যাম্পেইন চালু করুন 🚀' : 'Launch Campaign 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPOSIT MODAL FOR SELLER AD BALANCE & WALLET */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    {isBn ? 'এড ব্যালেন্স ডিপোজিট করুন' : 'Deposit Funds to Ad Balance'}
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    {isBn ? 'বিকাশ, নগদ বা রকেটে টাকা পাঠিয়ে ট্রানজেকশন আইডি দিন' : 'Send money via bKash, Nagad, or Rocket and submit TrxID'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3.5 text-xs">
              {/* Payment Method Selector */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'পেমেন্ট মেথড নির্বাচন করুন *' : 'Select Payment Method *'}
                </label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value as any)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold bg-white text-gray-800 outline-none focus:border-[#0284c7]"
                >
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Rocket">Rocket (ডাচ-বাংলা রকেট)</option>
                  <option value="Bank Transfer">Bank Transfer (ব্যাংক ট্রান্সফার)</option>
                </select>
              </div>

              {/* DYNAMIC OFFICIAL ACCOUNT BOX BASED ON METHOD */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-600 text-[11px]">
                    {depositMethod === 'bKash' && (isBn ? 'অফিসিয়াল বিকাশ নম্বর:' : 'Official bKash Account:')}
                    {depositMethod === 'Nagad' && (isBn ? 'অফিসিয়াল নগদ নম্বর:' : 'Official Nagad Account:')}
                    {depositMethod === 'Rocket' && (isBn ? 'অফিসিয়াল রকেট নম্বর:' : 'Official Rocket Account:')}
                    {depositMethod === 'Bank Transfer' && (isBn ? 'অফিসিয়াল ব্যাংক অ্যাকাউন্ট:' : 'Official Bank Details:')}
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-2 py-0.5 rounded-full">
                    {depositMethod === 'bKash' && (adminAdSettings?.bkashType || 'Merchant')}
                    {depositMethod === 'Nagad' && (adminAdSettings?.nagadType || 'Personal')}
                    {depositMethod === 'Rocket' && 'Personal'}
                    {depositMethod === 'Bank Transfer' && 'Corporate'}
                  </span>
                </div>

                {depositMethod === 'bKash' && (
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-pink-200">
                    <div>
                      <span className="font-mono text-base font-black text-pink-700 tracking-wider">
                        {adminAdSettings?.bkashNumber || '01712-345678'}
                      </span>
                      <p className="text-[10px] text-gray-500">
                        {adminAdSettings?.bkashType === 'Personal'
                          ? (isBn ? 'বিকাশ অ্যাপ বা *২৪৭# দিয়ে Send Money করুন' : 'Send Money to this Personal account')
                          : (isBn ? 'বিকাশ অ্যাপ দিয়ে Make Payment করুন' : 'Make Payment to this Merchant account')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(adminAdSettings?.bkashNumber || '01712-345678', 'bkash')}
                      className="bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] font-black px-2.5 py-1.5 rounded-lg border border-pink-200 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'bkash' ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}</span>
                    </button>
                  </div>
                )}

                {depositMethod === 'Nagad' && (
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200">
                    <div>
                      <span className="font-mono text-base font-black text-amber-700 tracking-wider">
                        {adminAdSettings?.nagadNumber || '01812-987654'}
                      </span>
                      <p className="text-[10px] text-gray-500">
                        {adminAdSettings?.nagadType === 'Personal'
                          ? (isBn ? 'নগদ অ্যাপ বা *১৬৭# দিয়ে Send Money করুন' : 'Send Money to this Personal account')
                          : (isBn ? 'নগদ অ্যাপ দিয়ে Merchant Pay করুন' : 'Make Payment to this Merchant account')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(adminAdSettings?.nagadNumber || '01812-987654', 'nagad')}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-black px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'nagad' ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}</span>
                    </button>
                  </div>
                )}

                {depositMethod === 'Rocket' && (
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-purple-200">
                    <div>
                      <span className="font-mono text-base font-black text-purple-700 tracking-wider">
                        {adminAdSettings?.rocketNumber || '01912-456789-2'}
                      </span>
                      <p className="text-[10px] text-gray-500">
                        {isBn ? 'রকেট অ্যাপ বা *৩২২# দিয়ে Send Money করুন' : 'Send Money via DBBL Rocket'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(adminAdSettings?.rocketNumber || '01912-456789-2', 'rocket')}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-black px-2.5 py-1.5 rounded-lg border border-purple-200 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'rocket' ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}</span>
                    </button>
                  </div>
                )}

                {depositMethod === 'Bank Transfer' && (
                  <div className="bg-white p-2.5 rounded-xl border border-gray-200 space-y-1.5">
                    <p className="text-[11px] font-mono text-gray-800 leading-relaxed font-bold">
                      {adminAdSettings?.bankDetails || 'Bank Asia Ltd, Principal Branch Dhaka, A/C: 021310088921'}
                    </p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(adminAdSettings?.bankDetails || '', 'bank')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === 'bank' ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'ব্যাংক তথ্য কপি করুন' : 'Copy Bank Details')}</span>
                    </button>
                  </div>
                )}

                {/* Instructions Notice */}
                <div className="p-2 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[10.5px] text-amber-900 leading-snug">
                  ℹ️ {adminAdSettings?.depositNotice || (isBn ? 'টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) ও নম্বর দিয়ে ডিপোজিট সাবমিট করুন।' : 'After payment, enter your sender number and Transaction ID (TrxID).')}
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'ডিপোজিট পরিমাণ (৳) *' : 'Deposit Amount (৳) *'}
                </label>
                <input
                  type="number"
                  min={100}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  placeholder="e.g. 1000"
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-black text-gray-900 text-sm outline-none focus:border-emerald-600"
                  required
                />
                <div className="flex gap-1.5 pt-1.5">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-lg border cursor-pointer transition-all ${
                        depositAmount === amt
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      ৳{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender Number */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন *' : 'Sender Mobile / Account Number *'}
                </label>
                <input
                  type="text"
                  value={depositSenderNumber}
                  onChange={(e) => setDepositSenderNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-mono font-bold text-gray-900 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              {/* Transaction ID */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'ট্রানজেকশন আইডি (TrxID) *' : 'Transaction ID (TrxID) *'}
                </label>
                <input
                  type="text"
                  value={depositTrxId}
                  onChange={(e) => setDepositTrxId(e.target.value)}
                  placeholder="e.g. 9B8A7C6D5E"
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-mono font-black uppercase text-gray-900 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {isBn ? 'নোট / রেফারেন্স (ঐচ্ছিক)' : 'Notes / Reference (Optional)'}
                </label>
                <input
                  type="text"
                  value={depositNotes}
                  onChange={(e) => setDepositNotes(e.target.value)}
                  placeholder={isBn ? 'e.g. ক্যাম্পেইন বাজেট রিচার্জ' : 'e.g. Ad balance deposit'}
                  className="w-full p-2 border border-gray-200 rounded-xl text-gray-700 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
                >
                  {isBn ? '💸 ডিপোজিট সাবমিট করুন' : '💸 Submit Deposit Request'}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center">
                {isBn
                  ? 'এডমিন ডিপোজিট ভেরিফাই করে কিছুক্ষণের মধ্যে আপনার এড ব্যালেন্সে টাকা যোগ করে দেবেন।'
                  : 'Admin will verify the transaction and credit funds to your Ad Balance shortly.'}
              </p>
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

      {/* SELLER ACCOUNT KYC VERIFICATION MODAL POPUP */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    {isBn ? 'সেলার একাউন্ট ভেরিফিকেশন (KYC Request)' : 'Seller Account Identity Verification'}
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    {isBn ? 'প্রোডাক্ট আপলোড আনলক করতে গ্যালারি থেকে আপনার এনআইডি, পাসপোর্ট বা লাইসেন্সের ছবি আপলোড করুন' : 'Upload NID, Passport, or License photo from gallery to unlock product uploading'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-3.5 text-xs">
              {/* Document Type Selector */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'পরিচয়পত্রের ধরণ নির্বাচন করুন *' : 'Select Document Type *'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'NID', label: '🪪 NID Card' },
                    { id: 'PASSPORT', label: '🛂 Passport' },
                    { id: 'DRIVING_LICENSE', label: '🚘 License' }
                  ].map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setDocType(doc.id as any)}
                      className={`p-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                        docType === doc.id
                          ? 'bg-[#0284c7] text-white border-[#0284c7]'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {doc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'ডকুমেন্ট নম্বর (NID / Passport / License No.) *' : 'Document Number *'}
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder={docType === 'NID' ? 'e.g. 1992839201928' : docType === 'PASSPORT' ? 'e.g. A01928374' : 'e.g. DL-8291048'}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-mono font-bold text-gray-900 outline-none focus:border-[#0284c7]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'ডকুমেন্ট অনুযায়ী আপনার পূর্ণ নাম *' : 'Full Name on Document *'}
                </label>
                <input
                  type="text"
                  value={fullNameAsPerDoc}
                  onChange={(e) => setFullNameAsPerDoc(e.target.value)}
                  placeholder={isBn ? 'e.g. মোঃ রফিকুল ইসলাম' : 'e.g. Md. Rafiqul Islam'}
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-bold text-gray-900 outline-none focus:border-[#0284c7]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  {isBn ? 'যোগাযোগের মোবাইল নম্বর *' : 'Verification Contact Phone *'}
                </label>
                <input
                  type="text"
                  value={verifPhone}
                  onChange={(e) => setVerifPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full p-2.5 border border-gray-300 rounded-xl font-mono font-bold text-gray-900 outline-none focus:border-[#0284c7]"
                  required
                />
              </div>

              {/* DIRECT GALLERY IMAGE UPLOADS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                {/* FRONT IMAGE */}
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 space-y-1.5">
                  <label className="font-extrabold text-gray-900 block text-[11px]">
                    {isBn ? '১. সামনের দিকের ছবি (Front Photo) *' : '1. Front Photo *'}
                  </label>
                  <div className="h-28 w-full bg-white rounded-lg border border-dashed border-gray-300 overflow-hidden flex items-center justify-center relative">
                    {frontImgUrl ? (
                      <img src={frontImgUrl} alt="Front" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-semibold">{isBn ? 'গ্যালারি থেকে ফটো নির্বাচন করুন' : 'No photo selected'}</span>
                    )}
                    {isUploadingFrontDoc && (
                      <div className="absolute inset-0 bg-black/60 text-white text-[10px] flex items-center justify-center font-bold">
                        আপলোড হচ্ছে...
                      </div>
                    )}
                  </div>
                  <label className="w-full py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-[11px] rounded-lg cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isBn ? '📂 গ্যালারি থেকে আপলোড (Front)' : '📂 Browse Gallery'}</span>
                    <input type="file" accept="image/*" onChange={handleFrontDocFileUpload} className="hidden" />
                  </label>
                </div>

                {/* BACK IMAGE */}
                {docType !== 'PASSPORT' && (
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 space-y-1.5">
                    <label className="font-extrabold text-gray-900 block text-[11px]">
                      {isBn ? '২. পিছনের দিকের ছবি (Back Photo) *' : '2. Back Photo *'}
                    </label>
                    <div className="h-28 w-full bg-white rounded-lg border border-dashed border-gray-300 overflow-hidden flex items-center justify-center relative">
                      {backImgUrl ? (
                        <img src={backImgUrl} alt="Back" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold">{isBn ? 'গ্যালারি থেকে ফটো নির্বাচন করুন' : 'No photo selected'}</span>
                      )}
                      {isUploadingBackDoc && (
                        <div className="absolute inset-0 bg-black/60 text-white text-[10px] flex items-center justify-center font-bold">
                          আপলোড হচ্ছে...
                        </div>
                      )}
                    </div>
                    <label className="w-full py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-[11px] rounded-lg cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isBn ? '📂 গ্যালারি থেকে আপলোড (Back)' : '📂 Browse Gallery'}</span>
                      <input type="file" accept="image/*" onChange={handleBackDocFileUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer transition-all active:scale-98 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isBn ? '🛡️ আবেদন সাবমিট করুন' : '🛡️ Submit Application'}</span>
                </button>
              </div>
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
