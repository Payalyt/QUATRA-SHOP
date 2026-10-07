import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PRODUCTS } from '@/lib/data/seed-products';
import { authorize } from '@/lib/middleware/auth-middleware';
import { productSchema } from '@/lib/validations/product';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('q')?.toLowerCase();
  const category = searchParams.get('category');
  const flashSale = searchParams.get('flashSale');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort');

  let results = [...INITIAL_PRODUCTS];

  if (search) {
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.titleBn.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }

  if (category && category !== 'all') {
    results = results.filter(
      (p) => p.categoryId === category || p.slug.includes(category)
    );
  }

  if (flashSale === 'true') {
    results = results.filter((p) => p.isFlashSale);
  }

  if (minPrice) {
    results = results.filter((p) => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    results = results.filter((p) => p.price <= parseFloat(maxPrice));
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else {
    // Default popularity
    results.sort((a, b) => b.soldCount - a.soldCount);
  }

  return NextResponse.json({
    count: results.length,
    products: results
  });
}


export async function POST(req: NextRequest) {
  // 1. Security Check: Only Sellers and Admin
  const auth = await authorize(req, ['SELLER', 'ADMIN']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  // 2. Data Validation
  const body = await req.json();
  const validation = productSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

  try {
    // 3. Save Product
    const productRef = adminDb!.collection('products').doc(`prod-${Date.now()}`);
    await productRef.set({
      ...validation.data,
      sellerId: auth.user!.uid, // Enforce sellerId
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, productId: productRef.id }, { status: 201 });
  } catch (err: unknown) {
    console.error('Product Creation Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

