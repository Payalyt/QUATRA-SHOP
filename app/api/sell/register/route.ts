import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, shopName, phone, email, password, shopAddress, nidTradeLicense, payoutMethod, payoutAccount } = body;

    if (!shopName || !phone || !email) {
      return NextResponse.json({ error: 'Shop name, phone, and email are required.' }, { status: 400 });
    }

    const slug = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const seller = {
      id: `seller-${Date.now()}`,
      userId: `usr-seller-${Date.now()}`,
      shopName,
      slug,
      name,
      phone,
      email,
      shopAddress,
      nidTradeLicense,
      payoutMethod: payoutMethod || 'bKash',
      payoutAccount: payoutAccount || phone,
      status: 'Pending',
      rating: 5.0,
      followerCount: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    return NextResponse.json({
      success: true,
      message: 'Seller account registered successfully! Awaiting Admin review.',
      seller
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
