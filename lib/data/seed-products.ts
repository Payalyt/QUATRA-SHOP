import { Category, Product, Banner, Order } from '../types/ecommerce';

export const BANGLADESH_DIVISIONS = [
  {
    name: 'Dhaka',
    districts: ['Dhaka City', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 'Manikganj', 'Munshiganj', 'Narsingdi']
  },
  {
    name: 'Chattogram',
    districts: ['Chattogram City', "Cox's Bazar", 'Cumilla', 'Feni', 'Noakhali', 'Brahmanbaria', 'Chandpur']
  },
  {
    name: 'Sylhet',
    districts: ['Sylhet Sadar', 'Moulvibazar', 'Habiganj', 'Sunamganj']
  },
  {
    name: 'Rajshahi',
    districts: ['Rajshahi Sadar', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore', 'Chapai Nawabganj']
  },
  {
    name: 'Khulna',
    districts: ['Khulna Sadar', 'Jashore', 'Kushtia', 'Satkhira', 'Bagerhat', 'Jhenaidah']
  },
  {
    name: 'Barishal',
    districts: ['Barishal Sadar', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati', 'Barguna']
  },
  {
    name: 'Rangpur',
    districts: ['Rangpur Sadar', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Nilphamari', 'Thakurgaon']
  },
  {
    name: 'Mymensingh',
    districts: ['Mymensingh Sadar', 'Jamalpur', 'Netrokona', 'Sherpur']
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'cat-electronics',
    name: 'Electronic Devices',
    nameBn: 'ইলেকট্রনিক ডিভাইস',
    slug: 'electronic-devices',
    iconName: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    subcategories: [
      { id: 'sub-smartphones', name: 'Smartphones & 5G', nameBn: 'স্মার্টফোন ও ৫জি', slug: 'smartphones' },
      { id: 'sub-tablets', name: 'Tablets & iPads', nameBn: 'ট্যাবলেট ও আইপ্যাড', slug: 'tablets' },
      { id: 'sub-laptops', name: 'Laptops & MacBooks', nameBn: 'ল্যাপটপ ও ম্যাকবুক', slug: 'laptops' },
      { id: 'sub-smarttv', name: 'Smart Android TVs', nameBn: 'স্মার্ট অ্যান্ড্রয়েড টিভি', slug: 'smart-tv' }
    ]
  },
  {
    id: 'cat-accessories',
    name: 'Electronic Accessories',
    nameBn: 'ইলেকট্রনিক এক্সেসরিজ',
    slug: 'electronic-accessories',
    iconName: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    subcategories: [
      { id: 'sub-earbuds', name: 'TWS Wireless Earbuds', nameBn: 'টিডব্লিউএস ইয়ারবাডস', slug: 'wireless-earbuds' },
      { id: 'sub-powerbanks', name: 'Fast Power Banks', nameBn: 'পাওয়ার ব্যাংক', slug: 'power-banks' },
      { id: 'sub-smartwatches', name: 'Smartwatches & Bands', nameBn: 'স্মার্টওয়াচ', slug: 'smartwatches' },
      { id: 'sub-chargers', name: 'GaN Chargers & Cables', nameBn: 'চার্জার ও কেবল', slug: 'chargers' }
    ]
  },
  {
    id: 'cat-appliances',
    name: 'TV & Home Appliances',
    nameBn: 'টিভি ও হোম অ্যাপ্লায়েন্স',
    slug: 'home-appliances',
    iconName: 'Tv',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
    subcategories: [
      { id: 'sub-fridge', name: 'Inverter Refrigerators', nameBn: 'রেফ্রিজারেটর', slug: 'refrigerators' },
      { id: 'sub-ac', name: 'Split Air Conditioners', nameBn: 'এসি ও এয়ারকুলার', slug: 'air-conditioners' },
      { id: 'sub-blenders', name: 'Blenders & Grinders', nameBn: 'ব্লেন্ডার ও গ্রাইন্ডার', slug: 'blenders' },
      { id: 'sub-irons', name: 'Steam & Dry Irons', nameBn: 'আয়রন ও স্টিমার', slug: 'irons' }
    ]
  },
  {
    id: 'cat-men-fashion',
    name: "Men's Fashion",
    nameBn: 'পুরুষদের ফ্যাশন',
    slug: 'mens-fashion',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80',
    subcategories: [
      { id: 'sub-panjabi', name: 'Exclusive Panjabis & Kurtas', nameBn: 'এক্সক্লুসিভ পাঞ্জাবি', slug: 'panjabis' },
      { id: 'sub-tshirts', name: 'Polo & Casual T-Shirts', nameBn: 'টি-শার্ট ও পোলো', slug: 'tshirts' },
      { id: 'sub-denim', name: 'Stretch Jeans & Chinos', nameBn: 'জিন্স প্যান্ট', slug: 'jeans' },
      { id: 'sub-footwear', name: 'Formal & Casual Shoes', nameBn: 'লেদার জুতো ও লোফার', slug: 'mens-shoes' }
    ]
  },
  {
    id: 'cat-women-fashion',
    name: "Women's Fashion",
    nameBn: 'মহিলাদের ফ্যাশন',
    slug: 'womens-fashion',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    subcategories: [
      { id: 'sub-sarees', name: 'Traditional Jamdani & Silk', nameBn: 'ঐতিহ্যবাহী জামদানি ও সিল্ক', slug: 'sarees' },
      { id: 'sub-salwar', name: 'Three Piece & Kurtis', nameBn: 'থ্রি পিস ও কুর্তি', slug: 'three-piece' },
      { id: 'sub-handbags', name: 'Leather Bags & Purses', nameBn: 'হ্যান্ডব্যাগ ও পার্স', slug: 'handbags' },
      { id: 'sub-jewellery', name: 'Jewellery & Watches', nameBn: 'গহনা ও ঘড়ি', slug: 'jewellery' }
    ]
  },
  {
    id: 'cat-groceries',
    name: 'Bazaar Mart (Groceries)',
    nameBn: 'বাজার মার্ট (মুদি সামগ্রী)',
    slug: 'groceries-mart',
    iconName: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    subcategories: [
      { id: 'sub-spices', name: 'Radhuni Spices & Masala', nameBn: 'রাঁধুনী মসলা', slug: 'spices' },
      { id: 'sub-oil', name: 'Pure Mustard & Rice Bran Oil', nameBn: 'সরিষার তেল ও সয়াবিন', slug: 'edible-oil' },
      { id: 'sub-tea', name: 'Sylhet Special Tea', nameBn: 'সিলেটি চা পাতা', slug: 'tea-coffee' },
      { id: 'sub-dryfruits', name: 'Dates & Dry Fruits', nameBn: 'খেজুর ও বাদাম', slug: 'dry-fruits' }
    ]
  },
  {
    id: 'cat-beauty',
    name: 'Health & Beauty',
    nameBn: 'স্বাস্থ্য ও রূপচর্চা',
    slug: 'health-beauty',
    iconName: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    subcategories: [
      { id: 'sub-skincare', name: 'Korean Skincare & Serums', nameBn: 'কোরিয়ান স্কিনকেয়ার', slug: 'skincare' },
      { id: 'sub-haircare', name: 'Herbal Hair Oils & Shampoos', nameBn: 'হেয়ার অয়েল ও শ্যাম্পু', slug: 'haircare' },
      { id: 'sub-fragrance', name: 'Attar & French Perfumes', nameBn: 'আতোর ও সুগন্ধি', slug: 'perfumes' },
      { id: 'sub-grooming', name: 'Beard Trimmers & Shavers', nameBn: 'ট্রিমার ও শেভার', slug: 'trimmer' }
    ]
  },
  {
    id: 'cat-sports',
    name: 'Sports & Outdoors',
    nameBn: 'খেলাধুলা ও আউটডোর',
    slug: 'sports-outdoors',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
    subcategories: [
      { id: 'sub-cricket', name: 'Kashmir Willow Cricket Bats', nameBn: 'ক্রিকেট ব্যাট ও কিট', slug: 'cricket' },
      { id: 'sub-fitness', name: 'Gym Dumbbells & Resistance', nameBn: 'জিম ও ফিটনেস', slug: 'gym' },
      { id: 'sub-jerseys', name: 'Bangladesh Cricket Jerseys', nameBn: 'বিসিবি জার্সি', slug: 'jerseys' }
    ]
  }
];

export const HERO_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: '11.11 Mega Shopping Festival',
    subtitle: 'Up to 70% Off on Smartphones, Gadgets & Fashion with 0% EMI',
    imageUrl: '/images/hero_mega_deal_banner_1790874450965.jpg',
    badge: 'MEGA DEAL OF THE YEAR',
    linkUrl: '/search?sale=mega',
    ctaText: 'Shop Deals Now',
    type: 'slider'
  },
  {
    id: 'banner-2',
    title: 'Eid & Festive Luxe Collection',
    subtitle: 'Hand-woven Dhakai Jamdani Sarees, Semi-formal Panjabis & Leather Goods',
    imageUrl: '/images/hero_fashion_lifestyle_1790874464596.jpg',
    badge: 'NEW ARRIVALS 2026',
    linkUrl: '/search?category=mens-fashion',
    ctaText: 'Explore Collection',
    type: 'slider'
  },
  {
    id: 'banner-3',
    title: 'Next-Gen Smart Tech & Audio Fest',
    subtitle: 'Active Noise Cancelling TWS, AMOLED Smartwatches & GaN Quick Chargers',
    imageUrl: '/images/hero_gadgets_electronics_1790874480335.jpg',
    badge: 'OFFICIAL WARRANTY',
    linkUrl: '/search?category=electronic-accessories',
    ctaText: 'Discover Tech',
    type: 'slider'
  },
  {
    id: 'banner-4',
    title: 'Daraz Mart: Daily Essentials Fast Delivery',
    subtitle: 'Fresh Rajshahi Mangoes, Pure Mustard Oil, Sylhet Tea & Grocery Pantry',
    imageUrl: '/images/promo_grocery_daily_1790874494950.jpg',
    badge: 'SAME DAY IN DHAKA',
    linkUrl: '/search?category=groceries-mart',
    ctaText: 'Order Groceries',
    type: 'slider'
  },
  {
    id: 'bottom-banner-1',
    title: 'Pantry Essentials & Fresh Bazar',
    subtitle: 'Pure Mustard Oil, Spices & Tea with Same-Day Delivery',
    imageUrl: '/images/promo_grocery_daily_1790874494950.jpg',
    badge: 'Bazaar Mart',
    linkUrl: '/search?category=cat-groceries',
    categoryId: 'cat-groceries',
    ctaText: 'Shop Now',
    type: 'bottom'
  },
  {
    id: 'bottom-banner-2',
    title: 'Authentic Dhakai Jamdani & Panjabi',
    subtitle: 'Handloom Sarees, Jacquard Kurtas & Leather Shoes',
    imageUrl: '/images/hero_fashion_lifestyle_1790874464596.jpg',
    badge: 'Fashion',
    linkUrl: '/search?category=cat-women-fashion',
    categoryId: 'cat-women-fashion',
    ctaText: 'Explore Now',
    type: 'bottom'
  },
  {
    id: 'bottom-banner-3',
    title: 'Smart Audio, TWS & GaN Chargers',
    subtitle: 'Anker, Baseus & Kieslect with official warranty',
    imageUrl: '/images/hero_gadgets_electronics_1790874480335.jpg',
    badge: 'Official Tech',
    linkUrl: '/search?category=cat-accessories',
    categoryId: 'cat-accessories',
    ctaText: 'Discover Tech',
    type: 'bottom'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-redmi-note13',
    title: 'Xiaomi Redmi Note 13 Pro 5G (8GB/256GB) AMOLED 200MP Camera',
    titleBn: 'শাওমি রেডমি নোট ১৩ প্রো ৫জি (৮জিবি/২৫৬জিবি) ২০০ মেগাপিক্সেল ক্যামেরা',
    slug: 'xiaomi-redmi-note-13-pro-5g',
    description: 'Experience ultra-clear 200MP OIS photography, 120Hz 1.5K CrystalRes AMOLED display, and blazing 67W turbo charging. 100% official brand new unit with BTRC approval.',
    descriptionBn: '২০০ মেগাপিক্সেল ওআইএস ক্যামেরা, ১২০ হার্টজ ক্রিস্টালরেস অ্যামোলেড ডিসপ্লে এবং ৬৭ ওয়াট টার্বো চার্জিং। বিটিআরসি অনুমোদিত অফিসিয়াল ব্র্যান্ড নিউ হ্যান্ডসেট।',
    price: 34999,
    originalPrice: 39999,
    discountPercent: 12,
    stock: 24,
    brand: 'Xiaomi',
    categoryId: 'cat-electronics',
    rating: 4.8,
    reviewCount: 342,
    soldCount: 1820,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    warranty: '1 Year Official Brand Warranty (Xiaomi Bangladesh)',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    specifications: {
      'Display': '6.67" 120Hz 1.5K AMOLED (1800 nits peak)',
      'Processor': 'Snapdragon 7s Gen 2 (4nm)',
      'Rear Camera': '200MP (OIS) + 8MP (Ultra-Wide) + 2MP (Macro)',
      'Front Camera': '16MP HDR',
      'Battery': '5100 mAh with 67W Fast Charging',
      'Network': '5G / 4G LTE Dual SIM BTRC Approved',
      'OS': 'MIUI 14 based on Android 13 (Upgradable to HyperOS)'
    },
    media: [
      { id: 'm-1', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-2', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' },
      { id: 'm-3', url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    variants: [
      { id: 'var-rn13-black', name: 'Color', value: 'Midnight Black', stock: 12 },
      { id: 'var-rn13-blue', name: 'Color', value: 'Ocean Teal', stock: 8 },
      { id: 'var-rn13-purple', name: 'Color', value: 'Aurora Purple', stock: 4 }
    ],
    reviews: [
      {
        id: 'rev-1',
        productId: 'prod-redmi-note13',
        userId: 'usr-101',
        userName: 'Tanvir Hossain',
        rating: 5,
        userCity: 'Dhanmondi, Dhaka',
        comment: 'অসাধারণ ফোন! ক্যামেরা সত্যিই ২০০ মেগাপিক্সেল পরিষ্কার। ব্যাটারি ব্যাকআপ প্রায় দেড় দিন চলে। ডেলিভারি মাত্র ২ দিনে পেয়েছি। ধন্যবাদ বাজারবিডি!',
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80'],
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-09-18'
      },
      {
        id: 'rev-2',
        productId: 'prod-redmi-note13',
        userId: 'usr-102',
        userName: 'Sadia Rahman',
        rating: 5,
        userCity: 'Agrabad, Chattogram',
        comment: 'Original phone with valid IMEI verification on BTRC portal. Packaged carefully with air-cushion bubble wrap. Value for money.',
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-09-22'
      }
    ]
  },
  {
    id: 'prod-samsung-galaxy-a55',
    title: 'Samsung Galaxy A55 5G (8GB/256GB) Super AMOLED Metal Frame IP67',
    titleBn: 'স্যামসাং গ্যালাক্সি এ৫৫ ৫জি (৮জিবি/২৫৬জিবি) সুপার অ্যামোলেড মেটাল ফ্রেম',
    slug: 'samsung-galaxy-a55-5g',
    description: 'Iconic design with metal frame and Corning Gorilla Glass Victus+, 50MP OIS triple camera with Nightography, Exynos 1480 4nm processor, and 4 years of OS updates.',
    descriptionBn: 'প্রিমিয়াম মেটাল ফ্রেম এবং গরিলা গ্লাস ভিকটাস প্লাস। ৫০ মেগাপিক্সেল ট্রিপল ক্যামেরা, ৪ বছর অ্যান্ড্রয়েড ওএস আপডেট গ্যারান্টি।',
    price: 49999,
    originalPrice: 56999,
    discountPercent: 12,
    stock: 19,
    brand: 'Samsung',
    categoryId: 'cat-electronics',
    rating: 4.9,
    reviewCount: 215,
    soldCount: 940,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    warranty: '1 Year Samsung Bangladesh Official Warranty',
    specifications: {
      'Display': '6.6" 120Hz Super AMOLED (1000 nits)',
      'Processor': 'Exynos 1480 Octa-Core (4nm)',
      'Rear Camera': '50MP (OIS) + 12MP (Ultra-Wide) + 5MP (Macro)',
      'Front Camera': '32MP 4K Video',
      'Battery': '5000 mAh with 25W Fast Charging',
      'Protection': 'IP67 Water & Dust Resistance'
    },
    media: [
      { id: 'm-sa-1', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-sa-2', url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    variants: [
      { id: 'var-sa-navy', name: 'Color', value: 'Awesome Navy', stock: 10 },
      { id: 'var-sa-ice', name: 'Color', value: 'Awesome Ice Blue', stock: 9 }
    ]
  },
  {
    id: 'prod-walton-primo-s8',
    title: 'Walton Primo S8 Pro (6GB/128GB) 64MP AI Quad Camera Made in Bangladesh',
    titleBn: 'ওয়ালটন প্রিমো এস৮ প্রো (৬জিবি/১২৮জিবি) ৬৪ মেগা এআই কোয়াড ক্যামেরা',
    slug: 'walton-primo-s8-pro',
    description: 'Proudly manufactured in Chandra, Gazipur, Bangladesh. Equipped with 6.78-inch FHD+ 90Hz display, Helio G95 gaming chipset, 64MP ultra HD camera, and 30W fast charge.',
    descriptionBn: 'বাংলাদেশে নিজস্ব কারখানায় তৈরি ওয়ালটনের ফ্ল্যাগশিপ ফোন। ৬৪ মেগাপিক্সেল ক্যামেরা, হেলিও জি৯৫ গেমিং প্রসেসর এবং দ্রুতগতির ৩০ ওয়াট চার্জিং।',
    price: 19990,
    originalPrice: 23500,
    discountPercent: 15,
    stock: 35,
    brand: 'Walton',
    categoryId: 'cat-electronics',
    rating: 4.7,
    reviewCount: 420,
    soldCount: 2450,
    isFeatured: true,
    isFlashSale: false,
    warranty: '1 Year Full Replacement Guarantee + Free Service in all 64 Districts',
    specifications: {
      'Display': '6.78" FHD+ 90Hz Punch-Hole IPS Display',
      'Processor': 'MediaTek Helio G95 Gaming SoC',
      'Camera': '64MP Primary + 8MP Wide + 2MP Depth + 2MP Macro',
      'Battery': '5000 mAh Li-Polymer with 30W Fast Charging',
      'Origin': 'Walton Hi-Tech Industries Ltd, Gazipur, Bangladesh'
    },
    media: [
      { id: 'm-wlt-1', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-wlt-2', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ]
  },
  {
    id: 'prod-hp-pavilion-laptop',
    title: 'HP Pavilion 15 Core i5 13th Gen (16GB RAM/512GB NVMe SSD) FHD IPS Laptop',
    titleBn: 'এইচপি প্যাভিলিয়ন ১৫ কোর আই৫ ১৩ম জেনারেশন (১৬জিবি/৫১২জিবি এসএসডি) ল্যাপটপ',
    slug: 'hp-pavilion-15-core-i5-13th-gen',
    description: 'Sleek aluminum body, Intel Core i5-1335U 10-Core processor, 16GB DDR4 RAM, Bang & Olufsen stereo audio, backlit keyboard, and full-day battery life for university and office.',
    descriptionBn: '১৩তম জেনারেশন কোর আই৫ প্রসেসর, ১৬জিবি র‍্যাম, বি অ্যান্ড ও স্পিকার এবং দীর্ঘস্থায়ী ব্যাটারি। শিক্ষার্থী ও ফ্রিল্যান্সারদের জন্য সেরা ল্যাপটপ।',
    price: 82500,
    originalPrice: 92000,
    discountPercent: 10,
    stock: 12,
    brand: 'HP',
    categoryId: 'cat-electronics',
    rating: 4.9,
    reviewCount: 88,
    soldCount: 360,
    isFeatured: true,
    isFlashSale: false,
    warranty: '2 Years Official Brand Warranty with Bagpack',
    specifications: {
      'CPU': 'Intel Core i5-1335U (Up to 4.60 GHz, 10 Cores, 12 Threads)',
      'RAM': '16 GB DDR4-3200 MHz RAM',
      'Storage': '512 GB PCIe NVMe M.2 SSD',
      'Display': '15.6" Diagonal FHD IPS Micro-edge Anti-glare',
      'Audio': 'Audio by B&O Dual Speakers'
    },
    media: [
      { id: 'm-hp-1', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-hp-2', url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ]
  },
  {
    id: 'prod-lenovo-tab-m10',
    title: 'Lenovo Tab M10 Plus 3rd Gen 10.6" 2K Display (4GB/64GB) 4G LTE Calling',
    titleBn: 'লেনোভো ট্যাব এম১০ প্লাস ১০.৬ ইঞ্চি ২কে ডিসপ্লে (৪জিবি/৬৪জিবি) সিম কলিং ট্যাবলেট',
    slug: 'lenovo-tab-m10-plus-3rd-gen-lte',
    description: 'Crisp 10.61-inch 2K IPS display (2000 x 1200), Quad stereo speakers with Dolby Atmos, Dedicated 4G LTE SIM card slot for voice calling & internet, 7700 mAh all-day battery.',
    descriptionBn: '১০.৬ ইঞ্চি ২কে আইপিএস ডিসপ্লে, কোয়াড স্পিকার ডলবি অ্যাটমস, ৪জি সিম কলিং সুবিধা ও দীর্ঘস্থায়ী ব্যাটারি। বাচ্চাদের পড়াশোনা ও বিনোদনের জন্য দারুণ।',
    price: 24500,
    originalPrice: 29000,
    discountPercent: 16,
    stock: 22,
    brand: 'Lenovo',
    categoryId: 'cat-electronics',
    rating: 4.8,
    reviewCount: 164,
    soldCount: 780,
    isFeatured: false,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    warranty: '1 Year Official Warranty',
    specifications: {
      'Display': '10.61" 2K (2000x1200) IPS 400 nits',
      'Audio': '4 Quad Speakers optimized with Dolby Atmos',
      'Connectivity': '4G LTE SIM Slot + Dual-Band Wi-Fi + GPS',
      'Battery': '7700 mAh (Up to 14 hours video playback)'
    },
    media: [
      { id: 'm-tab-1', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true }
    ]
  },
  {
    id: 'prod-anker-soundcore-r50i',
    title: 'Anker Soundcore R50i True Wireless Earbuds with 10mm Bass Drivers 30H Playtime',
    titleBn: 'অ্যাঙ্কার সাউন্ডকোর আর৫০আই ট্রু ওয়্যারলেস ইয়ারবাডস ৩০ ঘন্টা ব্যাকআপ',
    slug: 'anker-soundcore-r50i-tws',
    description: 'Big 10mm drivers with BassUp technology, 2 built-in microphones with AI noise reduction for crystal-clear calls, IPX5 water resistance, and 30 hours of combined playtime with charging case.',
    descriptionBn: '১০ মিমি বাসআপ ড্রাইভার, এআই কল নয়েজ রিডাকশন, আইপিএক্স৫ ওয়াটার রেজিস্ট্যান্ট এবং ৩০ ঘন্টা ব্যাটারি ব্যাকআপ।',
    price: 1850,
    originalPrice: 2499,
    discountPercent: 26,
    stock: 85,
    brand: 'Anker',
    categoryId: 'cat-accessories',
    rating: 4.9,
    reviewCount: 890,
    soldCount: 4620,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    warranty: '18 Months Replacement Warranty',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    specifications: {
      'Driver Size': '10mm Dynamic Drivers',
      'Playtime': '10h single charge / 30h with case',
      'Fast Charge': '10 mins charge = 2 hours playtime',
      'Waterproof': 'IPX5 Sweat & Rain resistant',
      'Connectivity': 'Bluetooth 5.3',
      'App Support': 'Soundcore App with 22 EQ Presets'
    },
    media: [
      { id: 'm-ank-1', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-ank-2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    variants: [
      { id: 'var-ank-blk', name: 'Color', value: 'Matte Black', stock: 50 },
      { id: 'var-ank-wht', name: 'Color', value: 'Pearl White', stock: 35 }
    ],
    reviews: [
      {
        id: 'rev-3',
        productId: 'prod-anker-soundcore-r50i',
        userId: 'usr-103',
        userName: 'Mahmudul Hasan',
        rating: 5,
        userCity: 'Mirpur, Dhaka',
        comment: 'সাউন্ডকোয়ালিটি খুবই ভালো, বিশেষ করে বেজ যাদের পছন্দ তাদের জন্য দারুণ। কলিংয়েও নয়েজ খুব কম। এই বাজেটে সেরা ইয়ারবাড!',
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-09-25'
      }
    ]
  },
  {
    id: 'prod-jamdani-saree',
    title: 'Authentic Handloom Dhakai Jamdani Saree (84 Count Pure Cotton Zari Work)',
    titleBn: 'ঐতিহ্যবাহী হাতে বোনা খাঁটি ঢাকার জামদানি শাড়ি (৮৪ কাউন্ট সুতি জরি কাজ)',
    slug: 'dhakai-jamdani-saree-handloom',
    description: 'Woven by master artisans in Demra, Narayanganj. Features intricate floral patterns with gold zari border on soft breathable 84-count pure cotton fabric. Perfect for weddings, Eid celebrations and formal occasions.',
    descriptionBn: 'নারায়ণগঞ্জের ঐতিহ্যবাহী তাঁতিদের হাতে বোনা খাঁটি ৮৪ কাউন্ট সুতি জামদানি। চমৎকার সোনালী জরি পার এবং জমকালো নকশা।',
    price: 4950,
    originalPrice: 7500,
    discountPercent: 34,
    stock: 14,
    brand: 'Aarong Handloom',
    categoryId: 'cat-women-fashion',
    rating: 4.9,
    reviewCount: 142,
    soldCount: 520,
    isFeatured: true,
    isFlashSale: false,
    warranty: '100% Genuine Handloom Quality Guarantee',
    specifications: {
      'Fabric': '84 Count Pure Fine Cotton with Metallic Zari',
      'Length': '12 Haat (with matching unstitched blouse piece)',
      'Origin': 'Demra / Rupganj, Narayanganj, Bangladesh',
      'Wash Care': 'Dry Clean Recommended'
    },
    media: [
      { id: 'm-jam-1', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-jam-2', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    variants: [
      { id: 'var-jam-maroon', name: 'Color', value: 'Royal Maroon & Gold', stock: 6 },
      { id: 'var-jam-blue', name: 'Color', value: 'Midnight Navy & Silver', stock: 5 },
      { id: 'var-jam-emerald', name: 'Color', value: 'Emerald Green & Gold', stock: 3 }
    ],
    reviews: [
      {
        id: 'rev-4',
        productId: 'prod-jamdani-saree',
        userId: 'usr-104',
        userName: 'Nusrat Jahan',
        rating: 5,
        userCity: 'Uttara, Dhaka',
        comment: 'কাপড়ের মান অত্যন্ত নরম ও জমকালো। ছবিতে যেমন দেখেছি বাস্তবে আরও সুন্দর। পরিবারের সবাই খুব পছন্দ করেছে।',
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80'],
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-09-15'
      }
    ]
  },
  {
    id: 'prod-panjabi-semi-formal',
    title: "Premium Men's Jacquard Semi-Formal Panjabi with Metal Snap Buttons",
    titleBn: "প্রিমিয়াম জাকোয়ার্ড পুরুষদের সেমি-ফরমাল পাঞ্জাবি মেটাল বোতামসহ",
    slug: 'mens-jacquard-semi-formal-panjabi',
    description: "Tailored to modern slim-regular silhouette using breathable jacquard blended cotton. Features mandarin band collar, side pockets, and matte finish metal snaps. Ideal for Jummah prayers, Eid, and family get-togethers.",
    descriptionBn: "প্রিমিয়াম জাকোয়ার্ড সুতি ফেব্রিক, ট্রেন্ডি ব্যান্ড কলার এবং মেটাল বোতাম। জুম্মা, ঈদ ও যেকোনো উৎসবের জন্য পারফেক্ট।",
    price: 2190,
    originalPrice: 3200,
    discountPercent: 31,
    stock: 45,
    brand: 'Lubnan',
    categoryId: 'cat-men-fashion',
    rating: 4.7,
    reviewCount: 215,
    soldCount: 980,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    warranty: '7 Days Exchange & Return Guarantee',
    specifications: {
      'Fabric': '100% Breathable Jacquard Cotton',
      'Fit': 'Modern Slim Fit',
      'Collar': 'Mandarin Band Collar with Subtle Piping',
      'Care': 'Gentle Machine Wash or Hand Wash'
    },
    media: [
      { id: 'm-pan-1', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-pan-2', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    variants: [
      { id: 'var-pan-s40', name: 'Size', value: '40 (M)', stock: 15 },
      { id: 'var-pan-s42', name: 'Size', value: '42 (L)', stock: 20 },
      { id: 'var-pan-s44', name: 'Size', value: '44 (XL)', stock: 10 }
    ],
    reviews: [
      {
        id: 'rev-5',
        productId: 'prod-panjabi-semi-formal',
        userId: 'usr-105',
        userName: 'Zubair Ahmed',
        rating: 5,
        userCity: 'Sylhet Sadar',
        comment: 'ফিটিং একদম পারফেক্ট! ফেব্রিক অনেক আরামদায়ক। কালারটাও চমৎকার।',
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-09-20'
      }
    ]
  },
  {
    id: 'prod-walton-smart-tv',
    title: 'Walton 43" 4K UHD Frameless Google Android Smart TV (Dolby Audio & Voice Remote)',
    titleBn: 'ওয়ালটন ৪৩ ইঞ্চি ৪কে ইউএইচডি ফ্রেমলেস গুগল অ্যান্ড্রয়েড স্মার্ট টিভি',
    slug: 'walton-43-inch-4k-smart-tv',
    description: 'Stunning 4K Ultra HD IPS panel with HDR10 support, Google TV OS, built-in Chromecast, Bluetooth 5.1, and dual 20W Dolby Digital Plus stereo surround sound. Made with pride in Bangladesh.',
    descriptionBn: 'ওয়ালটনের ৪৩ ইঞ্চি ৪কে আল্ট্রা এইচডি গুগল স্মার্ট টিভি। ডলবি অডিও সাউন্ড এবং ভয়েস কমান্ড রিমোট। ৫ বছরের প্যানেল ওয়ারেন্টি।',
    price: 36900,
    originalPrice: 42900,
    discountPercent: 14,
    stock: 8,
    brand: 'Walton',
    categoryId: 'cat-appliances',
    rating: 4.8,
    reviewCount: 310,
    soldCount: 840,
    isFeatured: true,
    isFlashSale: false,
    warranty: '5 Years Official Panel Warranty + 3 Years Free Service',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    specifications: {
      'Screen Size': '43 Inch 4K UHD (3840 x 2160)',
      'Operating System': 'Official Google TV with Play Store',
      'Audio': '20W Dolby Audio & DTS Virtual:X',
      'Ports': '3x HDMI 2.1, 2x USB, Optical Out, Ethernet RJ45',
      'Wireless': 'Dual-Band Wi-Fi (2.4/5GHz) + Bluetooth 5.1'
    },
    media: [
      { id: 'm-tv-1', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-tv-2', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    variants: [
      { id: 'var-tv-43', name: 'Size', value: '43 Inch 4K', stock: 8 },
      { id: 'var-tv-55', name: 'Size', value: '55 Inch 4K (Special Edition)', priceDiff: 18000, stock: 3 }
    ],
    reviews: [
      {
        id: 'rev-6',
        productId: 'prod-walton-smart-tv',
        userId: 'usr-106',
        userName: 'Kazi Farhan',
        rating: 5,
        userCity: 'Rajshahi Sadar',
        comment: 'পিকচার কোয়ালিটি দুর্দান্ত! ইউটিউব এবং নেটফ্লিক্স একদম স্মুথ চলে। সাউন্ড বেশ জোরালো। ওয়ালটনের সার্ভিস টেকনিশিয়ান এসে নিজ হাতে ইনস্টল করে দিয়ে গেছেন।',
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-09-10'
      }
    ]
  },
  {
    id: 'prod-radhuni-mustard-oil-combo',
    title: 'Radhuni Pure Mustard Oil (2 Litre) + Shorshe Ilish Masala Combo Pack',
    titleBn: 'রাঁধুনী খাঁটি সরিষার তেল (২ লিটার) + সর্ষে ইলিশ মসলা কম্বো প্যাক',
    slug: 'radhuni-pure-mustard-oil-2l-combo',
    description: '100% pure cold-pressed mustard oil with pungent natural aroma and essential fatty acids. Complete with Radhuni traditional fish masala for rich authentic taste.',
    descriptionBn: 'ঝাঁঝালো ১০০% খাঁটি ঘানির সরিষার তেল ও সুস্বাদু সর্ষে ইলিশ রান্নার মসলা কম্বো। সরাসরি স্কয়ার ফুড থেকে সংগৃহীত।',
    price: 680,
    originalPrice: 820,
    discountPercent: 17,
    stock: 120,
    brand: 'Radhuni',
    categoryId: 'cat-groceries',
    rating: 4.9,
    reviewCount: 540,
    soldCount: 3200,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    warranty: 'BSTI Certified 100% Pure Guarantee',
    specifications: {
      'Volume': '2 Litre Pet Bottle + 50g Masala Packet',
      'Processing': 'Cold-Pressed Micro-Filtered',
      'Certification': 'BSTI BDS 1530:2000 Approved',
      'Best Before': '12 Months from Manufacturing'
    },
    media: [
      { id: 'm-oil-1', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-oil-2', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    reviews: [
      {
        id: 'rev-7',
        productId: 'prod-radhuni-mustard-oil-combo',
        userId: 'usr-107',
        userName: 'Shirin Akhter',
        rating: 5,
        userCity: 'Gulshan, Dhaka',
        comment: 'তেলের ঝাঁঝ খুব দারুণ! ভর্তা ও খিচুড়ির সাথে অপূর্ব স্বাদ দেয়। বাজারবিডি ডেলিভারি বয় খুব ভদ্র ছিল।',
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-09-28'
      }
    ]
  },
  {
    id: 'prod-smartwatch-amoled',
    sellerId: 'seller-apex-01',
    isSponsored: true,
    sponsoredBid: 1.5,
    title: 'Kieslect Calling Smartwatch Ks Pro (2.01" Super AMOLED Display Always-on)',
    titleBn: 'কিসলেক্ট কলিং স্মার্টওয়াচ কেএস প্রো ২.০১ ইঞ্চি সুপার অ্যামোলেড',
    slug: 'kieslect-ks-pro-calling-smartwatch',
    description: 'Massive 2.01-inch HD AMOLED screen with 60Hz refresh rate, stable Bluetooth 5.2 phone calls, 100 sports modes, real-time heart rate and SpO2 tracking, and up to 10 days battery endurance.',
    descriptionBn: '২.০১ ইঞ্চি সুপার অ্যামোলেড স্ক্রিন, সরাসরি ব্লুটুথ কলিং সুবিধা, ১০০+ স্পোর্টস মোড এবং দীর্ঘস্থায়ী ব্যাটারি।',
    price: 5850,
    originalPrice: 7990,
    discountPercent: 27,
    stock: 18,
    brand: 'Kieslect',
    categoryId: 'cat-accessories',
    rating: 4.8,
    reviewCount: 380,
    soldCount: 1420,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    warranty: '1 Year Brand Replacement Warranty',
    specifications: {
      'Display': '2.01" FHD AMOLED (410 x 502 px)',
      'Calling': 'Built-in Speaker & Mic with AI Noise Cancelling',
      'Waterproof': 'IP68 Swim-proof rating',
      'Battery': '300 mAh (3.5-6 days typical use / 10 days standby)'
    },
    media: [
      { id: 'm-sw-1', url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-sw-2', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    variants: [
      { id: 'var-sw-blk', name: 'Strap', value: 'Black Magnetic Silicone', stock: 10 },
      { id: 'var-sw-org', name: 'Strap', value: 'Vibrant Orange Dual Strap', stock: 8 }
    ],
    reviews: [
      {
        id: 'rev-8',
        productId: 'prod-smartwatch-amoled',
        userId: 'usr-108',
        userName: 'Shahriar Kabir',
        rating: 5,
        userCity: 'Khulna Sadar',
        comment: 'ডিসপ্লেটা সত্যি অসাধারণ ব্রাইট! রোদেও ক্লিয়ার দেখা যায়। ব্লুটুথ কলিং কোয়ালিটি চমৎকার। ১০০% রিকমেন্ডেড!',
        isVerifiedPurchase: true,
        isApproved: true,
        createdAt: '2026-09-24'
      }
    ]
  },
  {
    id: 'prod-cricket-bat-ca-plus',
    title: 'CA Plus 15000 English Willow Cricket Bat (Official Grade 1 Hologram)',
    titleBn: 'সিএ প্লাস ১৫০০০ ইংলিশ উইলো ক্রিকেট ব্যাট গ্রেড ১ অফিসিয়াল',
    slug: 'ca-plus-15000-cricket-bat',
    description: 'Crafted from hand-selected Grade 1 English Willow. Features 38-40mm thick edges, massive sweet spot, exceptional balance and ping. Comes with padded bat cover.',
    descriptionBn: 'গ্রেড ১ হ্যান্ড সিলেক্টেড ইংলিশ উইলো ব্যাট। দারুণ ব্যালেন্স এবং পাওয়ারফুল স্ট্রোক। প্রফেশনাল ক্রিকেটারদের সেরা পছন্দ।',
    price: 14500,
    originalPrice: 18500,
    discountPercent: 22,
    stock: 5,
    brand: 'CA Sports',
    categoryId: 'cat-sports',
    rating: 4.9,
    reviewCount: 98,
    soldCount: 310,
    isFeatured: true,
    isFlashSale: false,
    warranty: 'Genuine English Willow Authenticity Guarantee',
    specifications: {
      'Willow': 'Grade 1 Handcrafted English Willow',
      'Weight': '2lb 8oz to 2lb 9oz (1160 - 1190g)',
      'Grains': '8-10 Straight Natural Grains',
      'Handle': '12-piece cane semi-oval handle'
    },
    media: [
      { id: 'm-bat-1', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-bat-2', url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    variants: [
      { id: 'var-bat-sh', name: 'Handle', value: 'Short Handle (SH)', stock: 3 },
      { id: 'var-bat-lh', name: 'Handle', value: 'Long Handle (LH)', stock: 2 }
    ]
  },
  {
    id: 'prod-apex-leather-oxford',
    title: "Apex Men's Genuine Full-Grain Leather Oxford Dress Shoes",
    titleBn: "অ্যাপেক্স জেনুইন লেদার ফরমাল অক্সফোর্ড জুতো",
    slug: 'apex-mens-leather-oxford-shoes',
    description: 'Handcrafted with premium cowhide full-grain leather, cushioned memory foam insole, and durable non-slip TPR outsole. Elegant stitch detailing for meetings and wedding functions.',
    descriptionBn: 'খাঁটি গরুর চামড়া দিয়ে তৈরি অ্যাপেক্সের এক্সক্লুসিভ ফরমাল জুতো। সফট মেমোরি ফোম ইনসোল দিয়ে সারাদিন আরামদায়ক ব্যবহারের নিশ্চয়তা।',
    price: 3990,
    originalPrice: 5490,
    discountPercent: 27,
    stock: 16,
    brand: 'Apex',
    categoryId: 'cat-men-fashion',
    rating: 4.8,
    reviewCount: 160,
    soldCount: 650,
    isFeatured: false,
    isFlashSale: false,
    warranty: '6 Months Manufacturer Guarantee',
    specifications: {
      'Upper': '100% Genuine Full Grain Cow Leather',
      'Insole': 'Orthopedic Memory Foam with Breathable Lining',
      'Sole': 'Flexible Slip-Resistant TPR'
    },
    media: [
      { id: 'm-apx-1', url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-apx-2', url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ],
    variants: [
      { id: 'var-apx-41', name: 'Size', value: 'EU 41 (UK 7)', stock: 6 },
      { id: 'var-apx-42', name: 'Size', value: 'EU 42 (UK 8)', stock: 7 },
      { id: 'var-apx-43', name: 'Size', value: 'EU 43 (UK 9)', stock: 3 }
    ]
  },
  {
    id: 'prod-baseus-gan-65w',
    sellerId: 'seller-apex-01',
    isSponsored: true,
    sponsoredBid: 1.2,
    title: 'Baseus GaN5 Pro 65W Fast Charger (2x USB-C + 1x USB-A) with 100W Type-C Cable',
    titleBn: 'বেসাস গ্যান৫ প্রো ৬৫ ওয়াট ফাস্ট চার্জার ১০০ ওয়াট কেবলসহ',
    slug: 'baseus-gan5-pro-65w-fast-charger',
    description: 'Compact 5th-gen Gallium Nitride technology supporting PD 3.0, QC 4+, PPS for ultra-fast charging of MacBooks, iPhones, Samsung, and laptops simultaneously without heating.',
    descriptionBn: 'লেটেস্ট গ্যালিয়াম নাইট্রাইড টেকনোলজি। ল্যাপটপ, আইফোন ও অ্যান্ড্রয়েড একসাথে দ্রুত চার্জ করার সুবিধা। অতিরিক্ত গরম হয় না।',
    price: 2450,
    originalPrice: 3200,
    discountPercent: 23,
    stock: 42,
    brand: 'Baseus',
    categoryId: 'cat-accessories',
    rating: 4.9,
    reviewCount: 420,
    soldCount: 2310,
    isFeatured: true,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    warranty: '6 Months Brand Warranty',
    specifications: {
      'Output Power': '65W Max (USB-C1/C2: 65W, USB-A: 60W)',
      'Dimensions': '65 x 36 x 32 mm (Pocket Size)',
      'Safety': 'BCT Smart Temperature Control & Over-voltage Protection',
      'Includes': '1-Meter 100W E-Marker Type-C Braided Cable'
    },
    media: [
      { id: 'm-bas-1', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-bas-2', url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ]
  },
  {
    id: 'prod-korean-snail-serum',
    title: 'COSRX Advanced Snail 96 Mucin Power Essence 100ml (Hydrating & Repairing)',
    titleBn: 'কসআরএক্স অ্যাডভান্সড স্নেল ৯৬ মিউসিন পাওয়ার এসেন্স ১০০ মিলি',
    slug: 'cosrx-snail-96-mucin-essence',
    description: 'Lightweight essence enriched with 96.3% Snail Secretion Filtrate. Nourishes tired skin, fades dark spots, restores skin elasticity, and provides deep hydration. 100% authentic Korean import.',
    descriptionBn: '৯৬.৩% স্নেল মিউসিন সমৃদ্ধ জনপ্রিয় কোরিয়ান এসেন্স। ত্বকের ব্রণের দাগ দূর করে, গভীর ময়েশ্চার প্রদান করে এবং ত্বক নরম ও উজ্জ্বল রাখে।',
    price: 1650,
    originalPrice: 2200,
    discountPercent: 25,
    stock: 30,
    brand: 'COSRX',
    categoryId: 'cat-beauty',
    rating: 4.9,
    reviewCount: 620,
    soldCount: 2940,
    isFeatured: false,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    warranty: '100% Authentic Korean Import Guarantee',
    specifications: {
      'Volume': '100ml / 3.38 fl. oz',
      'Skin Type': 'All Skin Types (Acne-prone, Dry, Sensitive)',
      'Key Ingredient': '96.3% Snail Secretion Filtrate, Sodium Hyaluronate',
      'Country of Origin': 'South Korea'
    },
    media: [
      { id: 'm-sn-1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true },
      { id: 'm-sn-2', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80', type: 'IMAGE' }
    ]
  },
  {
    id: 'prod-sylhet-tea-premium',
    title: 'Finlay Green Tea Sreemangal Sylhet Garden Fresh Leaf (400g Tin Container)',
    titleBn: 'ফিনলে গ্রিন টি শ্রীমঙ্গল সিলেট তাজা চা পাতা (৪০০ গ্রাম টিন)',
    slug: 'finlay-sylhet-green-tea-tin',
    description: 'Picked from the lush high-altitude gardens of Sreemangal, the tea capital of Bangladesh. Rich in antioxidants and catechins with light floral aroma.',
    descriptionBn: 'শ্রীমঙ্গলের চা বাগান থেকে সংগৃহীত তাজা গ্রিন টি। অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ এবং মেদ কমাতে ও শরীর সতেজ রাখতে অত্যন্ত কার্যকর।',
    price: 420,
    originalPrice: 550,
    discountPercent: 24,
    stock: 65,
    brand: 'Finlay',
    categoryId: 'cat-groceries',
    rating: 4.8,
    reviewCount: 210,
    soldCount: 1650,
    isFeatured: false,
    isFlashSale: false,
    warranty: 'Garden Fresh Guarantee',
    specifications: {
      'Weight': '400g Sealed Metal Tin',
      'Origin': 'Sreemangal, Moulvibazar, Sylhet',
      'Leaf Grade': 'Whole Leaf Pekoe Green Tea'
    },
    media: [
      { id: 'm-tea-1', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80', type: 'IMAGE', isThumbnail: true }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'BZ-2026-89412',
    userId: 'usr-customer-1',
    customerName: 'Rayhan Ahmed',
    customerPhone: '01712345678',
    shippingAddress: {
      fullName: 'Rayhan Ahmed',
      phone: '01712345678',
      division: 'Dhaka',
      district: 'Dhaka City',
      thanaCity: 'Dhanmondi 27',
      addressLine: 'House 42, Road 9/A, Dhanmondi',
      deliveryInstruction: 'Call before delivery please'
    },
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    subtotal: 36849,
    shippingFee: 60,
    discount: 500,
    total: 36409,
    items: [
      {
        id: 'item-1',
        productId: 'prod-redmi-note13',
        title: 'Xiaomi Redmi Note 13 Pro 5G (8GB/256GB)',
        price: 34999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
        variantName: 'Color',
        variantValue: 'Ocean Teal'
      },
      {
        id: 'item-2',
        productId: 'prod-anker-soundcore-r50i',
        title: 'Anker Soundcore R50i True Wireless Earbuds',
        price: 1850,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        variantName: 'Color',
        variantValue: 'Matte Black'
      }
    ],
    trackingNumber: 'REDX-DH-984321',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    // Within 7 days: return is available!
    returnWindowEndsAt: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    returnRequested: false
  },
  {
    id: 'ord-1002',
    orderNumber: 'BZ-2026-90145',
    userId: 'usr-customer-1',
    customerName: 'Rayhan Ahmed',
    customerPhone: '01712345678',
    shippingAddress: {
      fullName: 'Rayhan Ahmed',
      phone: '01712345678',
      division: 'Dhaka',
      district: 'Dhaka City',
      thanaCity: 'Gulshan 1',
      addressLine: 'Road 11, House 88, Level 4'
    },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Shipped',
    subtotal: 4950,
    shippingFee: 60,
    discount: 0,
    total: 5010,
    items: [
      {
        id: 'item-3',
        productId: 'prod-jamdani-saree',
        title: 'Authentic Handloom Dhakai Jamdani Saree',
        price: 4950,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
        variantName: 'Color',
        variantValue: 'Royal Maroon & Gold'
      }
    ],
    trackingNumber: 'PATHAO-CT-774129',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  }
];
