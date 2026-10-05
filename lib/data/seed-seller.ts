import {
  Seller,
  SellerWallet,
  SellerTransaction,
  WithdrawalRequest,
  SellerNotification,
  ProductQnA,
  SellerPromotion,
  SponsoredAdCampaign,
  SellerDepositRequest,
  AdminAdSettings
} from '../types/ecommerce';

export const DEFAULT_SELLERS: Seller[] = [
  {
    id: 'seller-apex-01',
    sellerIdNumber: '81049281',
    userId: 'usr-seller-apex',
    shopName: 'Apex Tech & Gadget Center',
    slug: 'apex-gadget-store',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    description: 'Official Apex Tech & Premium Gadget Store on QUATRO. 100% Genuine Electronics, Fast Express Shipping across Bangladesh & 7-Day Money-Back Guarantee.',
    phone: '01712998877',
    email: 'seller@apexbd.com',
    shopAddress: 'Shop #304, Level 4, BCS Computer City, IDB Bhaban, Agargaon, Dhaka-1207',
    status: 'Approved',
    payoutMethod: 'bKash',
    payoutAccount: '01712998877',
    commissionOverride: 5,
    rating: 4.9,
    followerCount: 12840,
    joinedDate: '2024-03-15'
  },
  {
    id: 'seller-fashion-02',
    sellerIdNumber: '62940173',
    userId: 'usr-seller-artisan',
    shopName: 'Artisan Fashion House',
    slug: 'artisan-fashion-house',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    description: 'Handcrafted Premium Traditional & Modern Apparel, Panjabi, Saree & Designer Wear made in Bangladesh.',
    phone: '01811223344',
    email: 'seller@artisanfashion.bd',
    shopAddress: 'Plot 12, Road 4, Sector 3, Uttara, Dhaka-1230',
    status: 'Approved',
    payoutMethod: 'Nagad',
    payoutAccount: '01811223344',
    commissionOverride: 8,
    rating: 4.8,
    followerCount: 8450,
    joinedDate: '2024-06-10'
  },
  {
    id: 'seller-pending-03',
    sellerIdNumber: '94028416',
    userId: 'usr-seller-green',
    shopName: 'Green Organic BD',
    slug: 'green-organic-bd',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
    description: 'Pure Sundarban Honey, Cold Pressed Mustard Oil & Natural Organic Foods.',
    phone: '01933445566',
    email: 'info@greenorganic.bd',
    shopAddress: 'Chawkbazar, Old Dhaka, Dhaka-1211',
    status: 'Pending',
    payoutMethod: 'bKash',
    payoutAccount: '01933445566',
    rating: 5.0,
    followerCount: 140,
    joinedDate: '2026-10-01'
  }
];

export const DEFAULT_WALLETS: Record<string, SellerWallet> = {
  'seller-apex-01': {
    id: 'wal-apex-01',
    sellerId: 'seller-apex-01',
    totalIncome: 148500,
    totalCommission: 7425,
    netEarnings: 141075,
    availableBalance: 42500,
    adBalance: 1500,
    pendingBalance: 18200,
    withdrawnAmount: 80375,
    updatedAt: new Date().toISOString()
  },
  'seller-fashion-02': {
    id: 'wal-fashion-02',
    sellerId: 'seller-fashion-02',
    totalIncome: 64200,
    totalCommission: 5136,
    netEarnings: 59064,
    availableBalance: 19500,
    adBalance: 800,
    pendingBalance: 9564,
    withdrawnAmount: 30000,
    updatedAt: new Date().toISOString()
  }
};

