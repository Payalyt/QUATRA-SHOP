import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/data/seed-products';

export async function GET() {
  return NextResponse.json({ categories: CATEGORIES });
}
