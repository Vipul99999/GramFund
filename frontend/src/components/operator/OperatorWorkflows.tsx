'use client';
import { useState } from 'react';
import { apiRequest } from '../../lib/apiClient';
import { sanitizeText } from '../../lib/security';
import { EmptyState, ErrorState, LoadingState } from '../common/StateBlocks';
import { useAuth } from '../../contexts/AuthContext';

export function OperatorWorkflows() {
  const { csrfToken } = useAuth();
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string|undefined>(); const [result, setResult] = useState<any>(null);
  const [tx, setTx] = useState({ familyId:'', handlerId:'', amount:'', idempotencyKey:'' });

  async function createTx() {
    setLoading(true); setError(undefined);
    const payload = { ...tx, familyId: sanitizeText(tx.familyId), handlerId: sanitizeText(tx.handlerId), amount: Number(tx.amount) };
    const res = await apiRequest('/api/v1/transactions', { method:'POST', body: JSON.stringify(payload), csrfToken: csrfToken || undefined });
    if (!res.ok) setError(res.error.message); else setResult(res.data);
    setLoading(false);
  }

  return <section className="space-y-4" aria-label="Operator workflows">
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-2 font-semibold">Create Transaction</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {Object.keys(tx).map((k) => <input key={k} aria-label={k} className="rounded border p-2" value={(tx as any)[k]} onChange={e=>setTx({...tx,[k]:e.target.value})} placeholder={k} />)}
      </div>
      <button onClick={createTx} className="mt-3 rounded bg-slate-900 px-4 py-2 text-white">Submit</button>
    </div>
    {loading && <LoadingState label="Submitting transaction..." />}
    {error && <ErrorState message={error} />}
    {!loading && !error && !result && <EmptyState message="No operation yet." />}
    {result && <pre className="overflow-auto rounded-xl border bg-slate-950 p-4 text-xs text-green-200">{JSON.stringify(result,null,2)}</pre>}
  </section>;
}