export const DEFAULT_TRANSACTIONS: SellerTransaction[] = [
  {
    id: 'trx-101',
    sellerId: 'seller-apex-01',
    orderId: 'BZ-2026-10482',
    amount: 12500,
    commission: 625,
    netAmount: 11875,
    type: 'CREDIT',
    description: 'Order Payment Completed (TWS Earbuds & Smartwatch)',
    status: 'Available',
    availableAt: '2026-09-28',
    createdAt: '2026-09-21'
  },
  {
    id: 'trx-102',
    sellerId: 'seller-apex-01',
    orderId: 'BZ-2026-10943',
    amount: 18500,
    commission: 925,
    netAmount: 17575,
    type: 'CREDIT',
    description: 'Order Payment Completed (5G Smartphone)',
    status: 'Pending',
    availableAt: '2026-10-08',
    createdAt: '2026-10-01'
  },
  {
    id: 'trx-103',
    sellerId: 'seller-apex-01',
    amount: 30000,
    commission: 0,
    netAmount: 30000,
    type: 'DEBIT',
    description: 'Payout Transfer via bKash Personal (TrxID: 9X7A12K3L)',
    status: 'Withdrawn',
    createdAt: '2026-09-25'
  }
];

export const DEFAULT_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'wdr-201',
    sellerId: 'seller-apex-01',
    shopName: 'Apex Tech & Gadget Center',
    amount: 25000,
    payoutMethod: 'bKash',
    accountDetails: '01712998877 (bKash Personal)',
    status: 'Paid',
    processedAt: '2026-09-25 14:30',
    createdAt: '2026-09-24 10:15'
  },
  {
    id: 'wdr-202',
    sellerId: 'seller-apex-01',
    shopName: 'Apex Tech & Gadget Center',
    amount: 15000,
    payoutMethod: 'bKash',
    accountDetails: '01712998877 (bKash Personal)',
    status: 'Pending',
    createdAt: '2026-10-02 09:00'
  }
];

export const DEFAULT_NOTIFICATIONS: SellerNotification[] = [
  {
    id: 'notif-1',
    sellerId: 'seller-apex-01',
    title: 'New Order Received! 🛒',
    message: 'Customer Hasib Rahman placed an order BZ-2026-10943 for ৳18,500.',
    type: 'ORDER',
    isRead: false,
    createdAt: '2026-10-02 11:20'
  },
  {
    id: 'notif-2',
    sellerId: 'seller-apex-01',
    title: 'Low Stock Alert ⚠️',
    message: 'Anker Soundcore Motion+ Bluetooth Speaker stock is down to 2 units.',
    type: 'STOCK',
    isRead: false,
    createdAt: '2026-10-01 16:45'
  },
  {
    id: 'notif-3',
    sellerId: 'seller-apex-01',
    title: 'New Product Approved ✅',
    message: 'Your new product "Logitech MX Master 3S Mouse" was approved by Admin.',
    type: 'PRODUCT_STATUS',
    isRead: true,
    createdAt: '2026-09-29 10:00'
  }
];

export const DEFAULT_QNA: ProductQnA[] = [
  {
    id: 'qna-1',
    productId: 'prod-1',
    productTitle: 'Baseus 65W GaN Fast Charger',
    sellerId: 'seller-apex-01',
    userId: 'usr-cust-99',
    userName: 'Tanvir Hossain',
    question: 'Is this 65W GaN charger compatible with MacBook Pro 14 inch and Samsung S24 Ultra?',
    answer: 'Yes, brother! It supports Power Delivery 3.0 & PPS fast charging for MacBook, iPhone, and Samsung Ultra devices simultaneously.',
    answeredAt: '2026-09-30 18:20',
    createdAt: '2026-09-30 14:10'
  },
  {
    id: 'qna-2',
    productId: 'prod-2',
    productTitle: 'Haylou RS4 Plus AMOLED Smartwatch',
    sellerId: 'seller-apex-01',
    userId: 'usr-cust-88',
    userName: 'Nadia Afrin',
    question: 'Does this watch have official replacement warranty in Bangladesh?',
    answer: 'Yes! We provide 6 Months official replacement warranty card inside the sealed box.',
    answeredAt: '2026-10-01 11:00',
    createdAt: '2026-10-01 09:30'
  }
];

