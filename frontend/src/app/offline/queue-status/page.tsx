'use client';
import { useOfflineStore } from '../../../store/offline.store';
export default function QueueStatusPage(){ const items = useOfflineStore((s)=>s.queue); return <main>Queued: {items.length}</main>; }
