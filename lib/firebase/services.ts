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
    await setDoc(userRef, {
      ...user,
      updatedAt: serverTimestamp(),
      createdAt: user.createdAt || serverTimestamp(),
    }, { merge: true });
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
      usersList.push({ id: doc.id, ...doc.data() } as UnifiedUserData);
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
          fallbackList.push({ id: doc.id, ...data });
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
