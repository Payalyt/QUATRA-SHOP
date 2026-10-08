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

// Real clean database - no mock dummy sellers or fake NID mockup documents
export const DEFAULT_SELLERS: Seller[] = [];

export const DEFAULT_WALLETS: Record<string, SellerWallet> = {};

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
