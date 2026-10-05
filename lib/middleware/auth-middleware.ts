import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function authorize(req: NextRequest, allowedRoles: ('ADMIN' | 'SUB_AGENT' | 'SELLER')[]) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];
  
  if (!token) {
    return { error: 'Unauthorized', status: 401 };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // ইন-মেমরি চেক বা Firestore থেকে রোল চেক করুন
    // এখানে আমরা ধরে নিচ্ছি ইউজার কাস্টম ক্লেইম বা ডাটায় রোল আছে
    const userRole = decodedToken.role; // বা Firestore থেকে ফেচ করা

    if (!allowedRoles.includes(userRole)) {
      return { error: 'Forbidden', status: 403 };
    }

    return { user: decodedToken, status: 200 };
  } catch (error) {
    return { error: 'Invalid Token', status: 401 };
  }
}
