export interface CourierField {
  key: string;
  label: string;
  placeholder: string;
  secret?: boolean;
  defaultValue?: string;
}

export interface CourierDefinition {
  id: string;
  name: string;
  bnName: string;
  category: 'domestic' | 'international';
  prefix: string;
  coverage: string;
  logoUrl?: string;
  portalUrl: string;
  trackingUrl: (code: string) => string;
  fields: CourierField[];
}

export const ALL_COURIERS: CourierDefinition[] = [
  // ================= 19 BANGLADESH DOMESTIC COURIERS =================
  {
    id: 'sundarban',
    name: 'Sundarban Courier Service',
    bnName: 'সুন্দরবন কুরিয়ার সার্ভিস',
    category: 'domestic',
    prefix: 'SNDB',
    coverage: '৬৪ জেলা ও সকল উপজেলা শাখা নেটওয়ার্ক (Nationwide)',
    portalUrl: 'https://sundarbancourierltd.com/',
    trackingUrl: (code) => `https://sundarbancourierltd.com/?cn=${code}`,
    fields: [
      { key: 'SUNDARBAN_API_KEY', label: 'Sundarban API Key', placeholder: 'sndb_live_api_key_xxxxxxxx' },
      { key: 'SUNDARBAN_MERCHANT_CODE', label: 'Merchant Branch Code', placeholder: 'SNDB-DHK-001' },
      { key: 'SUNDARBAN_API_URL', label: 'API Base URL', placeholder: 'https://api.sundarbancourierltd.com/v1', defaultValue: 'https://api.sundarbancourierltd.com/v1' }
    ]
  },
  {
    id: 'steadfast',
    name: 'Steadfast Courier',
    bnName: 'স্টেডফাস্ট কুরিয়ার',
    category: 'domestic',
    prefix: 'STDF',
    coverage: '৬৪ জেলা ডোরস্টেপ হোম ডেলিভারি ও দ্রুততম ক্যাশ অন ডেলিভারি (COD)',
    portalUrl: 'https://portal.steadfast.com.bd/',
    trackingUrl: (code) => `https://steadfast.com.bd/t/${code}`,
    fields: [
      { key: 'STEADFAST_API_KEY', label: 'Steadfast API Key', placeholder: 'sf_live_key_xxxxxxxx', secret: true },
      { key: 'STEADFAST_SECRET_KEY', label: 'Steadfast Secret Key', placeholder: 'sf_secret_xxxxxxxx', secret: true },
      { key: 'STEADFAST_BASE_URL', label: 'API Base URL', placeholder: 'https://portal.steadfast.com.bd/api/v1', defaultValue: 'https://portal.steadfast.com.bd/api/v1' }
    ]
  },
  {
    id: 'pathao',
    name: 'Pathao Courier',
    bnName: 'পাঠাও কুরিয়ার',
    category: 'domestic',
    prefix: 'PTHO',
    coverage: 'দেশজুড়ে সুপারফাস্ট রাইডার পিকআপ ও ডোরস্টেপ ডেলিভারি',
    portalUrl: 'https://merchant.pathao.com/',
    trackingUrl: (code) => `https://merchant.pathao.com/tracking?consignment_id=${code}`,
    fields: [
      { key: 'PATHAO_CLIENT_ID', label: 'Pathao Client ID', placeholder: 'pathao_client_id_xxxx' },
      { key: 'PATHAO_CLIENT_SECRET', label: 'Pathao Client Secret', placeholder: 'pathao_secret_xxxx', secret: true },
      { key: 'PATHAO_USERNAME', label: 'Pathao Merchant Email / Phone', placeholder: 'merchant@domain.com' },
      { key: 'PATHAO_PASSWORD', label: 'Pathao Account Password', placeholder: '••••••••', secret: true },
      { key: 'PATHAO_STORE_ID', label: 'Pathao Store / Warehouse ID', placeholder: 'STORE-12948' }
    ]
  },
  {
    id: 'paperfly',
    name: 'Paperfly',
    bnName: 'পেপারফ্লাই কুরিয়ার',
    category: 'domestic',
    prefix: 'PFLY',
    coverage: 'রিমোট ইউনিয়ন ও ভিলেজ লেভেল পয়েন্ট-টু-পয়েন্ট ডেলিভারি',
    portalUrl: 'https://paperfly.com.bd/',
    trackingUrl: (code) => `https://paperfly.com.bd/tracking.php?orderId=${code}`,
    fields: [
      { key: 'PAPERFLY_KEY', label: 'Paperfly API Key', placeholder: 'paperfly_api_key_xxxx', secret: true },
      { key: 'PAPERFLY_USERNAME', label: 'Paperfly Username', placeholder: 'merchant_username' },
      { key: 'PAPERFLY_PASSWORD', label: 'Paperfly Password', placeholder: '••••••••', secret: true }
    ]
  },
  {
    id: 'redx',
    name: 'RedX',
    bnName: 'রেডএক্স ডেলিভারি',
    category: 'domestic',
    prefix: 'REDX',
    coverage: 'ই-কমার্স স্পেশালাইজড টেক-বেইজড এক্সপ্রেস ডেলিভারি',
    portalUrl: 'https://redx.com.bd/',
    trackingUrl: (code) => `https://redx.com.bd/track/${code}`,
    fields: [
      { key: 'REDX_API_KEY', label: 'RedX Secret Token', placeholder: 'Bearer redx_token_xxxx', secret: true },
      { key: 'REDX_BASE_URL', label: 'RedX API Base URL', placeholder: 'https://openapi.redx.com.bd/v1.0.0-beta', defaultValue: 'https://openapi.redx.com.bd/v1.0.0-beta' }
    ]
  },
  {
    id: 'ecourier',
    name: 'eCourier',
    bnName: 'ই-কুরিয়ার',
    category: 'domestic',
    prefix: 'ECBD',
    coverage: 'পার্সেল ভেরিফিকেশন, ওয়ান-টাইম পাসওয়ার্ড ও পার্সেল রিটার্ন ম্যানেজমেন্ট',
    portalUrl: 'https://ecourier.com.bd/',
    trackingUrl: (code) => `https://ecourier.com.bd/track/?ecr=${code}`,
    fields: [
      { key: 'ECOURIER_API_KEY', label: 'eCourier API Key', placeholder: 'ecr_api_key_xxxx', secret: true },
      { key: 'ECOURIER_API_SECRET', label: 'API Secret', placeholder: 'ecr_secret_xxxx', secret: true },
      { key: 'ECOURIER_USER_ID', label: 'User / Merchant ID', placeholder: 'EC-USER-9921' }
    ]
  },
  {
    id: 'deliverytiger',
    name: 'Delivery Tiger',
    bnName: 'ডেলিভারি টাইগার',
    category: 'domestic',
    prefix: 'DTGR',
    coverage: 'দ্রুততম পেমেন্ট ক্লিয়ারিং ও কম মূল্যে হোম ডেলিভারি',
    portalUrl: 'https://deliverytiger.com.bd/',
    trackingUrl: (code) => `https://deliverytiger.com.bd/track/${code}`,
    fields: [
      { key: 'DELIVERY_TIGER_API_KEY', label: 'Delivery Tiger API Key', placeholder: 'dt_key_xxxx', secret: true },
      { key: 'DELIVERY_TIGER_SECRET', label: 'Delivery Tiger Secret', placeholder: 'dt_secret_xxxx', secret: true }
    ]
  },
  {
    id: 'ajr',
    name: 'AJR Parcel & Courier',
    bnName: 'এজেআর পার্সেল ও কুরিয়ার',
    category: 'domestic',
    prefix: 'AJRP',
    coverage: 'উপজেলা ও জেলা পর্যায়ে নিরাপদ বড় পার্সেল ও কাভার্ড ভ্যান সার্ভিস',
    portalUrl: 'https://ajrcourier.com/',
    trackingUrl: (code) => `https://ajrcourier.com/track?id=${code}`,
    fields: [
      { key: 'AJR_API_KEY', label: 'AJR API Key', placeholder: 'ajr_api_key_xxxx' },
      { key: 'AJR_CLIENT_ID', label: 'AJR Merchant Client ID', placeholder: 'AJR-MERCHANT-01' }
    ]
  },
  {
    id: 'janani',
    name: 'Janani Express',
    bnName: 'জননী এক্সপ্রেস পার্সেল সার্ভিস',
    category: 'domestic',
    prefix: 'JNNI',
    coverage: 'সারাদেশে বিশ্বস্ত বুকিং ও ট্র্যাকিং পার্সেল সার্ভিস',
    portalUrl: 'https://jananiexpress.com/',
    trackingUrl: (code) => `https://jananiexpress.com/tracking?ref=${code}`,
    fields: [
      { key: 'JANANI_API_KEY', label: 'Janani Express API Key', placeholder: 'janani_key_xxxx' },
      { key: 'JANANI_BRANCH_CODE', label: 'Branch Code', placeholder: 'JNNI-DHK-CENTRAL' }
    ]
  },
  {
    id: 'karatoa',
    name: 'Karatoa Courier Service',
    bnName: 'করতোয়া কুরিয়ার সার্ভিস',
    category: 'domestic',
    prefix: 'KRTO',
    coverage: 'উত্তরবঙ্গসহ সারাদেশে শক্তিশালী শাখা ও দ্রুততম পার্সেল নেটওয়ার্ক',
    portalUrl: 'https://karatoacourier.com/',
    trackingUrl: (code) => `https://karatoacourier.com/track/${code}`,
    fields: [
      { key: 'KARATOA_API_KEY', label: 'Karatoa API Key', placeholder: 'krto_api_key_xxxx' },
      { key: 'KARATOA_MERCHANT_ID', label: 'Merchant ID', placeholder: 'KRTO-MERCHANT-88' }
    ]
  },
  {
    id: 'shodagor',
    name: 'Shodagor Express',
    bnName: 'সওদাগর এক্সপ্রেস',
    category: 'domestic',
    prefix: 'SHDG',
    coverage: 'হোলসেল ও ই-কমার্স বাল্ক ডেলিভারি লজিস্টিকস',
    portalUrl: 'https://shodagorexpress.com/',
    trackingUrl: (code) => `https://shodagorexpress.com/track/${code}`,
    fields: [
      { key: 'SHODAGOR_API_KEY', label: 'Shodagor API Key', placeholder: 'shodagor_api_key_xxxx' },
      { key: 'SHODAGOR_CLIENT_ID', label: 'Client ID', placeholder: 'SHDG-CLIENT-101' }
    ]
  },
  {
    id: 'continental',
    name: 'Continental Courier',
    bnName: 'কন্টিনেন্টাল কুরিয়ার',
    category: 'domestic',
    prefix: 'CNTL',
    coverage: 'দ্রুত এক্সপ্রেস পার্সেল ও কর্পোরেট ডেলিভারি সেবা',
    portalUrl: 'https://continentalcourierbd.com/',
    trackingUrl: (code) => `https://continentalcourierbd.com/track?cn=${code}`,
    fields: [
      { key: 'CONTINENTAL_API_KEY', label: 'Continental API Key', placeholder: 'cntl_api_key_xxxx' },
      { key: 'CONTINENTAL_CODE', label: 'Agency / Merchant Code', placeholder: 'CNTL-AGENCY-09' }
    ]
  },
  {
    id: 'qexpress',
    name: 'Q-Express',
    bnName: 'কিউ-এক্সপ্রেস লজিস্টিকস',
    category: 'domestic',
    prefix: 'QEXP',
    coverage: 'ঢাকা ও প্রধান শহরে সেম-ডে এবং নেক্সট-ডে ডেলিভারি',
    portalUrl: 'https://qexpress.com.bd/',
    trackingUrl: (code) => `https://qexpress.com.bd/track/${code}`,
    fields: [
      { key: 'QEXPRESS_API_KEY', label: 'Q-Express API Key', placeholder: 'qexp_api_key_xxxx' },
      { key: 'QEXPRESS_MERCHANT_ID', label: 'Merchant ID', placeholder: 'QEXP-MER-004' }
    ]
  },
  {
    id: 'sonar',
    name: 'Sonar Courier Service',
    bnName: 'সোনার কুরিয়ার সার্ভিস',
    category: 'domestic',
    prefix: 'SONR',
    coverage: 'নিরাপদ পরিবহন ও বিশ্বস্ত দেশজুড়ে ডেলিভারি',
    portalUrl: 'https://sonarcourier.com/',
    trackingUrl: (code) => `https://sonarcourier.com/track?consignment=${code}`,
    fields: [
      { key: 'SONAR_API_KEY', label: 'Sonar Courier API Key', placeholder: 'sonar_api_key_xxxx' },
      { key: 'SONAR_ACCOUNT_NO', label: 'Merchant Account No', placeholder: 'SONAR-ACC-3301' }
    ]
  },
  {
    id: 'courierbd',
    name: 'CourierBD',
    bnName: 'কুরিয়ার বিডি',
    category: 'domestic',
    prefix: 'CRBD',
    coverage: 'স্মার্ট পার্সেল এগ্রিগেটর ও মাল্টি-কুরিয়ার ট্র্যাকিং',
    portalUrl: 'https://courierbd.com/',
    trackingUrl: (code) => `https://courierbd.com/track/${code}`,
    fields: [
      { key: 'COURIERBD_API_KEY', label: 'CourierBD API Key', placeholder: 'crbd_api_key_xxxx' },
      { key: 'COURIERBD_SECRET', label: 'Secret Key', placeholder: 'crbd_secret_xxxx', secret: true }
    ]
  },
  {
    id: 'bdparcel',
    name: 'Bangladesh Parcel Service',
    bnName: 'বাংলাদেশ পার্সেল সার্ভিস',
    category: 'domestic',
    prefix: 'BDPS',
    coverage: 'সারাদেশে নির্ভরযোগ্য পার্সেল সার্ভিস ও গুদামজাতকরণ',
    portalUrl: 'https://bangladeshparcel.com/',
    trackingUrl: (code) => `https://bangladeshparcel.com/track/${code}`,
    fields: [
      { key: 'BD_PARCEL_API_KEY', label: 'BD Parcel API Key', placeholder: 'bdps_api_key_xxxx' },
      { key: 'BD_PARCEL_MERCHANT_CODE', label: 'Merchant Branch Code', placeholder: 'BDPS-CODE-01' }
    ]
  },
  {
    id: 'dolphin',
    name: 'Dolphin Courier',
    bnName: 'ডলফিন কুরিয়ার সার্ভিস',
    category: 'domestic',
    prefix: 'DLPH',
    coverage: 'সরাসরি ডোর ডেলিভারি ও দ্রুত ডকুমেন্ট/পার্সেল পরিবহন',
    portalUrl: 'https://dolphincourier.com/',
    trackingUrl: (code) => `https://dolphincourier.com/track?id=${code}`,
    fields: [
      { key: 'DOLPHIN_API_KEY', label: 'Dolphin API Key', placeholder: 'dolphin_key_xxxx' },
      { key: 'DOLPHIN_CLIENT_ID', label: 'Client ID', placeholder: 'DLPH-CL-820' }
    ]
  },
  {
    id: 'apex',
    name: 'Apex Courier',
    bnName: 'এপেক্স কুরিয়ার',
    category: 'domestic',
    prefix: 'APEX',
    coverage: 'ই-কমার্স ডেলিভারি সল্যুশন ও ক্যাশ অন ডেলিভারি সাপোর্ট',
    portalUrl: 'https://apexcourier.com.bd/',
    trackingUrl: (code) => `https://apexcourier.com.bd/track/${code}`,
    fields: [
      { key: 'APEX_COURIER_API_KEY', label: 'Apex Courier API Key', placeholder: 'apex_key_xxxx' },
      { key: 'APEX_MERCHANT_ID', label: 'Merchant ID', placeholder: 'APEX-MER-441' }
    ]
  },
  {
    id: 'starline',
    name: 'Starline Courier',
    bnName: 'স্টারলাইন কুরিয়ার',
    category: 'domestic',
    prefix: 'STRL',
    coverage: 'দক্ষিণ-পূর্ব ও চট্টগ্রাম-সিলেট জোনসহ দ্রুত পরিবহন',
    portalUrl: 'https://starlinecourier.com/',
    trackingUrl: (code) => `https://starlinecourier.com/track?cn=${code}`,
    fields: [
      { key: 'STARLINE_API_KEY', label: 'Starline API Key', placeholder: 'strl_api_key_xxxx' },
      { key: 'STARLINE_CODE', label: 'Booking Code', placeholder: 'STRL-DHK-MAIN' }
    ]
  },

  // ================= 6 INTERNATIONAL COURIERS =================
  {
    id: 'dhl',
    name: 'DHL Express',
    bnName: 'ডিএইচএল এক্সপ্রেস',
    category: 'international',
    prefix: 'DHL',
    coverage: '২২০+ দেশ ও অঞ্চলে প্রিমিয়াম আন্তর্জাতিক বিমান ডাক ও পার্সেল শিপমেন্ট',
    portalUrl: 'https://developer.dhl.com/',
    trackingUrl: (code) => `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${code}`,
    fields: [
      { key: 'DHL_API_KEY', label: 'DHL Express API Key', placeholder: 'dhl_api_key_xxxxxxxx', secret: true },
      { key: 'DHL_API_SECRET', label: 'DHL Secret Key', placeholder: 'dhl_secret_xxxxxxxx', secret: true },
      { key: 'DHL_ACCOUNT_NUMBER', label: 'DHL Shipper Account No', placeholder: '123456789' }
    ]
  },
  {
    id: 'fedex',
    name: 'FedEx',
    bnName: 'ফেডএক্স এক্সপ্রেস',
    category: 'international',
    prefix: 'FDX',
    coverage: '২২০+ দেশ ও অঞ্চলে আন্তর্জাতিক গ্লোবাল প্রায়োরিটি শিপমেন্ট',
    portalUrl: 'https://developer.fedex.com/',
    trackingUrl: (code) => `https://www.fedex.com/fedextrack/?trknbr=${code}`,
    fields: [
      { key: 'FEDEX_API_KEY', label: 'FedEx API Key (Client ID)', placeholder: 'fedex_key_xxxxxxxx', secret: true },
      { key: 'FEDEX_SECRET_KEY', label: 'FedEx Secret Key', placeholder: 'fedex_secret_xxxxxxxx', secret: true },
      { key: 'FEDEX_ACCOUNT_NUMBER', label: 'FedEx Account Number', placeholder: '987654321' },
      { key: 'FEDEX_METER_NUMBER', label: 'FedEx Meter Number', placeholder: 'MTR-10294' }
    ]
  },
  {
    id: 'ups',
    name: 'UPS',
    bnName: 'ইউপিএস (United Parcel Service)',
    category: 'international',
    prefix: 'UPS',
    coverage: 'বিশ্বব্যাপী আন্তর্জাতিক ই-কমার্স ও লজিস্টিকস পার্সেল নেটওয়ার্ক',
    portalUrl: 'https://developer.ups.com/',
    trackingUrl: (code) => `https://www.ups.com/track?tracknum=${code}`,
    fields: [
      { key: 'UPS_ACCESS_KEY', label: 'UPS Access License Key', placeholder: 'ups_access_key_xxxx', secret: true },
      { key: 'UPS_USER_ID', label: 'UPS Username / ID', placeholder: 'ups_merchant_id' },
      { key: 'UPS_PASSWORD', label: 'UPS Password', placeholder: '••••••••', secret: true },
      { key: 'UPS_SHIPPER_NUMBER', label: 'UPS Shipper Account No', placeholder: 'SHP-99210' }
    ]
  },
  {
    id: 'aramex',
    name: 'Aramex',
    bnName: 'অ্যারামেক্স গ্লোবাল লজিস্টিকস',
    category: 'international',
    prefix: 'ARMX',
    coverage: 'মধ্যপ্রাচ্য, এশিয়া, ইউরোপসহ আন্তর্জাতিক পার্সেল ও ই-কমার্স শিপিং',
    portalUrl: 'https://www.aramex.com/developer',
    trackingUrl: (code) => `https://www.aramex.com/track/results?ShipmentNumber=${code}`,
    fields: [
      { key: 'ARAMEX_USERNAME', label: 'Aramex Account Email/User', placeholder: 'user@company.com' },
      { key: 'ARAMEX_PASSWORD', label: 'Aramex API Password', placeholder: '••••••••', secret: true },
      { key: 'ARAMEX_ACCOUNT_NUMBER', label: 'Account Number', placeholder: 'ARMX-ACC-1122' },
      { key: 'ARAMEX_ACCOUNT_PIN', label: 'Account PIN', placeholder: '1234', secret: true }
    ]
  },
  {
    id: 'ems',
    name: 'EMS / Bangladesh Post',
    bnName: 'ইএমএস / বাংলাদেশ ডাক বিভাগ',
    category: 'international',
    prefix: 'EMS',
    coverage: 'বাংলাদেশ সরকারের ডাক বিভাগের মাধ্যমে সুলভ মূল্যে আন্তর্জাতিক পার্সেল',
    portalUrl: 'http://bdpost.portal.gov.bd/',
    trackingUrl: (code) => `http://bdpost.portal.gov.bd/site/page/tracking?barcode=${code}`,
    fields: [
      { key: 'EMS_BD_POST_API_KEY', label: 'EMS BD Post API Key', placeholder: 'ems_bdpost_key_xxxx' },
      { key: 'EMS_POST_CODE', label: 'Sender Postal / Hub Code', placeholder: 'DHAKA-GPO-1000' }
    ]
  },
  {
    id: 'transair',
    name: 'Transair Express',
    bnName: 'ট্রান্সএয়ার এক্সপ্রেস',
    category: 'international',
    prefix: 'TRA',
    coverage: 'বাংলাদেশ থেকে ২২০+ দেশে আকাশপথে আন্তর্জাতিক এক্সপ্রেস ডেলিভারি',
    portalUrl: 'https://transairexpress.com/',
    trackingUrl: (code) => `https://transairexpress.com/tracking?awb=${code}`,
    fields: [
      { key: 'TRANSAIR_API_KEY', label: 'Transair API Key', placeholder: 'transair_key_xxxx' },
      { key: 'TRANSAIR_CLIENT_CODE', label: 'Transair Client / AWB Code', placeholder: 'TRA-DHK-99' }
    ]
  }
];

export function getCourierByName(name: string): CourierDefinition | undefined {
  if (!name) return undefined;
  const n = name.toLowerCase().trim();
  return ALL_COURIERS.find((c) => 
    c.name.toLowerCase() === n || 
    c.id.toLowerCase() === n ||
    n.includes(c.id.toLowerCase()) ||
    c.prefix.toLowerCase() === n
  );
}

export function generateCourierTrackingCode(courierName: string): string {
  const courier = getCourierByName(courierName);
  const prefix = courier ? courier.prefix : 'EXPR';
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}-${randomDigits}`;
}

export function getCourierTrackingUrl(trackingCode: string, courierName?: string): string {
  if (!trackingCode) return 'https://steadfast.com.bd/';
  
  if (courierName) {
    const courier = getCourierByName(courierName);
    if (courier) return courier.trackingUrl(trackingCode);
  }

  // Fallback by prefix
  const prefix = trackingCode.split('-')[0]?.toUpperCase();
  const matched = ALL_COURIERS.find((c) => c.prefix === prefix);
  if (matched) {
    return matched.trackingUrl(trackingCode);
  }

  return `https://steadfast.com.bd/t/${trackingCode}`;
}
