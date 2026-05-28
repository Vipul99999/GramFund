'use client';
import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/apiClient';
import { LoadingState, ErrorState, EmptyState } from '../common/StateBlocks';

export function AuditTimeline() {
  const [state, setState] = useState<{loading:boolean;error?:string;rows:any[]}>({loading:true,rows:[]});
  useEffect(()=>{(async()=>{const r=await apiRequest<any[]>('/api/v1/audit/logs',{retries:1}); if(!r.ok) setState({loading:false,error:r.error.message,rows:[]}); else setState({loading:false,rows:r.data||[]});})();},[]);
  if(state.loading) return <LoadingState label="Loading audit timeline..." />;
  if(state.error) return <ErrorState message={state.error} />;
  if(!state.rows.length) return <EmptyState message="No audit timeline entries." />;
  return <section className="rounded-xl border bg-white p-4" aria-label="Audit timeline"><h3 className="mb-2 font-semibold">Audit Timeline</h3><ul className="space-y-2">{state.rows.slice(0,15).map((r:any)=><li key={r.id} className="rounded border p-2 text-xs"><strong>{r.action}</strong> · {r.entityType} · {new Date(r.createdAt).toLocaleString()}</li>)}</ul></section>;
}
