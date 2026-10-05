export type Role = 'CUSTOMER' | 'ADMIN' | 'SELLER' | 'SUB_AGENT';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Returned'
  | 'Cancelled';

export type PaymentMethod =
  | 'COD'
  | 'bKash'
  | 'Nagad'
  | 'Rocket'
  | 'SSLCommerz'
  | string;

export type GatewayAccountType = 'Personal' | 'Agent' | 'Merchant' | 'Payment';

export interface PaymentGatewayConfig {
  id: string;
  name: string; // e.g. "bKash", "Nagad", "Rocket", "Upay", "Visa", "Mastercard", "PayPal", "Stripe", "Debit Card"
  type: GatewayAccountType; // "Personal", "Agent", "Merchant"
  accountNumber: string; // e.g. "01712-345678" or "Merchant / API ID"
  instructions: string; // e.g. "Send Money (Personal) to this number and provide your Transaction ID"
  isActive: boolean;
  badge?: string; // e.g. "10% Cashback" or "Instant"
  logoUrl?: string; // Payment gateway brand logo URL
}

export interface FooterFeature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface CourierApiConfig {
  steadfastApiKey?: string;
  steadfastSecretKey?: string;
  steadfastEnvironment?: 'sandbox' | 'production';
  pathaoClientId?: string;
  pathaoClientSecret?: string;
  pathaoStoreId?: string;
}

export interface BkashApiConfig {
  appKey?: string;
  appSecret?: string;
  username?: string;
  password?: string;
  merchantNumber?: string;
  environment?: 'sandbox' | 'live';
}

export interface NagadApiConfig {
  merchantId?: string;
  merchantNumber?: string;
  publicKey?: string;
  privateKey?: string;
  environment?: 'sandbox' | 'live';
}

