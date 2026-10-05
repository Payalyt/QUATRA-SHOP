import { PaymentGatewayConfig, MarketplaceSettings } from '../types/ecommerce';

export const DEFAULT_SETTINGS: MarketplaceSettings = {
  storeName: 'QUATRO',
  siteLogoUrl: 'https://i.postimg.cc/jjqqT7rs/QUATRO-wordmark-logo-design-2K-20260926210000.jpg',
  supportPhone: '16124',
  supportEmail: 'support@bazaarbd.com',
  helplineNotice: '24/7 Helpline & Support across all 64 Districts',
  officeAddress: 'Level 6, Navana Tower, Gulshan 1, Dhaka-1212, Bangladesh',
  isAddToCartEnabled: true,
  isBuyNowEnabled: true,
  whatsappNumber: '+8801712345678',
  whatsappGreeting: 'Hello QUATRO! I want to inquire about a product or my order.',
  flashSaleHoursLeft: 11,
  flashSaleMinutesLeft: 45,
  codInstructions: 'পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করুন। standard & 24h shipping available.',
  courierConfig: {
    steadfastApiKey: 'sf_api_live_982910482910',
    steadfastSecretKey: 'sf_secret_482910482910',
    steadfastEnvironment: 'sandbox',
    pathaoClientId: 'pth_client_81029384',
    pathaoClientSecret: 'pth_sec_92019201',
    pathaoStoreId: '10293'
  },
  bkashConfig: {
    appKey: 'bkash_app_key_8201928301',
    appSecret: 'bkash_app_secret_91029384',
    username: 'quatro_merchant_017',
    password: 'quatro_bkash_pass_2026',
    merchantNumber: '01713-445566',
    environment: 'sandbox'
  },
  nagadConfig: {
    merchantId: 'NAGAD_MCH_82910481',
    merchantNumber: '01922-334455',
    environment: 'sandbox'
  },
  footerLinks: [
    { label: 'About Us', url: '/about' },
    { label: 'Digital Bangladesh Vision', url: '/vision' },
    { label: 'Careers at QUATRO', url: '/careers' },
    { label: 'Terms & Conditions', url: '/terms' },
    { label: 'Privacy Policy', url: '/privacy' }
  ],
  deliveryPartners: [
    { id: 'p1', name: 'Pathao Express', logoUrl: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=100&auto=format&fit=crop&q=80' },
    { id: 'p2', name: 'RedX', logoUrl: 'https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?w=100&auto=format&fit=crop&q=80' },
    { id: 'p3', name: 'Paperfly', logoUrl: 'https://images.unsplash.com/photo-1586864387789-628af9fea93f?w=100&auto=format&fit=crop&q=80' },
    { id: 'p4', name: 'eCourier', logoUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=100&auto=format&fit=crop&q=80' }
  ],
  footerFeatures: [
    { id: 'f1', title: '100% Authentic', description: 'Genuine products with official warranty', iconName: 'ShieldCheck' },
    { id: 'f2', title: 'Nationwide Delivery', description: 'Fast shipping to all 64 districts in BD', iconName: 'Truck' },
    { id: 'f3', title: '7-Day Easy Return', description: 'Hassle-free doorstep pickup & refund', iconName: 'RotateCcw' },
    { id: 'f4', title: 'bKash & Cash on Delivery', description: 'Pay cash at doorstep or instant bKash', iconName: 'CreditCard' }
  ]
};

export const DEFAULT_COUPONS = [
  {
    id: 'cpn-1',
    code: 'EID2026',
    discountType: 'PERCENT' as const,
    discountValue: 10,
    minSpend: 1000,
    description: '10% Eid Discount on orders above ৳1,000',
    isActive: true
  },
  {
    id: 'cpn-2',
    code: 'DARAZBD10',
    discountType: 'PERCENT' as const,
    discountValue: 10,
    minSpend: 500,
    description: '10% Special Discount voucher',
    isActive: true
  },
  {
    id: 'cpn-3',
    code: 'SAVE200',
    discountType: 'FLAT' as const,
    discountValue: 200,
    minSpend: 1500,
    description: 'Flat ৳200 discount on orders above ৳1,500',
    isActive: true
  },
  {
    id: 'cpn-4',
    code: 'NEWUSER50',
    discountType: 'PERCENT' as const,
    discountValue: 15,
    minSpend: 800,
    description: '15% Welcome discount for new customers',
    isActive: true
  }
];

export const DEFAULT_GATEWAYS: PaymentGatewayConfig[] = [
  {
    id: 'gw-bkash-merchant',
    name: 'bKash (Merchant)',
    type: 'Merchant',
    accountNumber: '01713-445566',
    instructions: 'Instant automated checkout or Payment option using merchant code.',
    isActive: true,
    badge: '10% Cashback',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'gw-bkash-personal',
    name: 'bKash (Personal)',
    type: 'Personal',
    accountNumber: '01899-887766',
    instructions: 'Send Money to our official personal number. Include your order number in reference.',
    isActive: true,
    badge: 'Send Money',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'gw-nagad-personal',
    name: 'Nagad (Personal / Agent)',
    type: 'Personal',
    accountNumber: '01922-334455',
    instructions: 'Send Money to this Nagad personal wallet. Enter your TrxID after sending.',
    isActive: true,
    badge: 'Fast Pay',
    logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'gw-rocket-agent',
    name: 'Rocket (Agent)',
    type: 'Agent',
    accountNumber: '01788-990011-4',
    instructions: 'Cash In through any Rocket Agent. Provide last 4 digits of sender number.',
    isActive: true,
    badge: 'Agent Cash-in',
    logoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'gw-visa-mastercard',
    name: 'Visa / Mastercard / Debit Card',
    type: 'Merchant',
    accountNumber: 'SSLCOMMERZ-GATEWAY-2026',
    instructions: 'Pay securely using any Visa, Mastercard, DBBL Nexus, or local Debit & Credit card.',
    isActive: true,
    badge: '0% EMI Available',
    logoUrl: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'gw-stripe-card',
    name: 'Stripe (International Cards)',
    type: 'Merchant',
    accountNumber: 'acct_1QUATRO2026Stripe',
    instructions: 'Accepts Visa, Mastercard, American Express, and international cards with 3D Secure verification.',
    isActive: true,
    badge: 'Global Pay',
    logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'gw-paypal',
    name: 'PayPal Checkout',
    type: 'Merchant',
    accountNumber: 'payments@bazaarbd.com',
    instructions: 'Pay instantly with your PayPal balance or linked international bank account.',
    isActive: true,
    badge: 'USD / BDT',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_SUB_AGENTS = [
  {
    id: 'agent-1',
    name: 'Tanvir Hossain (Order Moderator)',
    email: 'agent@bazaarbd.com',
    password: 'agent',
    phone: '01719988776',
    role: 'SUB_AGENT' as const,
    permissions: {
      canManageOrders: true,
      canVerifyPayments: true,
      canLiveChat: true,
      canModerateReviews: true
    },
    isActive: true,
    createdAt: '2026-10-01, 10:00 AM'
  },
  {
    id: 'agent-2',
    name: 'Nusrat Jahan (Chat Support)',
    email: 'nusrat@bazaarbd.com',
    password: 'agent',
    phone: '01822334455',
    role: 'SUB_AGENT' as const,
    permissions: {
      canManageOrders: true,
      canVerifyPayments: false,
      canLiveChat: true,
      canModerateReviews: true
    },
    isActive: true,
    createdAt: '2026-10-02, 09:30 AM'
  }
];

export const DEFAULT_LIVE_CHATS = [
  {
    id: 'chat-1',
    customerName: 'Rayhan Ahmed',
    customerPhone: '01712345678',
    customerEmail: 'rayhan@bazaarbd.com',
    message: 'Hello, is standard delivery available in Dhanmondi today?',
    reply: 'Yes, Rayhan! Orders placed before 3 PM are dispatched for next-day hub delivery.',
    repliedBy: 'Tanvir Hossain (Agent)',
    repliedAt: '2026-10-02, 11:15 AM',
    status: 'Resolved' as const,
    timestamp: '2026-10-02, 11:02 AM'
  },
  {
    id: 'chat-2',
    customerName: 'Sabrina Mostafa',
    customerPhone: '01911223344',
    customerEmail: 'sabrina@gmail.com',
    message: 'I paid via bKash TrxID 9J4K82LA. Has my payment been approved?',
    status: 'Open' as const,
    timestamp: '2026-10-02, 02:40 PM'
  },
  {
    id: 'chat-3',
    customerName: 'Kamrul Hasan',
    customerPhone: '01855667788',
    customerEmail: 'kamrul@yahoo.com',
    message: 'Do you provide 7-day replacement warranty if the product size does not fit?',
    reply: 'Yes, you can request an easy 7-day replacement from your order dashboard!',
    repliedBy: 'Nusrat Jahan (Agent)',
    repliedAt: '2026-10-02, 04:10 PM',
    status: 'Resolved' as const,
    timestamp: '2026-10-02, 03:55 PM'
  }
];
