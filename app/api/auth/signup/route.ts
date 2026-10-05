import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, role } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const assignedRole = role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
    const user = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || '01700000000',
      role: assignedRole,
      token: `jwt_bazaarbd_${Date.now()}_token`
    };

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