export interface MarketplaceSettings {
  storeName: string;
  siteLogoUrl?: string;
  supportPhone: string;
  supportEmail: string;
  helplineNotice: string;
  officeAddress: string;
  isAddToCartEnabled?: boolean;
  isBuyNowEnabled?: boolean;
  isCodEnabled?: boolean;
  whatsappNumber?: string;
  whatsappGreeting?: string;
  flashSaleHoursLeft?: number;
  flashSaleMinutesLeft?: number;
  codInstructions?: string;
  productApprovalRequired?: boolean;
  courierConfig?: CourierApiConfig;
  bkashConfig?: BkashApiConfig;
  nagadConfig?: NagadApiConfig;
  footerLinks?: { label: string; url: string }[];
  deliveryPartners?: DeliveryPartner[];
  footerFeatures?: FooterFeature[];
  aboutUsContent?: string;
  privacyPolicyContent?: string;
  termsConditionsContent?: string;
  careersContent?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FLAT';
  discountValue: number;
  minSpend?: number;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface User {
  id: string;
  customerId?: string; // Unique 8-digit QA Customer ID (e.g. QA-48291048)
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string;
  address?: ShippingAddress;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  iconName: string;
  image?: string;
  commission?: number;
  subcategories?: {
    id: string;
    name: string;
    nameBn: string;
    slug: string;
  }[];
}

export interface ProductMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  isThumbnail?: boolean;
  alt?: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Color" or "Size"
  value: string; // e.g. "Space Black" or "XL"
  priceDiff?: number;
  stock: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  userCity: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId?: string;
  status?: 'ACTIVE' | 'PENDING_REVIEW' | 'INACTIVE' | 'REJECTED';
  title: string;
  titleBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  price: number; // in BDT ৳
  originalPrice: number;
  discountPercent: number;
  stock: number;
  brand: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSaleEnd?: string; // ISO date string
  isSponsored?: boolean; // When active sponsored ad campaign exists
  sponsoredBid?: number; // Active CPC bid for ranking boost
  tags?: string[];
  warranty?: string;
  videoUrl?: string;
  specifications: Record<string, string>;
  media: ProductMedia[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variantId?: string;
  variantName?: string;
  variantValue?: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thanaCity: string;
  addressLine: string;
  deliveryInstruction?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  sellerId?: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variantName?: string;
  variantValue?: string;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
  completed: boolean;
}

export interface SubOrder {
  id: string;
  sellerId: string;
  shopName: string;
  items: OrderItem[];
  subtotal: number;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courierPartner?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. BZ-2026-10482
  userId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  items: OrderItem[];
  subOrders?: SubOrder[];
  trackingNumber: string;
  courierPartner?: string;
  transactionId?: string;
  senderNumber?: string;
  trackingLogs?: OrderTrackingStep[];
  createdAt: string;
  deliveredAt?: string;
  returnWindowEndsAt?: string; // 7 days after deliveredAt
  returnRequested?: boolean;
  returnReason?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  badge?: string;
  linkUrl: string;
  ctaText: string;
  categoryId?: string; // Optional: Link banner to specific category (or 'all')
  type?: 'slider' | 'bottom'; // 'slider' is default (top slider)
}

export interface FlashSaleItem {
  product: Product;
  claimedPercent: number; // e.g. 68%
  totalQuota: number;
}

export interface AudienceLead {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  source: string; // e.g., 'Footer Deals Newsletter', 'Product Buy Intent', 'Flash Sale Alert', 'Direct Admin Entry'
  productTitle?: string;
  note?: string;
  status?: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';
  createdAt: string;
}

export interface SubAgent {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'SUB_AGENT';
  permissions: {
    canManageOrders: boolean;
    canVerifyPayments: boolean;
    canLiveChat: boolean;
    canModerateReviews: boolean;
  };
  isActive: boolean;
  createdAt: string;
}

export interface LiveChatMessage {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  message: string;
  reply?: string;
  repliedBy?: string;
  repliedAt?: string;
  status: 'Open' | 'Resolved';
  timestamp: string;
}

export type SellerStatus = 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
export type PayoutMethod = 'bKash' | 'Nagad' | 'Bank';
export type WithdrawalStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected';

export interface Seller {
  id: string;
  sellerIdNumber?: string; // Unique 8-digit QA Seller ID (e.g. QA-SL-82910482)
  userId: string;
  shopName: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  phone: string;
  email: string;
  shopAddress: string;
  nidTradeLicense?: string; // Doc URL
  status: SellerStatus;
  payoutMethod: PayoutMethod;
  payoutAccount: string; // e.g. "01712345678" or Bank Account Number / Branch
  commissionOverride?: number; // e.g. 5 for 5%
  rating: number; // e.g. 4.9
  followerCount: number;
  joinedDate: string;
}

export interface SellerWallet {
  id: string;
  sellerId: string;
  totalIncome: number;
  totalCommission: number;
  netEarnings: number;
  availableBalance: number;
  adBalance?: number; // Dedicated funds for running sponsored ads and search ranking boost
  pendingBalance: number; // Held during 7-day return window
  withdrawnAmount: number;
  updatedAt: string;
}

export interface SellerTransaction {
  id: string;
  sellerId: string;
  orderId?: string;
  amount: number;
  commission: number;
  netAmount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  status: 'Pending' | 'Available' | 'Withdrawn';
  availableAt?: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  sellerId: string;
  shopName: string;
  amount: number;
  payoutMethod: PayoutMethod;
  accountDetails: string;
  status: WithdrawalStatus;
  rejectReason?: string;
  processedAt?: string;
  createdAt: string;
}

export interface SellerNotification {
  id: string;
  sellerId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'STOCK' | 'PRODUCT_STATUS' | 'WITHDRAWAL' | 'REVIEW';
  isRead: boolean;
  createdAt: string;
}

export interface ProductQnA {
  id: string;
  productId: string;
  productTitle: string;
  sellerId: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  answeredAt?: string;
  createdAt: string;
}

export interface SellerPromotion {
  id: string;
  sellerId: string;
  title: string;
  discountPercent: number;
  productIds: string[];
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
}

export interface SellerSalesReportItem {
  productId: string;
  title: string;
  image: string;
  sku: string;
  views: number;
  unitsSold: number;
  revenue: number;
  returns: number;
  rating: number;
}

export interface SponsoredAdCampaign {
  id: string;
  sellerId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  dailyBudget: number; // in BDT ৳
  bidAmount: number; // BDT per click (e.g., 1.50)
  biddingType: 'AUTO' | 'MANUAL';
  targetKeywords: string[];
  negativeKeywords?: string[];
  status: 'ACTIVE' | 'PAUSED' | 'ENDED';
  impressions: number; // Real-time views count
  clicks: number; // Real-time clicks count
  spend: number; // Total money spent in BDT
  salesGenerated: number; // Revenue generated in BDT
  ordersCount: number; // Total converted orders
  roas: number; // Return on Ad Spend (salesGenerated / spend)
  createdAt: string;
  startedAt?: string;
}

export interface SellerDepositRequest {
  id: string;
  sellerId: string;
  sellerShopName: string;
  sellerPhone: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer';
  senderNumber: string;
  trxId: string;
  notes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface AdminAdSettings {
  cpmRate: number; // in BDT per 1,000 impressions (e.g., 200 = ৳200 / 1000 imp)
  bkashNumber: string;
  bkashType: 'Personal' | 'Merchant';
  nagadNumber: string;
  nagadType: 'Personal' | 'Merchant';
  rocketNumber: string;
  bankDetails: string;
  depositNotice: string;
}

