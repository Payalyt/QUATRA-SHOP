import {
  Affiliate,
  AffiliateLink,
  AffiliateClick,
  AffiliateCommission,
  AffiliateWithdrawal,
  AffiliateSettings,
  AffiliateFraudAlert
} from '../types/ecommerce';

export const DEFAULT_AFFILIATES: Affiliate[] = [
  {
    id: 'aff-tanvir-01',
    userId: 'usr-affiliate-tanvir',
    name: 'Tanvir Ahmed',
    email: 'affiliate.demo@gmail.com',
    phone: '01719887766',
    code: 'AFF-DEMO2026',
    status: 'Active',
    payoutMethod: 'bKash',
    payoutAccount: '01719887766',
    availableBalance: 3450,
    pendingBalance: 1280,
    totalEarned: 8230,
    totalWithdrawn: 3500,
    joinedDate: '2024-02-10',
    createdAt: '2024-02-10T10:00:00.000Z'
  },
  {
    id: 'aff-sumon-02',
    userId: 'usr-affiliate-sumon',
    name: 'Sumon Chowdhury',
    email: 'sumon.promoter@gmail.com',
    phone: '01812334455',
    code: 'AFF-SUMON88',
    status: 'Active',
    payoutMethod: 'Nagad',
    payoutAccount: '01812334455',
    availableBalance: 5800,
    pendingBalance: 2400,
    totalEarned: 14200,
    totalWithdrawn: 6000,
    joinedDate: '2024-01-15',
    createdAt: '2024-01-15T08:30:00.000Z'
  },
  {
    id: 'aff-rahim-03',
    userId: 'usr-affiliate-rahim',
    name: 'Rahim Content Creator',
    email: 'rahim.tech@gmail.com',
    phone: '01999887766',
    code: 'AFF-TECHRAHIM',
    status: 'Suspended',
    payoutMethod: 'Bank',
    payoutAccount: 'DBBL: 115.120.9847291',
    availableBalance: 0,
    pendingBalance: 0,
    totalEarned: 1200,
    totalWithdrawn: 1200,
    joinedDate: '2024-03-01',
    createdAt: '2024-03-01T12:00:00.000Z'
  }
];

export const DEFAULT_AFFILIATE_SETTINGS: AffiliateSettings = {
  globalCommissionPercent: 10,
  categoryCommissions: {
    'cat-electronics': 8,
    'cat-fashion': 12,
    'cat-home': 10,
    'cat-beauty': 15,
    'cat-groceries': 5
  },
  holdPeriodDays: 15,
  withdrawalFrequency: 'bi_weekly',
  minWithdrawalAmount: 500,
  cookieDurationDays: 30
};

export const DEFAULT_AFFILIATE_LINKS: AffiliateLink[] = [
  {
    id: 'link-01',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    productId: 'prod-t900-ultra-smartwatch',
    productTitle: 'T900 Ultra 2 Big Display Bluetooth Calling Smartwatch',
    productSlug: 't900-ultra-2-smartwatch',
    productImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80',
    productPrice: 1250,
    url: '/product/t900-ultra-2-smartwatch?ref=AFF-DEMO2026',
    clicksCount: 342,
    ordersCount: 28,
    conversionRate: 8.18,
    createdAt: '2024-02-12T14:20:00.000Z'
  },
  {
    id: 'link-02',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    productId: 'prod-lenovo-lp40-pro',
    productTitle: 'Lenovo LP40 Pro TWS Wireless Earbuds Bluetooth 5.1',
    productSlug: 'lenovo-lp40-pro-tws',
    productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
    productPrice: 890,
    url: '/product/lenovo-lp40-pro-tws?ref=AFF-DEMO2026',
    clicksCount: 215,
    ordersCount: 19,
    conversionRate: 8.84,
    createdAt: '2024-02-15T10:15:00.000Z'
  },
  {
    id: 'link-03',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    url: '/?ref=AFF-DEMO2026',
    clicksCount: 184,
    ordersCount: 11,
    conversionRate: 5.98,
    createdAt: '2024-02-10T11:00:00.000Z'
  }
];

export const DEFAULT_AFFILIATE_CLICKS: AffiliateClick[] = [
  {
    id: 'click-01',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    productId: 'prod-t900-ultra-smartwatch',
    timestamp: '2024-03-01T09:30:00.000Z',
    ipHash: 'a8f5***12b',
    device: 'Mobile (Android)'
  },
  {
    id: 'click-02',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    productId: 'prod-t900-ultra-smartwatch',
    timestamp: '2024-03-01T11:45:00.000Z',
    ipHash: 'e7c1***94f',
    device: 'Desktop (Windows)'
  },
  {
    id: 'click-03',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    productId: 'prod-lenovo-lp40-pro',
    timestamp: '2024-03-02T14:10:00.000Z',
    ipHash: '3b92***81a',
    device: 'Mobile (iOS)'
  },
  {
    id: 'click-04',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    timestamp: '2024-03-03T18:25:00.000Z',
    ipHash: '9c4d***22e',
    device: 'Mobile (Android)'
  }
];

