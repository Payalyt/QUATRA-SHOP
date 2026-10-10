import { NextRequest, NextResponse } from 'next/server';
import { sendSmsNotification } from '@/lib/sms/sms-service';

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json();

    if (!to || !message) {
      return NextResponse.json({ success: false, error: 'Recipient number and message are required' }, { status: 400 });
    }

    const result = await sendSmsNotification({ to, message });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal Error' }, { status: 500 });
  }
}
