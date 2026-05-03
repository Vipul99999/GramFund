'use client';

import { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';

type Payment = {
  id: string;
  date: string;
  event: string;
  from: string;
  to: string;
  expectedAmount: number;
  paidAmount: number;
  mode: 'CASH' | 'ONLINE';
  handler: string;
  eventId?: string | null;
};

const FAMILY = 'Sharma';

const payments: Payment[] = [
  { id: 'txn_001', date: '2026-01-10', event: 'Sharma Wedding', from: 'Verma', to: FAMILY, expectedAmount: 500, paidAmount: 500, mode: 'CASH', handler: 'Rajesh', eventId: 'evt_100' },
  { id: 'txn_002', date: '2026-02-15', event: 'Medical Help', from: FAMILY, to: 'Verma', expectedAmount: 500, paidAmount: 800, mode: 'ONLINE', handler: 'Nisha', eventId: 'evt_101' },
  { id: 'txn_003', date: '2026-03-05', event: 'Temple Donation', from: FAMILY, to: 'Patel', expectedAmount: 500, paidAmount: 300, mode: 'CASH', handler: 'Rajesh', eventId: 'evt_102' },
  { id: 'txn_004', date: '2026-03-20', event: 'Temple Donation', from: FAMILY, to: 'Patel', expectedAmount: 200, paidAmount: 400, mode: 'CASH', handler: 'Rajesh', eventId: 'evt_102' },
  { id: 'txn_005', date: '2026-04-01', event: 'Community Help', from: FAMILY, to: 'Singh', expectedAmount: 0, paidAmount: 1000, mode: 'CASH', handler: 'Aman', eventId: null },
];

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function getStatus(expected: number, paid: number) {
  if (expected === 0) return 'COMPLETE';
  if (paid === expected) return 'COMPLETE';
  if (paid < expected) return 'PARTIAL';
  return 'OVERPAID';
}

function getBalanceDelta(expected: number, paid: number) {
  if (expected === 0) return { label: 'No expected amount (help payment)', value: 0 };
  if (paid > expected) return { label: 'Extra', value: paid - expected };
  if (paid < expected) return { label: 'Pending', value: expected - paid };
  return { label: 'Balanced', value: 0 };
}

export default function FamilyDashboardPage() {
  const [filter, setFilter] = useState<'ALL' | 'GIVEN' | 'RECEIVED'>('ALL');
  const [selectedId, setSelectedId] = useState(payments[0].id);

  const visible = useMemo(() => payments.filter((payment) => {
    if (filter === 'GIVEN') return payment.from === FAMILY;
    if (filter === 'RECEIVED') return payment.to === FAMILY;
    return true;
  }), [filter]);

  const summary = useMemo(() => {
    const totalGiven = payments.filter((p) => p.from === FAMILY).reduce((n, p) => n + p.paidAmount, 0);
    const totalReceived = payments.filter((p) => p.to === FAMILY).reduce((n, p) => n + p.paidAmount, 0);
    const net = totalReceived - totalGiven;
    return { totalGiven, totalReceived, net };
  }, []);

  const relationSummary = useMemo(() => {
    const map = new Map<string, { gave: number; received: number }>();
    for (const payment of payments) {
      const other = payment.from === FAMILY ? payment.to : payment.from;
      const current = map.get(other) ?? { gave: 0, received: 0 };
      if (payment.from === FAMILY) current.gave += payment.paidAmount;
      if (payment.to === FAMILY) current.received += payment.paidAmount;
      map.set(other, current);
    }
    return [...map.entries()].map(([family, v]) => ({ family, ...v, net: v.received - v.gave }));
  }, []);

  const selected = visible.find((p) => p.id === selectedId) ?? visible[0];
  const balanceDelta = selected ? getBalanceDelta(selected.expectedAmount, selected.paidAmount) : null;

  return <main>
    <div className="page-head">
      <h1>Family Dashboard</h1>
      <p style={{ margin: 0, color: '#334155' }}>Simple money view: You gave / You received</p>
    </div>

    <Card title="Balance clarity">
      <div className="stats-grid">
        <div className="mini-stat"><p>You gave</p><strong>{inr.format(summary.totalGiven)}</strong></div>
        <div className="mini-stat good"><p>You received</p><strong>{inr.format(summary.totalReceived)}</strong></div>
        <div className="mini-stat fair"><p>Net</p><strong>{summary.net >= 0 ? '+' : ''}{inr.format(summary.net)}</strong><p>{summary.net >= 0 ? 'You will receive' : 'You owe'}</p></div>
      </div>
      <p style={{ color: '#64748b' }}>Offline-safe: cached records remain visible and sync resumes when network returns.</p>
    </Card>

    <Card title="Payment history">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {(['ALL', 'GIVEN', 'RECEIVED'] as const).map((key) => <button key={key} className={`pill ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>{key}</button>)}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th align="left">Date</th><th align="left">Event</th><th align="left">Amount</th><th align="left">Type</th><th align="left">Status</th></tr></thead>
        <tbody>
          {visible.map((payment) => {
            const type = payment.from === FAMILY ? 'GIVEN' : 'RECEIVED';
            const status = getStatus(payment.expectedAmount, payment.paidAmount);
            return <tr key={payment.id} onClick={() => setSelectedId(payment.id)} style={{ cursor: 'pointer', borderTop: '1px solid #e2e8f0' }}>
              <td>{payment.date}</td><td>{payment.event}</td><td>{inr.format(payment.paidAmount)}</td>
              <td style={{ color: type === 'RECEIVED' ? '#166534' : '#991b1b' }}>{type}</td>
              <td style={{ color: status === 'PARTIAL' ? '#854d0e' : '#334155' }}>{status}</td>
            </tr>;
          })}
        </tbody>
      </table>
    </Card>

    {selected && balanceDelta && <Card title="Payment detail (trust view)">
      <p><b>Transaction ID:</b> {selected.id}</p>
      <p><b>Event:</b> {selected.event} ({selected.eventId ?? 'No event'})</p>
      <p><b>From → To:</b> {selected.from} → {selected.to}</p>
      <p><b>Paid:</b> {inr.format(selected.paidAmount)} | <b>Expected:</b> {inr.format(selected.expectedAmount)}</p>
      <p><b>{balanceDelta.label}:</b> {balanceDelta.value > 0 ? inr.format(balanceDelta.value) : '—'}</p>
      <p><b>Handler:</b> {selected.handler} | <b>Mode:</b> {selected.mode} | <b>Date:</b> {selected.date}</p>
      <p style={{ color: '#64748b' }}>Immutable log keeps each transaction and timestamp for village-level trust.</p>
    </Card>}

    <Card title="Statement preview (download / print)">
      <p><b>GramFund Statement</b> — Family: Sharma | Village: Rampur | Period: Jan–Dec 2026</p>
      <p>Total Given: {inr.format(summary.totalGiven)} | Total Received: {inr.format(summary.totalReceived)} | Net: {inr.format(summary.net)}</p>
      {relationSummary.map((r) => <p key={r.family}>With {r.family} Family: You gave {inr.format(r.gave)} | They gave {inr.format(r.received)} | Net {inr.format(r.net)} ({r.net >= 0 ? 'you will receive' : 'you owe'})</p>)}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="pill">Download PDF</button>
        <button className="pill">Print</button>
        <button className="pill">Share (future)</button>
      </div>
    </Card>
  </main>;
}
