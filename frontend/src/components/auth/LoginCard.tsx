'use client';
import { useState } from 'react';
import { isEmailOrPhone, sanitizeText } from '../../lib/security';
import { useAuth } from '../../contexts/AuthContext';

export function LoginCard() {
  const auth = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    const cleanId = sanitizeText(identifier);
    if (!isEmailOrPhone(cleanId) || password.length < 8) return setError('Enter valid email/phone and password (min 8 chars).');
    const e = await auth.login(cleanId, password);
    if (e) setError(e);
  }

  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Login card">
    <h2 className="mb-3 text-lg font-semibold">Secure Sign In</h2>
    <label className="mb-2 block text-sm">Email or Phone</label>
    <input aria-label="Email or phone" className="mb-3 w-full rounded-lg border p-2" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} />
    <label className="mb-2 block text-sm">Password</label>
    <input aria-label="Password" type="password" className="mb-3 w-full rounded-lg border p-2" value={password} onChange={(e)=>setPassword(e.target.value)} />
    <button aria-label="Login" onClick={submit} disabled={auth.loading} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-60">{auth.loading?'Signing in...':'Sign in'}</button>
    {auth.lockoutUntil && <p className="mt-2 text-xs text-amber-700">Account lockout active until: {auth.lockoutUntil}</p>}
    {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
  </section>;
}
