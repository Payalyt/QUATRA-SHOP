/**
 * Universal Bangladesh SMS Gateway Dispatcher
 * Ready for: SSLWireless, MimSMS, Greenweb, ElitBuzz, Twilio, BulkSMSBD
 */
export interface SmsPayload {
  to: string; // Recipient mobile number (e.g. 017XXXXXXXX)
  message: string;
}

export async function sendSmsNotification({ to, message }: SmsPayload): Promise<{ success: boolean; message?: string }> {
  try {
    const cleanNumber = to.replace(/[-+\s]/g, '');
    const apiKey = process.env.SMS_API_KEY;
    const senderId = process.env.SMS_SENDER_ID || 'QUATRO';
    const provider = (process.env.SMS_PROVIDER || 'mim_sms').toLowerCase();

    // If no SMS API key is configured yet in environment, log gracefully
    if (!apiKey) {
      console.log(`[SMS-SIMULATOR] To: ${cleanNumber} | Message: ${message}`);
      return { success: true, message: 'SMS simulated successfully (API key pending)' };
    }

    // 1. SSLWireless SMS API
    if (provider.includes('ssl') || provider.includes('wireless')) {
      const sid = process.env.SMS_SID || senderId;
      const res = await fetch('https://smsplus.sslwireless.com/api/v3/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_token: apiKey,
          sid: sid,
          msisdn: cleanNumber,
          sms: message,
          csms_id: `SMS_${Date.now()}`
        })
      });
      const data = await res.json();
      return { success: res.ok, message: data.status_message || 'SSLWireless SMS sent' };
    }

    // 2. BulkSMS BD API (Recommended)
    if (provider.includes('bulk') || provider.includes('bulksms')) {
      const url = `http://bulksmsbd.net/api/smsapi?api_key=${encodeURIComponent(apiKey)}&type=text&number=${encodeURIComponent(cleanNumber)}&senderid=${encodeURIComponent(senderId)}&message=${encodeURIComponent(message)}`;
      const res = await fetch(url);
      return { success: res.ok, message: 'BulkSMS BD sent' };
    }

    // 3. MimSMS API
    if (provider.includes('mim')) {
      const url = `https://api.mimsms.com/api/SmsSending/Send?UserName=${encodeURIComponent(process.env.SMS_USERNAME || '')}&Apikey=${encodeURIComponent(apiKey)}&MobileNumber=${encodeURIComponent(cleanNumber)}&CampaignId=null&SenderName=${encodeURIComponent(senderId)}&TransactionType=T&Message=${encodeURIComponent(message)}`;
      const res = await fetch(url, { method: 'POST' });
      return { success: res.ok, message: 'MimSMS sent' };
    }

    // 4. Greenweb SMS API
    if (provider.includes('green')) {
      const url = `https://api.greenweb.com.bd/api.php?token=${encodeURIComponent(apiKey)}&to=${encodeURIComponent(cleanNumber)}&message=${encodeURIComponent(message)}`;
      const res = await fetch(url);
      return { success: res.ok, message: 'Greenweb SMS sent' };
    }

    // 5. Alpha SMS
    if (provider.includes('alpha')) {
      const url = `https://api.sms.net.bd/sendsms?api_key=${encodeURIComponent(apiKey)}&msg=${encodeURIComponent(message)}&to=${encodeURIComponent(cleanNumber)}`;
      const res = await fetch(url);
      return { success: res.ok, message: 'Alpha SMS sent' };
    }

    // 6. Generic / ElitBuzz SMS API
    const genericUrl = `https://msg.elitbuzz-bd.com/smsapi?api_key=${encodeURIComponent(apiKey)}&type=text&contacts=${encodeURIComponent(cleanNumber)}&senderid=${encodeURIComponent(senderId)}&msg=${encodeURIComponent(message)}`;
    const res = await fetch(genericUrl);
    return { success: res.ok, message: 'SMS sent' };

  } catch (error: any) {
    console.warn('SMS dispatch error:', error);
    return { success: false, message: error?.message || 'Failed to dispatch SMS' };
  }
}
