'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';

const isEmail = (value: string) => value.includes('@');

export default function LoginPage() {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'INPUT' | 'OTP'>('INPUT');
  const [message, setMessage] = useState('');

  const mode = useMemo(() => (isEmail(identifier) ? 'EMAIL' : 'PHONE'), [identifier]);

  const submit = async () => {
    const payload: Record<string, unknown> = { identifier, deviceId: 'web-client' };
    if (mode === 'EMAIL') payload.password = password;
    if (mode === 'PHONE' && stage === 'OTP') payload.otp = otp;

    const res = await fetch('/api/v1/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.mode === 'OTP_SENT') {
      setStage('OTP');
      setMessage(t('otpSent'));
      return;
    }
    setMessage(t('loginSuccess'));
  };

  return (
    <main style={{ maxWidth: 420, margin: '3rem auto' }}>
      <h1>{t('login')}</h1>
      <input placeholder={t('enterEmailPhone')} value={identifier} onChange={(e) => setIdentifier(e.target.value)} style={{ width: '100%', marginBottom: 12 }} />
      {mode === 'EMAIL' ? (
        <input placeholder={t('password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 12 }} />
      ) : stage === 'OTP' ? (
        <input placeholder={t('otp')} value={otp} onChange={(e) => setOtp(e.target.value)} style={{ width: '100%', marginBottom: 12 }} />
      ) : null}
      <button onClick={submit}>{mode === 'PHONE' && stage === 'INPUT' ? t('sendOtp') : t('login')}</button>
      <button onClick={() => setMessage('Google OAuth UI flow placeholder')}>{t('googleLogin')}</button>
      {message && <p>{message}</p>}
    </main>
  );
}
