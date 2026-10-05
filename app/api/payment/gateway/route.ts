import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, provider, amount, accountNumber, otp, pin, invoiceRef } = body;

    if (action === 'grant_token') {
      // Simulate Grant Token API call to bKash / Nagad
      const idToken = `bk_token_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
      return NextResponse.json({
        statusCode: '0000',
        statusMessage: 'Successful',
        id_token: idToken,
        token_type: 'Bearer',
        expires_in: 3600
      });
    }

    if (action === 'create_payment') {
      const paymentID = `${provider.toUpperCase()}_PAY_${Math.floor(10000000 + Math.random() * 90000000)}`;
      return NextResponse.json({
        statusCode: '0000',
        statusMessage: 'Successful',
        paymentID: paymentID,
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: invoiceRef || `INV-${Date.now()}`
      });
    }

    if (action === 'execute_payment') {
      if (!accountNumber || accountNumber.length < 11) {
        return NextResponse.json(
          { statusCode: '2001', statusMessage: 'Invalid Mobile Wallet Account Number' },
          { status: 400 }
        );
      }
      if (otp && otp !== '123456' && otp.length !== 6) {
        return NextResponse.json(
          { statusCode: '2002', statusMessage: 'Invalid OTP Verification Code' },
          { status: 400 }
        );
      }

      const randomDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
      const prefix = provider === 'bKash' ? 'BK' : provider === 'Nagad' ? 'NG' : 'TRX';
      const trxId = `${prefix}${randomDigits}X`;

      return NextResponse.json({
        statusCode: '0000',
        statusMessage: 'Successful',
        paymentID: body.paymentID || `PAY_${Date.now()}`,
        trxID: trxId,
        amount: amount,
        customerMsisdn: accountNumber,
        paymentExecuteTime: new Date().toISOString(),
        currency: 'BDT',
        merchantInvoiceNumber: invoiceRef || `INV-${Date.now()}`
      });
    }

    return NextResponse.json({ error: 'Unsupported gateway action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Payment Gateway Execution Failed' }, { status: 500 });
  }
}
