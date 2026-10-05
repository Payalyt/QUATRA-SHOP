import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/middleware/auth-middleware';
import { orderSchema } from '@/lib/validations/order';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  // 1. Security Check: Authenticate user
  const auth = await authorize(req, ['CUSTOMER', 'ADMIN', 'SUB_AGENT']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  // 2. Data Validation
  const body = await req.json();
  const validation = orderSchema.safeParse(body);
  if (!validation.success) return NextResponse.json({ error: validation.error }, { status: 400 });

  try {
    // 3. Business Logic with Firestore Transaction
    await adminDb!.runTransaction(async (transaction) => {
        // Each item stock validation and deduction
        for (const item of validation.data.items) {
            const productRef = adminDb!.collection('products').doc(item.productId);
            const productDoc = await transaction.get(productRef);

            if (!productDoc.exists) throw new Error(`Product ${item.productId} not found`);
            
            const productData = productDoc.data();
            if (productData!.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${productData!.title}`);
            }

            // Update stock
            transaction.update(productRef, { stock: FieldValue.increment(-item.quantity) });
        }

        // Create order
        const orderRef = adminDb!.collection('orders').doc();
        const orderNumber = `BZ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

        transaction.set(orderRef, {
            ...validation.data,
            userId: auth.user!.uid, // From middleware
            orderNumber,
            orderStatus: 'Pending',
            paymentStatus: validation.data.paymentMethod === 'COD' ? 'Pending' : 'Processing',
            trackingNumber: `BD-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
            createdAt: new Date().toISOString()
        });
    });

    return NextResponse.json({ success: true, message: 'Order placed successfully' }, { status: 201 });
  } catch (err: any) {
    console.error('Transaction Error:', err);
    return NextResponse.json({ error: err.message || 'Transaction failed' }, { status: 400 });
  }
}

