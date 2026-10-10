import { NextRequest, NextResponse } from 'next/server';
import { SponsoredAdCampaign } from '@/lib/types/ecommerce';
import { DEFAULT_SPONSORED_CAMPAIGNS } from '@/lib/data/seed-seller';

const campaigns: SponsoredAdCampaign[] = [...DEFAULT_SPONSORED_CAMPAIGNS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get('sellerId');
  const productId = searchParams.get('productId');

  let filtered = [...campaigns];
  if (sellerId) {
    filtered = filtered.filter((c) => c.sellerId === sellerId);
  }
  if (productId) {
    filtered = filtered.filter((c) => c.productId === productId);
  }

  return NextResponse.json({
    success: true,
    campaigns: filtered
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sellerId, productId, productTitle, productImage, dailyBudget, bidAmount, targetKeywords } = body;

    if (!sellerId || !productId || !dailyBudget || !bidAmount) {
      return NextResponse.json(
        { success: false, message: 'Missing required campaign parameters' },
        { status: 400 }
      );
    }

    const newCampaign: SponsoredAdCampaign = {
      id: `ad-${Date.now()}`,
      sellerId,
      productId,
      productTitle: productTitle || 'Sponsored Product',
      productImage: productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      dailyBudget: Number(dailyBudget),
      bidAmount: Number(bidAmount),
      biddingType: 'AUTO',
      targetKeywords: Array.isArray(targetKeywords) ? targetKeywords : [],
      impressions: 0,
      clicks: 0,
      spend: 0,
      salesGenerated: 0,
      ordersCount: 0,
      roas: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      startedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    campaigns.unshift(newCampaign);

    return NextResponse.json({
      success: true,
      message: 'Sponsored campaign created and activated',
      campaign: newCampaign
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to create campaign' },
      { status: 400 }
    );
  }
}
