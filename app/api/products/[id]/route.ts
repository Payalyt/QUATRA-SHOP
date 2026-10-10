import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PRODUCTS } from '@/lib/data/seed-products';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}
