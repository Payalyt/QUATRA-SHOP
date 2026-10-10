import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, shopName, name, phone, shopAddress, payoutMethod, payoutAccount } = body;

    if (action === 'register') {
      if (!shopName || !email || !phone) {
        return NextResponse.json({ error: 'Shop Name, Email and Phone are required' }, { status: 400 });
      }

      const slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const newSeller = {
        id: `seller-${Date.now()}`,
        userId: `usr-seller-${Date.now()}`,
        shopName,
        slug: slug || `shop-${Date.now()}`,
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
        description: `Welcome to ${shopName}! Quality products on QUATRO.`,
        phone,
        email,
        shopAddress: shopAddress || 'Dhaka, Bangladesh',
        status: 'Pending',
        payoutMethod: payoutMethod || 'bKash',
        payoutAccount: payoutAccount || phone,
        rating: 5.0,
        followerCount: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      return NextResponse.json({
        success: true,
        message: 'Seller account registered successfully! Status: Pending Admin Approval.',
        seller: newSeller
      });
    }

    if (action === 'login') {
      if (!email) {
        return NextResponse.json({ error: 'Please enter seller email address' }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Seller authenticated successfully',
        sellerId: 'seller-apex-01'
      });
    }

    return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error processing seller authentication' }, { status: 500 });
  }
}
