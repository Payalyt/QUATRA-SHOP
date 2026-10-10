import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const isAdmin = email.toLowerCase().includes('admin');
    const user = {
      id: isAdmin ? 'usr-admin-1' : 'usr-customer-1',
      name: isAdmin ? 'Admin Supervisor' : 'Rayhan Ahmed',
      email,
      phone: '01712345678',
      role: isAdmin ? 'ADMIN' : 'CUSTOMER',
      token: `jwt_bazaarbd_${Date.now()}_${isAdmin ? 'adm' : 'cust'}`
    };

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
