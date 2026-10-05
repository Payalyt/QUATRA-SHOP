import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get('sellerId') || 'seller-apex-01';

  return NextResponse.json({
    sellerId,
    ordersCount: 8,
    message: 'Seller orders list retrieved successfully'
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderStatus } = body;

    return NextResponse.json({
      success: true,
      message: `Order ${orderId || ''} status updated to ${orderStatus}`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
