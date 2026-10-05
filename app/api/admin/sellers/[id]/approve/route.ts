import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { action, reason } = body; // 'approve' | 'reject' | 'suspend'

    if (action === 'reject') {
      return NextResponse.json({
        success: true,
        sellerId: id,
        status: 'Rejected',
        message: `Seller account rejected. Reason: ${reason || 'Incomplete details'}`
      });
    }

    if (action === 'suspend') {
      return NextResponse.json({
        success: true,
        sellerId: id,
        status: 'Suspended',
        message: 'Seller account suspended.'
      });
    }

    return NextResponse.json({
      success: true,
      sellerId: id,
      status: 'Approved',
      message: 'Seller account approved successfully! Seller can now upload products.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Action failed' }, { status: 500 });
  }
}
