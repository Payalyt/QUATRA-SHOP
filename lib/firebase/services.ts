import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './config';
import { Product, Order, AudienceLead, SellerDepositRequest, SponsoredAdCampaign, Role } from '@/lib/types/ecommerce';

// ----------------- USERS (UNIFIED CUSTOMERS & SELLERS) -----------------
export interface UnifiedUserData {
  id: string;
  customerId?: string; // Unique 8-digit QA Customer ID (e.g. QA-48291048)
  sellerIdNumber?: string; // Unique 8-digit QA Seller ID (e.g. QA-SL-82910482)
  name: string;
  email: string;
  phone?: string;
  role: Role; // 'CUSTOMER' | 'SELLER' | 'ADMIN'
  avatarUrl?: string;
  status?: 'Active' | 'Pending' | 'Approved' | 'Suspended' | 'Blocked';
  // Seller-specific details stored in the same users collection
  shopName?: string;
  shopAddress?: string;
  nidTradeLicense?: string;
  payoutMethod?: string;
  payoutAccount?: string;
  // Customer-specific details
  shippingAddress?: string;
  ordersCount?: number;
  totalSpent?: number;
  createdAt?: any;
  updatedAt?: any;
}

export async function syncUserToFirestore(user: UnifiedUserData) {
  try {
    const userRef = doc(db, 'users', user.id);
    const rawData: Record<string, any> = {
      ...user,
      updatedAt: serverTimestamp(),
      createdAt: user.createdAt || serverTimestamp(),
    };
    const cleanData: Record<string, any> = {};
    Object.keys(rawData).forEach((key) => {
      if (rawData[key] !== undefined) {
        cleanData[key] = rawData[key];
      }
    });
    await setDoc(userRef, cleanData, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore user sync warning:', error);
    return { success: false, error };
  }
}

export async function getUserFromFirestore(userId: string): Promise<UnifiedUserData | null> {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data() as UnifiedUserData;
    }
    return null;
  } catch (error) {
    console.warn('Firestore getUser error:', error);
    return null;
  }
}

export async function fetchAllUsersFromFirestore(roleFilter?: 'CUSTOMER' | 'SELLER' | 'ALL'): Promise<UnifiedUserData[]> {
  try {
    const usersCol = collection(db, 'users');
    let q = query(usersCol, orderBy('createdAt', 'desc'));
    if (roleFilter && roleFilter !== 'ALL') {
      q = query(usersCol, where('role', '==', roleFilter), orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    const usersList: UnifiedUserData[] = [];
    snapshot.forEach((doc) => {
      usersList.push({ ...doc.data(), id: doc.id } as UnifiedUserData);
    });
    return usersList;
  } catch (error) {
    console.warn('Firestore fetchAllUsers warning:', error);
    // If composite index is pending, fallback to un-ordered query
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const fallbackList: UnifiedUserData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as UnifiedUserData;
        if (!roleFilter || roleFilter === 'ALL' || data.role === roleFilter) {
          fallbackList.push({ ...data, id: doc.id });
        }
      });
      return fallbackList;
    } catch (fallbackErr) {
      console.warn('Firestore fallback fetch failed:', fallbackErr);
      return [];
    }
  }
}

export async function updateUserInFirestore(userId: string, updates: Partial<UnifiedUserData>) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.warn('Firestore updateUser error:', error);
    return { success: false, error };
  }
}

// ----------------- LEADS / AUDIENCE -----------------
export async function saveLeadToFirestore(lead: Partial<AudienceLead>) {
  try {
    const leadId = lead.id || `ld-${Date.now()}`;
    const leadRef = doc(db, 'leads', leadId);
    await setDoc(leadRef, {
      ...lead,
      id: leadId,
      createdAt: lead.createdAt || new Date().toISOString(),
      timestamp: serverTimestamp()
    }, { merge: true });
    return { success: true, id: leadId };
  } catch (error) {
    console.warn('Firestore saveLead error:', error);
    return { success: false, error };
  }
}

export async function fetchLeadsFromFirestore(): Promise<AudienceLead[]> {
  try {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const leads: AudienceLead[] = [];
    snapshot.forEach((doc) => {
      leads.push(doc.data() as AudienceLead);
    });
    return leads;
  } catch (error) {
    console.warn('Firestore fetchLeads error:', error);
    return [];
  }
}

// ----------------- PRODUCTS -----------------
export async function saveProductToFirestore(product: Product) {
  try {
    const prodRef = doc(db, 'products', product.id);
    await setDoc(prodRef, {
      ...product,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveProduct error:', error);
    return { success: false, error };
  }
}

export async function fetchProductsFromFirestore(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const prods: Product[] = [];
    snapshot.forEach((doc) => {
      prods.push(doc.data() as Product);
    });
    return prods;
  } catch (error) {
    console.warn('Firestore fetchProducts error:', error);
    return [];
  }
}

// ----------------- ORDERS -----------------
export async function saveOrderToFirestore(order: Order) {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      updatedAt: serverTimestamp(),
      createdAt: order.createdAt || new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveOrder error:', error);
    return { success: false, error };
  }
}

