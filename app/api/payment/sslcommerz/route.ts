import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

/**
 * SSLCommerz Payment Gateway Handler
 * Supports Sandbox and Live production environments
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCity,
      currency = 'BDT'
    } = body;

    const storeId = process.env.SSLCOMMERZ_STORE_ID || 'testbox';
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || 'qwerty';
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === 'true';

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://ais-dev-kzjwcmsvdqu5ezdwhtt2l3-128349718043.asia-southeast1.run.app';

    const tranId = `SSLCZ_${orderId || Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const formData = new URLSearchParams();
    formData.append('store_id', storeId);
    formData.append('store_passwd', storePassword);
    formData.append('total_amount', (amount || 0).toString());
    formData.append('currency', currency);
    formData.append('tran_id', tranId);
    formData.append('success_url', `${origin}/api/payment/sslcommerz/success?orderId=${encodeURIComponent(orderId || tranId)}`);
    formData.append('fail_url', `${origin}/api/payment/sslcommerz/fail?orderId=${encodeURIComponent(orderId || tranId)}`);
    formData.append('cancel_url', `${origin}/api/payment/sslcommerz/cancel?orderId=${encodeURIComponent(orderId || tranId)}`);
    formData.append('ipn_url', `${origin}/api/payment/sslcommerz/ipn`);

    // Customer info
    formData.append('cus_name', customerName || 'Customer');
    formData.append('cus_email', customerEmail || 'customer@quatro.com');
    formData.append('cus_add1', customerAddress || 'Dhaka, Bangladesh');
    formData.append('cus_city', customerCity || 'Dhaka');
    formData.append('cus_postcode', '1000');
    formData.append('cus_country', 'Bangladesh');
    formData.append('cus_phone', customerPhone || '01700000000');

    // Product info
    formData.append('product_name', 'QUATRO Order');
    formData.append('product_category', 'General');
    formData.append('product_profile', 'general');
    formData.append('shipping_method', 'YES');
    formData.append('num_of_item', '1');

    const sslUrl = isLive
      ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

    // If storeId is default demo testbox and no keys provided yet, provide sandbox gateway simulator URL
    if (storeId === 'testbox' && !process.env.SSLCOMMERZ_STORE_ID) {
      return NextResponse.json({
        status: 'SUCCESS',
        GatewayPageURL: `${origin}?sslcommerz_simulated=true&tran_id=${tranId}&amount=${amount}&order_id=${orderId}`,
        tran_id: tranId,
        message: 'SSLCommerz Session Initialized in Developer Sandbox Mode'
      });
    }

    const response = await fetch(sslUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    const data = await response.json();

    if (data.status === 'SUCCESS' && data.GatewayPageURL) {
      return NextResponse.json({
        status: 'SUCCESS',
        GatewayPageURL: data.GatewayPageURL,
        sessionkey: data.sessionkey,
        tran_id: tranId
      });
    }

    return NextResponse.json({
      status: 'FAILED',
      failedreason: data.failedreason || 'SSLCommerz initialization failed',
      raw: data
    }, { status: 400 });

  } catch (error: any) {
    console.error('SSLCommerz Init Error:', error);
    return NextResponse.json({
      status: 'ERROR',
      error: error?.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
