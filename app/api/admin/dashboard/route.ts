import { NextResponse } from 'next/server';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/lib/data/seed-products';

export async function GET() {
  const totalRevenue = INITIAL_ORDERS.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrders = INITIAL_ORDERS.length;
  const lowStockProducts = INITIAL_PRODUCTS.filter((p) => p.stock < 10);

  return NextResponse.json({
    metrics: {
      totalRevenue,
      totalOrders,
      totalProducts: INITIAL_PRODUCTS.length,
      activeUsers: 1420
    },
    lowStockAlerts: lowStockProducts,
    recentOrders: INITIAL_ORDERS.slice(0, 5)
  });
}
