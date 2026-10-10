'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  Banner,
  User,
  Review,
  OrderStatus,
  PaymentMethod,
  ShippingAddress,
  PaymentGatewayConfig,
  MarketplaceSettings,
  OrderTrackingStep,
  Coupon,
  AudienceLead,
  SubAgent,
  LiveChatMessage,
  Seller,
  SellerWallet,
  SellerTransaction,
  WithdrawalRequest,
  SellerNotification,
  ProductQnA,
  SellerPromotion,
  SponsoredAdCampaign,
  SellerDepositRequest,
  AdminAdSettings,
  PayoutMethod,
  SellerStatus,
  WithdrawalStatus,
  SellerVerificationRequest,
  SellerVerificationStatus,
  Affiliate,
  AffiliateLink,
  AffiliateClick,
  AffiliateCommission,
  AffiliateWithdrawal,
  AffiliateSettings,
  AffiliateFraudAlert,
  AffiliateStatus,
  AffiliateCommissionStatus,
  AffiliateWithdrawalStatus
} from '../types/ecommerce';
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  HERO_BANNERS,
  INITIAL_ORDERS
} from '../data/seed-products';
import {
  DEFAULT_SETTINGS,
  DEFAULT_GATEWAYS,
  DEFAULT_COUPONS,
  DEFAULT_SUB_AGENTS,
  DEFAULT_LIVE_CHATS
} from '../data/default-settings';
import {
  DEFAULT_SELLERS,
  DEFAULT_WALLETS,
  DEFAULT_TRANSACTIONS,
  DEFAULT_WITHDRAWALS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_QNA,
  DEFAULT_SELLER_PROMOTIONS,
  DEFAULT_SPONSORED_CAMPAIGNS,
  DEFAULT_DEPOSIT_REQUESTS,
  DEFAULT_ADMIN_AD_SETTINGS
} from '../data/seed-seller';
import {
  DEFAULT_AFFILIATES,
  DEFAULT_AFFILIATE_SETTINGS,
  DEFAULT_AFFILIATE_LINKS,
  DEFAULT_AFFILIATE_CLICKS,
  DEFAULT_AFFILIATE_COMMISSIONS,
  DEFAULT_AFFILIATE_WITHDRAWALS,
  DEFAULT_AFFILIATE_FRAUD_ALERTS
} from '../data/seed-affiliate';
import { Language, translations } from '../i18n/translations';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { 
  saveLeadToFirestore, 
  saveOrderToFirestore, 
  saveProductToFirestore, 
  syncUserToFirestore,
  saveBannerToFirestore,
  deleteBannerFromFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  saveSettingsToFirestore,
  saveCouponToFirestore,
  deleteCouponFromFirestore,
  saveSellerToFirestore,
  saveAffiliateToFirestore
} from '@/lib/firebase/services';
import { db } from '@/lib/firebase/config';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { generateCustomerQAId, generateSellerQAId } from '@/lib/utils/id-generator';

