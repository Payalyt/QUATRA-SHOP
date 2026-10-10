import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format');

  if (format === 'csv') {
    const csvContent = `Product Title,SKU,Views,Units Sold,Revenue (BDT),Returns,Rating\n"Anker Soundcore Motion+ Bluetooth Speaker","ANK-MOT-PLUS",1450,42,125000,1,4.9\n"Baseus 65W GaN Fast Charger","BAS-GAN-65W",890,68,136000,0,4.8\n"Haylou RS4 Plus AMOLED Smartwatch","HAY-RS4-PLS",2100,54,232200,2,4.7\n`;

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="bazaarbd-seller-sales-report.csv"'
      }
    });
  }

  return NextResponse.json({
    report: [
      {
        productId: 'prod-1',
        title: 'Anker Soundcore Motion+ Bluetooth Speaker',
        sku: 'ANK-MOT-PLUS',
        views: 1450,
        unitsSold: 42,
        revenue: 125000,
        returns: 1,
        rating: 4.9
      },
      {
        productId: 'prod-2',
        title: 'Baseus 65W GaN Fast Charger',
        sku: 'BAS-GAN-65W',
        views: 890,
        unitsSold: 68,
        revenue: 136000,
        returns: 0,
        rating: 4.8
      }
    ]
  });
}
