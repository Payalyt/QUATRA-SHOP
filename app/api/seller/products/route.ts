import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get('sellerId') || 'seller-apex-01';

  return NextResponse.json({
    sellerId,
    totalProducts: 12,
    message: 'Seller products retrieved successfully'
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, price, categoryId, stock } = body;

    if (!title || !price || !categoryId) {
      return NextResponse.json({ error: 'Title, Price, and Category are required' }, { status: 400 });
    }

    const id = `prod-seller-${Date.now()}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    return NextResponse.json({
      success: true,
      message: `Product "${title}" uploaded successfully`,
      product: {
        id,
        title,
        slug,
        price,
        stock: stock || 10,
        categoryId,
        status: 'Approved'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
