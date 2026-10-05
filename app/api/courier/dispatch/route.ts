import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, courierPartner, orderId, recipientName, recipientPhone, recipientAddress, codAmount, weightKg } = body;

    if (action === 'create_consignment') {
      const partner = courierPartner || 'Steadfast Express';
      const isSteadfast = partner.toLowerCase().includes('steadfast');
      const prefix = isSteadfast ? 'STDF' : 'PTHO';
      const randomId = Math.floor(10000000 + Math.random() * 90000000);
      const trackingCode = `${prefix}-${randomId}`;

      const initialLogs = [
        {
          status: 'Confirmed',
          title: 'Consignment Created',
          description: `Parcel booked with ${partner} (Invoice Ref: ${orderId || 'QUATRO-ORDER'}).`,
          location: 'Dhaka Central Merchant Hub',
          timestamp: new Date().toISOString(),
          completed: true
        },
        {
          status: 'Processing',
          title: 'Picked up by Rider',
          description: `${partner} courier rider assigned for pickup.`,
          location: 'Merchant Warehouse, Dhaka',
          timestamp: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
          completed: true
        },
        {
          status: 'Shipped',
          title: 'In Transit',
          description: `Parcel sorting complete at ${partner} Central Logistics Facility.`,
          location: 'Dhaka Main Sorting Hub',
          timestamp: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
          completed: false
        }
      ];

      return NextResponse.json({
        success: true,
        status: 200,
        courier: partner,
        trackingCode: trackingCode,
        consignmentId: trackingCode,
        deliveryFee: weightKg && weightKg > 1 ? 120 : 60,
        codAmount: codAmount || 0,
        recipient: {
          name: recipientName,
          phone: recipientPhone,
          address: recipientAddress
        },
        trackingLogs: initialLogs,
        createdAt: new Date().toISOString()
      });
    }

    if (action === 'track_consignment') {
      const trackingCode = body.trackingCode || 'STDF-8819204';
      const partner = trackingCode.startsWith('STDF') ? 'Steadfast Express' : 'Pathao Express';

      return NextResponse.json({
        success: true,
        trackingCode: trackingCode,
        courier: partner,
        currentStatus: 'In Transit',
        estimatedDelivery: 'Next-Day Express (24 Hours)',
        trackingLogs: [
          {
            status: 'Confirmed',
            title: 'Merchant Order Placed',
            description: 'Order confirmed on QUATRO Marketplace.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            completed: true
          },
          {
            status: 'Processing',
            title: 'Picked up by Courier',
            description: `Rider picked up parcel from merchant shop.`,
            timestamp: new Date(Date.now() - 43200000).toISOString(),
            completed: true
          },
          {
            status: 'Shipped',
            title: 'In Transit at District Hub',
            description: `Dispatched to Destination Hub.`,
            location: 'Tejgaon Logistic Hub, Dhaka',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            completed: true
          },
          {
            status: 'Delivered',
            title: 'Out for Delivery',
            description: 'Delivery rider is on the way to recipient address.',
            location: 'Destination Area',
            timestamp: new Date().toISOString(),
            completed: false
          }
        ]
      });
    }

    return NextResponse.json({ error: 'Unsupported courier action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Courier API Request Failed' }, { status: 500 });
  }
}
