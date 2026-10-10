import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, items } = body;

    // Group items by sellerId
    const subOrdersMap: Record<string, any[]> = {};

    items.forEach((item: any) => {
      const sId = item.sellerId || 'seller-apex-01';
      if (!subOrdersMap[sId]) {
        subOrdersMap[sId] = [];
      }
      subOrdersMap[sId].push(item);
    });

    const subOrders = Object.entries(subOrdersMap).map(([sellerId, sellerItems], idx) => {
      const subtotal = sellerItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
      return {
        id: `subord-${orderId}-${idx + 1}`,
        sellerId,
        shopName: sellerItems[0]?.shopName || 'Marketplace Seller',
        items: sellerItems,
        subtotal,
        orderStatus: 'Pending',
        trackingNumber: `TRK-${sellerId.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`
      };
    });

    return NextResponse.json({
      success: true,
      orderId,
      subOrders
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Order splitting failed' }, { status: 500 });
  }
}
