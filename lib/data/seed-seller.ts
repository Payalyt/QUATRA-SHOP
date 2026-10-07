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
    joinedDate: '2024-03-15',
    isVerified: true,
    verificationStatus: 'VERIFIED',
    verificationData: {
      documentType: 'NID',
      documentNumber: '1992269104829104',
      fullNameAsPerDoc: 'MD APEX HOSSAIN',
      phone: '01712998877',
      frontImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      backImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      submittedAt: '2024-03-15 10:00:00',
      reviewedAt: '2024-03-15 11:30:00'
    }
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
    joinedDate: '2024-06-10',
    isVerified: true,
    verificationStatus: 'VERIFIED',
    verificationData: {
      documentType: 'PASSPORT',
      documentNumber: 'A09824109',
      fullNameAsPerDoc: 'ARTISAN FASHION LTD',
      phone: '01811223344',
      frontImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      submittedAt: '2024-06-10 14:20:00',
      reviewedAt: '2024-06-10 16:00:00'
    }
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
    joinedDate: '2026-10-01',
    isVerified: false,
    verificationStatus: 'PENDING_VERIFICATION',
    verificationData: {
      documentType: 'NID',
      documentNumber: '298104829104',
      fullNameAsPerDoc: 'TARIKUL ISLAM',
      phone: '01933445566',
      frontImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      backImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
      submittedAt: '2026-10-01 11:15:00'
    }
  }
];

export const DEFAULT_WALLETS: Record<string, SellerWallet> = {
  'seller-apex-01': {
    id: 'wal-apex-01',
    sellerId: 'seller-apex-01',
    totalIncome: 0,
    totalCommission: 0,
    netEarnings: 0,
    availableBalance: 0,
    adBalance: 0,
    pendingBalance: 0,
    withdrawnAmount: 0,
    updatedAt: new Date().toISOString()
  },
  'seller-fashion-02': {
    id: 'wal-fashion-02',
    sellerId: 'seller-fashion-02',
    totalIncome: 0,
    totalCommission: 0,
    netEarnings: 0,
    availableBalance: 0,
    adBalance: 0,
    pendingBalance: 0,
    withdrawnAmount: 0,
    updatedAt: new Date().toISOString()
  }
};

export const DEFAULT_TRANSACTIONS: SellerTransaction[] = [];

export const DEFAULT_WITHDRAWALS: WithdrawalRequest[] = [];

export const DEFAULT_NOTIFICATIONS: SellerNotification[] = [];

export const DEFAULT_QNA: ProductQnA[] = [];

export const DEFAULT_SELLER_PROMOTIONS: SellerPromotion[] = [];

export const DEFAULT_SPONSORED_CAMPAIGNS: SponsoredAdCampaign[] = [];

export const DEFAULT_DEPOSIT_REQUESTS: SellerDepositRequest[] = [];

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


