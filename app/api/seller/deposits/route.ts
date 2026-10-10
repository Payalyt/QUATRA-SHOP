import { NextRequest, NextResponse } from 'next/server';
import { SellerDepositRequest } from '@/lib/types/ecommerce';
import { DEFAULT_DEPOSIT_REQUESTS } from '@/lib/data/seed-seller';

let deposits: SellerDepositRequest[] = [...DEFAULT_DEPOSIT_REQUESTS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get('sellerId');

  let filtered = [...deposits];
  if (sellerId) {
    filtered = filtered.filter((d) => d.sellerId === sellerId);
  }

  return NextResponse.json({
    success: true,
    deposits: filtered
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sellerId, sellerShopName, sellerPhone, amount, paymentMethod, senderNumber, trxId, notes } = body;

    if (!sellerId || !amount || !trxId || !senderNumber) {
      return NextResponse.json(
        { success: false, message: 'Required deposit fields are missing' },
        { status: 400 }
      );
    }

    const newDeposit: SellerDepositRequest = {
      id: `dep-${Date.now()}`,
      sellerId,
      sellerShopName: sellerShopName || 'Seller Shop',
      sellerPhone: sellerPhone || '',
      amount: Number(amount),
      paymentMethod: paymentMethod || 'bKash',
      senderNumber,
      trxId,
      status: 'PENDING',
      notes,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    deposits.unshift(newDeposit);

    return NextResponse.json({
      success: true,
      message: 'Deposit request submitted for Admin verification',
      deposit: newDeposit
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid payload' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { depositId, action, rejectionReason } = body;

    if (!depositId || !action) {
      return NextResponse.json(
        { success: false, message: 'Deposit ID and action are required' },
        { status: 400 }
      );
    }

    deposits = deposits.map((d) => {
      if (d.id === depositId) {
        return {
          ...d,
          status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          rejectionReason: action === 'REJECT' ? rejectionReason : undefined,
          processedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return d;
    });

    return NextResponse.json({
      success: true,
      message: `Deposit request ${action === 'APPROVE' ? 'approved' : 'rejected'}`
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to process deposit' },
      { status: 500 }
    );
  }
}
