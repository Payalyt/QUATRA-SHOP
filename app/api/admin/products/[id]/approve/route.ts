import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { action, reason } = body; // 'approve' | 'reject'

    if (action === 'reject') {
      return NextResponse.json({
        success: true,
        productId: id,
        status: 'REJECTED',
        message: `Product rejected. Reason: ${reason || 'Does not meet guidelines'}`
      });
    }

    return NextResponse.json({
      success: true,
      productId: id,
      status: 'ACTIVE',
      message: 'Product approved and published live on marketplace!'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Action failed' }, { status: 500 });
  }
}
