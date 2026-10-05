import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get('sellerId') || 'seller-apex-01';

  return NextResponse.json({
    sellerId,
    wallet: {
      totalIncome: 148500,
      totalCommission: 7425,
      netEarnings: 141075,
      availableBalance: 42500,
      pendingBalance: 18200,
      withdrawnAmount: 80375
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sellerId, amount, payoutMethod, accountDetails } = body;

    if (!amount || amount < 500) {
      return NextResponse.json({ error: 'Minimum payout withdrawal amount is ৳500' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Payout request of ৳${amount} via ${payoutMethod || 'bKash'} submitted to Admin.`,
      requestId: `wdr-${Date.now()}`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to request withdrawal' }, { status: 500 });
  }
}
