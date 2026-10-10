import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return NextResponse.json({
    shop: {
      shopName: slug.replace(/-/g, ' ').toUpperCase(),
      slug,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
      rating: 4.9,
      followerCount: 12840,
      joinedDate: '2024-03-15'
    }
  });
}
