import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get('sellerId') || 'seller-apex-01';

  return NextResponse.json({
    seller: {
      id: sellerId,
      shopName: 'Apex Tech & Gadget Center',
      slug: 'apex-gadget-store',
      phone: '01712998877',
      email: 'seller@apexbd.com',
      status: 'Approved',
      rating: 4.9,
      followerCount: 12840
    }
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: 'Seller shop profile updated successfully',
      updates: body
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update seller profile' }, { status: 500 });
  }
}
