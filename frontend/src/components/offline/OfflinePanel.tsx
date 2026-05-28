'use client';
import { useEffect, useState } from 'react';
import { getQueue } from '../../offline/queue';
import { useSync } from '../../hooks/useSync';
import { useNetworkQuality } from '../../hooks/useNetworkQuality';
import { useConflictStore } from '../../store/conflict.store';
import { useLanguage } from '../../i18n/LanguageContext';

export function OfflinePanel() {
  const { t } = useLanguage();
  const quality = useNetworkQuality();
  const { sync } = useSync();
  const conflicts = useConflictStore((s:any) => s.conflicts || []);
  const setConflicts = useConflictStore((s:any) => s.setConflicts);
  const [pending, setPending] = useState(0);
  const [lastSync, setLastSync] = useState<string>('never');
  const [busy, setBusy] = useState(false);

  async function refreshQueue(){ setPending((await getQueue()).length); }
  useEffect(()=>{ refreshQueue(); },[]);

  async function runSync() {
    setBusy(true);
    const r = await sync();
    setLastSync(new Date().toLocaleString());
    await refreshQueue();
    setBusy(false);
    return r;
  }

  return <section className="rounded-xl border bg-white p-4" aria-label="Offline panel">
    {(quality === 'OFFLINE' || quality === 'POOR') && <p className="mb-2 rounded bg-amber-100 p-2 text-amber-900" role="status">{t('offlineSafeMode')}</p>}
    <div className="grid gap-2 sm:grid-cols-3">
      <div><p className="text-xs text-slate-500">{t('pendingQueue')}</p><strong>{pending}</strong></div>
      <div><p className="text-xs text-slate-500">{t('conflicts')}</p><strong>{conflicts.length}</strong></div>
      <div><p className="text-xs text-slate-500">{t('lastSync')}</p><strong className="text-xs">{lastSync}</strong></div>
    </div>
    <div className="mt-3 flex gap-2">
      <button onClick={runSync} className="rounded bg-slate-900 px-3 py-2 text-white" disabled={busy}>{busy ? t('loading') : t('syncNow')}</button>
      <button onClick={()=>setConflicts([])} className="rounded border px-3 py-2">{t('resolve')}</button>
    </div>
  </section>;
}