// ----------------- SELLER DEPOSITS -----------------
export async function saveDepositToFirestore(deposit: SellerDepositRequest) {
  try {
    const depRef = doc(db, 'seller_deposits', deposit.id);
    await setDoc(depRef, {
      ...deposit,
      timestamp: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveDeposit error:', error);
    return { success: false, error };
  }
}

// ----------------- SPONSORED CAMPAIGNS -----------------
export async function saveCampaignToFirestore(campaign: SponsoredAdCampaign) {
  try {
    const campRef = doc(db, 'campaigns', campaign.id);
    await setDoc(campRef, {
      ...campaign,
      timestamp: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveCampaign error:', error);
    return { success: false, error };
  }
}

// ----------------- BANNERS & NOTICES -----------------
export async function saveBannerToFirestore(banner: any) {
  try {
    const bannerRef = doc(db, 'banners', banner.id);
    await setDoc(bannerRef, {
      ...banner,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveBanner error:', error);
    return { success: false, error };
  }
}

export async function deleteBannerFromFirestore(bannerId: string) {
  try {
    await deleteDoc(doc(db, 'banners', bannerId));
    return { success: true };
  } catch (error) {
    console.warn('Firestore deleteBanner error:', error);
    return { success: false, error };
  }
}

// ----------------- CATEGORIES -----------------
export async function saveCategoryToFirestore(category: any) {
  try {
    const catRef = doc(db, 'categories', category.id);
    await setDoc(catRef, {
      ...category,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveCategory error:', error);
    return { success: false, error };
  }
}

export async function deleteCategoryFromFirestore(categoryId: string) {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    return { success: true };
  } catch (error) {
    console.warn('Firestore deleteCategory error:', error);
    return { success: false, error };
  }
}

// ----------------- SETTINGS & NOTICES -----------------
export async function saveSettingsToFirestore(settings: any) {
  try {
    const setRef = doc(db, 'settings', 'general');
    await setDoc(setRef, {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveSettings error:', error);
    return { success: false, error };
  }
}

// ----------------- COUPONS -----------------
export async function saveCouponToFirestore(coupon: any) {
  try {
    const couponRef = doc(db, 'coupons', coupon.id);
    await setDoc(couponRef, {
      ...coupon,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveCoupon error:', error);
    return { success: false, error };
  }
}

export async function deleteCouponFromFirestore(couponId: string) {
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
    return { success: true };
  } catch (error) {
    console.warn('Firestore deleteCoupon error:', error);
    return { success: false, error };
  }
}

// ----------------- AFFILIATES -----------------
export async function saveAffiliateToFirestore(affiliate: any) {
  try {
    const affRef = doc(db, 'affiliates', affiliate.id);
    await setDoc(affRef, {
      ...affiliate,
      updatedAt: serverTimestamp(),
      createdAt: affiliate.createdAt || new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveAffiliate error:', error);
    return { success: false, error };
  }
}

export async function fetchAffiliatesFromFirestore(): Promise<any[]> {
  try {
    const snapshot = await getDocs(collection(db, 'affiliates'));
    const list: any[] = [];
    snapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    return list;
  } catch (error) {
    console.warn('Firestore fetchAffiliates error:', error);
    return [];
  }
}

export async function saveAffiliateWithdrawalToFirestore(withdrawal: any) {
  try {
    const wRef = doc(db, 'affiliate_withdrawals', withdrawal.id);
    await setDoc(wRef, {
      ...withdrawal,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveAffiliateWithdrawal error:', error);
    return { success: false, error };
  }
}

export async function saveAffiliateCommissionToFirestore(commission: any) {
  try {
    const cRef = doc(db, 'affiliate_commissions', commission.id);
    await setDoc(cRef, {
      ...commission,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveAffiliateCommission error:', error);
    return { success: false, error };
  }
}

// ----------------- SELLERS -----------------
export async function saveSellerToFirestore(seller: any) {
  try {
    const sRef = doc(db, 'sellers', seller.id);
    await setDoc(sRef, {
      ...seller,
      updatedAt: serverTimestamp(),
      createdAt: seller.createdAt || new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.warn('Firestore saveSeller error:', error);
    return { success: false, error };
  }
}

export async function fetchSellersFromFirestore(): Promise<any[]> {
  try {
    const snapshot = await getDocs(collection(db, 'sellers'));
    const list: any[] = [];
    snapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    return list;
  } catch (error) {
    console.warn('Firestore fetchSellers error:', error);
    return [];
  }
}

