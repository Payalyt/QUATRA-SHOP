import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

/**
 * Universal Courier Webhook Receiver
 * Supports Steadfast Courier & Pathao Courier Status Webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Steadfast Webhook Structure
    // payload: { consignment_id, order_id, status: 'delivered' | 'cancelled' | 'in_transit' | 'pending' }
    // 2. Pathao Webhook Structure
    // payload: { merchant_order_id, consignment_id, order_status: 'Delivered' | 'Returned' | ... }

    const consignmentId = body.consignment_id || body.consignmentId || body.tracking_code;
    const orderId = body.order_id || body.merchant_order_id || body.invoice;
    const rawStatus = (body.status || body.order_status || body.delivery_status || '').toString().toLowerCase();

    let mappedStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' = 'PROCESSING';

    if (rawStatus.includes('delivered') || rawStatus === 'successful') {
      mappedStatus = 'DELIVERED';
    } else if (rawStatus.includes('transit') || rawStatus.includes('picked') || rawStatus.includes('shipping') || rawStatus.includes('shipped')) {
      mappedStatus = 'SHIPPED';
    } else if (rawStatus.includes('cancel') || rawStatus.includes('return')) {
      mappedStatus = 'CANCELLED';
    } else if (rawStatus.includes('confirm')) {
      mappedStatus = 'CONFIRMED';
    }

    if (adminDb && orderId) {
      try {
        const orderRef = adminDb.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();
        if (orderDoc.exists) {
          await orderRef.update({
            status: mappedStatus,
            courierTrackingCode: consignmentId || orderDoc.data()?.courierTrackingCode,
            courierLastStatus: rawStatus,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (dbErr) {
        console.warn('Courier webhook Firestore sync notice:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Courier webhook processed successfully',
      orderId,
      mappedStatus
    });
  } catch (error: any) {
    console.error('Courier webhook error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Webhook processing failed' }, { status: 500 });
  }
}
