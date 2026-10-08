import {
  Affiliate,
  AffiliateLink,
  AffiliateClick,
  AffiliateCommission,
  AffiliateWithdrawal,
  AffiliateSettings,
  AffiliateFraudAlert
} from '../types/ecommerce';

// Real clean database - no mock dummy affiliates or fake earnings
export const DEFAULT_AFFILIATES: Affiliate[] = [];

export const DEFAULT_AFFILIATE_SETTINGS: AffiliateSettings = {
  defaultCommissionRate: 10,
  minWithdrawalLimit: 500,
  cookieDurationDays: 30,
  payoutDayOfMonth: 5,
  isProgramActive: true,
  autoApproveNewAffiliates: true,
  requirePhoneVerification: true,
  bannedKeywords: ['spam', 'crack', 'cheat', 'illegal'],
  allowedPaymentMethods: ['bKash', 'Nagad', 'Rocket', 'Bank']
};

export const DEFAULT_AFFILIATE_LINKS: AffiliateLink[] = [];

export const DEFAULT_AFFILIATE_CLICKS: AffiliateClick[] = [];

export const DEFAULT_AFFILIATE_COMMISSIONS: AffiliateCommission[] = [];

export const DEFAULT_AFFILIATE_WITHDRAWALS: AffiliateWithdrawal[] = [];

export const DEFAULT_AFFILIATE_FRAUD_ALERTS: AffiliateFraudAlert[] = [];