export const DEFAULT_SELLER_PROMOTIONS: SellerPromotion[] = [
  {
    id: 'promo-101',
    sellerId: 'seller-apex-01',
    title: 'Apex Weekend Tech Bonanza',
    discountPercent: 12,
    productIds: ['prod-1', 'prod-2'],
    startTime: '2026-10-01T00:00:00Z',
    endTime: '2026-10-07T23:59:59Z',
    isActive: true,
    createdAt: '2026-09-30'
  }
];

export const DEFAULT_SPONSORED_CAMPAIGNS: SponsoredAdCampaign[] = [
  {
    id: 'camp-ad-01',
    sellerId: 'seller-apex-01',
    productId: 'prod-smartwatch-amoled',
    productTitle: 'Haylou RS4 Plus AMOLED Smartwatch (Retina HD Display)',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    dailyBudget: 500,
    bidAmount: 1.5,
    biddingType: 'AUTO',
    targetKeywords: ['smartwatch', 'amoled watch', 'haylou', 'bluetooth watch', 'waterproof watch'],
    negativeKeywords: ['free watch', 'repair', 'second hand'],
    status: 'ACTIVE',
    impressions: 18450,
    clicks: 742,
    spend: 1113,
    salesGenerated: 34990,
    ordersCount: 10,
    roas: 31.4,
    createdAt: '2026-09-28',
    startedAt: '2026-09-28 10:00'
  },
  {
    id: 'camp-ad-02',
    sellerId: 'seller-apex-01',
    productId: 'prod-baseus-gan-65w',
    productTitle: 'Baseus 65W GaN Fast Charger (3-Port Multi-Device Turbo)',
    productImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    dailyBudget: 300,
    bidAmount: 1.2,
    biddingType: 'MANUAL',
    targetKeywords: ['fast charger', 'gan charger', 'baseus', 'macbook charger', 'type-c adapter'],
    negativeKeywords: ['fake', 'replica'],
    status: 'ACTIVE',
    impressions: 11200,
    clicks: 418,
    spend: 501.6,
    salesGenerated: 18900,
    ordersCount: 7,
    roas: 37.6,
    createdAt: '2026-09-29',
    startedAt: '2026-09-29 14:00'
  }
];

export const DEFAULT_DEPOSIT_REQUESTS: SellerDepositRequest[] = [
  {
    id: 'dep-101',
    sellerId: 'seller-apex-01',
    sellerShopName: 'Apex Tech Official',
    sellerPhone: '01711002233',
    amount: 1000,
    paymentMethod: 'bKash',
    senderNumber: '01711002233',
    trxId: 'BK9X2A88LP',
    notes: 'Deposited ৳1,000 for 5,000 Impressions boost',
    status: 'APPROVED',
    createdAt: '2026-10-02 14:30',
    processedAt: '2026-10-02 14:45'
  },
  {
    id: 'dep-102',
    sellerId: 'seller-apex-01',
    sellerShopName: 'Apex Tech Official',
    sellerPhone: '01711002233',
    amount: 500,
    paymentMethod: 'Nagad',
    senderNumber: '01711002233',
    trxId: 'NG77Y09B21',
    notes: 'Weekend campaign budget boost',
    status: 'PENDING',
    createdAt: '2026-10-03 10:15'
  }
];

export const DEFAULT_ADMIN_AD_SETTINGS: AdminAdSettings = {
  cpmRate: 200, // ৳200 per 1,000 impressions (৳0.20 per impression)
  bkashNumber: '01712-345678',
  bkashType: 'Merchant',
  nagadNumber: '01812-987654',
  nagadType: 'Personal',
  rocketNumber: '01912-456789-2',
  bankDetails: 'Bank Asia Ltd, Principal Branch Dhaka, A/C: 021310088921, Name: BazaarBD Marketplace E-Commerce Ltd.',
  depositNotice: 'টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) ও যে নম্বর থেকে পাঠিয়েছেন তা দিয়ে ডিপোজিট রিকোয়েস্ট সাবমিট করুন। এডমিন অনুমোদনের সাথে সাথে আপনার এড একাউন্টে ব্যালেন্স যোগ হবে।'
};


