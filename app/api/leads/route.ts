import { NextRequest, NextResponse } from 'next/server';
import { AudienceLead } from '@/lib/types/ecommerce';

// In-memory / server-side handler for audience leads & newsletter subscribers
let audienceLeads: AudienceLead[] = [
  {
    id: 'ld-1',
    name: 'Faisal Ahmed',
    email: 'faisal.ahmed@outlook.com',
    phone: '01711223344',
    source: 'Footer Deals Newsletter',
    productTitle: 'Soundcore by Anker R50i TWS Earbuds',
    note: 'Interested in discount voucher code. Wants SMS alert when price drops.',
    status: 'CONTACTED',
    createdAt: '2026-10-01, 11:22 AM'
  },
  {
    id: 'ld-2',
    name: 'Tania Rahman',
    email: 'tania.rahman@gmail.com',
    phone: '01899887766',
    source: 'Flash Sale Deal Alert',
    productTitle: 'Apex Men Genuine Leather Formal Shoe',
    note: 'Looking for Size 42 stock in Flash Sale.',
    status: 'NEW',
    createdAt: '2026-10-02, 08:14 AM'
  },
  {
    id: 'ld-3',
    name: 'Sakib Khan',
    email: 'sakib.khan@yahoo.com',
    phone: '01912345678',
    source: 'Product Buy Intent Inquiry',
    productTitle: 'Samsung Galaxy Watch 6 Classic 43mm',
    note: 'Confirmed buyer - called on WhatsApp for home delivery.',
    status: 'CONVERTED',
    createdAt: '2026-10-02, 09:30 AM'
  },
  {
    id: 'ld-4',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan24@gmail.com',
    phone: '01678123456',
    source: 'Direct Admin Entry',
    productTitle: 'Realme Buds Air 5 Pro ANC',
    note: 'Inquired from Facebook ad, requested 10% coupon.',
    status: 'NEW',
    createdAt: '2026-10-03, 10:15 AM'
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const source = searchParams.get('source')?.toLowerCase();
  const status = searchParams.get('status');

  let filtered = [...audienceLeads];

  if (source) {
    filtered = filtered.filter((l) => l.source?.toLowerCase().includes(source));
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((l) => (l.status || 'NEW') === status);
  }

  if (search) {
    filtered = filtered.filter(
      (l) =>
        (l.name && l.name.toLowerCase().includes(search)) ||
        (l.email && l.email.toLowerCase().includes(search)) ||
        (l.phone && l.phone.includes(search)) ||
        (l.source && l.source.toLowerCase().includes(search)) ||
        (l.productTitle && l.productTitle.toLowerCase().includes(search)) ||
        (l.note && l.note.toLowerCase().includes(search))
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    leads: filtered
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, source = 'Storefront Inquiry', productTitle, note } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number or email is required' },
        { status: 400 }
      );
    }

    const newLead: AudienceLead = {
      id: `ld-${Date.now()}`,
      name: name?.trim() || undefined,
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      source: source.trim(),
      productTitle: productTitle?.trim() || undefined,
      note: note?.trim() || undefined,
      status: 'NEW',
      createdAt: new Date().toLocaleString()
    };

    audienceLeads.unshift(newLead);

    return NextResponse.json({
      success: true,
      message: 'Audience lead recorded successfully',
      lead: newLead
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Lead ID is required' },
        { status: 400 }
      );
    }

    audienceLeads = audienceLeads.map((l) => (l.id === id ? { ...l, ...updates } : l));

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully'
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Lead ID is required' },
      { status: 400 }
    );
  }

  audienceLeads = audienceLeads.filter((l) => l.id !== id);

  return NextResponse.json({
    success: true,
    message: 'Lead deleted'
  });
}
