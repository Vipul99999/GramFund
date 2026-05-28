'use client';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/apiClient';
import { EmptyState, ErrorState, LoadingState } from '../common/StateBlocks';

export function Overview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await apiRequest<any>('/api/v1/transparency/community-wall/demo-village', { retries: 2, timeoutMs: 8000 });
      if (!mounted) return;
      if (!res.ok) setError(res.error.message); else setData(res.data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingState label="Loading metrics..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <EmptyState message="No records yet." />;

  return <section className="grid gap-3 md:grid-cols-3" aria-label="Community metrics">
    <article className="rounded-xl border bg-white p-4"><p className="text-xs text-slate-500">Total Collected</p><strong>{String(data.totalCollected)}</strong></article>
    <article className="rounded-xl border bg-white p-4"><p className="text-xs text-slate-500">Families</p><strong>{String(data.totalFamilies)}</strong></article>
    <article className="rounded-xl border bg-white p-4"><p className="text-xs text-slate-500">Pending Settlements</p><strong>{String(data.pendingSettlements)}</strong></article>
  </section>;
}