export const DEFAULT_AFFILIATE_COMMISSIONS: AffiliateCommission[] = [
  {
    id: 'comm-01',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    orderId: 'ord-8102',
    orderNumber: 'BZ-2026-8102',
    productId: 'prod-t900-ultra-smartwatch',
    productTitle: 'T900 Ultra 2 Big Display Bluetooth Calling Smartwatch',
    productImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80',
    quantity: 2,
    orderAmount: 2500,
    commissionAmount: 250,
    commissionRate: 10,
    status: 'Approved',
    approveAfter: '2024-02-25T12:00:00.000Z',
    approvedAt: '2024-02-25T12:00:00.000Z',
    orderDate: '2024-02-10T14:30:00.000Z',
    daysLeft: 0
  },
  {
    id: 'comm-02',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    orderId: 'ord-8291',
    orderNumber: 'BZ-2026-8291',
    productId: 'prod-lenovo-lp40-pro',
    productTitle: 'Lenovo LP40 Pro TWS Wireless Earbuds Bluetooth 5.1',
    productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
    quantity: 1,
    orderAmount: 890,
    commissionAmount: 89,
    commissionRate: 10,
    status: 'Approved',
    approveAfter: '2024-02-28T16:00:00.000Z',
    approvedAt: '2024-02-28T16:00:00.000Z',
    orderDate: '2024-02-13T16:20:00.000Z',
    daysLeft: 0
  },
  {
    id: 'comm-03',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    orderId: 'ord-8940',
    orderNumber: 'BZ-2026-8940',
    productId: 'prod-t900-ultra-smartwatch',
    productTitle: 'T900 Ultra 2 Big Display Bluetooth Calling Smartwatch',
    productImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80',
    quantity: 4,
    orderAmount: 5000,
    commissionAmount: 500,
    commissionRate: 10,
    status: 'Pending',
    // 8 days left from today
    approveAfter: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    daysLeft: 8
  },
  {
    id: 'comm-04',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    orderId: 'ord-9012',
    orderNumber: 'BZ-2026-9012',
    productId: 'prod-artisan-panjabi',
    productTitle: 'Exclusive Royal Silk Embroidered Traditional Panjabi',
    productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
    quantity: 2,
    orderAmount: 6500,
    commissionAmount: 780, // 12% category rate
    commissionRate: 12,
    status: 'Pending',
    // 12 days left from today
    approveAfter: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    daysLeft: 12
  },
  {
    id: 'comm-05',
    affiliateId: 'aff-tanvir-01',
    affiliateCode: 'AFF-DEMO2026',
    orderId: 'ord-8600',
    orderNumber: 'BZ-2026-8600',
    productId: 'prod-lenovo-lp40-pro',
    productTitle: 'Lenovo LP40 Pro TWS Wireless Earbuds Bluetooth 5.1',
    productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
    quantity: 1,
    orderAmount: 890,
    commissionAmount: 89,
    commissionRate: 10,
    status: 'Cancelled',
    approveAfter: '2024-02-20T10:00:00.000Z',
    orderDate: '2024-02-05T10:00:00.000Z',
    daysLeft: 0
  }
];

export const DEFAULT_AFFILIATE_WITHDRAWALS: AffiliateWithdrawal[] = [
  {
    id: 'with-01',
    affiliateId: 'aff-tanvir-01',
    affiliateName: 'Tanvir Ahmed',
    affiliateCode: 'AFF-DEMO2026',
    payoutMethod: 'bKash',
    payoutAccount: '01719887766',
    amount: 3500,
    status: 'Paid',
    requestedAt: '2024-02-28T09:00:00.000Z',
    processedAt: '2024-02-28T14:30:00.000Z',
    txnId: 'BK92L0P1X'
  },
  {
    id: 'with-02',
    affiliateId: 'aff-tanvir-01',
    affiliateName: 'Tanvir Ahmed',
    affiliateCode: 'AFF-DEMO2026',
    payoutMethod: 'bKash',
    payoutAccount: '01719887766',
    amount: 1200,
    status: 'Pending',
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const DEFAULT_AFFILIATE_FRAUD_ALERTS: AffiliateFraudAlert[] = [
  {
    id: 'fraud-01',
    affiliateId: 'aff-rahim-03',
    affiliateName: 'Rahim Content Creator',
    type: 'HIGH_IP_CLICKS',
    severity: 'HIGH',
    description: 'Detected 420 clicks from identical IP hash (103.204.***) within 15 minutes without any conversions.',
    timestamp: '2024-03-01T15:20:00.000Z',
    resolved: false
  },
  {
    id: 'fraud-02',
    affiliateId: 'aff-tanvir-01',
    affiliateName: 'Tanvir Ahmed',
    type: 'SELF_ORDER_ATTEMPT',
    severity: 'LOW',
    description: 'System automatically blocked commission self-attribution attempt on buyer account matching affiliate phone.',
    timestamp: '2024-02-22T11:05:00.000Z',
    resolved: true
  }
];
