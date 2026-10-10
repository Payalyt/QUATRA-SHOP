import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get('tran_id') as string;
    const val_id = formData.get('val_id') as string;
    const amount = formData.get('amount') as string;
    const card_type = formData.get('card_type') as string;
    const bank_tran_id = formData.get('bank_tran_id') as string;

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    // Update order status in Firestore if database is accessible
    if (adminDb && orderId) {
      try {
        const orderRef = adminDb.collection('orders').doc(orderId);
        await orderRef.set({
          paymentStatus: 'PAID',
          transactionId: bank_tran_id || val_id || tran_id,
          paymentMethod: card_type || 'SSLCommerz',
          paidAt: new Date().toISOString(),
          sslcommerzData: {
            tran_id,
            val_id,
            amount,
            card_type,
            bank_tran_id
          }
        }, { merge: true });
      } catch (dbErr) {
        console.warn('SSLCommerz DB update notice:', dbErr);
      }
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://ais-dev-kzjwcmsvdqu5ezdwhtt2l3-128349718043.asia-southeast1.run.app';
    return NextResponse.redirect(`${origin}?payment_success=true&order_id=${encodeURIComponent(orderId || '')}&trx_id=${encodeURIComponent(val_id || tran_id || '')}`, 303);
  } catch (err: any) {
    console.error('SSLCommerz success callback error:', err);
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://ais-dev-kzjwcmsvdqu5ezdwhtt2l3-128349718043.asia-southeast1.run.app';
    return NextResponse.redirect(`${origin}?payment_error=true`, 303);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId') || '';
  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://ais-dev-kzjwcmsvdqu5ezdwhtt2l3-128349718043.asia-southeast1.run.app';
  return NextResponse.redirect(`${origin}?payment_success=true&order_id=${encodeURIComponent(orderId)}`, 303);
}
