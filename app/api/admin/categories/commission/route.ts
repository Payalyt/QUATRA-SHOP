import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/middleware/auth-middleware';
import { adminDb } from '@/lib/firebase/admin';

// In-memory fallback cache
const memoryCategoriesStore: Record<string, { id: string; name: string; commission: number; updatedAt?: string }> = {
  'cat-electronics': { id: 'cat-electronics', name: 'Electronics & Gadgets', commission: 5 },
  'cat-men-fashion': { id: 'cat-men-fashion', name: "Men's Fashion", commission: 12 },
  'cat-women-fashion': { id: 'cat-women-fashion', name: "Women's Fashion", commission: 12 },
  'cat-accessories': { id: 'cat-accessories', name: 'Smart Accessories', commission: 5 },
  'cat-appliances': { id: 'cat-appliances', name: 'Home Appliances', commission: 5 },
  'cat-others': { id: 'cat-others', name: 'Other Categories', commission: 10 }
};

/**
 * GET: Retrieve all category commission configurations
 */
export async function GET() {
  try {
    let categories: any[] = [];

    try {
        const snapshot = await adminDb!.collection('categories').get();
        if (!snapshot.empty) {
          categories = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
        }
    } catch {
        // Fallback
    }

    if (categories.length === 0) {
      categories = Object.values(memoryCategoriesStore);
    }

    return NextResponse.json({
      success: true,
      categories
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      categories: Object.values(memoryCategoriesStore),
    }, { status: 200 });
  }
}

/**
 * POST: Update or create category commission rates
 */
export async function POST(req: NextRequest) {
  // 1. Security Check: Only Admins
  const auth = await authorize(req, ['ADMIN']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await req.json();
    const { categoryId, name, commission } = body;

    const docId = categoryId || body.id;

    if (!docId || commission === undefined || commission === null) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const commissionNum = Number(commission);
    if (isNaN(commissionNum) || commissionNum < 0 || commissionNum > 100) {
      return NextResponse.json({ success: false, error: 'Invalid commission' }, { status: 400 });
    }

    const categoryData = {
      id: docId,
      name: name || memoryCategoriesStore[docId]?.name || docId,
      commission: commissionNum,
      updatedAt: new Date().toISOString()
    };

    memoryCategoriesStore[docId] = categoryData;

    try {
        await adminDb!.collection('categories').doc(docId).set(categoryData, { merge: true });
    } catch {
        // Soft fallback
    }

    return NextResponse.json({ success: true, message: 'Commission rate saved', category: categoryData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
