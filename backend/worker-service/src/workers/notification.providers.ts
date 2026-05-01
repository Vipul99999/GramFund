interface ProviderResult { ok: boolean; error?: string }

export const pushProvider = {
  async send(input: { userId: string; to: string; message: string }): Promise<ProviderResult> {
    const token = process.env.FCM_SERVER_KEY;
    if (!token) return { ok: false, error: 'FCM_SERVER_KEY_MISSING' };
    if (!input.to) return { ok: false, error: 'MISSING_DEVICE_TOKEN' };
    const resp = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `key=${token}` },
      body: JSON.stringify({ to: input.to, notification: { title: 'GramFund', body: input.message }, data: { userId: input.userId } })
    });
    if (!resp.ok) return { ok: false, error: `FCM_HTTP_${resp.status}` };
    return { ok: true };
  }
};

export const smsProvider = {
  async send(input: { to: string; message: string }): Promise<ProviderResult> {
    const provider = process.env.SMS_PROVIDER ?? 'MSG91';
    if (provider === 'TWILIO') {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_FROM;
      if (!sid || !token || !from) return { ok: false, error: 'TWILIO_CONFIG_MISSING' };
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ To: input.to, From: from, Body: input.message })
      });
      if (!res.ok) return { ok: false, error: `TWILIO_HTTP_${res.status}` };
      return { ok: true };
    }

    const auth = process.env.MSG91_AUTH_KEY;
    const sender = process.env.MSG91_SENDER_ID;
    const route = process.env.MSG91_ROUTE ?? '4';
    if (!auth || !sender) return { ok: false, error: 'MSG91_CONFIG_MISSING' };
    const res = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: { authkey: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, route, mobiles: input.to.replace(/\D/g, ''), message: input.message })
    });
    if (!res.ok) return { ok: false, error: `MSG91_HTTP_${res.status}` };
    return { ok: true };
  }
};