interface MarketplaceContextType {
  // Mounting flag for SSR safety
  isMounted: boolean;

  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], params?: Record<string, string | number>) => string;
  formatPrice: (amount: number) => string;

  // Store Settings (helpline, contact email, phone)
  settings: MarketplaceSettings;
  updateSettings: (newSettings: Partial<MarketplaceSettings>) => void;

  // Payment Gateways Config (bKash personal/agent/merchant, nagad, rocket)
  gateways: PaymentGatewayConfig[];
  addGateway: (gw: Omit<PaymentGatewayConfig, 'id'>) => void;
  updateGateway: (id: string, updates: Partial<PaymentGatewayConfig>) => void;
  deleteGateway: (id: string) => void;

  // User & Auth
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  switchRole: (role: 'CUSTOMER' | 'ADMIN' | 'SELLER') => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'signup' | 'subagent' | 'forgot_password';
  setAuthModalTab: (tab: 'login' | 'signup' | 'subagent' | 'forgot_password') => void;

  // Catalog & Category CRUD
  products: Product[];
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id' | 'slug'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Banners CRUD
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantId?: string, variantName?: string, variantValue?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Voucher & Coupons
  voucherCode: string;
  appliedDiscount: number;
  applyVoucherCode: (code: string) => boolean;
  coupons: Coupon[];
  addCoupon: (cpn: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  collectedVouchers: string[];
  collectVoucher: (code: string) => void;
  isVoucherCollected: (code: string) => boolean;
  addCustomerReviewWithPhoto: (productId: string, rating: number, comment: string, images?: string[]) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Modals & Active Views
  activeProductModal: Product | null;
  setActiveProductModal: (p: Product | null) => void;
  activeVideoModalUrl: string | null;
  setActiveVideoModalUrl: (url: string | null) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isBkashModalOpen: boolean;
  setIsBkashModalOpen: (open: boolean) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  activeReturnOrderModal: Order | null;
  setActiveReturnOrderModal: (ord: Order | null) => void;
  isTrackOrderModalOpen: boolean;
  setIsTrackOrderModalOpen: (open: boolean) => void;
  trackOrderNumberQuery: string;
  setTrackOrderNumberQuery: (val: string) => void;
  isAppDownloadModalOpen: boolean;
  setIsAppDownloadModalOpen: (open: boolean) => void;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;

  // Orders & Tracking
  orders: Order[];
  placeOrder: (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    shippingFee?: number,
    transactionId?: string,
    senderNumber?: string
  ) => Promise<Order>;
  requestReturn: (orderId: string, reason: string) => boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: 'Pending' | 'Paid' | 'Failed') => void;
  updateOrderTracking: (
    orderId: string,
    courierPartner: string,
    status: OrderStatus,
    note?: string,
    location?: string,
    trackingCode?: string
  ) => void;

  // Admin Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'slug'> & { rating?: number; reviewCount?: number; soldCount?: number }) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  approveReview: (productId: string, reviewId: string) => void;

  // Notification Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Audience & Newsletter Leads
  leads: AudienceLead[];
  addLead: (
    email?: string,
    phone?: string,
    source?: string,
    name?: string,
    note?: string,
    productTitle?: string
  ) => void;
  updateLead: (id: string, updates: Partial<AudienceLead>) => void;
  deleteLead: (id: string) => void;

  // Sub-Agent Staff & Permissions Management
  subAgents: SubAgent[];
  addSubAgent: (agent: Omit<SubAgent, 'id' | 'createdAt'>) => void;
  updateSubAgent: (id: string, updates: Partial<SubAgent>) => void;
  deleteSubAgent: (id: string) => void;
  currentSubAgent: SubAgent | null;
  setCurrentSubAgent: (agent: SubAgent | null) => void;

  // Live Chat & Customer Inquiries
  liveChats: LiveChatMessage[];
  addLiveChatMessage: (name: string, message: string, phone?: string, email?: string) => void;
  replyToLiveChat: (chatId: string, replyText: string, agentName?: string) => void;

  // Seller Center Module State & Actions
  sellers: Seller[];
  currentSeller: Seller | null;
  setCurrentSeller: (seller: Seller | null) => void;
  sellerWallets: Record<string, SellerWallet>;
  sellerTransactions: SellerTransaction[];
  withdrawalRequests: WithdrawalRequest[];
  sellerNotifications: SellerNotification[];
  productQnAs: ProductQnA[];
  sellerPromotions: SellerPromotion[];
  sponsoredCampaigns: SponsoredAdCampaign[];
  shopFollowers: string[];
  createSponsoredCampaign: (data: Omit<SponsoredAdCampaign, 'id' | 'impressions' | 'clicks' | 'spend' | 'salesGenerated' | 'ordersCount' | 'roas' | 'createdAt'>) => void;
  toggleCampaignStatus: (campaignId: string) => void;
  deleteSponsoredCampaign: (campaignId: string) => void;
  recordProductImpression: (productId: string) => void;
  recordProductClick: (productId: string) => void;
  simulateCampaignTraffic: (campaignId: string, impressions?: number, clicks?: number) => void;
  getRankedProducts: (prods: Product[], query?: string, categoryId?: string) => Product[];
  sellerRegister: (data: {
    name: string;
    shopName: string;
    phone: string;
    email: string;
    password: string;
    shopAddress: string;
    payoutMethod: PayoutMethod;
    payoutAccount: string;
    nidTradeLicense?: string;
  }) => Promise<Seller>;
  sellerLogin: (email: string, pass: string) => Promise<Seller>;
  updateSellerProfile: (sellerId: string, updates: Partial<Seller>) => void;
  addSellerProduct: (product: Omit<Product, 'id' | 'slug'>) => void;
  updateSellerProduct: (id: string, updates: Partial<Product>) => void;
  deleteSellerProduct: (id: string) => void;
  approveProduct: (productId: string) => void;
  rejectProduct: (productId: string, reason?: string) => void;
  requestWithdrawal: (sellerId: string, amount: number, method: PayoutMethod, account: string) => boolean;
  replyToReview: (productId: string, reviewId: string, replyText: string) => void;
  answerQuestion: (qnaId: string, answerText: string) => void;
  addCustomerQuestion: (productId: string, question: string) => void;
  createSellerPromotion: (promo: Omit<SellerPromotion, 'id' | 'createdAt'>) => void;
  toggleFollowShop: (sellerId: string) => void;
  isFollowingShop: (sellerId: string) => boolean;
  approveSeller: (sellerId: string) => void;
  rejectSeller: (sellerId: string, reason?: string) => void;
  suspendSeller: (sellerId: string) => void;
  submitSellerVerification: (sellerId: string, data: Omit<SellerVerificationRequest, 'submittedAt'>) => void;
  approveSellerVerification: (sellerId: string) => void;
  rejectSellerVerification: (sellerId: string, reason: string) => void;
  approveWithdrawal: (requestId: string) => void;
  rejectWithdrawal: (requestId: string, reason: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  adminAdSettings: AdminAdSettings;
  updateAdminAdSettings: (updates: Partial<AdminAdSettings>) => void;
  depositRequests: SellerDepositRequest[];
  submitSellerDeposit: (data: Omit<SellerDepositRequest, 'id' | 'status' | 'createdAt'>) => void;
  approveSellerDeposit: (depositId: string) => void;
  rejectSellerDeposit: (depositId: string, reason: string) => void;
  adjustSellerBalance: (sellerId: string, amount: number, type: 'CREDIT' | 'DEBIT', balanceType: 'MAIN' | 'AD' | 'BOTH', reason: string) => void;
  transferToAdBalance: (sellerId: string, amount: number) => boolean;

  // Affiliate System State & Actions
  affiliates: Affiliate[];
  currentAffiliate: Affiliate | null;
  setCurrentAffiliate: (aff: Affiliate | null) => void;
  affiliateLinks: AffiliateLink[];
  affiliateClicks: AffiliateClick[];
  affiliateCommissions: AffiliateCommission[];
  affiliateWithdrawals: AffiliateWithdrawal[];
  affiliateSettings: AffiliateSettings;
  affiliateFraudAlerts: AffiliateFraudAlert[];
  activeAffiliateCode: string | null;
  setActiveAffiliateCode: (code: string | null) => void;
  registerAffiliate: (data: {
    name: string;
    phone: string;
    email: string;
    password?: string;
    payoutMethod: 'bKash' | 'Nagad' | 'Bank';
    payoutAccount: string;
  }) => Promise<Affiliate>;
  loginAffiliate: (email: string, pass: string) => Promise<Affiliate>;
  upgradeCustomerToAffiliate: (payoutMethod: 'bKash' | 'Nagad' | 'Bank', payoutAccount: string) => Promise<Affiliate>;
  generateAffiliateLink: (productId?: string) => AffiliateLink;
  recordAffiliateClick: (code: string, productId?: string) => void;
  requestAffiliateWithdrawal: (amount: number, payoutMethod: 'bKash' | 'Nagad' | 'Bank', payoutAccount: string) => boolean;
  adminUpdateWithdrawal: (id: string, status: AffiliateWithdrawalStatus, txnId?: string, rejectReason?: string) => void;
  adminToggleAffiliateStatus: (affiliateId: string) => void;
  adminUpdateAffiliateSettings: (settings: Partial<AffiliateSettings>) => void;
  adminCancelCommission: (commissionId: string, reason: string) => void;
  runAffiliateCommissionApprovalCron: () => number;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const INITIAL_LEADS: AudienceLead[] = [];

const DEFAULT_CUSTOMER: User = {
  id: 'usr-customer-1',
  name: 'Rayhan Ahmed',
  email: 'rayhan@bazaarbd.com',
  phone: '01712345678',
  role: 'CUSTOMER',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  address: {
    fullName: 'Rayhan Ahmed',
    phone: '01712345678',
    division: 'Dhaka',
    district: 'Dhaka City',
    thanaCity: 'Dhanmondi',
    addressLine: 'House 42, Road 7/A, Dhanmondi R/A, Dhaka-1209'
  }
};

const DEFAULT_ADMIN: User = {
  id: 'usr-admin-payal',
  name: 'Payal Admin',
  email: 'Payalyt6279@gmail.com',
  phone: '01899887766',
  role: 'ADMIN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
};

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMounted = useIsMounted();
  const [language, setLanguageState] = useState<Language>('en');
  const [settings, setSettings] = useState<MarketplaceSettings>(DEFAULT_SETTINGS);
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(DEFAULT_GATEWAYS);
  const [user, setUser] = useState<User | null>(null);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [banners, setBanners] = useState<Banner[]>(HERO_BANNERS);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Vouchers & Coupons
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [leads, setLeads] = useState<AudienceLead[]>(INITIAL_LEADS);
  const [subAgents, setSubAgents] = useState<SubAgent[]>(DEFAULT_SUB_AGENTS);
  const [currentSubAgent, setCurrentSubAgent] = useState<SubAgent | null>(null);
  const [liveChats, setLiveChats] = useState<LiveChatMessage[]>(DEFAULT_LIVE_CHATS);

  // Seller Center Module States
  const [sellers, setSellers] = useState<Seller[]>(DEFAULT_SELLERS);
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(DEFAULT_SELLERS[0]);
  const [sellerWallets, setSellerWallets] = useState<Record<string, SellerWallet>>(DEFAULT_WALLETS);
  const [sellerTransactions, setSellerTransactions] = useState<SellerTransaction[]>(DEFAULT_TRANSACTIONS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(DEFAULT_WITHDRAWALS);
  const [sellerNotifications, setSellerNotifications] = useState<SellerNotification[]>(DEFAULT_NOTIFICATIONS);
  const [productQnAs, setProductQnAs] = useState<ProductQnA[]>(DEFAULT_QNA);
  const [sellerPromotions, setSellerPromotions] = useState<SellerPromotion[]>(DEFAULT_SELLER_PROMOTIONS);
  const [sponsoredCampaigns, setSponsoredCampaigns] = useState<SponsoredAdCampaign[]>(DEFAULT_SPONSORED_CAMPAIGNS);
  const [depositRequests, setDepositRequests] = useState<SellerDepositRequest[]>(DEFAULT_DEPOSIT_REQUESTS);
  const [adminAdSettings, setAdminAdSettings] = useState<AdminAdSettings>(DEFAULT_ADMIN_AD_SETTINGS);
  const [shopFollowers, setShopFollowers] = useState<string[]>(['seller-apex-01']);

  // Affiliate System States
  const [affiliates, setAffiliates] = useState<Affiliate[]>(DEFAULT_AFFILIATES);
  const [currentAffiliate, setCurrentAffiliate] = useState<Affiliate | null>(DEFAULT_AFFILIATES[0]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(DEFAULT_AFFILIATE_LINKS);
  const [affiliateClicks, setAffiliateClicks] = useState<AffiliateClick[]>(DEFAULT_AFFILIATE_CLICKS);
  const [affiliateCommissions, setAffiliateCommissions] = useState<AffiliateCommission[]>(DEFAULT_AFFILIATE_COMMISSIONS);
  const [affiliateWithdrawals, setAffiliateWithdrawals] = useState<AffiliateWithdrawal[]>(DEFAULT_AFFILIATE_WITHDRAWALS);
  const [affiliateSettings, setAffiliateSettings] = useState<AffiliateSettings>(DEFAULT_AFFILIATE_SETTINGS);
  const [affiliateFraudAlerts, setAffiliateFraudAlerts] = useState<AffiliateFraudAlert[]>(DEFAULT_AFFILIATE_FRAUD_ALERTS);
  const [activeAffiliateCode, setActiveAffiliateCode] = useState<string | null>(null);

  // Ref to always access latest campaigns without re-triggering memoized ranking calculations
  const sponsoredCampaignsRef = useRef<SponsoredAdCampaign[]>(DEFAULT_SPONSORED_CAMPAIGNS);
  useEffect(() => {
    sponsoredCampaignsRef.current = sponsoredCampaigns;
  }, [sponsoredCampaigns]);

  const adminAdSettingsRef = useRef<AdminAdSettings>(DEFAULT_ADMIN_AD_SETTINGS);
  useEffect(() => {
    adminAdSettingsRef.current = adminAdSettings;
  }, [adminAdSettings]);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'subagent' | 'forgot_password'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [activeVideoModalUrl, setActiveVideoModalUrl] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isBkashModalOpen, setIsBkashModalOpen] = useState<boolean>(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [activeReturnOrderModal, setActiveReturnOrderModal] = useState<Order | null>(null);
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState<boolean>(false);
  const [trackOrderNumberQuery, setTrackOrderNumberQuery] = useState<string>('');
  const [isAppDownloadModalOpen, setIsAppDownloadModalOpen] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Restore client state safely in useEffect to guarantee hydration parity
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedCart = localStorage.getItem('bazaarbd_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedWishlist = localStorage.getItem('bazaarbd_wishlist');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

        const savedOrders = localStorage.getItem('bazaarbd_orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        const savedLang = localStorage.getItem('bazaarbd_lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'bn')) setLanguageState(savedLang);

        const savedSettings = localStorage.getItem('bazaarbd_settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));

        const savedGateways = localStorage.getItem('bazaarbd_gateways');
        if (savedGateways) setGateways(JSON.parse(savedGateways));

        const savedCategories = localStorage.getItem('bazaarbd_categories');
        if (savedCategories) setCategories(JSON.parse(savedCategories));

        const savedBanners = localStorage.getItem('bazaarbd_banners');
        if (savedBanners) setBanners(JSON.parse(savedBanners));

        const savedCoupons = localStorage.getItem('bazaarbd_coupons');
        if (savedCoupons) setCoupons(JSON.parse(savedCoupons));

        const savedLeads = localStorage.getItem('bazaarbd_leads');
        if (savedLeads) setLeads(JSON.parse(savedLeads));

        const savedAgents = localStorage.getItem('bazaarbd_subagents');
        if (savedAgents) setSubAgents(JSON.parse(savedAgents));

        const savedChats = localStorage.getItem('bazaarbd_livechats');
        if (savedChats) setLiveChats(JSON.parse(savedChats));

        const savedSellers = localStorage.getItem('bazaarbd_sellers');
        if (savedSellers) {
          const parsedSellers = JSON.parse(savedSellers) as Seller[];
          const migratedSellers = parsedSellers.map((s) => {
            if (!s.sellerIdNumber) {
              return { ...s, sellerIdNumber: generateSellerQAId() };
            }
            return s;
          });
          setSellers(migratedSellers);
        }

        const savedCurrentSeller = localStorage.getItem('bazaarbd_current_seller');
        if (savedCurrentSeller) {
          const parsedCurSeller = JSON.parse(savedCurrentSeller) as Seller;
          if (!parsedCurSeller.sellerIdNumber) {
            parsedCurSeller.sellerIdNumber = generateSellerQAId();
          }
          setCurrentSeller(parsedCurSeller);
        }

        const savedWallets = localStorage.getItem('bazaarbd_seller_wallets');
        if (savedWallets) setSellerWallets(JSON.parse(savedWallets));

        const savedWithdrawals = localStorage.getItem('bazaarbd_withdrawals');
        if (savedWithdrawals) setWithdrawalRequests(JSON.parse(savedWithdrawals));

        const savedSellerNotifs = localStorage.getItem('bazaarbd_seller_notifs');
        if (savedSellerNotifs) setSellerNotifications(JSON.parse(savedSellerNotifs));

        const savedQnAs = localStorage.getItem('bazaarbd_qnas');
        if (savedQnAs) setProductQnAs(JSON.parse(savedQnAs));

        const savedCampaigns = localStorage.getItem('bazaarbd_sponsored_campaigns');
        if (savedCampaigns) setSponsoredCampaigns(JSON.parse(savedCampaigns));

        const savedDeposits = localStorage.getItem('bazaarbd_deposit_requests');
        if (savedDeposits) setDepositRequests(JSON.parse(savedDeposits));

        const savedAdSettings = localStorage.getItem('bazaarbd_ad_settings');
        if (savedAdSettings) setAdminAdSettings(JSON.parse(savedAdSettings));

        // Load Affiliate System Data
        const savedAffiliates = localStorage.getItem('quatro_affiliates');
        if (savedAffiliates) setAffiliates(JSON.parse(savedAffiliates));

        const savedCurAffiliate = localStorage.getItem('quatro_current_affiliate');
        if (savedCurAffiliate) setCurrentAffiliate(JSON.parse(savedCurAffiliate));

        const savedAffLinks = localStorage.getItem('quatro_affiliate_links');
        if (savedAffLinks) setAffiliateLinks(JSON.parse(savedAffLinks));

        const savedAffClicks = localStorage.getItem('quatro_affiliate_clicks');
        if (savedAffClicks) setAffiliateClicks(JSON.parse(savedAffClicks));

        const savedAffCommissions = localStorage.getItem('quatro_affiliate_commissions');
        if (savedAffCommissions) setAffiliateCommissions(JSON.parse(savedAffCommissions));

        const savedAffWithdrawals = localStorage.getItem('quatro_affiliate_withdrawals');
        if (savedAffWithdrawals) setAffiliateWithdrawals(JSON.parse(savedAffWithdrawals));

        const savedAffSettings = localStorage.getItem('quatro_affiliate_settings');
        if (savedAffSettings) setAffiliateSettings(JSON.parse(savedAffSettings));

        const savedAffFraud = localStorage.getItem('quatro_affiliate_fraud');
        if (savedAffFraud) setAffiliateFraudAlerts(JSON.parse(savedAffFraud));

        // Handle URL referral tracking (30 days cookie, last click wins)
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const refParam = urlParams.get('ref');
          if (refParam && refParam.trim()) {
            const cleanCode = refParam.trim().toUpperCase();
            setActiveAffiliateCode(cleanCode);
            localStorage.setItem('quatro_affiliate_ref', cleanCode);
            try {
              document.cookie = `quatro_affiliate_ref=${cleanCode}; max-age=${30 * 24 * 60 * 60}; path=/`;
            } catch {}
          } else {
            const storedRef = localStorage.getItem('quatro_affiliate_ref');
            if (storedRef) setActiveAffiliateCode(storedRef);
          }
        }

        const savedUser = localStorage.getItem('bazaarbd_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser) as User;
          if (parsedUser.email === 'rayhan@bazaarbd.com' || parsedUser.name === 'Rayhan Ahmed') {
            try { localStorage.removeItem('bazaarbd_user'); } catch {}
            setUser(null);
          } else {
            if (!parsedUser.customerId) {
              parsedUser.customerId = parsedUser.role === 'SELLER' ? generateSellerQAId() : generateCustomerQAId();
            }
            setUser(parsedUser);
          }
        }

        const savedProducts = localStorage.getItem('bazaarbd_products');
        if (savedProducts) {
          const parsed = JSON.parse(savedProducts) as Product[];
          const existingIds = new Set(parsed.map((p) => p.id));
          const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
          if (missing.length > 0) {
            setProducts([...parsed, ...missing]);
          } else {
            setProducts(parsed);
          }
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ----------------------------------------------------------------------
  // REAL-TIME FIRESTORE onSnapshot LISTENERS
  // Automatically syncs products, notices, banners, categories, coupons & orders
  // across all active client & admin sessions instantly without page refresh!
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!db || !isMounted) return;

    // 1. Real-time Products Sync
    const unSubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const liveProducts = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          })) as Product[];
          
          setProducts((prev) => {
            const map = new Map<string, Product>();
            INITIAL_PRODUCTS.forEach((p) => map.set(p.id, p));
            prev.forEach((p) => map.set(p.id, p));
            liveProducts.forEach((p) => map.set(p.id, p));
            return Array.from(map.values());
          });
        }
      },
      () => {}
    );

    // 2. Real-time Banners Sync
    const unSubBanners = onSnapshot(
      collection(db, 'banners'),
      (snapshot) => {
        if (!snapshot.empty) {
          const liveBanners = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          })) as Banner[];
          setBanners(liveBanners);
        }
      },
      () => {}
    );

    // 3. Real-time Store Settings & Notices / Announcements Sync
    const unSubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          const liveSettings = docSnap.data() as Partial<MarketplaceSettings>;
          setSettings((prev) => ({ ...prev, ...liveSettings }));
        }
      },
      () => {}
    );

    // 4. Real-time Categories Sync
    const unSubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        if (!snapshot.empty) {
          const liveCategories = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          })) as Category[];
          setCategories(liveCategories);
        }
      },
      () => {}
    );

    // 5. Real-time Coupons Sync
    const unSubCoupons = onSnapshot(
      collection(db, 'coupons'),
      (snapshot) => {
        if (!snapshot.empty) {
          const liveCoupons = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          })) as Coupon[];
          setCoupons(liveCoupons);
        }
      },
      () => {}
    );

    // 6. Real-time Orders Sync
    const unSubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!snapshot.empty) {
          const liveOrders = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          })) as Order[];
          
          setOrders((prev) => {
            const map = new Map<string, Order>();
            prev.forEach((o) => map.set(o.id, o));
            liveOrders.forEach((o) => map.set(o.id, o));
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      },
      () => {}
    );

    return () => {
      unSubProducts();
      unSubBanners();
      unSubSettings();
      unSubCategories();
      unSubCoupons();
      unSubOrders();
    };
  }, [isMounted]);

  // Save changes to localStorage only after mounting
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_gateways', JSON.stringify(gateways));
    } catch {
      // ignore
    }
  }, [gateways, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_categories', JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_banners', JSON.stringify(banners));
    } catch {
      // ignore
    }
  }, [banners, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_coupons', JSON.stringify(coupons));
    } catch {
      // ignore
    }
  }, [coupons, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_leads', JSON.stringify(leads));
    } catch {
      // ignore
    }
  }, [leads, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_subagents', JSON.stringify(subAgents));
    } catch {
      // ignore
    }
  }, [subAgents, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_livechats', JSON.stringify(liveChats));
    } catch {
      // ignore
    }
  }, [liveChats, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_sellers', JSON.stringify(sellers));
    } catch {
      // ignore
    }
  }, [sellers, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      if (currentSeller) {
        localStorage.setItem('bazaarbd_current_seller', JSON.stringify(currentSeller));
      } else {
        localStorage.removeItem('bazaarbd_current_seller');
      }
    } catch {
      // ignore
    }
  }, [currentSeller, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_seller_wallets', JSON.stringify(sellerWallets));
    } catch {
      // ignore
    }
  }, [sellerWallets, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_withdrawals', JSON.stringify(withdrawalRequests));
    } catch {
      // ignore
    }
  }, [withdrawalRequests, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_sponsored_campaigns', JSON.stringify(sponsoredCampaigns));
    } catch {
      // ignore
    }
  }, [sponsoredCampaigns, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_deposit_requests', JSON.stringify(depositRequests));
    } catch {
      // ignore
    }
  }, [depositRequests, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('bazaarbd_ad_settings', JSON.stringify(adminAdSettings));
    } catch {
      // ignore
    }
  }, [adminAdSettings, isMounted]);

  const addCoupon = (cpn: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...cpn,
      id: `cpn-${Date.now()}`
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    saveCouponToFirestore(newCoupon).catch((err) => console.warn('Sync coupon notice:', err));
    showToast(`Coupon "${cpn.code}" added successfully!`, 'success');
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    saveCouponToFirestore({ id, ...updates }).catch((err) => console.warn('Update coupon notice:', err));
    showToast('Coupon updated!', 'success');
  };

  const [collectedVouchers, setCollectedVouchers] = useState<string[]>(['WELCOME50', 'QUATRO10']);

  const collectVoucher = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (collectedVouchers.includes(clean)) {
      showToast(
        language === 'bn' ? 'ভাউচারটি ইতিমধ্যে আপনার কালেকশনে সংরক্ষিত রয়েছে!' : 'Voucher already collected in your wallet!',
        'info'
      );
      return;
    }
    setCollectedVouchers((prev) => [...prev, clean]);
    showToast(
      language === 'bn'
        ? `🎉 ভাউচার "${clean}" সফলভাবে কালেক্ট করা হয়েছে! চেকআউটে স্বয়ংক্রিয় ডিসকাউন্ট পাবেন।`
        : `🎉 Voucher "${clean}" collected! Ready to apply at checkout.`,
      'success'
    );
  };

  const isVoucherCollected = (code: string) => {
    return collectedVouchers.includes(code.trim().toUpperCase());
  };

  const addCustomerReviewWithPhoto = (
    productId: string,
    rating: number,
    comment: string,
    images: string[] = []
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userId: user ? user.id : 'usr-guest',
      userName: user ? user.name : 'Verified Buyer',
      userCity: user?.address?.district || 'Dhaka',
      rating,
      comment,
      images,
      isVerifiedPurchase: true,
      isApproved: true,
      createdAt: 'Just now'
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newRev, ...(p.reviews || [])];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));
          return {
            ...p,
            rating: avgRating,
            reviewCount: updatedReviews.length,
            reviews: updatedReviews
          };
        }
        return p;
      })
    );

    showToast(
      language === 'bn'
        ? 'আপনার আনবক্সিং ফটো ও রিভিউ সফলভাবে প্রকাশিত হয়েছে!'
        : 'Your review and photo have been published!',
      'success'
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    deleteCouponFromFirestore(id).catch((err) => console.warn('Delete coupon notice:', err));
    showToast('Coupon deleted', 'info');
  };

  const addLead = (
    email?: string,
    phone?: string,
    source = 'Newsletter',
    name?: string,
    note?: string,
    productTitle?: string
  ) => {
    const newLead: AudienceLead = {
      id: `ld-${Date.now()}`,
      name,
      email,
      phone,
      source,
      productTitle,
      note,
      status: 'NEW',
      createdAt: new Date().toLocaleString()
    };
    setLeads((prev) => [newLead, ...prev]);
    saveLeadToFirestore(newLead).catch((err) => console.warn('Sync lead to Firebase notice:', err));
    showToast(
      language === 'bn'
        ? 'আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে! শীঘ্রই যোগাযোগ করা হবে।'
        : 'Your information has been saved! We will contact you soon.',
      'success'
    );
  };

  const updateLead = (id: string, updates: Partial<AudienceLead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    saveLeadToFirestore({ id, ...updates }).catch((err) => console.warn('Update lead to Firebase notice:', err));
    showToast(language === 'bn' ? 'লিড তথ্য আপডেট হয়েছে' : 'Lead details updated', 'success');
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    showToast('Lead record removed', 'info');
  };

  // Sub-Agent CRUD
  const addSubAgent = (agentData: Omit<SubAgent, 'id' | 'createdAt'>) => {
    const newAgent: SubAgent = {
      ...agentData,
      id: `agent-${Date.now()}`,
      createdAt: new Date().toLocaleString()
    };
    setSubAgents((prev) => [newAgent, ...prev]);
    showToast(`Sub-Agent "${agentData.name}" created with permissions!`, 'success');
  };

  const updateSubAgent = (id: string, updates: Partial<SubAgent>) => {
    setSubAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Sub-Agent details & permissions updated', 'success');
  };

  const deleteSubAgent = (id: string) => {
    setSubAgents((prev) => prev.filter((a) => a.id !== id));
    showToast('Sub-Agent account removed', 'info');
  };

  // Live Chat
  const addLiveChatMessage = (name: string, message: string, phone?: string, email?: string) => {
    const newChat: LiveChatMessage = {
      id: `chat-${Date.now()}`,
      customerName: name || 'Customer',
      customerPhone: phone,
      customerEmail: email,
      message,
      status: 'Open',
      timestamp: new Date().toLocaleString()
    };
    setLiveChats((prev) => [newChat, ...prev]);
    showToast('Message sent to QUATRO support team!', 'success');
  };

  const replyToLiveChat = (chatId: string, replyText: string, agentName = 'QUATRO Support Agent') => {
    setLiveChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              reply: replyText,
              repliedBy: agentName,
              repliedAt: new Date().toLocaleString(),
              status: 'Resolved'
            }
          : c
      )
    );
    showToast('Reply submitted to customer inquiry', 'success');
  };

  // Seller Center Implementation
  const sellerRegister = async (data: {
    name: string;
    shopName: string;
    phone: string;
    email: string;
    password: string;
    shopAddress: string;
    payoutMethod: PayoutMethod;
    payoutAccount: string;
    nidTradeLicense?: string;
  }): Promise<Seller> => {
    const slug = data.shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const sellerIdNumber = generateSellerQAId();
    const newSeller: Seller = {
      id: `seller-${Date.now()}`,
      sellerIdNumber: sellerIdNumber,
      userId: `usr-seller-${Date.now()}`,
      shopName: data.shopName,
      slug: slug || `shop-${Date.now()}`,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
      description: `Welcome to ${data.shopName}! Quality products on QUATRO.`,
      phone: data.phone,
      email: data.email,
      shopAddress: data.shopAddress,
      nidTradeLicense: data.nidTradeLicense,
      status: 'Pending',
      payoutMethod: data.payoutMethod,
      payoutAccount: data.payoutAccount,
      rating: 5.0,
      followerCount: 1,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setSellers((prev) => [newSeller, ...prev]);
    setCurrentSeller(newSeller);
    setUser({
      id: newSeller.userId,
      customerId: sellerIdNumber,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'SELLER'
    });

    // Save seller into unified 'users' collection in Firestore
    syncUserToFirestore({
      id: newSeller.userId,
      customerId: sellerIdNumber,
      sellerIdNumber: sellerIdNumber,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'SELLER',
      shopName: data.shopName,
      shopAddress: data.shopAddress,
      nidTradeLicense: data.nidTradeLicense,
      payoutMethod: data.payoutMethod,
      payoutAccount: data.payoutAccount,
      status: 'Pending',
      createdAt: new Date().toISOString()
    }).catch((err) => console.warn('Sync seller to users collection notice:', err));

    // Save seller into dedicated 'sellers' directory in Firestore
    saveSellerToFirestore(newSeller).catch((err) =>
      console.warn('Save seller to sellers collection notice:', err)
    );

    setSellerWallets((prev) => ({
      ...prev,
      [newSeller.id]: {
        id: `wal-${Date.now()}`,
        sellerId: newSeller.id,
        totalIncome: 0,
        totalCommission: 0,
        netEarnings: 0,
        availableBalance: 0,
        pendingBalance: 0,
        withdrawnAmount: 0,
        updatedAt: new Date().toISOString()
      }
    }));

    const notif: SellerNotification = {
      id: `notif-${Date.now()}`,
      sellerId: newSeller.id,
      title: 'Registration Received ⏳',
      message: 'Your shop application is under review by Super Admin. You can set up your shop profile now!',
      type: 'PRODUCT_STATUS',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast('Shop registration submitted! Pending Admin Approval.', 'success');
    return newSeller;
  };

  const sellerLogin = async (emailStr: string, pass: string): Promise<Seller> => {
    const clean = emailStr.trim().toLowerCase();
    const matched = sellers.find((s) => s.email.toLowerCase() === clean);
    if (!matched) {
      const apex = sellers.find((s) => s.id === 'seller-apex-01');
      if (apex) {
        setCurrentSeller(apex);
        setUser({
          id: apex.userId,
          name: apex.shopName,
          email: apex.email,
          phone: apex.phone,
          role: 'SELLER'
        });
        showToast(`Logged in as ${apex.shopName}`, 'success');
        return apex;
      }
      throw new Error('No seller account found with this email.');
    }

    if (matched.status === 'Suspended') {
      showToast('This shop account has been suspended by Admin. Contact support.', 'error');
      throw new Error('Account suspended');
    }

    setCurrentSeller(matched);
    setUser({
      id: matched.userId,
      name: matched.shopName,
      email: matched.email,
      phone: matched.phone,
      role: 'SELLER'
    });
    showToast(`Welcome to ${matched.shopName} Seller Dashboard!`, 'success');
    return matched;
  };

  const updateSellerProfile = (sellerId: string, updates: Partial<Seller>) => {
    setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, ...updates } : s)));
    if (currentSeller && currentSeller.id === sellerId) {
      setCurrentSeller((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Shop profile settings updated!', 'success');
  };

  const addSellerProduct = (prodData: Omit<Product, 'id' | 'slug'>) => {
    const seller = currentSeller || DEFAULT_SELLERS[0];

    // Enforce Account Approval & Suspension Status
    if (seller.status === 'Suspended') {
      showToast(
        language === 'bn'
          ? '🔒 দুঃখিত, আপনার সেলার একাউন্টটি সাময়িকভাবে স্থগিত (Suspended) করা হয়েছে!'
          : '🔒 Sorry, your seller account is suspended! Please contact support.',
        'error'
      );
      return;
    }
    if (seller.status === 'Pending') {
      showToast(
        language === 'bn'
          ? '🔒 আপনার সেলার একাউন্টটি এখনও পেন্ডিং (অ্যাডমিন অনুমোদনের অপেক্ষায়) আছে!'
          : '🔒 Your seller account is pending admin approval!',
        'error'
      );
      return;
    }
    if (seller.status === 'Rejected') {
      showToast(
        language === 'bn'
          ? '🔒 আপনার সেলার একাউন্ট রেজিস্ট্রেশন বাতিল (Rejected) করা হয়েছে!'
          : '🔒 Your seller account registration is rejected!',
        'error'
      );
      return;
    }

    // Enforce Account Verification Rule
    if (seller.verificationStatus !== 'VERIFIED' && !seller.isVerified) {
      showToast(
        language === 'bn'
          ? 'প্রোডাক্ট আপলোড করতে প্রথমে আপনার সেলার একাউন্ট ভেরিফাই করুন (এনআইডি/পাসপোর্ট/লাইসেন্স)!'
          : 'Account Verification Required! Please submit your NID/Passport/License verification to upload products.',
        'error'
      );
      return;
    }

    const slug = prodData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `product-${Date.now()}`;
    const id = `prod-seller-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id,
      slug,
      sellerId: seller.id,
      status: 'PENDING_REVIEW', // Automatically pending admin review
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0
    };

    setProducts((prev) => [newProduct, ...prev]);

    const notif: SellerNotification = {
      id: `notif-${Date.now()}`,
      sellerId: seller.id,
      title: 'New Product Uploaded (Pending Admin Review) ⏳',
      message: `Product "${prodData.title}" has been uploaded and is pending Admin review & approval.`,
      type: 'PRODUCT_STATUS',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'bn'
        ? `🎉 প্রোডাক্ট "${prodData.title}" সফলভাবে সেভ হয়েছে! এডমিন প্যানেলে পেন্ডিং হিসেবে যুক্ত করা হয়েছে।`
        : `🎉 Product "${prodData.title}" saved successfully! Submitted to Admin Review Queue (Pending).`,
      'success'
    );
  };

  const approveProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: 'ACTIVE' } : p))
    );
    const prod = products.find((p) => p.id === productId);
    if (prod && prod.sellerId) {
      const notif: SellerNotification = {
        id: `notif-${Date.now()}`,
        sellerId: prod.sellerId,
        title: 'Product Approved! 🎉',
        message: `Your product "${prod.title}" has been reviewed & APPROVED by Admin. It is now live on the marketplace storefront!`,
        type: 'PRODUCT_STATUS',
        isRead: false,
        createdAt: new Date().toLocaleString()
      };
      setSellerNotifications((prev) => [notif, ...prev]);
    }
    showToast('Product APPROVED & published to marketplace storefront!', 'success');
  };

  const rejectProduct = (productId: string, reason?: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: 'REJECTED' } : p))
    );
    const prod = products.find((p) => p.id === productId);
    if (prod && prod.sellerId) {
      const notif: SellerNotification = {
        id: `notif-${Date.now()}`,
        sellerId: prod.sellerId,
        title: 'Product Review Update ⚠️',
        message: `Your product "${prod.title}" was REJECTED by Admin. Reason: ${reason || 'Does not meet catalog guidelines.'}`,
        type: 'PRODUCT_STATUS',
        isRead: false,
        createdAt: new Date().toLocaleString()
      };
      setSellerNotifications((prev) => [notif, ...prev]);
    }
    showToast('Product status marked as REJECTED.', 'info');
  };

  const updateSellerProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product details & inventory updated!', 'success');
  };

  const deleteSellerProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from shop catalog', 'info');
  };

  const requestWithdrawal = (
    sellerId: string,
    amount: number,
    method: PayoutMethod,
    account: string
  ): boolean => {
    if (amount < 500) {
      showToast('Minimum payout withdrawal amount is ৳500', 'error');
      return false;
    }

    const wallet = sellerWallets[sellerId] || {
      id: `wal-${sellerId}`,
      sellerId,
      totalIncome: 0,
      totalCommission: 0,
      netEarnings: 0,
      availableBalance: 0,
      pendingBalance: 0,
      withdrawnAmount: 0,
      updatedAt: new Date().toISOString()
    };

    if (amount > wallet.availableBalance) {
      showToast('Insufficient available balance for this withdrawal request.', 'error');
      return false;
    }

    const sellerObj = sellers.find((s) => s.id === sellerId);
    const newReq: WithdrawalRequest = {
      id: `wdr-${Date.now()}`,
      sellerId,
      shopName: sellerObj ? sellerObj.shopName : 'Seller Shop',
      amount,
      payoutMethod: method,
      accountDetails: account,
      status: 'Pending',
      createdAt: new Date().toLocaleString()
    };

    setWithdrawalRequests((prev) => [newReq, ...prev]);

    setSellerWallets((prev) => ({
      ...prev,
      [sellerId]: {
        ...wallet,
        availableBalance: wallet.availableBalance - amount,
        updatedAt: new Date().toISOString()
      }
    }));

    const trx: SellerTransaction = {
      id: `trx-${Date.now()}`,
      sellerId,
      amount,
      commission: 0,
      netAmount: amount,
      type: 'DEBIT',
      description: `Payout Withdrawal Request via ${method} (${account})`,
      status: 'Pending',
      createdAt: new Date().toLocaleString()
    };
    setSellerTransactions((prev) => [trx, ...prev]);

    const notif: SellerNotification = {
      id: `notif-${Date.now()}`,
      sellerId,
      title: 'Withdrawal Request Submitted 💸',
      message: `Your withdrawal request for ৳${amount.toLocaleString()} via ${method} is pending Admin processing.`,
      type: 'WITHDRAWAL',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast(`Payout request of ৳${amount.toLocaleString()} submitted successfully!`, 'success');
    return true;
  };

  const replyToReview = (productId: string, reviewId: string, replyText: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId && p.reviews) {
          return {
            ...p,
            reviews: p.reviews.map((r) =>
              r.id === reviewId
                ? { ...r, comment: `${r.comment}\n\n💬 [Shop Seller Reply]: ${replyText}` }
                : r
            )
          };
        }
        return p;
      })
    );
    showToast('Reply to customer review submitted!', 'success');
  };

  const answerQuestion = (qnaId: string, answerText: string) => {
    setProductQnAs((prev) =>
      prev.map((q) =>
        q.id === qnaId
          ? {
              ...q,
              answer: answerText,
              answeredAt: new Date().toLocaleString()
            }
          : q
      )
    );
    showToast('Customer question answered!', 'success');
  };

  const addCustomerQuestion = (productId: string, question: string) => {
    const prod = products.find((p) => p.id === productId);
    const sellerId = prod?.sellerId || 'seller-apex-01';
    const newQnA: ProductQnA = {
      id: `qna-${Date.now()}`,
      productId,
      productTitle: prod ? prod.title : 'Marketplace Item',
      sellerId,
      userId: user ? user.id : 'usr-guest',
      userName: user ? user.name : 'Verified Customer',
      question,
      createdAt: new Date().toLocaleString()
    };

    setProductQnAs((prev) => [newQnA, ...prev]);

    const notif: SellerNotification = {
      id: `notif-${Date.now()}`,
      sellerId,
      title: 'New Customer Question ❓',
      message: `Question asked on "${prod?.title || 'product'}": "${question.slice(0, 40)}..."`,
      type: 'REVIEW',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast('Question submitted to shop seller!', 'success');
  };

  const createSellerPromotion = (promoData: Omit<SellerPromotion, 'id' | 'createdAt'>) => {
    const newPromo: SellerPromotion = {
      ...promoData,
      id: `promo-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSellerPromotions((prev) => [newPromo, ...prev]);
    showToast(`Promotion "${promoData.title}" activated for selected products!`, 'success');
  };

  const createSponsoredCampaign = (
    data: Omit<
      SponsoredAdCampaign,
      'id' | 'impressions' | 'clicks' | 'spend' | 'salesGenerated' | 'ordersCount' | 'roas' | 'createdAt'
    >
  ) => {
    const newCamp: SponsoredAdCampaign = {
      ...data,
      id: `camp-ad-${Date.now()}`,
      impressions: 1,
      clicks: 0,
      spend: 0,
      salesGenerated: 0,
      ordersCount: 0,
      roas: 0,
      durationDays: data.durationDays || 7,
      createdAt: new Date().toISOString().split('T')[0],
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSponsoredCampaigns((prev) => [newCamp, ...prev]);
    // Also mark the product as sponsored with bid amount
    setProducts((prev) =>
      prev.map((p) =>
        p.id === data.productId
          ? { ...p, isSponsored: true, sponsoredBid: data.bidAmount }
          : p
      )
    );
    showToast(`🚀 Sponsored Ad Campaign launched for "${data.productTitle}"!`, 'success');
  };

  const toggleCampaignStatus = (campaignId: string) => {
    setSponsoredCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const nextStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          setProducts((prods) =>
            prods.map((p) =>
              p.id === c.productId
                ? { ...p, isSponsored: nextStatus === 'ACTIVE' }
                : p
            )
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const deleteSponsoredCampaign = (campaignId: string) => {
    const target = sponsoredCampaigns.find((c) => c.id === campaignId);
    if (target) {
      setProducts((prods) =>
        prods.map((p) =>
          p.id === target.productId
            ? { ...p, isSponsored: false, sponsoredBid: undefined }
            : p
        )
      );
    }
    setSponsoredCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    showToast('Sponsored campaign removed.', 'info');
  };

  const recordProductImpression = useCallback((productId: string) => {
    const rate = adminAdSettingsRef.current?.cpmRate || 200;
    const costPerImp = rate / 1000; // 200 / 1000 = 0.20 BDT per impression

    setSponsoredCampaigns((prev) => {
      let updated = false;
      const next = prev.map((c) => {
        if (c.productId === productId && c.status === 'ACTIVE') {
          // Check seller wallet balance
          const wallet = sellerWallets[c.sellerId];
          const curBalance = wallet ? (wallet.adBalance ?? wallet.availableBalance ?? 0) : 0;
          if (curBalance < costPerImp) {
            // Insufficient ad balance, auto-pause campaign!
            return {
              ...c,
              status: 'PAUSED' as const
            };
          }

          updated = true;
          const nextImp = c.impressions + 1;
          const nextSpend = Number((c.spend + costPerImp).toFixed(2));
          const nextRoas = nextSpend > 0 ? Number((c.salesGenerated / nextSpend).toFixed(1)) : 0;
          return {
            ...c,
            impressions: nextImp,
            spend: nextSpend,
            roas: nextRoas
          };
        }
        return c;
      });

      if (updated) {
        // Deduct from seller wallet
        const activeCamp = prev.find((c) => c.productId === productId && c.status === 'ACTIVE');
        if (activeCamp) {
          setSellerWallets((wList) => {
            const w = wList[activeCamp.sellerId];
            if (!w) return wList;
            const newAdBalance = Math.max(0, Number(((w.adBalance ?? w.availableBalance ?? 0) - costPerImp).toFixed(2)));
            const newAvail = Math.max(0, Number((w.availableBalance - costPerImp).toFixed(2)));
            return {
              ...wList,
              [activeCamp.sellerId]: {
                ...w,
                adBalance: newAdBalance,
                availableBalance: newAvail
              }
            };
          });
        }
      }

      return updated ? next : prev;
    });
  }, [sellerWallets]);

  const recordProductClick = useCallback((productId: string) => {
    setSponsoredCampaigns((prev) => {
      let updated = false;
      const next = prev.map((c) => {
        if (c.productId === productId && c.status === 'ACTIVE') {
          updated = true;
          const nextClicks = c.clicks + 1;
          const nextSpend = Number((c.spend + c.bidAmount).toFixed(1));
          const nextRoas = nextSpend > 0 ? Number((c.salesGenerated / nextSpend).toFixed(1)) : 0;
          return {
            ...c,
            clicks: nextClicks,
            spend: nextSpend,
            roas: nextRoas
          };
        }
        return c;
      });
      return updated ? next : prev;
    });
  }, []);

  const simulateCampaignTraffic = useCallback((campaignId: string, impressions = 50, clicks = 3) => {
    const rate = adminAdSettingsRef.current?.cpmRate || 200;
    const impCost = (impressions / 1000) * rate; // e.g. (50/1000) * 200 = 10 BDT
    const clickCost = clicks * 1.5;
    const addedSpend = Number((impCost + clickCost).toFixed(2));

    setSponsoredCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const nextImp = c.impressions + impressions;
          const nextClk = c.clicks + clicks;
          const nextSpend = Number((c.spend + addedSpend).toFixed(2));
          const addedSales = clicks > 0 ? (c.dailyBudget >= 400 ? 3499 : 1290) : 0;
          const nextSales = c.salesGenerated + addedSales;
          const nextOrders = c.ordersCount + (clicks > 0 ? 1 : 0);
          const nextRoas = nextSpend > 0 ? Number((nextSales / nextSpend).toFixed(1)) : 0;
          return {
            ...c,
            impressions: nextImp,
            clicks: nextClk,
            spend: nextSpend,
            salesGenerated: nextSales,
            ordersCount: nextOrders,
            roas: nextRoas
          };
        }
        return c;
      })
    );

    // Deduct from target seller's wallet
    const target = sponsoredCampaignsRef.current.find((c) => c.id === campaignId);
    if (target) {
      setSellerWallets((wList) => {
        const w = wList[target.sellerId];
        if (!w) return wList;
        return {
          ...wList,
          [target.sellerId]: {
            ...w,
            adBalance: Math.max(0, Number(((w.adBalance ?? w.availableBalance ?? 0) - addedSpend).toFixed(2))),
            availableBalance: Math.max(0, Number((w.availableBalance - addedSpend).toFixed(2)))
          }
        };
      });
    }

    showToast(`📈 Simulated +${impressions} real-time impressions (৳${impCost.toFixed(1)} CPM) & +${clicks} ad clicks!`, 'info');
  }, []);

  const getRankedProducts = useCallback((prodList: Product[], query?: string, categoryId?: string): Product[] => {
    let list = [...prodList];
    if (categoryId && categoryId !== 'all') {
      list = list.filter((p) => p.categoryId === categoryId);
    }
    const q = query?.trim().toLowerCase();
    const currentCampaigns = sponsoredCampaignsRef.current || [];

    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.titleBn.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          currentCampaigns.some(
            (c) =>
              c.status === 'ACTIVE' &&
              c.productId === p.id &&
              c.targetKeywords.some((kw) => kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase()))
          )
      );
    }

    return list.sort((a, b) => {
      const aAd = currentCampaigns.find((c) => c.status === 'ACTIVE' && c.productId === a.id);
      const bAd = currentCampaigns.find((c) => c.status === 'ACTIVE' && c.productId === b.id);

      const aScore =
        (aAd ? 10000 + (aAd.bidAmount || 1) * 1000 : 0) +
        (a.soldCount || 0) * 2 +
        (a.rating || 0) * 100 +
        (a.reviewCount || 0) +
        (a.stock > 0 ? 500 : 0);

      const bScore =
        (bAd ? 10000 + (bAd.bidAmount || 1) * 1000 : 0) +
        (b.soldCount || 0) * 2 +
        (b.rating || 0) * 100 +
        (b.reviewCount || 0) +
        (b.stock > 0 ? 500 : 0);

      return bScore - aScore;
    });
  }, []);

  const updateAdminAdSettings = (updates: Partial<AdminAdSettings>) => {
    setAdminAdSettings((prev) => ({ ...prev, ...updates }));
    showToast('Platform ad deposit numbers & CPM settings updated!', 'success');
  };

  const submitSellerDeposit = (data: Omit<SellerDepositRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: SellerDepositRequest = {
      ...data,
      id: `dep-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toLocaleString()
    };
    setDepositRequests((prev) => [newReq, ...prev]);
    showToast('ডিপোজিট রিকোয়েস্ট সফলভাবে জমা হয়েছে! এডমিন অনুমোদনের পর ব্যালেন্স যোগ হবে।', 'success');
  };

  const approveSellerDeposit = (depositId: string) => {
    const req = depositRequests.find((d) => d.id === depositId);
    if (!req) return;

    setDepositRequests((prev) =>
      prev.map((d) =>
        d.id === depositId ? { ...d, status: 'APPROVED', processedAt: new Date().toLocaleString() } : d
      )
    );

    // Credit seller's wallet and adBalance
    setSellerWallets((prev) => {
      const current = prev[req.sellerId] || {
        id: `wal-${req.sellerId}`,
        sellerId: req.sellerId,
        totalIncome: 0,
        totalCommission: 0,
        netEarnings: 0,
        availableBalance: 0,
        adBalance: 0,
        pendingBalance: 0,
        withdrawnAmount: 0,
        updatedAt: new Date().toISOString()
      };
      return {
        ...prev,
        [req.sellerId]: {
          ...current,
          availableBalance: current.availableBalance + req.amount,
          adBalance: (current.adBalance || 0) + req.amount,
          updatedAt: new Date().toISOString()
        }
      };
    });

    // Auto-resume paused campaigns for this seller if balance was exhausted
    setSponsoredCampaigns((cList) =>
      cList.map((c) =>
        c.sellerId === req.sellerId && c.status === 'PAUSED' ? { ...c, status: 'ACTIVE' } : c
      )
    );

    // Send notification to seller
    const notif: SellerNotification = {
      id: `notif-${Date.now()}`,
      sellerId: req.sellerId,
      title: 'Deposit Approved! ৳' + req.amount + ' Credited 💰',
      message: `Your deposit request (${req.paymentMethod}, TrxID: ${req.trxId}) of ৳${req.amount} has been approved by Admin and added to your Ad balance!`,
      type: 'WITHDRAWAL',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast(`Deposit of ৳${req.amount} approved & credited to ${req.sellerShopName}!`, 'success');
  };

  const rejectSellerDeposit = (depositId: string, reason: string) => {
    setDepositRequests((prev) =>
      prev.map((d) =>
        d.id === depositId
          ? { ...d, status: 'REJECTED', rejectionReason: reason, processedAt: new Date().toLocaleString() }
          : d
      )
    );
    showToast('Deposit request marked as rejected.', 'info');
  };

  const adjustSellerBalance = (sellerId: string, amount: number, type: 'CREDIT' | 'DEBIT', balanceType: 'MAIN' | 'AD' | 'BOTH', reason: string) => {
    setSellerWallets((prev) => {
      const current = prev[sellerId] || {
        id: `wal-${sellerId}`,
        sellerId,
        totalIncome: 0,
        totalCommission: 0,
        netEarnings: 0,
        availableBalance: 0,
        adBalance: 0,
        pendingBalance: 0,
        withdrawnAmount: 0,
        updatedAt: new Date().toISOString()
      };
      const diff = type === 'CREDIT' ? amount : -amount;
      const updatedAvailable = (balanceType === 'MAIN' || balanceType === 'BOTH')
        ? Math.max(0, current.availableBalance + diff)
        : current.availableBalance;
      const updatedAd = (balanceType === 'AD' || balanceType === 'BOTH')
        ? Math.max(0, (current.adBalance || 0) + diff)
        : (current.adBalance || 0);

      return {
        ...prev,
        [sellerId]: {
          ...current,
          availableBalance: updatedAvailable,
          adBalance: updatedAd,
          updatedAt: new Date().toISOString()
        }
      };
    });
    showToast(`Seller balance adjusted: ৳${amount} (${reason})`, 'success');
  };

  const transferToAdBalance = (sellerId: string, amount: number) => {
    const wallet = sellerWallets[sellerId] || { availableBalance: 0, adBalance: 0 };
    if (amount <= 0 || amount > wallet.availableBalance) {
      showToast('Insufficient available balance for transfer!', 'error');
      return false;
    }
    setSellerWallets((prev) => ({
      ...prev,
      [sellerId]: {
        ...wallet,
        availableBalance: wallet.availableBalance - amount,
        adBalance: (wallet.adBalance || 0) + amount,
        updatedAt: new Date().toISOString()
      }
    }));
    showToast(`Successfully transferred ৳${amount.toLocaleString()} to Ad Balance!`, 'success');
    return true;
  };

  const toggleFollowShop = (sellerId: string) => {
    setShopFollowers((prev) => {
      const exists = prev.includes(sellerId);
      const next = exists ? prev.filter((id) => id !== sellerId) : [...prev, sellerId];

      setSellers((sList) =>
        sList.map((s) =>
          s.id === sellerId
            ? {
                ...s,
                followerCount: Math.max(0, s.followerCount + (exists ? -1 : 1))
              }
            : s
        )
      );

      showToast(exists ? 'Unfollowed shop.' : 'You are now following this shop!', 'info');
      return next;
    });
  };

  const isFollowingShop = (sellerId: string) => shopFollowers.includes(sellerId);

  const approveSeller = (sellerId: string) => {
    setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, status: 'Approved' } : s)));
    const notif: SellerNotification = {
      id: `notif-${Date.now()}`,
      sellerId,
      title: 'Shop Account Approved! 🎉',
      message: 'Congratulations! Your seller account is now fully APPROVED. You can start uploading products and receiving orders.',
      type: 'PRODUCT_STATUS',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);
    showToast('Seller account approved!', 'success');
  };

  const rejectSeller = (sellerId: string, reason = 'Registration details incomplete.') => {
    setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, status: 'Rejected' } : s)));
    showToast(`Seller account rejected (${reason})`, 'info');
  };

  const suspendSeller = (sellerId: string) => {
    setSellers((prev) => prev.map((s) => (s.id === sellerId ? { ...s, status: 'Suspended' } : s)));
    showToast('Seller account suspended.', 'error');
  };

  const submitSellerVerification = (sellerId: string, data: Omit<SellerVerificationRequest, 'submittedAt'>) => {
    const request: SellerVerificationRequest = {
      ...data,
      submittedAt: new Date().toLocaleString()
    };

    setSellers((prev) =>
      prev.map((s) =>
        s.id === sellerId
          ? {
              ...s,
              isVerified: false,
              verificationStatus: 'PENDING_VERIFICATION',
              verificationData: request
            }
          : s
      )
    );

    if (currentSeller && currentSeller.id === sellerId) {
      setCurrentSeller((prev) =>
        prev
          ? {
              ...prev,
              isVerified: false,
              verificationStatus: 'PENDING_VERIFICATION',
              verificationData: request
            }
          : null
      );
    }

    const notif: SellerNotification = {
      id: `notif-verif-${Date.now()}`,
      sellerId,
      title: 'KYC Document Submitted for Review 📄',
      message: `Your ${data.documentType} verification details have been received. Admin will review within 24 hours.`,
      type: 'PRODUCT_STATUS',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'bn'
        ? 'আপনার এনআইডি/পাসপোর্ট/লাইসেন্স ভেরিফিকেশন আবেদন জমা হয়েছে! অ্যাডমিন ২৪ ঘণ্টার মধ্যে রিভিউ করবে।'
        : 'KYC Verification request submitted! Admin will review your document within 24 hours.',
      'success'
    );
  };

  const approveSellerVerification = (sellerId: string) => {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === sellerId
          ? {
              ...s,
              isVerified: true,
              verificationStatus: 'VERIFIED',
              verificationData: s.verificationData
                ? { ...s.verificationData, reviewedAt: new Date().toLocaleString() }
                : undefined
            }
          : s
      )
    );

    if (currentSeller && currentSeller.id === sellerId) {
      setCurrentSeller((prev) =>
        prev
          ? {
              ...prev,
              isVerified: true,
              verificationStatus: 'VERIFIED'
            }
          : null
      );
    }

    const notif: SellerNotification = {
      id: `notif-verif-approved-${Date.now()}`,
      sellerId,
      title: 'Account Verification Approved! ✅',
      message: 'Congratulations! Your NID/Passport/Driving License verification is APPROVED. You can now upload products and sell.',
      type: 'PRODUCT_STATUS',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast('Seller KYC Account Verification approved successfully!', 'success');
  };

  const rejectSellerVerification = (sellerId: string, reason: string) => {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === sellerId
          ? {
              ...s,
              isVerified: false,
              verificationStatus: 'REJECTED',
              verificationData: s.verificationData
                ? {
                    ...s.verificationData,
                    reviewedAt: new Date().toLocaleString(),
                    rejectionReason: reason
                  }
                : undefined
            }
          : s
      )
    );

    if (currentSeller && currentSeller.id === sellerId) {
      setCurrentSeller((prev) =>
        prev
          ? {
              ...prev,
              isVerified: false,
              verificationStatus: 'REJECTED',
              verificationData: prev.verificationData
                ? { ...prev.verificationData, rejectionReason: reason }
                : undefined
            }
          : null
      );
    }

    const notif: SellerNotification = {
      id: `notif-verif-rej-${Date.now()}`,
      sellerId,
      title: 'Account Verification Rejected ⚠️',
      message: `Your account verification request was rejected. Reason: ${reason}`,
      type: 'PRODUCT_STATUS',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast(`Seller verification rejected (${reason})`, 'info');
  };

  const approveWithdrawal = (requestId: string) => {
    const req = withdrawalRequests.find((w) => w.id === requestId);
    if (!req) return;

    setWithdrawalRequests((prev) =>
      prev.map((w) => (w.id === requestId ? { ...w, status: 'Paid', processedAt: new Date().toLocaleString() } : w))
    );

    setSellerWallets((prev) => {
      const wallet = prev[req.sellerId] || {
        id: `wal-${req.sellerId}`,
        sellerId: req.sellerId,
        totalIncome: 0,
        totalCommission: 0,
        netEarnings: 0,
        availableBalance: 0,
        pendingBalance: 0,
        withdrawnAmount: 0,
        updatedAt: new Date().toISOString()
      };
      return {
        ...prev,
        [req.sellerId]: {
          ...wallet,
          withdrawnAmount: wallet.withdrawnAmount + req.amount,
          updatedAt: new Date().toISOString()
        }
      };
    });

    const notif: SellerNotification = {
      id: `notif-${Date.now()}`,
      sellerId: req.sellerId,
      title: 'Payout Processed & Transferred 💰',
      message: `Your payout of ৳${req.amount.toLocaleString()} via ${req.payoutMethod} has been paid out successfully.`,
      type: 'WITHDRAWAL',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast('Withdrawal marked as Paid & Funds Transferred!', 'success');
  };

  const rejectWithdrawal = (requestId: string, reason: string) => {
    const req = withdrawalRequests.find((w) => w.id === requestId);
    if (!req) return;

    setWithdrawalRequests((prev) =>
      prev.map((w) => (w.id === requestId ? { ...w, status: 'Rejected', rejectReason: reason } : w))
    );

    setSellerWallets((prev) => {
      const wallet = prev[req.sellerId];
      if (!wallet) return prev;
      return {
        ...prev,
        [req.sellerId]: {
          ...wallet,
          availableBalance: wallet.availableBalance + req.amount,
          updatedAt: new Date().toISOString()
        }
      };
    });

    const notif: SellerNotification = {
      id: `notif-${Date.now()}`,
      sellerId: req.sellerId,
      title: 'Withdrawal Request Rejected ⚠️',
      message: `Your payout request of ৳${req.amount.toLocaleString()} was rejected: ${reason}. Funds restored to available balance.`,
      type: 'WITHDRAWAL',
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setSellerNotifications((prev) => [notif, ...prev]);

    showToast('Withdrawal rejected & balance restored.', 'info');
  };

  const markNotificationAsRead = (notificationId: string) => {
    setSellerNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('bazaarbd_lang', lang);
    } catch {
      // ignore
    }
  };

  const updateSettings = (newSettings: Partial<MarketplaceSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettingsToFirestore(updated).catch((err) => console.warn('Sync settings notice:', err));
      return updated;
    });
    showToast('Marketplace notice & contact settings saved live!', 'success');
  };

  // Payment Gateways
  const addGateway = (gw: Omit<PaymentGatewayConfig, 'id'>) => {
    const id = `gw-${Date.now()}`;
    setGateways((prev) => [...prev, { ...gw, id }]);
    showToast(`Payment Gateway "${gw.name}" added successfully!`, 'success');
  };

  const updateGateway = (id: string, updates: Partial<PaymentGatewayConfig>) => {
    setGateways((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast('Gateway details updated!', 'success');
  };

  const deleteGateway = (id: string) => {
    setGateways((prev) => prev.filter((g) => g.id !== id));
    showToast('Gateway removed', 'info');
  };

  // Category CRUD
  const addCategory = (cat: Omit<Category, 'id' | 'slug'>) => {
    const slug = cat.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      slug
    };
    setCategories((prev) => [...prev, newCat]);
    saveCategoryToFirestore(newCat).catch((err) => console.warn('Sync category notice:', err));
    showToast(`Category "${cat.name}" added successfully!`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    saveCategoryToFirestore({ id, ...updates }).catch((err) => console.warn('Update category notice:', err));
    showToast('Category updated!', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteCategoryFromFirestore(id).catch((err) => console.warn('Delete category notice:', err));
    showToast('Category removed', 'info');
  };

  // Banner CRUD
  const addBanner = (bannerData: Omit<Banner, 'id'>) => {
    const newBanner: Banner = {
      ...bannerData,
      id: `banner-${Date.now()}`
    };
    setBanners((prev) => [newBanner, ...prev]);
    saveBannerToFirestore(newBanner).catch((err) => console.warn('Sync banner notice:', err));
    showToast(`Banner "${bannerData.title}" added successfully!`, 'success');
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    saveBannerToFirestore({ id, ...updates }).catch((err) => console.warn('Update banner notice:', err));
    showToast('Banner updated successfully!', 'success');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    deleteBannerFromFirestore(id).catch((err) => console.warn('Delete banner notice:', err));
    showToast('Banner removed', 'info');
  };

  const logout = () => {
    setUser(null);
    setCurrentSubAgent(null);
    setCurrentSeller(null);
    setIsAdminView(false);
    try {
      localStorage.removeItem('bazaarbd_user');
      localStorage.removeItem('bazaarbd_current_subagent');
      localStorage.removeItem('bazaarbd_current_seller');
    } catch {
      // ignore
    }
    showToast(language === 'bn' ? 'সফলভাবে একাউন্ট লগআউট হয়েছে!' : 'Logged out successfully!', 'info');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('bazaarbd_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('Profile & delivery details updated!', 'success');
  };

  const t = (key: keyof typeof translations['en'], params?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] || translations['en'][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const formatPrice = (amount: number): string => {
    return `৳${amount.toLocaleString('en-IN')}`;
  };

  const switchRole = (newRole: 'CUSTOMER' | 'ADMIN' | 'SELLER') => {
    if (newRole === 'ADMIN') {
      setUser(DEFAULT_ADMIN);
      setIsAdminView(true);
      showToast('Switched to Admin Mode (Full Privileges)', 'info');
    } else if (newRole === 'SELLER') {
      const activeSeller = DEFAULT_SELLERS[0] || { id: 'seller-apex-01', shopName: 'Apex Store' };
      setUser({
        ...DEFAULT_CUSTOMER,
        id: activeSeller.id,
        name: activeSeller.shopName,
        role: 'SELLER'
      });
      setIsAdminView(false);
      showToast('Switched to Seller Mode', 'info');
    } else {
      setUser(DEFAULT_CUSTOMER);
      setIsAdminView(false);
      showToast('Switched to Customer Mode', 'info');
    }
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    variantId?: string,
    variantName?: string,
    variantValue?: string
  ) => {
    // ACCESS CONTROL: Verify user authentication before allowing Add to Cart
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

    if (settings.isAddToCartEnabled === false) {
      showToast(
        language === 'bn'
          ? 'স্টোর অ্যাডমিন কর্তৃক কার্ট ও ক্রয় সাময়িকভাবে বন্ধ রাখা হয়েছে।'
          : 'Store purchasing & Add to Cart is temporarily paused by store admin.',
        'error'
      );
      return;
    }

    if (product.stock <= 0) {
      showToast(t('outOfStock'), 'error');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: Math.min(newQty, product.stock)
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variantId || 'base'}-${Date.now()}`,
          productId: product.id,
          product,
          variantId,
          variantName,
          variantValue,
          price: product.price,
          quantity: Math.min(quantity, product.stock)
        };
        return [...prev, newItem];
      }
    });

    showToast(
      language === 'bn'
        ? `"${product.titleBn || product.title}" কার্টে যোগ হয়েছে`
        : `Added "${product.title}" to cart!`,
      'success'
    );
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast(language === 'bn' ? 'পণ্যটি কার্ট থেকে সরানো হয়েছে' : 'Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(0);
    setVoucherCode('');
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyVoucherCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const matched = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);

    if (!matched) {
      showToast(
        language === 'bn' ? 'ভাউচার কোডটি সঠিক নয় বা মেয়াদ শেষ হয়েছে' : 'Invalid or expired coupon code',
        'error'
      );
      return false;
    }

    if (matched.minSpend && cartSubtotal < matched.minSpend) {
      showToast(
        language === 'bn'
          ? `এই কুপনের জন্য সর্বনিম্ন ৳${matched.minSpend} টাকার অর্ডার করতে হবে`
          : `Minimum order amount of ৳${matched.minSpend} required for this coupon`,
        'error'
      );
      return false;
    }

    let discount = 0;
    if (matched.discountType === 'PERCENT') {
      discount = Math.round(cartSubtotal * (matched.discountValue / 100));
    } else {
      discount = matched.discountValue;
    }

    discount = Math.min(discount, cartSubtotal);

    setVoucherCode(clean);
    setAppliedDiscount(discount);
    showToast(
      language === 'bn'
        ? `কুপন সফল! ৳${discount} ছাড় যোগ হয়েছে`
        : `Coupon applied! Saved ৳${discount}`,
      'success'
    );
    return true;
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(language === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'bn' ? 'উইশলিস্টে যুক্ত করা হয়েছে!' : 'Added to Wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const placeOrder = async (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    shippingFee = 60,
    transactionId?: string,
    senderNumber?: string
  ): Promise<Order> => {
    const subtotal = cartSubtotal;
    const discount = appliedDiscount;
    const total = Math.max(0, subtotal + shippingFee - discount);
    const orderNumber = `BZ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderItems = cart.map((item) => {
      const sId = item.product.sellerId || 'seller-apex-01';
      return {
        id: `oi-${Date.now()}-${item.id}`,
        productId: item.productId,
        sellerId: sId,
        title: item.product.title,
        price: item.price,
        quantity: item.quantity,
        image: item.product.media[0]?.url || '',
        variantName: item.variantName,
        variantValue: item.variantValue
      };
    });

    // Group order items into sub-orders per seller
    const subOrdersMap: Record<string, typeof orderItems> = {};
    orderItems.forEach((oi) => {
      const sId = oi.sellerId || 'seller-apex-01';
      if (!subOrdersMap[sId]) subOrdersMap[sId] = [];
      subOrdersMap[sId].push(oi);
    });

    const subOrders = Object.entries(subOrdersMap).map(([sId, sItems], idx) => {
      const sObj = sellers.find((s) => s.id === sId);
      const subtotalAmt = sItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
      return {
        id: `subord-${orderNumber}-${idx + 1}`,
        sellerId: sId,
        shopName: sObj ? sObj.shopName : 'Apex Tech & Gadget Center',
        items: sItems,
        subtotal: subtotalAmt,
        orderStatus: 'Confirmed' as const,
        trackingNumber: `STDF-${sId.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`
      };
    });

    const initialTrackingLogs: OrderTrackingStep[] = [
      {
        status: 'Confirmed',
        title: 'Order Placed & Steadfast Booking Created',
        description: `Order ${orderNumber} confirmed. Steadfast Courier consignment registered.`,
        location: 'Merchant Warehouse / Dhaka Central Hub',
        timestamp: new Date().toLocaleString(),
        completed: true
      },
      {
        status: 'Processing',
        title: 'Packaging & Ready for Courier Pickup',
        description: 'Package boxed with protective air cushions. Assigned to Steadfast Express pickup rider.',
        location: 'Dhaka Fulfillment Hub',
        timestamp: new Date().toLocaleString(),
        completed: false
      }
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: user?.id || 'usr-guest',
      customerName: shippingAddress.fullName || user?.name || 'Customer',
      customerPhone: shippingAddress.phone || user?.phone || '01700000000',
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      subtotal,
      shippingFee,
      discount,
      total,
      items: orderItems,
      subOrders,
      trackingNumber: `STDF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courierPartner: 'Steadfast Express',
      transactionId,
      senderNumber,
      trackingLogs: initialTrackingLogs,
      createdAt: new Date().toISOString()
    };

    // Update product stock counts
    setProducts((prev) =>
      prev.map((p) => {
        const cartMatch = cart.find((c) => c.productId === p.id);
        if (cartMatch) {
          const newStock = Math.max(0, p.stock - cartMatch.quantity);
          return {
            ...p,
            stock: newStock,
            soldCount: p.soldCount + cartMatch.quantity
          };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToFirestore(newOrder).catch((err) => console.warn('Sync order to Firebase notice:', err));

    // Attribute sales to active sponsored ad campaigns
    orderItems.forEach((it) => {
      setSponsoredCampaigns((cList) =>
        cList.map((c) => {
          if (c.productId === it.productId && c.status === 'ACTIVE') {
            const addedRev = it.price * it.quantity;
            const nextSales = c.salesGenerated + addedRev;
            const nextOrders = c.ordersCount + 1;
            const nextRoas = c.spend > 0 ? Number((nextSales / c.spend).toFixed(1)) : 0;
            return {
              ...c,
              salesGenerated: nextSales,
              ordersCount: nextOrders,
              roas: nextRoas
            };
          }
          return c;
        })
      );
    });

    // Attribute order to active affiliate referral code
    if (activeAffiliateCode) {
      const affiliateObj = affiliates.find(
        (a) => a.code.toUpperCase() === activeAffiliateCode.toUpperCase() && a.status === 'Active'
      );
      if (affiliateObj) {
        // Business Rule: Self-purchase is blocked! An affiliate cannot earn commission on their own order
        const isSelfPurchase =
          user?.email?.toLowerCase() === affiliateObj.email.toLowerCase() ||
          user?.phone === affiliateObj.phone ||
          user?.id === affiliateObj.userId;

        if (isSelfPurchase) {
          const fraudAlert: AffiliateFraudAlert = {
            id: `fraud-${Date.now()}`,
            affiliateId: affiliateObj.id,
            affiliateName: affiliateObj.name,
            type: 'SELF_ORDER_ATTEMPT',
            severity: 'LOW',
            description: `Self-purchase blocked: User attempted to purchase with their own affiliate ref code (${affiliateObj.code}).`,
            timestamp: new Date().toISOString(),
            resolved: false
          };
          setAffiliateFraudAlerts((prev) => [fraudAlert, ...prev]);
        } else {
          let totalComm = 0;
          const newCommissions: AffiliateCommission[] = [];

          orderItems.forEach((it) => {
            const productObj = products.find((p) => p.id === it.productId);
            const catId = productObj?.categoryId || '';
            const rate = affiliateSettings.categoryCommissions[catId] || affiliateSettings.globalCommissionPercent || 10;
            const commAmt = Math.round((it.price * it.quantity * rate) / 100);

            if (commAmt > 0) {
              totalComm += commAmt;
              newCommissions.push({
                id: `comm-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
                affiliateId: affiliateObj.id,
                affiliateCode: affiliateObj.code,
                orderId: newOrder.id,
                orderNumber: newOrder.orderNumber,
                orderItemId: it.id,
                productId: it.productId,
                productTitle: it.title,
                productImage: it.image,
                quantity: it.quantity,
                orderAmount: it.price * it.quantity,
                commissionAmount: commAmt,
                commissionRate: rate,
                status: 'Pending',
                approveAfter: new Date(Date.now() + (affiliateSettings.holdPeriodDays || 15) * 24 * 60 * 60 * 1000).toISOString(),
                orderDate: new Date().toISOString(),
                daysLeft: affiliateSettings.holdPeriodDays || 15
              });
            }
          });

          if (newCommissions.length > 0) {
            setAffiliateCommissions((prev) => [...newCommissions, ...prev]);
            setAffiliates((prev) =>
              prev.map((a) =>
                a.id === affiliateObj.id
                  ? {
                      ...a,
                      pendingBalance: a.pendingBalance + totalComm,
                      totalEarned: a.totalEarned + totalComm
                    }
                  : a
              )
            );
            if (currentAffiliate && currentAffiliate.id === affiliateObj.id) {
              setCurrentAffiliate((prev) =>
                prev
                  ? {
                      ...prev,
                      pendingBalance: prev.pendingBalance + totalComm,
                      totalEarned: prev.totalEarned + totalComm
                    }
                  : null
              );
            }
            // Update link order counters & conversion rates
            setAffiliateLinks((prev) =>
              prev.map((l) => {
                if (l.affiliateId === affiliateObj.id) {
                  const nextOrders = l.ordersCount + 1;
                  const nextCr = l.clicksCount > 0 ? Number(((nextOrders / l.clicksCount) * 100).toFixed(2)) : 0;
                  return { ...l, ordersCount: nextOrders, conversionRate: nextCr };
                }
                return l;
              })
            );
          }
        }
      }
    }

    setLastPlacedOrder(newOrder);
    clearCart();
    setIsCheckoutModalOpen(false);
    setIsOrderSuccessOpen(true);
    return newOrder;
  };

  const requestReturn = (orderId: string, reason: string): boolean => {
    let success = false;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (!ord.deliveredAt) {
            showToast('Item must be delivered before requesting a return.', 'error');
            return ord;
          }
          const deliveryTime = new Date(ord.deliveredAt).getTime();
          const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
          if (Date.now() - deliveryTime > sevenDaysMs) {
            showToast('Return window (7 days) has expired for this order.', 'error');
            return ord;
          }
          success = true;
          return {
            ...ord,
            orderStatus: 'Returned',
            returnRequested: true,
            returnReason: reason
          };
        }
        return ord;
      })
    );

    if (success) {
      showToast(t('returnSubmitted'), 'success');
      setActiveReturnOrderModal(null);
    }
    return success;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const isDeliveredNow = status === 'Delivered';
          const deliveredAt = isDeliveredNow ? new Date().toISOString() : ord.deliveredAt;
          const returnWindowEndsAt = isDeliveredNow
            ? new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
            : ord.returnWindowEndsAt;

          const updatedLogs = [...(ord.trackingLogs || [])];
          updatedLogs.push({
            status,
            title: `Order Status: ${status}`,
            description: `Package status updated to ${status} by QUATRO logistics.`,
            location: ord.shippingAddress.district || 'Hub',
            timestamp: new Date().toLocaleString(),
            completed: true
          });

          return {
            ...ord,
            orderStatus: status,
            deliveredAt,
            returnWindowEndsAt,
            trackingLogs: updatedLogs,
            paymentStatus: status === 'Delivered' ? 'Paid' : ord.paymentStatus
          };
        }
        return ord;
      })
    );

    // Business Rules: Affiliate Commission lifecycle sync
    if (status === 'Cancelled' || status === 'Returned') {
      setAffiliateCommissions((prev) =>
        prev.map((c) => {
          if (c.orderId === orderId && c.status === 'Pending') {
            setAffiliates((aList) =>
              aList.map((a) =>
                a.id === c.affiliateId
                  ? {
                      ...a,
                      pendingBalance: Math.max(0, a.pendingBalance - c.commissionAmount),
                      totalEarned: Math.max(0, a.totalEarned - c.commissionAmount)
                    }
                  : a
              )
            );
            return { ...c, status: 'Cancelled' as const, daysLeft: 0 };
          }
          return c;
        })
      );
    } else if (status === 'Delivered') {
      const holdDays = affiliateSettings.holdPeriodDays || 15;
      setAffiliateCommissions((prev) =>
        prev.map((c) => {
          if (c.orderId === orderId && c.status === 'Pending') {
            return {
              ...c,
              approveAfter: new Date(Date.now() + holdDays * 24 * 3600 * 1000).toISOString(),
              daysLeft: holdDays
            };
          }
          return c;
        })
      );
    }

    showToast(`Order status updated to ${status}`, 'success');
  };

  const updatePaymentStatus = (orderId: string, status: 'Pending' | 'Paid' | 'Failed') => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: status
          };
        }
        return ord;
      })
    );
    showToast(`Order payment status marked as ${status}`, 'success');
  };

  const updateOrderTracking = (
    orderId: string,
    courierPartner: string,
    status: OrderStatus,
    note?: string,
    location?: string,
    trackingCode?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedLogs = [...(ord.trackingLogs || [])];
          updatedLogs.push({
            status,
            title: note || `Dispatched via ${courierPartner}`,
            description: note || `In transit with courier agent (${courierPartner})`,
            location: location || ord.shippingAddress.district,
            timestamp: new Date().toLocaleString(),
            completed: true
          });

          return {
            ...ord,
            orderStatus: status,
            courierPartner,
            trackingNumber: trackingCode || ord.trackingNumber,
            trackingLogs: updatedLogs
          };
        }
        return ord;
      })
    );
    showToast('Live tracking status updated for customer!', 'success');
  };

  // Admin CRUD
  const addProduct = (
    newProdData: Omit<Product, 'id' | 'slug'> & {
      rating?: number;
      reviewCount?: number;
      soldCount?: number;
    }
  ) => {
    const slug = newProdData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const id = `prod-custom-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id,
      slug,
      rating: newProdData.rating !== undefined ? newProdData.rating : 5.0,
      reviewCount: newProdData.reviewCount !== undefined ? newProdData.reviewCount : 0,
      soldCount: newProdData.soldCount !== undefined ? newProdData.soldCount : 0
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('New product published to marketplace!', 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product details updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  const approveReview = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId && p.reviews) {
          return {
            ...p,
            reviews: p.reviews.map((r) => (r.id === reviewId ? { ...r, isApproved: true } : r))
          };
        }
        return p;
      })
    );
    showToast('Customer review approved and published!', 'success');
  };

  // ----------------------------------------------------------------------
  // AFFILIATE SYSTEM ACTIONS
  // ----------------------------------------------------------------------
  const registerAffiliate = async (data: {
    name: string;
    phone: string;
    email: string;
    password?: string;
    payoutMethod: 'bKash' | 'Nagad' | 'Bank';
    payoutAccount: string;
  }): Promise<Affiliate> => {
    const initials = (data.name.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'AFF').toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const code = `AFF-${initials}${randomDigits}`;

    const newAffiliate: Affiliate = {
      id: `aff-${Date.now()}`,
      userId: `usr-aff-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      code,
      status: 'Active',
      payoutMethod: data.payoutMethod,
      payoutAccount: data.payoutAccount,
      availableBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setAffiliates((prev) => [newAffiliate, ...prev]);
    setCurrentAffiliate(newAffiliate);
    const affiliateUser: User = {
      id: newAffiliate.userId,
      name: newAffiliate.name,
      email: newAffiliate.email,
      phone: newAffiliate.phone,
      role: 'AFFILIATE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    };
    setUser(affiliateUser);
    localStorage.setItem('quatro_current_affiliate', JSON.stringify(newAffiliate));
    localStorage.setItem('bazaarbd_user', JSON.stringify(affiliateUser));

    // Persist Affiliate to Firestore 'users' and 'affiliates' collections
    syncUserToFirestore({
      id: newAffiliate.userId,
      name: newAffiliate.name,
      email: newAffiliate.email,
      phone: newAffiliate.phone,
      role: 'AFFILIATE',
      customerId: newAffiliate.code,
      payoutMethod: newAffiliate.payoutMethod,
      payoutAccount: newAffiliate.payoutAccount,
      status: 'Active',
      createdAt: new Date().toISOString()
    }).catch((err) => console.warn('Sync affiliate to users collection notice:', err));

    saveAffiliateToFirestore(newAffiliate).catch((err) =>
      console.warn('Save affiliate to affiliates collection notice:', err)
    );

    showToast(`Welcome! Your affiliate code is ${newAffiliate.code}`, 'success');
    return newAffiliate;
  };

  const loginAffiliate = async (email: string, pass: string): Promise<Affiliate> => {
    const match = affiliates.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() || a.code.toLowerCase() === email.toLowerCase()
    );
    if (!match) {
      throw new Error('No affiliate account found with this email or code.');
    }
    if (match.status === 'Suspended') {
      throw new Error('Your affiliate account has been suspended. Please contact support.');
    }
    setCurrentAffiliate(match);
    const affiliateUser: User = {
      id: match.userId,
      name: match.name,
      email: match.email,
      phone: match.phone,
      role: 'AFFILIATE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    };
    setUser(affiliateUser);
    localStorage.setItem('quatro_current_affiliate', JSON.stringify(match));
    localStorage.setItem('bazaarbd_user', JSON.stringify(affiliateUser));
    showToast(`Logged in to Affiliate Portal as ${match.name}`, 'success');
    return match;
  };

  const upgradeCustomerToAffiliate = async (
    payoutMethod: 'bKash' | 'Nagad' | 'Bank',
    payoutAccount: string
  ): Promise<Affiliate> => {
    if (!user) throw new Error('Must be logged in to upgrade account');
    const existing = affiliates.find((a) => a.email.toLowerCase() === user.email.toLowerCase() || a.userId === user.id);
    if (existing) {
      setCurrentAffiliate(existing);
      setUser({ ...user, role: 'AFFILIATE' });
      showToast('Switched to Affiliate account!', 'info');
      return existing;
    }
    const initials = (user.name.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'AFF').toUpperCase();
    const code = `AFF-${initials}${Math.floor(1000 + Math.random() * 9000)}`;

    const newAff: Affiliate = {
      id: `aff-${Date.now()}`,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '01700000000',
      code,
      status: 'Active',
      payoutMethod,
      payoutAccount,
      availableBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setAffiliates((prev) => [newAff, ...prev]);
    setCurrentAffiliate(newAff);
    setUser({ ...user, role: 'AFFILIATE' });
    localStorage.setItem('quatro_current_affiliate', JSON.stringify(newAff));

    // Persist upgraded affiliate to Firestore
    syncUserToFirestore({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: 'AFFILIATE',
      customerId: code,
      payoutMethod,
      payoutAccount,
      status: 'Active',
      updatedAt: new Date().toISOString()
    }).catch((err) => console.warn('Sync upgraded affiliate to users notice:', err));

    saveAffiliateToFirestore(newAff).catch((err) =>
      console.warn('Save upgraded affiliate to affiliates notice:', err)
    );
    showToast(`Account upgraded! You are now an official QUATRO Affiliate (${code})`, 'success');
    return newAff;
  };

  const generateAffiliateLink = (productId?: string): AffiliateLink => {
    const activeAff = currentAffiliate || affiliates[0];
    const product = productId ? products.find((p) => p.id === productId) : undefined;
    const url = product
      ? `/product/${product.slug}?ref=${activeAff.code}`
      : `/?ref=${activeAff.code}`;

    const existing = affiliateLinks.find(
      (l) => l.affiliateId === activeAff.id && l.productId === (product?.id || undefined)
    );
    if (existing) return existing;

    const newLink: AffiliateLink = {
      id: `link-${Date.now()}`,
      affiliateId: activeAff.id,
      affiliateCode: activeAff.code,
      productId: product?.id,
      productTitle: product?.title,
      productSlug: product?.slug,
      productImage: product?.media[0]?.url,
      productPrice: product?.price,
      url,
      clicksCount: 0,
      ordersCount: 0,
      conversionRate: 0,
      createdAt: new Date().toISOString()
    };

    setAffiliateLinks((prev) => [newLink, ...prev]);
    return newLink;
  };

  const recordAffiliateClick = (code: string, productId?: string) => {
    const affiliate = affiliates.find((a) => a.code.toUpperCase() === code.toUpperCase() && a.status === 'Active');
    if (!affiliate) return;

    setActiveAffiliateCode(affiliate.code);
    localStorage.setItem('quatro_affiliate_ref', affiliate.code);
    try {
      document.cookie = `quatro_affiliate_ref=${affiliate.code}; max-age=${30 * 24 * 60 * 60}; path=/`;
    } catch {}

    const newClick: AffiliateClick = {
      id: `click-${Date.now()}`,
      affiliateId: affiliate.id,
      affiliateCode: affiliate.code,
      productId,
      timestamp: new Date().toISOString(),
      ipHash: `${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}***`,
      device: typeof navigator !== 'undefined' && /Mobi/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
    };

    setAffiliateClicks((prev) => [newClick, ...prev]);

    setAffiliateLinks((prev) =>
      prev.map((l) => {
        if (l.affiliateId === affiliate.id && (!productId || l.productId === productId)) {
          const nextClicks = l.clicksCount + 1;
          const nextCr = nextClicks > 0 ? Number(((l.ordersCount / nextClicks) * 100).toFixed(2)) : 0;
          return { ...l, clicksCount: nextClicks, conversionRate: nextCr };
        }
        return l;
      })
    );
  };

  const requestAffiliateWithdrawal = (
    amount: number,
    payoutMethod: 'bKash' | 'Nagad' | 'Bank',
    payoutAccount: string
  ): boolean => {
    const aff = currentAffiliate || affiliates[0];
    const minAmount = affiliateSettings.minWithdrawalAmount || 500;

    if (amount < minAmount) {
      showToast(`Minimum withdrawal amount is ৳${minAmount}`, 'error');
      return false;
    }
    if (amount > aff.availableBalance) {
      showToast(`Requested amount exceeds available balance (৳${aff.availableBalance})`, 'error');
      return false;
    }

    const cycleDays = affiliateSettings.withdrawalFrequency === 'once_per_month' ? 30 : affiliateSettings.withdrawalFrequency === 'bi_weekly' ? 15 : 0;
    if (cycleDays > 0) {
      const recentWithdrawal = affiliateWithdrawals.find((w) => {
        if (w.affiliateId === aff.id && w.status !== 'Rejected') {
          const daysAgo = (Date.now() - new Date(w.requestedAt).getTime()) / (24 * 3600 * 1000);
          return daysAgo < cycleDays;
        }
        return false;
      });
      if (recentWithdrawal) {
        const nextDate = new Date(new Date(recentWithdrawal.requestedAt).getTime() + cycleDays * 24 * 3600 * 1000)
          .toISOString()
          .split('T')[0];
        showToast(`Withdrawal limit reached (${cycleDays}-day cycle). Next withdrawal available on ${nextDate}`, 'error');
        return false;
      }
    }

    setAffiliates((prev) =>
      prev.map((a) => (a.id === aff.id ? { ...a, availableBalance: a.availableBalance - amount } : a))
    );
    if (currentAffiliate && currentAffiliate.id === aff.id) {
      setCurrentAffiliate({ ...currentAffiliate, availableBalance: currentAffiliate.availableBalance - amount });
    }

    const newReq: AffiliateWithdrawal = {
      id: `with-${Date.now()}`,
      affiliateId: aff.id,
      affiliateName: aff.name,
      affiliateCode: aff.code,
      payoutMethod,
      payoutAccount,
      amount,
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };

    setAffiliateWithdrawals((prev) => [newReq, ...prev]);
    showToast(`Withdrawal request for ৳${amount} submitted! Locked from available balance.`, 'success');
    return true;
  };

  const adminUpdateWithdrawal = (
    id: string,
    status: AffiliateWithdrawalStatus,
    txnId?: string,
    rejectReason?: string
  ) => {
    const item = affiliateWithdrawals.find((w) => w.id === id);
    if (!item) return;

    if (status === 'Paid') {
      setAffiliates((prev) =>
        prev.map((a) => (a.id === item.affiliateId ? { ...a, totalWithdrawn: a.totalWithdrawn + item.amount } : a))
      );
      if (currentAffiliate && currentAffiliate.id === item.affiliateId) {
        setCurrentAffiliate({ ...currentAffiliate, totalWithdrawn: currentAffiliate.totalWithdrawn + item.amount });
      }
    } else if (status === 'Rejected') {
      setAffiliates((prev) =>
        prev.map((a) => (a.id === item.affiliateId ? { ...a, availableBalance: a.availableBalance + item.amount } : a))
      );
      if (currentAffiliate && currentAffiliate.id === item.affiliateId) {
        setCurrentAffiliate({ ...currentAffiliate, availableBalance: currentAffiliate.availableBalance + item.amount });
      }
    }

    setAffiliateWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status,
              txnId: txnId || w.txnId,
              rejectReason: rejectReason || w.rejectReason,
              processedAt: new Date().toISOString()
            }
          : w
      )
    );
    showToast(`Withdrawal #${id.slice(-6)} marked as ${status}`, 'success');
  };

  const adminToggleAffiliateStatus = (affiliateId: string) => {
    setAffiliates((prev) =>
      prev.map((a) => {
        if (a.id === affiliateId) {
          const next = a.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`Affiliate ${a.name} is now ${next}`, 'info');
          return { ...a, status: next };
        }
        return a;
      })
    );
  };

  const adminUpdateAffiliateSettings = (newSettings: Partial<AffiliateSettings>) => {
    setAffiliateSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('quatro_affiliate_settings', JSON.stringify(updated));
      return updated;
    });
    showToast('Affiliate commission & withdrawal settings updated!', 'success');
  };

  const adminCancelCommission = (commissionId: string, reason: string) => {
    const match = affiliateCommissions.find((c) => c.id === commissionId);
    if (!match) return;

    if (match.status === 'Pending') {
      setAffiliates((prev) =>
        prev.map((a) =>
          a.id === match.affiliateId
            ? {
                ...a,
                pendingBalance: Math.max(0, a.pendingBalance - match.commissionAmount),
                totalEarned: Math.max(0, a.totalEarned - match.commissionAmount)
              }
            : a
        )
      );
    } else if (match.status === 'Approved') {
      setAffiliates((prev) =>
        prev.map((a) =>
          a.id === match.affiliateId
            ? {
                ...a,
                availableBalance: Math.max(0, a.availableBalance - match.commissionAmount),
                totalEarned: Math.max(0, a.totalEarned - match.commissionAmount)
              }
            : a
        )
      );
    }

    setAffiliateCommissions((prev) =>
      prev.map((c) => (c.id === commissionId ? { ...c, status: 'Cancelled' as const, daysLeft: 0 } : c))
    );

    const fraudAlert: AffiliateFraudAlert = {
      id: `fraud-${Date.now()}`,
      affiliateId: match.affiliateId,
      affiliateName: match.affiliateCode,
      type: 'HIGH_CANCEL_RATE',
      severity: 'HIGH',
      description: `Commission #${match.id.slice(-6)} manually cancelled by admin for fraud: ${reason}`,
      timestamp: new Date().toISOString(),
      resolved: false
    };
    setAffiliateFraudAlerts((prev) => [fraudAlert, ...prev]);
    showToast(`Commission cancelled. Deducted ৳${match.commissionAmount} from affiliate.`, 'info');
  };

  const runAffiliateCommissionApprovalCron = (): number => {
    let approvedCount = 0;
    const now = Date.now();

    setAffiliateCommissions((prevComms) => {
      const nextComms = prevComms.map((c) => {
        if (c.status === 'Pending') {
          const maturityTime = new Date(c.approveAfter).getTime();
          if (maturityTime <= now) {
            approvedCount++;
            setAffiliates((aList) =>
              aList.map((a) =>
                a.id === c.affiliateId
                  ? {
                      ...a,
                      pendingBalance: Math.max(0, a.pendingBalance - c.commissionAmount),
                      availableBalance: a.availableBalance + c.commissionAmount
                    }
                  : a
              )
            );
            return {
              ...c,
              status: 'Approved' as const,
              approvedAt: new Date().toISOString(),
              daysLeft: 0
            };
          }
        }
        return c;
      });
      return nextComms;
    });

    if (approvedCount > 0) {
      showToast(`Automated Cron Job: Approved ${approvedCount} mature commissions! Transferred to Available Balance.`, 'success');
    } else {
      showToast('Automated Cron Check: All pending commissions are within the 15-day verification period.', 'info');
    }
    return approvedCount;
  };

  return (
    <MarketplaceContext.Provider
      value={{
        isMounted,
        language,
        setLanguage,
        t,
        formatPrice,
        settings,
        updateSettings,
        gateways,
        addGateway,
        updateGateway,
        deleteGateway,
        user,
        setUser,
        logout,
        updateUserProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        switchRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        products,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        voucherCode,
        appliedDiscount,
        applyVoucherCode,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        collectedVouchers,
        collectVoucher,
        isVoucherCollected,
        addCustomerReviewWithPhoto,
        wishlist,
        toggleWishlist,
        isInWishlist,
        activeProductModal,
        setActiveProductModal,
        activeVideoModalUrl,
        setActiveVideoModalUrl,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isBkashModalOpen,
        setIsBkashModalOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        lastPlacedOrder,
        activeReturnOrderModal,
        setActiveReturnOrderModal,
        isTrackOrderModalOpen,
        setIsTrackOrderModalOpen,
        trackOrderNumberQuery,
        setTrackOrderNumberQuery,
        isAppDownloadModalOpen,
        setIsAppDownloadModalOpen,
        isAdminView,
        setIsAdminView,
        orders,
        placeOrder,
        requestReturn,
        updateOrderStatus,
        updatePaymentStatus,
        updateOrderTracking,
        addProduct,
        updateProduct,
        deleteProduct,
        approveReview,
        toast,
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
        addLiveChatMessage,
        replyToLiveChat,
        sellers,
        currentSeller,
        setCurrentSeller,
        sellerWallets,
        sellerTransactions,
        withdrawalRequests,
        sellerNotifications,
        productQnAs,
        sellerPromotions,
        sponsoredCampaigns,
        shopFollowers,
        createSponsoredCampaign,
        toggleCampaignStatus,
        deleteSponsoredCampaign,
        recordProductImpression,
        recordProductClick,
        simulateCampaignTraffic,
        getRankedProducts,
        sellerRegister,
        sellerLogin,
        updateSellerProfile,
        addSellerProduct,
        updateSellerProduct,
        deleteSellerProduct,
        approveProduct,
        rejectProduct,
        requestWithdrawal,
        replyToReview,
        answerQuestion,
        addCustomerQuestion,
        createSellerPromotion,
        toggleFollowShop,
        isFollowingShop,
        approveSeller,
        rejectSeller,
        suspendSeller,
        submitSellerVerification,
        approveSellerVerification,
        rejectSellerVerification,
        approveWithdrawal,
        rejectWithdrawal,
        markNotificationAsRead,
        adminAdSettings,
        updateAdminAdSettings,
        depositRequests,
        submitSellerDeposit,
        approveSellerDeposit,
        rejectSellerDeposit,
        adjustSellerBalance,
        transferToAdBalance,
        // Affiliate System
        affiliates,
        currentAffiliate,
        setCurrentAffiliate,
        affiliateLinks,
        affiliateClicks,
        affiliateCommissions,
        affiliateWithdrawals,
        affiliateSettings,
        affiliateFraudAlerts,
        activeAffiliateCode,
        setActiveAffiliateCode,
        registerAffiliate,
        loginAffiliate,
        upgradeCustomerToAffiliate,
        generateAffiliateLink,
        recordAffiliateClick,
        requestAffiliateWithdrawal,
        adminUpdateWithdrawal,
        adminToggleAffiliateStatus,
        adminUpdateAffiliateSettings,
        adminCancelCommission,
        runAffiliateCommissionApprovalCron
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
