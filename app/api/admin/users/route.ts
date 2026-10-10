import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/middleware/auth-middleware';
import { adminDb } from '@/lib/firebase/admin';

/**
 * GET /api/admin/users
 * Retrieve all registered users (Customers & Sellers) from the single 'users' collection in Firestore
 */
export async function GET(req: NextRequest) {
  // 1. Security Check: Only Admins
  const auth = await authorize(req, ['ADMIN']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(req.url);
    const roleFilter = searchParams.get('role'); // 'CUSTOMER' | 'SELLER' | 'ALL' | null

    let usersList: any[] = [];
    
    if (adminDb) {
      let queryRef: FirebaseFirestore.Query = adminDb.collection('users');
      if (roleFilter && roleFilter !== 'ALL') {
        queryRef = queryRef.where('role', '==', roleFilter);
      }
      const snapshot = await queryRef.get();
      snapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
    }

    // Map any dynamically fetched users so they consistently have QA IDs
    usersList = usersList.map((u, idx) => {
        if (u.role === 'SELLER') {
          const sId = u.sellerIdNumber || u.customerId || (u.id?.startsWith('QA-') ? u.id : `QA-SL-${81049280 + idx}`);
          return { ...u, sellerIdNumber: sId, customerId: sId };
        } else {
          const cId = u.customerId || (u.id?.startsWith('QA-') ? u.id : `QA-${48291040 + idx}`);
          return { ...u, customerId: cId };
        }
    });

    return NextResponse.json({
      success: true,
      count: usersList.length,
      users: usersList,
      source: 'firestore-users'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Update user status (approve seller, suspend seller, block user, etc.)
 */
export async function PATCH(req: NextRequest) {
  // 1. Security Check: Only Admins
  const auth = await authorize(req, ['ADMIN']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await req.json();
    const { userId, updates } = body;

    if (!userId || !updates) {
      return NextResponse.json({ success: false, error: 'Missing userId or updates' }, { status: 400 });
    }

    if (adminDb) {
        await adminDb.collection('users').doc(userId).set(
          { ...updates, updatedAt: new Date().toISOString() },
          { merge: true }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'User details updated in Firestore users collection successfully',
      userId,
      updates
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}
